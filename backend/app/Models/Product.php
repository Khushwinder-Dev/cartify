<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'status',
        'vendor',
        'product_type',
        'tags',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'published_at' => 'datetime',
        ];
    }

    public function options(): HasMany
    {
        return $this->hasMany(ProductOption::class)->orderBy('position');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(ProductMedia::class)->orderBy('position');
    }

    public function primaryMedia(): HasOne
    {
        return $this->hasOne(ProductMedia::class)->where('is_primary', true);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('vendor', 'like', "%{$search}%")
                        ->orWhere('product_type', 'like', "%{$search}%");
                });
            })
            ->when($filters['vendor'] ?? null, fn ($q, $vendor) => $q->where('vendor', $vendor))
            ->when($filters['product_type'] ?? null, fn ($q, $type) => $q->where('product_type', $type))
            ->when($filters['min_price'] ?? null, function ($q, $min) {
                $q->whereHas('variants', fn ($v) => $v->where('price', '>=', $min));
            })
            ->when($filters['max_price'] ?? null, function ($q, $max) {
                $q->whereHas('variants', fn ($v) => $v->where('price', '<=', $max));
            });
    }

    public function getMinPriceAttribute(): ?float
    {
        return (float) $this->variants->min('price');
    }

    public function getMaxPriceAttribute(): ?float
    {
        return (float) $this->variants->max('price');
    }

    public function getIsAvailableAttribute(): bool
    {
        return $this->variants->contains(fn ($variant) => $variant->isAvailable());
    }
}
