<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'instructions',
        'is_active',
        'is_test_mode',
        'transaction_fee_percent',
        'credentials',
        'position',
    ];

    /**
     * Always hide sensitive credentials from default serialization.
     */
    protected $hidden = [
        'credentials',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_test_mode' => 'boolean',
        'transaction_fee_percent' => 'decimal:2',
        'credentials' => 'array',
        'position' => 'integer',
    ];

    /**
     * Expose only safe public credentials (e.g. publishable key, client ID).
     */
    public function getPublicCredentialsAttribute(): ?array
    {
        $creds = $this->credentials;
        if (!is_array($creds)) {
            return null;
        }

        return match ($this->code) {
            'stripe' => array_filter([
                'publishable_key' => $creds['publishable_key'] ?? null,
            ]),
            'paypal' => array_filter([
                'client_id' => $creds['client_id'] ?? null,
            ]),
            default => null,
        };
    }
}
