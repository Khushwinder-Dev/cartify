<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ProductResource;
use App\Models\Wishlist;
use App\Models\WishlistItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends BaseApiController
{
    private function resolveWishlist(Request $request): Wishlist
    {
        $user = $request->user();
        $token = $request->header('X-Guest-Token') ?? $request->input('guest_token');

        if ($user) {
            return Wishlist::firstOrCreate(['user_id' => $user->id]);
        }

        return Wishlist::firstOrCreate(['guest_token' => $token ?? (string) \Illuminate\Support\Str::uuid()]);
    }

    public function index(Request $request): JsonResponse
    {
        $wishlist = $this->resolveWishlist($request);
        $wishlist->load(['items.product.primaryMedia', 'items.product.variants', 'items.variant']);

        return $this->success([
            'wishlist_id' => $wishlist->id,
            'items_count' => $wishlist->items->count(),
            'items' => $wishlist->items,
        ]);
    }

    public function toggle(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
        ]);

        $wishlist = $this->resolveWishlist($request);
        $existing = $wishlist->items()
            ->where('product_id', $validated['product_id'])
            ->where('product_variant_id', $validated['product_variant_id'] ?? null)
            ->first();

        if ($existing) {
            $existing->delete();
            return $this->success(['in_wishlist' => false], 'Removed from wishlist');
        }

        $item = $wishlist->items()->create([
            'product_id' => $validated['product_id'],
            'product_variant_id' => $validated['product_variant_id'] ?? null,
        ]);

        return $this->success(['in_wishlist' => true, 'item' => $item], 'Added to wishlist');
    }

    public function remove(Request $request, int $itemId): JsonResponse
    {
        $wishlist = $this->resolveWishlist($request);
        $wishlist->items()->where('id', $itemId)->delete();

        return $this->success(null, 'Item removed from wishlist');
    }
}
