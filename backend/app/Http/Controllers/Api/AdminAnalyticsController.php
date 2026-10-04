<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Http\JsonResponse;
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
}
