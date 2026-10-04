<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiscountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'type' => $this->type,
            'value' => (float) $this->value,
            'min_subtotal' => $this->min_subtotal !== null ? (float) $this->min_subtotal : null,
            'is_active' => (bool) $this->is_active,
            'starts_at' => $this->starts_at?->toISOString(),
            'expires_at' => $this->expires_at?->toISOString(),
            'usage_limit' => $this->usage_limit,
            'times_used' => $this->times_used,
        ];
    }
}
