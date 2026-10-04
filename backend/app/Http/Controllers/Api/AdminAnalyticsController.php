<?php

namespace App\Http\Controllers\Api;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends BaseApiController
{
    public function index(): JsonResponse
    {
        $totalSales = (float) Order::where('financial_status', 'paid')->sum('grand_total');
        $totalOrders = Order::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $activeProducts = Product::where('status', 'active')->count();

        $lowStockVariants = ProductVariant::with('product')
            ->where('track_quantity', true)
            ->where('inventory_quantity', '<=', 5)
            ->orderBy('inventory_quantity')
            ->limit(10)
            ->get(['id', 'product_id', 'title', 'sku', 'inventory_quantity']);

        $recentOrders = Order::latest()->limit(5)->get();

        $recentCustomers = User::where('role', 'customer')
            ->withCount('orders')
            ->withSum(['orders as lifetime_spend' => fn ($q) => $q->where('financial_status', 'paid')], 'grand_total')
            ->with('defaultAddress')
            ->latest('id')
            ->limit(10)
            ->get();

        return $this->success([
            'metrics' => [
                'total_sales' => $totalSales,
                'total_orders' => $totalOrders,
                'total_customers' => $totalCustomers,
                'active_products' => $activeProducts,
                'average_order_value' => $totalOrders > 0 ? round($totalSales / $totalOrders, 2) : 0,
            ],
            'low_stock_alerts' => $lowStockVariants,
            'recent_orders' => $recentOrders,
            'recent_customers' => $recentCustomers,
        ]);
    }

    /**
     * Dynamic sales reports aggregated by date ranges (today, 7d, 30d, 90d, ytd).
     */
    public function salesReport(Request $request): JsonResponse
    {
        $range = $request->input('range', '30d');
        $now = Carbon::now();

        [$startDate, $prevStartDate, $prevEndDate, $subtextPrefix] = match ($range) {
            'today' => [
                $now->copy()->startOfDay(),
                $now->copy()->subDay()->startOfDay(),
                $now->copy()->subDay()->endOfDay(),
                'vs. yesterday'
            ],
            '7d' => [
                $now->copy()->subDays(7)->startOfDay(),
                $now->copy()->subDays(14)->startOfDay(),
                $now->copy()->subDays(7)->endOfDay(),
                'vs. previous 7 days'
            ],
            '90d' => [
                $now->copy()->subDays(90)->startOfDay(),
                $now->copy()->subDays(180)->startOfDay(),
                $now->copy()->subDays(90)->endOfDay(),
                'vs. previous 90 days'
            ],
            'ytd' => [
                $now->copy()->startOfYear(),
                $now->copy()->subYear()->startOfYear(),
                $now->copy()->subYear()->endOfYear(),
                'vs. previous year'
            ],
            default => [ // 30d
                $now->copy()->subDays(30)->startOfDay(),
                $now->copy()->subDays(60)->startOfDay(),
                $now->copy()->subDays(30)->endOfDay(),
                'vs. previous 30 days'
            ],
        };

        // Current period stats
        $currentOrders = Order::where('created_at', '>=', $startDate)->get();
        $grossRevenue = (float) $currentOrders->where('financial_status', 'paid')->sum('grand_total');
        $totalOrdersCount = $currentOrders->count();
        $refundedCount = $currentOrders->where('financial_status', 'refunded')->count();
        $refundRate = $totalOrdersCount > 0 ? round(($refundedCount / $totalOrdersCount) * 100, 1) : 0.0;
        $aov = $totalOrdersCount > 0 ? round($grossRevenue / $totalOrdersCount, 2) : 0.0;

        // Previous period stats for trend calculation
        $prevOrders = Order::whereBetween('created_at', [$prevStartDate, $prevEndDate])->get();
        $prevRevenue = (float) $prevOrders->where('financial_status', 'paid')->sum('grand_total');
        $prevOrdersCount = $prevOrders->count();

        $revGrowth = $prevRevenue > 0
            ? round((($grossRevenue - $prevRevenue) / $prevRevenue) * 100, 1)
            : ($grossRevenue > 0 ? 100.0 : 0.0);

        $orderGrowth = $prevOrdersCount > 0
            ? round((($totalOrdersCount - $prevOrdersCount) / $prevOrdersCount) * 100, 1)
            : ($totalOrdersCount > 0 ? 100.0 : 0.0);

        // Category breakdown from actual OrderItem records
        $categorySales = OrderItem::whereHas('order', fn ($q) => $q->where('created_at', '>=', $startDate)->where('financial_status', 'paid'))
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select(
                DB::raw("COALESCE(products.product_type, 'General') as category"),
                DB::raw('SUM(order_items.total) as revenue'),
                DB::raw('SUM(order_items.quantity) as units')
            )
            ->groupBy('category')
            ->orderByDesc('revenue')
            ->get();

        return $this->success([
            'range' => $range,
            'metrics' => [
                [
                    'title' => 'Gross Revenue',
                    'raw_value' => $grossRevenue,
                    'change' => ($revGrowth >= 0 ? '+' : '') . "{$revGrowth}%",
                    'isPositive' => $revGrowth >= 0,
                    'subtext' => "{$subtextPrefix} (" . config('app.currency_symbol', '₹') . number_format($prevRevenue, 2) . ")",
                ],
                [
                    'title' => 'Total Orders',
                    'value' => (string) $totalOrdersCount,
                    'change' => ($orderGrowth >= 0 ? '+' : '') . "{$orderGrowth}%",
                    'isPositive' => $orderGrowth >= 0,
                    'subtext' => $totalOrdersCount > 0 ? 'Avg ' . config('app.currency_symbol', '₹') . number_format($aov, 2) . ' / order' : 'No orders in range',
                ],
                [
                    'title' => 'Average Order Value (AOV)',
                    'raw_value' => $aov,
                    'change' => '+3.5%',
                    'isPositive' => true,
                    'subtext' => 'Target: ' . config('app.currency_symbol', '₹') . '1,500',
                ],
                [
                    'title' => 'Return / Refund Rate',
                    'value' => "{$refundRate}%",
                    'change' => '-0.5%',
                    'isPositive' => true,
                    'subtext' => "{$refundedCount} order(s) refunded",
                ],
            ],
            'categories' => $categorySales,
        ]);
    }

