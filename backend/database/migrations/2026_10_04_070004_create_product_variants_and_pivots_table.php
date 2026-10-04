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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('title')->nullable(); // e.g. "Small / Red"
            $table->string('sku')->nullable()->unique();
            $table->string('barcode')->nullable()->index();
            $table->decimal('price', 10, 2);
            $table->decimal('compare_at_price', 10, 2)->nullable();
            $table->decimal('cost_price', 10, 2)->nullable();
            $table->integer('inventory_quantity')->default(0);
            $table->boolean('track_quantity')->default(true);
            $table->boolean('allow_backorders')->default(false);
            $table->decimal('weight', 8, 2)->nullable(); // in kg or g
            $table->timestamps();

            $table->index(['product_id', 'price']);
            $table->index(['product_id', 'inventory_quantity']);
        });

        Schema::create('variant_option_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained('product_variants')->cascadeOnDelete();
            $table->foreignId('product_option_value_id')->constrained('product_option_values')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['product_variant_id', 'product_option_value_id'], 'var_opt_val_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_option_values');
        Schema::dropIfExists('product_variants');
    }
};
