<?php

use App\Http\Controllers\Api\AdminAnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\CollectionController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DiscountController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentGatewayController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ShippingController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // 1. Authentication (Rate-limited against brute-force & credential stuffing)
    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    // 2. Public Catalog & Collections
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::get('/collections', [CollectionController::class, 'index']);
    Route::get('/collections/{slug}', [CollectionController::class, 'show']);

    // 3. Product Reviews & Ratings (Rate-limited review submission)
    Route::get('/products/{productId}/reviews', [ReviewController::class, 'index']);
    Route::post('/products/{productId}/reviews', [ReviewController::class, 'store'])->middleware('throttle:5,1');

    // 4. Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);
    Route::delete('/wishlist/{itemId}', [WishlistController::class, 'remove']);

    // 5. Cart Management (token & guest-friendly)
    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::put('/cart/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
    Route::post('/cart/calculate', [CartController::class, 'calculate']);

    // 6. Discounts / Coupon validation (Rate-limited against dictionary attacks)
    Route::post('/discounts/validate', [DiscountController::class, 'validateCode'])->middleware('throttle:15,1');

    // 7. Checkout (Rate-limited against automated carding)
    Route::post('/checkout/process', [CheckoutController::class, 'process'])->middleware('throttle:10,1');

    // 8. Webhooks
    Route::post('/webhooks/payment', [WebhookController::class, 'handlePayment']);

    // Public Shipping & Payment Methods (e.g. for checkout preview)
    Route::get('/shipping-methods', [ShippingController::class, 'index']);
    Route::get('/payment-gateways', [PaymentGatewayController::class, 'index']);

    // 9. Authenticated Customer Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/cart/merge', [CartController::class, 'merge']);

        // Orders
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{identifier}', [OrderController::class, 'show']);
    });

    // 10. Admin RBAC Routes (Strict authentication and role verification)
    Route::prefix('admin')->middleware(['auth:sanctum', EnsureAdmin::class])->group(function () {
        // Analytics
        Route::get('/analytics', [AdminAnalyticsController::class, 'index']);

        // Products management
        Route::post('/products', [ProductController::class, 'store']);
        Route::post('/products/preview-matrix', [ProductController::class, 'previewMatrix']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::patch('/products/{id}/variants', [ProductController::class, 'bulkUpdateVariants']);

        // Collections / Categories
        Route::post('/collections', [CollectionController::class, 'store']);
        Route::put('/collections/{id}', [CollectionController::class, 'update']);
        Route::delete('/collections/{id}', [CollectionController::class, 'destroy']);

        // Inventory management
        Route::get('/inventory', [ProductController::class, 'getInventory']);
        Route::patch('/variants/{id}/inventory', [ProductController::class, 'updateVariantInventory']);

        // Orders management
        Route::get('/orders', [OrderController::class, 'adminIndex']);
        Route::patch('/orders/{id}/fulfillment', [OrderController::class, 'updateFulfillment']);
        Route::patch('/orders/{id}/financial', [OrderController::class, 'updateFinancial']);

        // Discounts
        Route::get('/discounts', [DiscountController::class, 'index']);
        Route::post('/discounts', [DiscountController::class, 'store']);
        Route::delete('/discounts/{id}', [DiscountController::class, 'destroy']);

        // Reviews Moderation
        Route::get('/reviews', [ReviewController::class, 'adminIndex']);
        Route::patch('/reviews/{id}', [ReviewController::class, 'updateStatus']);
        Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

        // Customers CRM (Full CRUD)
        Route::get('/customers', [CustomerController::class, 'index']);
        Route::post('/customers', [CustomerController::class, 'store']);
        Route::get('/customers/{id}', [CustomerController::class, 'show']);
        Route::put('/customers/{id}', [CustomerController::class, 'update']);
        Route::delete('/customers/{id}', [CustomerController::class, 'destroy']);

        // Shipping Methods Management (Full CRUD)
        Route::get('/shipping', [ShippingController::class, 'index']);
        Route::post('/shipping', [ShippingController::class, 'store']);
        Route::get('/shipping/{id}', [ShippingController::class, 'show']);
        Route::put('/shipping/{id}', [ShippingController::class, 'update']);
        Route::patch('/shipping/{id}/toggle', [ShippingController::class, 'toggle']);
        Route::delete('/shipping/{id}', [ShippingController::class, 'destroy']);

        // Payment Gateways Management (Full CRUD)
        Route::get('/payments', [PaymentGatewayController::class, 'index']);
        Route::post('/payments', [PaymentGatewayController::class, 'store']);
        Route::get('/payments/{id}', [PaymentGatewayController::class, 'show']);
        Route::put('/payments/{id}', [PaymentGatewayController::class, 'update']);
        Route::patch('/payments/{id}/toggle', [PaymentGatewayController::class, 'toggle']);
        Route::delete('/payments/{id}', [PaymentGatewayController::class, 'destroy']);
    });
});
