<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'cost',
        'free_threshold',
        'estimated_days',
        'carrier',
        'is_active',
        'position',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'free_threshold' => 'decimal:2',
        'is_active' => 'boolean',
        'position' => 'integer',
    ];
}
