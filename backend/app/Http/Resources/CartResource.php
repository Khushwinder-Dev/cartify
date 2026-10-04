<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $subtotal = $this->calculateSubtotal();

        return [
            'id' => $this->id,
            'token' => $this->token,
            'user_id' => $this->user_id,
            'currency' => $this->currency,
            'items_count' => $this->items_count,
            'subtotal' => $subtotal,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
