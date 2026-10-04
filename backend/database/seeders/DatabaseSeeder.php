<?php

namespace Database\Seeders;

use App\Models\CustomerAddress;
use App\Models\Discount;
use App\Models\Product;
use App\Models\User;
use App\Services\ProductVariantService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $variantService = app(ProductVariantService::class);

        // 1. Admin & Customer Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@shopify-clone.test'],
            [
                'name' => 'Store Administrator',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '+1 (555) 123-4567',
            ]
        );

        $customer = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Eleanor Vance',
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'phone' => '+1 (555) 987-6543',
            ]
        );

        CustomerAddress::firstOrCreate(
            ['user_id' => $customer->id, 'is_default' => true],
            [
                'first_name' => 'Eleanor',
                'last_name' => 'Vance',
                'company' => 'Atelier Studio',
                'address_line1' => '742 Evergreen Terrace',
                'city' => 'Springfield',
                'state' => 'OR',
                'postal_code' => '97477',
                'country' => 'US',
                'phone' => '+1 (555) 987-6543',
            ]
        );

        // 2. Discounts
        Discount::firstOrCreate(
            ['code' => 'WELCOME10'],
            [
                'type' => 'percentage',
                'value' => 10.00,
                'min_subtotal' => 50.00,
                'is_active' => true,
                'usage_limit' => 500,
            ]
        );

        Discount::firstOrCreate(
            ['code' => 'SAVE50'],
            [
                'type' => 'fixed',
                'value' => 50.00,
                'min_subtotal' => 200.00,
                'is_active' => true,
                'usage_limit' => 100,
            ]
        );

        Discount::firstOrCreate(
            ['code' => 'FLASH25'],
            [
                'type' => 'percentage',
                'value' => 25.00,
                'min_subtotal' => 150.00,
                'is_active' => true,
            ]
        );

        // 3. Multi-Variant Products
        $catalog = [
            [
                'title' => 'Minimalist Japanese Wool Overshirt',
                'slug' => 'minimalist-japanese-wool-overshirt',
                'description' => 'Tailored from heavyweight 380gsm Japanese melton wool. Features horn buttons, French seams, and a relaxed boxy drape designed for versatile layering throughout the year.',
                'status' => 'active',
                'vendor' => 'Noragi Studio',
                'product_type' => 'Apparel',
                'tags' => ['wool', 'outerwear', 'minimalist', 'japan'],
                'media' => [
                    ['url' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80', 'alt' => 'Overshirt Front view', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80', 'alt' => 'Wool fabric texture', 'is_primary' => false],
                ],
                'options' => [
                    ['name' => 'Size', 'values' => ['S', 'M', 'L', 'XL']],
                    ['name' => 'Color', 'values' => ['Oatmeal', 'Charcoal', 'Forest Green']],
                ],
                'base_price' => 185.00,
                'compare_at_price' => 230.00,
                'base_inventory' => 15,
            ],
            [
                'title' => 'Aerospace Titanium Chronograph Watch',
                'slug' => 'aerospace-titanium-chronograph-watch',
                'description' => 'Engineered from grade 5 aerospace titanium with anti-reflective sapphire crystal glass. Features precision Japanese automatic movement with 42 hours power reserve and 100m water resistance.',
                'status' => 'active',
                'vendor' => 'Horology Lab',
                'product_type' => 'Accessories',
                'tags' => ['watch', 'titanium', 'luxury', 'chronograph'],
                'media' => [
                    ['url' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80', 'alt' => 'Titanium watch dial', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80', 'alt' => 'Watch leather strap detail', 'is_primary' => false],
                ],
                'options' => [
                    ['name' => 'Dial', 'values' => ['Midnight Black', 'Polar White']],
                    ['name' => 'Strap', 'values' => ['Milanese Mesh', 'Full Grain Leather']],
                ],
                'base_price' => 450.00,
                'compare_at_price' => 520.00,
                'base_inventory' => 8,
            ],
            [
                'title' => 'Noise-Cancelling Studio Headphones Pro',
                'slug' => 'noise-cancelling-studio-headphones-pro',
                'description' => 'Audiophile-grade 40mm planar magnetic drivers delivering ultra-low distortion and expansive soundstage. Hybrid active noise cancellation with 45 hours battery life and premium leather memory foam ear cushions.',
                'status' => 'active',
                'vendor' => 'Acoustics Sound',
                'product_type' => 'Electronics',
                'tags' => ['audio', 'headphones', 'wireless', 'anc'],
                'media' => [
                    ['url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80', 'alt' => 'Headphones angled view', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80', 'alt' => 'Ear cup texture', 'is_primary' => false],
                ],
                'options' => [
                    ['name' => 'Color', 'values' => ['Obsidian Black', 'Silver Mist', 'Sandstone Tan']],
                ],
                'base_price' => 299.00,
                'compare_at_price' => 349.00,
                'base_inventory' => 20,
            ],
            [
                'title' => 'Solid Walnut Ergonomic Desk',
                'slug' => 'solid-walnut-ergonomic-desk',
                'description' => 'Sustainably harvested American black walnut with natural beveled contour edge. Dual-motor synchronized height adjustment with digital memory presets and integrated aluminum cable management channel.',
                'status' => 'active',
                'vendor' => 'Kanso Living',
                'product_type' => 'Furniture',
                'tags' => ['desk', 'walnut', 'ergonomic', 'furniture'],
                'media' => [
                    ['url' => 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80', 'alt' => 'Walnut desk workspace', 'is_primary' => true],
                ],
                'options' => [
                    ['name' => 'Size', 'values' => ['55 Inch', '63 Inch']],
                    ['name' => 'Frame', 'values' => ['Matte Black', 'Arctic White']],
                ],
                'base_price' => 680.00,
                'compare_at_price' => 790.00,
                'base_inventory' => 6,
            ],
        ];

        foreach ($catalog as $item) {
            $product = Product::firstOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'description' => $item['description'],
                    'status' => $item['status'],
                    'vendor' => $item['vendor'],
                    'product_type' => $item['product_type'],
                    'tags' => $item['tags'],
                    'published_at' => now(),
                ]
            );

            // Add media
            foreach ($item['media'] as $pos => $mediaData) {
                $product->media()->firstOrCreate(
                    ['url' => $mediaData['url']],
                    [
                        'alt_text' => $mediaData['alt'],
                        'position' => $pos,
                        'is_primary' => $mediaData['is_primary'],
                    ]
                );
            }

            // Generate Cartesian matrix of variants
            $variantService->generateVariantsFromOptions(
                $product,
                $item['options'],
                [
                    'price' => $item['base_price'],
                    'compare_at_price' => $item['compare_at_price'],
                    'inventory_quantity' => $item['base_inventory'],
                    'track_quantity' => true,
                    'allow_backorders' => false,
                ]
            );
        }
    }
}
