<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Services\CheckoutService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckoutController extends BaseApiController
{
    public function __construct(
        protected CheckoutService $checkoutService
    ) {}

    public function process(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'idempotency_key' => 'required|string|max:128',
            'cart_token' => 'nullable|uuid',
            'email' => 'required|email|max:255',
            'customer_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'shipping_address' => 'required|array',
            'shipping_address.address_line1' => 'required|string|max:255',
            'shipping_address.city' => 'required|string|max:100',
            'shipping_address.state' => 'required|string|max:100',
            'shipping_address.postal_code' => 'required|string|max:20',
            'shipping_address.country' => 'required|string|size:2',
            'shipping_address.shipping_rate' => 'nullable|in:standard,express',
            'billing_address' => 'nullable|array',
            'discount_code' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Check idempotency first before cart verification so re-submitted requests return the existing order
        $existingOrder = \App\Models\Order::where('idempotency_key', $validated['idempotency_key'])
            ->with(['items.variant.product', 'items.product'])
            ->first();

        if ($existingOrder) {
            return $this->success([
                'order' => new OrderResource($existingOrder),
                'payment' => [
                    'status' => 'already_processed',
                    'order_number' => $existingOrder->order_number,
                ],
            ]);
        }

        $user = $request->user('sanctum');

        // Resolve cart
        if ($user) {
            $cart = Cart::where('user_id', $user->id)->first();
        } else {
            $token = $request->header('X-Cart-Token') ?? $validated['cart_token'] ?? null;
            $cart = $token ? Cart::where('token', $token)->first() : null;
        }

        if (!$cart || $cart->items()->count() === 0) {
            return $this->error('No active cart found with items to checkout.', null, 422);
        }

        try {
            $result = $this->checkoutService->processCheckout($cart, $validated, $user);

            return $this->success([
                'order' => new OrderResource($result['order']),
                'payment' => $result['payment'],
            ], 'Order created successfully', [], 201);
        } catch (Exception $e) {
            return $this->error($e->getMessage(), null, 422);
        }
    }
}
