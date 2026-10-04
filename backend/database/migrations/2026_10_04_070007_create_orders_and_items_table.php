<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('email')->index();
            $table->string('customer_name')->nullable();
            $table->string('phone')->nullable();
            $table->enum('status', ['open', 'closed', 'cancelled'])->default('open')->index();
            $table->enum('financial_status', ['pending', 'authorized', 'paid', 'refunded', 'partially_refunded'])->default('pending')->index();
            $table->enum('fulfillment_status', ['unfulfilled', 'partially_fulfilled', 'fulfilled', 'cancelled'])->default('unfulfilled')->index();
            $table->string('currency', 3)->default('USD');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount_total', 10, 2)->default(0.00);
            $table->decimal('tax_total', 10, 2)->default(0.00);
            $table->decimal('shipping_total', 10, 2)->default(0.00);
            $table->decimal('grand_total', 10, 2);
            $table->string('idempotency_key')->nullable()->unique();
            $table->string('payment_method')->nullable();
            $table->string('payment_intent_id')->nullable()->index();
            $table->json('shipping_address')->nullable();
            $table->json('billing_address')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['created_at', 'status']);
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->string('product_title');
            $table->string('variant_title')->nullable();
            $table->string('sku')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('quantity');
            $table->decimal('total', 10, 2);
            $table->json('options_snapshot')->nullable();
            $table->timestamps();

            $table->index(['order_id', 'product_variant_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
