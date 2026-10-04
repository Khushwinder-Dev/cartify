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
        User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Cartify Administrator',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '+1 (555) 100-2000',
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@shopify-clone.test'],
            [
                'name' => 'Cartify Admin',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '+1 (555) 123-4567',
            ]
        );

        $customer = User::firstOrCreate(
            ['email' => 'customer@customer.com'],
            [
                'name' => 'Sophia Laurent',
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'phone' => '+1 (555) 300-4000',
            ]
        );

        User::firstOrCreate(
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
                'first_name' => 'Sophia',
                'last_name' => 'Laurent',
                'company' => 'Cartify Atelier',
                'address_line1' => '450 Fashion Avenue, Suite 12',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10018',
                'country' => 'US',
                'phone' => '+1 (555) 300-4000',
            ]
        );

        // 2. Discounts
        Discount::firstOrCreate(
            ['code' => 'CARTIFY10'],
            [
                'type' => 'percentage',
                'value' => 10.00,
                'min_subtotal' => 50.00,
                'is_active' => true,
                'usage_limit' => 500,
            ]
        );

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

        // 3. 100% Clothing Catalog
        $catalog = [
            [
                'title' => 'Minimalist Japanese Wool Overshirt',
                'slug' => 'minimalist-japanese-wool-overshirt',
                'description' => 'Tailored from heavyweight 380gsm Japanese melton wool. Features horn buttons, French seams, and a relaxed boxy drape designed for versatile layering throughout the year.',
                'status' => 'active',
                'vendor' => 'Cartify Tailoring',
                'product_type' => 'Apparel',
                'tags' => ['wool', 'outerwear', 'minimalist', 'overshirt'],
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
                'title' => 'Heavyweight Organic Cotton T-Shirt',
                'slug' => 'heavyweight-organic-cotton-tee',
                'description' => 'Crafted from 100% GOTS-certified 260gsm ringspun organic cotton. Features double-needle bound collar, drop shoulders, and pre-shrunk combed weave for timeless everyday durability.',
                'status' => 'active',
                'vendor' => 'Cartify Basics',
                'product_type' => 'Apparel',
                'tags' => ['cotton', 'basics', 't-shirt', 'casual'],
                'media' => [
                    ['url' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', 'alt' => 'White Heavyweight Tee', 'is_primary' => true],
                    ['url' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80', 'alt' => 'Cotton fabric texture', 'is_primary' => false],
                ],
                'options' => [
                    ['name' => 'Size', 'values' => ['XS', 'S', 'M', 'L', 'XL', 'XXL']],
                    ['name' => 'Color', 'values' => ['Optic White', 'Washed Black', 'Sand Dune']],
                ],
                'base_price' => 48.00,
                'compare_at_price' => 60.00,
                'base_inventory' => 45,
            ],
            [
                'title' => 'Relaxed Linen Pleated Trousers',
                'slug' => 'relaxed-linen-pleated-trousers',
                'description' => 'Woven from airy French Normandy flax linen. Cut with a relaxed straight leg, double forward pleats, and an elasticated waistband with hidden drawstring for elevated comfort.',
                'status' => 'active',
                'vendor' => 'Cartify Tailoring',
                'product_type' => 'Apparel',
                'tags' => ['linen', 'trousers', 'summer', 'pleated'],
                'media' => [
                    ['url' => 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80', 'alt' => 'Linen Trousers on model', 'is_primary' => true],
                ],
                'options' => [
                    ['name' => 'Waist', 'values' => ['30', '32', '34', '36']],
                    ['name' => 'Color', 'values' => ['Natural Ecru', 'Navy Ink', 'Olive']],
                ],
                'base_price' => 140.00,
                'compare_at_price' => 175.00,
                'base_inventory' => 22,
            ],
            [
                'title' => 'Pure Mongolian Cashmere Crewneck',
                'slug' => 'pure-mongolian-cashmere-crewneck',
                'description' => 'Spun from Grade-A 2-ply 12-gauge Mongolian cashmere. Unbelievably soft handfeel with thermal regulation, ribbed cuffs, and seamless tubular knit construction.',
                'status' => 'active',
                'vendor' => 'Cartify Knitwear',
                'product_type' => 'Apparel',
                'tags' => ['knitwear', 'cashmere', 'sweater', 'winter'],
                'media' => [
                    ['url' => 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80', 'alt' => 'Cashmere Crewneck detail', 'is_primary' => true],
                ],
                'options' => [
                    ['name' => 'Size', 'values' => ['S', 'M', 'L', 'XL']],
                    ['name' => 'Color', 'values' => ['Heather Grey', 'Caramel Camel', 'Midnight']],
                ],
                'base_price' => 265.00,
                'compare_at_price' => 320.00,
                'base_inventory' => 18,
            ],
            [
                'title' => 'Structured Cotton Gabardine Trench',
                'slug' => 'structured-cotton-gabardine-trench',
                'description' => 'Double-breasted storm trench engineered in water-repellent dense cotton gabardine. Features horn buckles, storm flap, deep welt pockets, and vented back.',
                'status' => 'active',
                'vendor' => 'Cartify Tailoring',
                'product_type' => 'Apparel',
                'tags' => ['trench', 'outerwear', 'coat', 'waterproof'],
                'media' => [
                    ['url' => 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80', 'alt' => 'Trench Coat Model', 'is_primary' => true],
                ],
                'options' => [
                    ['name' => 'Size', 'values' => ['S', 'M', 'L']],
                    ['name' => 'Color', 'values' => ['Classic Honey', 'Night Charcoal']],
                ],
                'base_price' => 340.00,
                'compare_at_price' => 410.00,
                'base_inventory' => 12,
            ],
            [
                'title' => 'French Terry Loopback Hoodie',
                'slug' => 'french-terry-loopback-hoodie',
                'description' => 'Constructed from 480gsm ultra-dense unbrushed French terry cotton. Clean crossover hood with no drawstrings, hidden side seam pockets, and structured ribbed hems.',
                'status' => 'active',
                'vendor' => 'Cartify Basics',
                'product_type' => 'Apparel',
                'tags' => ['hoodie', 'sweatshirt', 'terry', 'casual'],
                'media' => [
                    ['url' => 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80', 'alt' => 'Loopback Hoodie', 'is_primary' => true],
                ],
                'options' => [
                    ['name' => 'Size', 'values' => ['S', 'M', 'L', 'XL']],
                    ['name' => 'Color', 'values' => ['Heather Ash', 'Washed Olive', 'Jet Black']],
                ],
                'base_price' => 110.00,
                'compare_at_price' => 135.00,
                'base_inventory' => 30,
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

        // 4. Shipping Methods
        \App\Models\ShippingMethod::firstOrCreate(
            ['code' => 'standard'],
            [
                'name' => 'Standard Ground Shipping',
                'description' => 'Reliable, cost-effective ground delivery directly to your door.',
                'cost' => 5.00,
                'free_threshold' => 75.00,
                'estimated_days' => '3-5 Business Days',
                'carrier' => 'FedEx Ground',
                'is_active' => true,
                'position' => 1,
            ]
        );

        \App\Models\ShippingMethod::firstOrCreate(
            ['code' => 'express'],
            [
                'name' => 'Express Air Courier',
                'description' => 'Fast 2-day domestic air shipping with full tracking and SMS updates.',
                'cost' => 15.00,
                'free_threshold' => 150.00,
                'estimated_days' => '2 Business Days',
                'carrier' => 'DHL Express',
                'is_active' => true,
                'position' => 2,
            ]
        );

        \App\Models\ShippingMethod::firstOrCreate(
            ['code' => 'overnight'],
            [
                'name' => 'Priority Overnight',
                'description' => 'Guaranteed next-morning delivery for urgent garment orders.',
                'cost' => 28.00,
                'free_threshold' => null,
                'estimated_days' => '1 Business Day (Next Morning)',
                'carrier' => 'UPS Next Day Air',
                'is_active' => true,
                'position' => 3,
            ]
        );

        \App\Models\ShippingMethod::firstOrCreate(
            ['code' => 'international'],
            [
                'name' => 'International Priority',
                'description' => 'Worldwide door-to-door delivery with customs pre-clearance.',
                'cost' => 38.00,
                'free_threshold' => 250.00,
                'estimated_days' => '5-7 Business Days',
                'carrier' => 'DHL Global',
                'is_active' => true,
                'position' => 4,
            ]
        );

        // 5. Payment Gateways
        \App\Models\PaymentGateway::firstOrCreate(
            ['code' => 'stripe'],
            [
                'name' => 'Stripe Card Payments',
                'description' => 'Accept Visa, Mastercard, AMEX, Discover, Apple Pay, and Google Pay with PCI-DSS Level 1 security.',
                'instructions' => 'Encrypted credit card tokenization via Stripe Elements.',
                'is_active' => true,
                'is_test_mode' => true,
                'transaction_fee_percent' => 2.90,
                'credentials' => [
                    'publishable_key' => 'pk_test_51MockStripeKeyCartifyLive001',
                    'secret_key' => 'sk_test_51MockStripeSecretCartifyLive001',
                    'webhook_secret' => 'whsec_MockWebhookCartifyLive001',
                ],
                'position' => 1,
            ]
        );

        \App\Models\PaymentGateway::firstOrCreate(
            ['code' => 'paypal'],
            [
                'name' => 'PayPal Express Checkout',
                'description' => 'Safe, direct payments using PayPal balance, linked cards, or Pay in 4 installments.',
                'instructions' => 'Customers are redirected to PayPal to authorize the transaction.',
                'is_active' => true,
                'is_test_mode' => true,
                'transaction_fee_percent' => 3.49,
                'credentials' => [
                    'client_id' => 'sb-client-id-cartify-demo',
                    'secret' => 'sb-secret-cartify-demo',
                ],
                'position' => 2,
            ]
        );

        \App\Models\PaymentGateway::firstOrCreate(
            ['code' => 'cod'],
            [
                'name' => 'Cash on Delivery (COD)',
                'description' => 'Pay in cash upon physical receipt and inspection of your garment order.',
                'instructions' => 'Please keep exact cash ready upon arrival of the delivery courier.',
                'is_active' => true,
                'is_test_mode' => false,
                'transaction_fee_percent' => 0.00,
                'credentials' => null,
                'position' => 3,
            ]
        );

        \App\Models\PaymentGateway::firstOrCreate(
            ['code' => 'bank_transfer'],
            [
                'name' => 'Direct Bank Wire Transfer',
                'description' => 'Direct B2B wire payment to Cartify corporate escrow account.',
                'instructions' => 'Please transfer to Account: 9876543210, Routing: 021000021, Bank: JPMorgan Chase. Use your Order ID as payment reference.',
                'is_active' => false,
                'is_test_mode' => false,
                'transaction_fee_percent' => 0.00,
                'credentials' => null,
                'position' => 4,
            ]
        );
    }
}
