<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Models\ProductReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends BaseApiController
{
    public function index(int $productId): JsonResponse
    {
        $reviews = ProductReview::where('product_id', $productId)
            ->approved()
            ->latest()
            ->paginate(15);

        $averageRating = (float) ProductReview::where('product_id', $productId)
            ->approved()
            ->avg('rating');

        $totalReviews = ProductReview::where('product_id', $productId)
            ->approved()
            ->count();

        return $this->success([
            'average_rating' => round($averageRating, 1),
            'total_reviews' => $totalReviews,
            'reviews' => $reviews,
        ]);
    }

    public function store(Request $request, int $productId): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:150',
            'comment' => 'required|string|max:2000',
        ]);

        $user = $request->user();
        $isVerified = false;

        // Check if user has previously purchased this product
        if ($user) {
            $isVerified = Order::where('user_id', $user->id)
                ->where('financial_status', 'paid')
                ->whereHas('items', fn ($q) => $q->where('product_id', $productId))
                ->exists();
        }

        $review = ProductReview::create([
            'product_id' => $productId,
            'user_id' => $user?->id,
            'customer_name' => strip_tags(trim($validated['customer_name'])),
            'rating' => $validated['rating'],
            'title' => isset($validated['title']) ? strip_tags(trim($validated['title'])) : null,
            'comment' => strip_tags(trim($validated['comment'])),
            'is_verified_purchase' => $isVerified,
            'status' => 'approved', // Auto-approve or queue for moderation
        ]);

        return $this->success($review, 'Thank you! Your review has been submitted.', [], 201);
    }

    // Admin Moderation
    public function adminIndex(): JsonResponse
    {
        $reviews = ProductReview::with(['product:id,title,slug', 'user:id,name,email'])
            ->latest()
            ->paginate(25);

        return $this->paginated($reviews);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $review = ProductReview::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $review->update(['status' => $validated['status']]);
        return $this->success($review, 'Review status updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $review = ProductReview::findOrFail($id);
        $review->delete();
        return $this->success(null, 'Review deleted');
    }
}
