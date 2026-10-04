<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Services\PricingEngineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CartController extends BaseApiController
{
    public function __construct(
        protected PricingEngineService $pricingEngine
    ) {}

    /**
     * Resolve cart from request (authenticated user cart or X-Cart-Token header).
     */
    protected function resolveCart(Request $request): Cart
    {
        $user = $request->user('sanctum');

        if ($user) {
            $cart = Cart::firstOrCreate(
                ['user_id' => $user->id],
                ['token' => (string) Str::uuid(), 'currency' => 'USD']
            );
        } else {
            $token = $request->header('X-Cart-Token') ?? $request->input('cart_token');
            if ($token) {
                $cart = Cart::firstOrCreate(
                    ['token' => $token],
                    ['currency' => 'USD']
                );
            } else {
                $cart = Cart::createWithToken(null, 'USD');
            }
        }

        return $cart->loadMissing(['items.variant.product', 'items.variant.optionValues']);
    }

    public function show(Request $request): JsonResponse
    {
        $cart = $this->resolveCart($request);
        return $this->success(new CartResource($cart));
    }

    public function addItem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $quantity = $validated['quantity'] ?? 1;
        $variant = ProductVariant::with('product')->findOrFail($validated['product_variant_id']);

        if (!$variant->hasSufficientStock($quantity)) {
            return $this->error("Insufficient stock for this variant. Only {$variant->inventory_quantity} available.", null, 422);
        }

        $cart = $this->resolveCart($request);

        $cartItem = $cart->items()->where('product_variant_id', $variant->id)->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $quantity;
            if (!$variant->hasSufficientStock($newQuantity)) {
                return $this->error("Cannot add {$quantity} more. Total in cart ({$newQuantity}) exceeds available stock ({$variant->inventory_quantity}).", null, 422);
            }
            $cartItem->update([
                'quantity' => $newQuantity,
                'price' => $variant->price,
            ]);
        } else {
            $cart->items()->create([
                'product_variant_id' => $variant->id,
                'quantity' => $quantity,
                'price' => $variant->price,
            ]);
        }

        return $this->success(
            new CartResource($cart->fresh(['items.variant.product', 'items.variant.optionValues'])),
            'Item added to cart'
        );
    }

    public function updateItem(Request $request, int $itemId): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $cart = $this->resolveCart($request);
        $cartItem = $cart->items()->where('id', $itemId)->firstOrFail();

        if ($validated['quantity'] === 0) {
            $cartItem->delete();
        } else {
            $variant = $cartItem->variant;
            if (!$variant->hasSufficientStock($validated['quantity'])) {
                return $this->error("Insufficient stock. Only {$variant->inventory_quantity} available.", null, 422);
            }

            $cartItem->update(['quantity' => $validated['quantity']]);
        }

        return $this->success(
            new CartResource($cart->fresh(['items.variant.product', 'items.variant.optionValues'])),
            'Cart item updated'
        );
    }

    public function removeItem(Request $request, int $itemId): JsonResponse
    {
        $cart = $this->resolveCart($request);
        $cartItem = $cart->items()->where('id', $itemId)->firstOrFail();
        $cartItem->delete();

        return $this->success(
            new CartResource($cart->fresh(['items.variant.product', 'items.variant.optionValues'])),
            'Cart item removed'
        );
    }

    public function merge(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'guest_cart_token' => 'required|uuid',
        ]);

        $user = $request->user();
        if (!$user) {
            return $this->error('Authentication required to merge cart', null, 401);
        }

        $guestCart = Cart::where('token', $validated['guest_cart_token'])->first();
        if (!$guestCart) {
            return $this->error('Guest cart not found', null, 404);
        }

        $userCart = Cart::firstOrCreate(['user_id' => $user->id], ['currency' => 'USD']);
        $userCart->mergeGuestCart($guestCart);

        return $this->success(
            new CartResource($userCart->fresh(['items.variant.product', 'items.variant.optionValues'])),
            'Cart merged successfully'
        );
    }

    /**
     * Calculate checkout totals (taxes, shipping, discounts) in real-time.
     */
    public function calculate(Request $request): JsonResponse
    {
        $cart = $this->resolveCart($request);
        $discountCode = $request->input('discount_code');
        $shippingAddress = $request->input('shipping_address', []);

        $breakdown = $this->pricingEngine->calculate($cart, $discountCode, $shippingAddress);

        return $this->success($breakdown);
    }
}
