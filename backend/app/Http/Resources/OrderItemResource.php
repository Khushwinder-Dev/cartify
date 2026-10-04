<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'product_id' => $this->product_id,
            'product_variant_id' => $this->product_variant_id,
            'product_title' => $this->product_title,
            'variant_title' => $this->variant_title,
            'sku' => $this->sku,
            'price' => (float) $this->price,
            'quantity' => (int) $this->quantity,
            'total' => (float) $this->total,
            'options_snapshot' => $this->options_snapshot,
        ];
    }
}
