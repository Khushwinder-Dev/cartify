<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'title' => $this->title,
            'sku' => $this->sku,
            'barcode' => $this->barcode,
            'price' => (float) $this->price,
            'compare_at_price' => $this->compare_at_price !== null ? (float) $this->compare_at_price : null,
            'cost_price' => $this->cost_price !== null ? (float) $this->cost_price : null,
            'inventory_quantity' => (int) $this->inventory_quantity,
            'track_quantity' => (bool) $this->track_quantity,
            'allow_backorders' => (bool) $this->allow_backorders,
            'is_available' => $this->isAvailable(),
            'weight' => $this->weight !== null ? (float) $this->weight : null,
            'option_values' => ProductOptionValueResource::collection($this->whenLoaded('optionValues')),
            'media' => ProductMediaResource::collection($this->whenLoaded('media')),
        ];
    }
}
