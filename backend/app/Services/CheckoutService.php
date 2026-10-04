<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Discount;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\Payment\PaymentGatewayInterface;
use App\Services\Payment\StripePaymentGateway;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckoutService
{
    public function __construct(
        protected PricingEngineService $pricingEngine,
        protected PaymentGatewayInterface $paymentGateway
    ) {}

    /**
     * Process checkout idempotently with concurrency-safe atomic inventory decrements.
     *
     * @param Cart $cart
     * @param array $payload
     * @param User|null $user
     * @return array ['order' => Order, 'payment' => array]
     * @throws Exception
     */
    public function processCheckout(Cart $cart, array $payload, ?User $user = null): array
    {
        $idempotencyKey = $payload['idempotency_key'] ?? null;

        // 1. Idempotency Check: return existing order if already completed with this key
        if ($idempotencyKey) {
            $existingOrder = Order::where('idempotency_key', $idempotencyKey)
                ->with(['items.variant.product', 'items.product'])
                ->first();
            if ($existingOrder) {
                return [
                    'order' => $existingOrder,
                    'payment' => [
                        'status' => 'already_processed',
                        'order_number' => $existingOrder->order_number,
                    ],
                ];
            }
        }

        // 2. Validate Cart State
        $cart->loadMissing(['items.variant.product', 'items.variant.optionValues']);
        if ($cart->items->isEmpty()) {
            throw new Exception('Cart is empty. Cannot process checkout.');
        }

        // 3. Concurrency-Safe Stock Decrement and Order Creation Transaction
        return DB::transaction(function () use ($cart, $payload, $user, $idempotencyKey) {
            $pricing = $this->pricingEngine->calculate(
                $cart,
                $payload['discount_code'] ?? null,
                $payload['shipping_address'] ?? []
            );

            // Pessimistic Locking: Acquire exclusive row locks (lockForUpdate) on all variants in order
            $variantIds = $cart->items->pluck('product_variant_id')->unique()->all();
            $lockedVariants = ProductVariant::whereIn('id', $variantIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            // Verify inventory availability for each line item under lock
            foreach ($cart->items as $cartItem) {
                $variant = $lockedVariants->get($cartItem->product_variant_id);

                if (!$variant) {
                    throw new Exception("Product variant with ID {$cartItem->product_variant_id} is no longer available.");
                }

                if ($variant->track_quantity && !$variant->allow_backorders) {
                    if ($variant->inventory_quantity < $cartItem->quantity) {
                        throw new Exception("Insufficient stock for '{$variant->product->title} - {$variant->title}'. Only {$variant->inventory_quantity} available.");
                    }
                }
            }

            // Decrement inventory atomically under lock
            foreach ($cart->items as $cartItem) {
                $variant = $lockedVariants->get($cartItem->product_variant_id);
                if ($variant->track_quantity) {
                    $variant->decrement('inventory_quantity', $cartItem->quantity);

                    // Low stock alert threshold (e.g. <= 5 units)
                    if ($variant->inventory_quantity <= 5) {
                        Log::warning("Low stock alert for SKU [{$variant->sku}]: {$variant->inventory_quantity} remaining.", [
                            'variant_id' => $variant->id,
                            'product_id' => $variant->product_id,
                        ]);
                    }
                }
            }

            // Increment discount usage if applied
            if (!empty($pricing['discount_code'])) {
                Discount::where('code', $pricing['discount_code'])->increment('times_used');
            }

            // 4. Create Immutable Order Snapshot
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $user?->id ?? $cart->user_id,
                'email' => $payload['email'] ?? $user?->email,
                'customer_name' => $payload['customer_name'] ?? ($user ? $user->name : 'Guest Customer'),
                'phone' => $payload['phone'] ?? null,
                'status' => 'open',
                'financial_status' => 'pending',
                'fulfillment_status' => 'unfulfilled',
                'currency' => $pricing['currency'],
                'subtotal' => $pricing['subtotal'],
                'discount_total' => $pricing['discount_total'],
                'tax_total' => $pricing['tax_total'],
                'shipping_total' => $pricing['shipping_total'],
                'grand_total' => $pricing['grand_total'],
                'idempotency_key' => $idempotencyKey,
                'shipping_address' => $payload['shipping_address'] ?? null,
                'billing_address' => $payload['billing_address'] ?? ($payload['shipping_address'] ?? null),
                'notes' => $payload['notes'] ?? null,
            ]);

            // 5. Create Immutable Order Items Snapshot
            foreach ($cart->items as $cartItem) {
                $variant = $lockedVariants->get($cartItem->product_variant_id);
                $optionsSnapshot = $variant->optionValues->map(fn ($ov) => [
                    'option' => $ov->option?->name,
                    'value' => $ov->value,
                ])->toArray();

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $variant->product_id,
                    'product_variant_id' => $variant->id,
                    'product_title' => $variant->product->title,
                    'variant_title' => $variant->title,
                    'sku' => $variant->sku,
                    'price' => $cartItem->price,
                    'quantity' => $cartItem->quantity,
                    'total' => round((float) $cartItem->price * $cartItem->quantity, 2),
                    'options_snapshot' => $optionsSnapshot,
                ]);
            }

            // 6. Initialize Payment Intent via Payment Gateway
            $paymentData = $this->paymentGateway->createPaymentIntent($order);

            // 7. Flush cart items
            $cart->items()->delete();

            return [
                'order' => $order->load(['items.variant.product']),
                'payment' => $paymentData,
            ];
        });
    }
}
