<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Services\Payment\PaymentGatewayInterface;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
            Log::error('Webhook verification failed: ' . $e->getMessage());
            return $this->error('Webhook verification failed: ' . $e->getMessage(), null, 400);
        }

        $eventType = $event['type'] ?? '';
        $dataObject = $event['data']['object'] ?? [];
        $paymentIntentId = $dataObject['id'] ?? null;

        Log::info("Payment webhook received: {$eventType}", ['payment_intent_id' => $paymentIntentId]);

        if ($paymentIntentId) {
            $order = Order::where('payment_intent_id', $paymentIntentId)->first();

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
                        $order->update([
                            'financial_status' => 'pending',
                        ]);
                        Log::warning("Order #{$order->order_number} payment failed.");
                        break;

                    case 'charge.refunded':
                        $order->update([
                            'financial_status' => 'refunded',
                        ]);
                        Log::info("Order #{$order->order_number} marked as REFUNDED.");
                        break;
                }
            }
        }

        return response()->json(['received' => true], 200);
    }
}
