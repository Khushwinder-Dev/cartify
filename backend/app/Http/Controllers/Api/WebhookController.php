<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Services\Payment\PaymentGatewayInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WebhookController extends BaseApiController
{
    public function __construct(
        protected PaymentGatewayInterface $paymentGateway
    ) {}

    public function handlePayment(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature', '');

        try {
            $event = $this->paymentGateway->verifyWebhook($payload, $signature);
        } catch (Exception $e) {
            Log::error('Webhook cryptographic verification failed: ' . $e->getMessage());
            return $this->error('Webhook verification failed: ' . $e->getMessage(), null, 400);
        }

        // 1. Idempotency Check: Prevent duplicate webhook replay attacks
        $eventId = $event['id'] ?? null;
        if ($eventId) {
            $isNew = Cache::add("webhook_processed:{$eventId}", true, 86400 * 7); // 7-day TTL
            if (!$isNew) {
                Log::info("Duplicate webhook event ignored: {$eventId}");
                return response()->json(['received' => true, 'duplicate' => true], 200);
            }
        }

        $eventType = $event['type'] ?? '';
        $dataObject = $event['data']['object'] ?? [];
        $paymentIntentId = $dataObject['id'] ?? null;

        Log::info("Payment webhook received: {$eventType}", [
            'event_id' => $eventId,
            'payment_intent_id' => $paymentIntentId,
        ]);

        if ($paymentIntentId) {
            $order = Order::where('payment_intent_id', $paymentIntentId)->with('items.variant')->first();

            if ($order) {
                switch ($eventType) {
                    case 'payment_intent.succeeded':
                        $order->update([
                            'financial_status' => 'paid',
                            'status' => 'open',
                        ]);
                        Log::info("Order #{$order->order_number} marked as PAID.");
                        break;

                    case 'payment_intent.payment_failed':
                    case 'payment_intent.canceled':
                        // Restock inventory if checkout failed/canceled and not already cancelled
                        if ($order->status !== 'cancelled') {
                            DB::transaction(function () use ($order) {
                                foreach ($order->items as $item) {
                                    if ($item->variant && $item->variant->track_quantity) {
                                        $item->variant->increment('inventory_quantity', $item->quantity);
                                        Log::info("Restocked {$item->quantity} units for SKU [{$item->sku}] on failed checkout.");
                                    }
                                }
                                $order->update([
                                    'status' => 'cancelled',
                                    'financial_status' => 'pending',
                                ]);
                            });
                            Log::warning("Order #{$order->order_number} payment failed/canceled. Stock restored.");
                        }
                        break;

                    case 'charge.refunded':
                        DB::transaction(function () use ($order) {
                            if ($order->status !== 'cancelled') {
                                foreach ($order->items as $item) {
                                    if ($item->variant && $item->variant->track_quantity) {
                                        $item->variant->increment('inventory_quantity', $item->quantity);
                                    }
                                }
                            }
                            $order->update([
                                'financial_status' => 'refunded',
                                'status' => 'cancelled',
                            ]);
                        });
                        Log::info("Order #{$order->order_number} marked as REFUNDED and inventory restored.");
                        break;
                }
            }
        }

        return response()->json(['received' => true], 200);
    }
}
