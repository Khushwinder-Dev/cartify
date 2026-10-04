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

    protected $casts = [
        'is_active' => 'boolean',
        'is_test_mode' => 'boolean',
        'transaction_fee_percent' => 'decimal:2',
        'credentials' => 'array',
        'position' => 'integer',
    ];
}
