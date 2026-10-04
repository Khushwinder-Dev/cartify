<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends BaseApiController
{
    /**
     * Customer orders listing.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $orders = Order::where('user_id', $user->id)
            ->with(['items.variant.product'])
            ->latest()
            ->paginate(15);

        return $this->paginated($orders, OrderResource::class);
    }

    /**
     * Show single order by order number or ID.
     */
    public function show(Request $request, string $identifier): JsonResponse
    {
        $user = $request->user('sanctum');

        // 1. Authenticated customer / admin lookup
        if ($user) {
            if ($user->isAdmin()) {
                $order = Order::where(function ($q) use ($identifier) {
                    $q->where('order_number', $identifier)->orWhere('id', $identifier);
                })->with(['items.variant.product', 'items.product'])->firstOrFail();
            } else {
                $order = $user->orders()->where(function ($q) use ($identifier) {
                    $q->where('order_number', $identifier)->orWhere('id', $identifier);
                })->with(['items.variant.product', 'items.product'])->firstOrFail();
            }

            return $this->success(new OrderResource($order));
        }

        // 2. Guest order lookup: Requires matching order email and idempotency_key
        $email = $request->input('email');
        $idempotencyKey = $request->input('idempotency_key');

        if (!$email || !$idempotencyKey) {
            return $this->error('Authentication or guest verification credentials required to access order.', null, 401);
        }

        $order = Order::where(function ($q) use ($identifier) {
            $q->where('order_number', $identifier)->orWhere('id', $identifier);
        })
            ->whereNull('user_id')
            ->where('email', strtolower(trim($email)))
            ->where('idempotency_key', $idempotencyKey)
            ->with(['items.variant.product', 'items.product'])
            ->firstOrFail();

        return $this->success(new OrderResource($order));
    }

    /**
     * Admin: All orders with filters.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Order::query()->with(['items.variant', 'user']);

        if ($request->has('financial_status')) {
            $query->where('financial_status', $request->input('financial_status'));
        }
        if ($request->has('fulfillment_status')) {
            $query->where('fulfillment_status', $request->input('fulfillment_status'));
        }
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%");
            });
        }

        $orders = $query->latest()->paginate(20);

        return $this->paginated($orders, OrderResource::class);
    }

    /**
     * Admin: Update fulfillment status.
     */
    public function updateFulfillment(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'fulfillment_status' => 'required|in:unfulfilled,partially_fulfilled,fulfilled,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['fulfillment_status' => $validated['fulfillment_status']]);

        return $this->success(new OrderResource($order->fresh('items')), 'Order fulfillment status updated');
    }

    /**
     * Admin: Update financial status.
     */
    public function updateFinancial(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'financial_status' => 'required|in:pending,authorized,paid,refunded,partially_refunded',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['financial_status' => $validated['financial_status']]);

        return $this->success(new OrderResource($order->fresh('items')), 'Order financial status updated');
    }
}
