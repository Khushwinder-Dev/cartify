<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_subtotal',
        'starts_at',
        'expires_at',
        'usage_limit',
        'times_used',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
            'min_subtotal' => 'decimal:2',
            'starts_at' => 'datetime',
            'expires_at' => 'datetime',
            'usage_limit' => 'integer',
            'times_used' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function isValid(?float $subtotal = null): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = Carbon::now();

        if ($this->starts_at && $now->lt($this->starts_at)) {
            return false;
        }

        if ($this->expires_at && $now->gt($this->expires_at)) {
            return false;
        }

        if ($this->usage_limit !== null && $this->times_used >= $this->usage_limit) {
            return false;
        }

        if ($subtotal !== null && $this->min_subtotal !== null && $subtotal < $this->min_subtotal) {
            return false;
        }

        return true;
    }

    public function calculateDiscount(float $subtotal): float
    {
        if (!$this->isValid($subtotal)) {
            return 0.00;
        }

        if ($this->type === 'percentage') {
            $discount = round(($subtotal * (float) $this->value) / 100, 2);
            return min($discount, $subtotal);
        }

        return min((float) $this->value, $subtotal);
    }
}
