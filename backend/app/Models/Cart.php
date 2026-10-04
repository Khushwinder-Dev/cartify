<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'token',
        'user_id',
        'currency',
    ];

    protected static function booted(): void
    {
        static::creating(function (Cart $cart) {
            if (empty($cart->token)) {
                $cart->token = (string) Str::uuid();
            }
        });
    }

    public static function createWithToken(?int $userId = null, string $currency = 'USD'): self
    {
        return self::create([
            'token' => (string) Str::uuid(),
            'user_id' => $userId,
            'currency' => $currency,
        ]);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function calculateSubtotal(): float
    {
        return (float) $this->items->sum(fn ($item) => (float) $item->price * $item->quantity);
    }

    public function getItemsCountAttribute(): int
    {
        return (int) $this->items->sum('quantity');
    }

    /**
     * Merge items from a guest cart into this cart (e.g. on user login).
     */
    public function mergeGuestCart(Cart $guestCart): void
    {
        if ($this->id === $guestCart->id) {
            return;
        }

        foreach ($guestCart->items as $guestItem) {
            $existing = $this->items()->where('product_variant_id', $guestItem->product_variant_id)->first();
            if ($existing) {
                $existing->quantity += $guestItem->quantity;
                $existing->save();
            } else {
                $this->items()->create([
                    'product_variant_id' => $guestItem->product_variant_id,
                    'quantity' => $guestItem->quantity,
                    'price' => $guestItem->price,
                ]);
            }
        }

        $guestCart->delete();
    }
}
