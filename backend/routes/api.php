<?php

use App\Http\Controllers\Api\AdminAnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\DiscountController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // 1. Authentication
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // 2. Public Catalog
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    // 3. Cart Management (token & guest-friendly)
    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::put('/cart/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
    Route::post('/cart/calculate', [CartController::class, 'calculate']);

    // 4. Discounts / Coupon validation
    Route::post('/discounts/validate', [DiscountController::class, 'validateCode']);

    // 5. Checkout
    Route::post('/checkout/process', [CheckoutController::class, 'process']);

    // 6. Webhooks
    Route::post('/webhooks/payment', [WebhookController::class, 'handlePayment']);

    // 7. Authenticated Customer Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/cart/merge', [CartController::class, 'merge']);

        // Orders
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{identifier}', [OrderController::class, 'show']);
    });

    // 8. Admin RBAC Routes
    Route::prefix('admin')->middleware([EnsureAdmin::class])->group(function () {
        // Analytics
        Route::get('/analytics', [AdminAnalyticsController::class, 'index']);

        // Products management
        Route::post('/products', [ProductController::class, 'store']);
        Route::post('/products/preview-matrix', [ProductController::class, 'previewMatrix']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::patch('/products/{id}/variants', [ProductController::class, 'bulkUpdateVariants']);

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
    });
});
