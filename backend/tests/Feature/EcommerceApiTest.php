<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\Discount;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class EcommerceApiTest extends TestCase
{
    public function test_can_list_products_with_standard_envelope(): void
    {
        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'slug',
                        'min_price',
                        'max_price',
                        'is_available',
                        'primary_media',
                    ]
                ],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ],
                'message',
                'errors',
            ]);
    }

    public function test_can_retrieve_single_product_with_variants_and_options(): void
    {
        $product = Product::first();
        $response = $this->getJson("/api/v1/products/{$product->slug}");

        $response->assertStatus(200)
            ->assertJsonPath('data.slug', $product->slug)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'slug',
                    'options' => [
                        '*' => ['id', 'name', 'values']
                    ],
                    'variants' => [
                        '*' => ['id', 'title', 'sku', 'price', 'inventory_quantity', 'option_values']
                    ]
                ]
            ]);
    }

    public function test_cart_operations_and_atomic_checkout(): void
    {
        $variant = ProductVariant::where('inventory_quantity', '>=', 5)->first();
        $initialStock = $variant->inventory_quantity;
        $cartToken = (string) Str::uuid();

        // 1. Add item to cart
        $addResponse = $this->withHeaders(['X-Cart-Token' => $cartToken])
            ->postJson('/api/v1/cart/items', [
                'product_variant_id' => $variant->id,
                'quantity' => 2,
            ]);

        $addResponse->assertStatus(200)
            ->assertJsonPath('message', 'Item added to cart')
            ->assertJsonPath('data.items_count', 2);

        $itemId = $addResponse->json('data.items.0.id');

        // 2. Update item quantity
        $updateResponse = $this->withHeaders(['X-Cart-Token' => $cartToken])
            ->putJson("/api/v1/cart/items/{$itemId}", [
                'quantity' => 3,
            ]);

        $updateResponse->assertStatus(200)
            ->assertJsonPath('data.items_count', 3);

        // 3. Process checkout with atomic stock decrement
        $idempotencyKey = (string) Str::uuid();
        $checkoutResponse = $this->withHeaders(['X-Cart-Token' => $cartToken])
            ->postJson('/api/v1/checkout/process', [
                'idempotency_key' => $idempotencyKey,
                'email' => 'checkout-test@example.com',
                'customer_name' => 'Test Customer',
                'shipping_address' => [
                    'address_line1' => '100 Main St',
                    'city' => 'Seattle',
                    'state' => 'WA',
                    'postal_code' => '98101',
                    'country' => 'US',
                ],
                'discount_code' => 'WELCOME10',
            ]);

        $checkoutResponse->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'order' => [
                        'id',
                        'order_number',
                        'financial_status',
                        'fulfillment_status',
                        'grand_total',
                        'items',
                    ],
                    'payment' => [
                        'gateway',
                        'payment_intent_id',
                        'client_secret',
                    ]
                ]
            ]);

        // 4. Verify atomic stock decrement
        $variant->refresh();
        $this->assertEquals($initialStock - 3, $variant->inventory_quantity);

        // 5. Test idempotency: re-submitting with identical key returns same order
        $repeatResponse = $this->withHeaders(['X-Cart-Token' => $cartToken])
            ->postJson('/api/v1/checkout/process', [
                'idempotency_key' => $idempotencyKey,
                'email' => 'checkout-test@example.com',
                'customer_name' => 'Test Customer',
                'shipping_address' => [
                    'address_line1' => '100 Main St',
                    'city' => 'Seattle',
                    'state' => 'WA',
                    'postal_code' => '98101',
                    'country' => 'US',
                ],
            ]);

        $repeatResponse->assertStatus(200)
            ->assertJsonPath('data.payment.status', 'already_processed')
            ->assertJsonPath('data.order.order_number', $checkoutResponse->json('data.order.order_number'));
    }

    public function test_payment_webhook_updates_order_status(): void
    {
        $order = \App\Models\Order::create([
            'order_number' => \App\Models\Order::generateOrderNumber(),
            'email' => 'webhook@test.com',
            'subtotal' => 100.00,
            'grand_total' => 108.00,
            'payment_intent_id' => 'pi_test_webhook_123',
            'financial_status' => 'pending',
        ]);

        $webhookPayload = [
            'type' => 'payment_intent.succeeded',
            'data' => [
                'object' => [
                    'id' => 'pi_test_webhook_123',
                ]
            ]
        ];

        $response = $this->postJson('/api/v1/webhooks/payment', $webhookPayload);
        $response->assertStatus(200)
            ->assertJson(['received' => true]);

        $order->refresh();
        $this->assertEquals('paid', $order->financial_status);
    }
}
