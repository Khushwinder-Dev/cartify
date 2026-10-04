<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'title',
        'sku',
        'barcode',
        'price',
        'compare_at_price',
        'cost_price',
        'inventory_quantity',
        'track_quantity',
        'allow_backorders',
        'weight',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'compare_at_price' => 'decimal:2',
            'cost_price' => 'decimal:2',
            'inventory_quantity' => 'integer',
            'track_quantity' => 'boolean',
            'allow_backorders' => 'boolean',
            'weight' => 'decimal:2',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function optionValues(): BelongsToMany
    {
        return $this->belongsToMany(
            ProductOptionValue::class,
            'variant_option_values',
            'product_variant_id',
            'product_option_value_id'
        )->withTimestamps();
    }

    public function media(): HasMany
    {
        return $this->hasMany(ProductMedia::class, 'product_variant_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class, 'product_variant_id');
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class, 'product_variant_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'product_variant_id');
    }

    public function isAvailable(): bool
    {
        if (!$this->track_quantity) {
            return true;
        }

        return $this->allow_backorders || $this->inventory_quantity > 0;
    }

    public function hasSufficientStock(int $quantity): bool
    {
        if (!$this->track_quantity || $this->allow_backorders) {
            return true;
        }

        return $this->inventory_quantity >= $quantity;
    }
}