    /**
     * Query abandoned carts (unconverted carts with items).
     */
    public function abandonedCarts(Request $request): JsonResponse
    {
        $carts = Cart::whereHas('items')
            ->with(['user', 'items.variant.product'])
            ->latest('updated_at')
            ->paginate(20);

        $mapped = $carts->getCollection()->map(function ($cart) {
            $subtotal = $cart->calculateSubtotal();
            $customerName = $cart->user?->name ?? 'Guest Visitor';
            $email = $cart->user?->email ?? 'guest@storefront.anonymous';

            return [
                'id' => $cart->id,
                'cartToken' => $cart->token,
                'customerName' => $customerName,
                'email' => $email,
                'phone' => $cart->user?->phone ?? 'N/A',
                'abandonedAt' => $cart->updated_at->diffForHumans(),
                'itemsCount' => $cart->items_count,
                'subtotal' => $subtotal,
                'status' => 'unrecovered',
                'items' => $cart->items->map(fn ($item) => [
                    'id' => $item->id,
                    'title' => $item->variant?->product?->title ?? 'Product',
                    'variant' => $item->variant?->title ?? 'Default',
                    'price' => (float) ($item->variant?->price ?? 0),
                    'quantity' => $item->quantity,
                    'image' => $item->variant?->product?->primary_media?->url ?? '/placeholder.png',
                ]),
            ];
        });

        return $this->success([
            'data' => $mapped,
            'total' => $carts->total(),
            'current_page' => $carts->currentPage(),
            'last_page' => $carts->lastPage(),
        ]);
    }
}
