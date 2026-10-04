<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    public function test_admin_can_create_product_with_dynamic_options_and_cartesian_variants(): void
    {
        $admin = User::where('role', 'admin')->first();

        $payload = [
            'title' => 'Cashmere Knit Beanie',
            'status' => 'active',
            'vendor' => 'Alpine Studio',
            'product_type' => 'Headwear',
            'options' => [
                ['name' => 'Color', 'values' => ['Navy', 'Heather Grey', 'Caramel']],
            ],
            'base_price' => 65.00,
            'base_inventory' => 25,
            'media' => [
                ['url' => 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1000&q=80', 'alt_text' => 'Beanie front', 'is_primary' => true],
            ],
        ];

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/products', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Cashmere Knit Beanie')
            ->assertJsonCount(3, 'data.variants');

        $productId = $response->json('data.id');
        $variants = $response->json('data.variants');

        // Test bulk update of the generated variants matrix
        $bulkUpdatePayload = [
            'variants' => [
                [
                    'id' => $variants[0]['id'],
                    'price' => 59.00,
                    'inventory_quantity' => 12,
                ],
                [
                    'id' => $variants[1]['id'],
                    'price' => 70.00,
                    'inventory_quantity' => 4,
                ]
            ]
        ];

        $bulkResponse = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/products/{$productId}/variants", $bulkUpdatePayload);

        $bulkResponse->assertStatus(200);

        // Verify updated price
        $updatedProduct = Product::with('variants')->find($productId);
        $this->assertEquals(59.00, (float) $updatedProduct->variants->firstWhere('id', $variants[0]['id'])->price);
        $this->assertEquals(12, $updatedProduct->variants->firstWhere('id', $variants[0]['id'])->inventory_quantity);
    }

    public function test_admin_analytics_endpoint(): void
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/analytics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'metrics' => [
                        'total_sales',
                        'total_orders',
                        'total_customers',
                        'active_products',
                        'average_order_value',
                    ],
                    'low_stock_alerts',
                    'recent_orders',
                ]
            ]);
    }
}
