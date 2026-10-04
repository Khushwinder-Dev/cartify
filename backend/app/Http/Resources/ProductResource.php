<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'status' => $this->status,
            'vendor' => $this->vendor,
            'product_type' => $this->product_type,
            'tags' => $this->tags ?? [],
            'published_at' => $this->published_at?->toISOString(),
            'min_price' => $this->min_price,
            'max_price' => $this->max_price,
            'is_available' => $this->is_available,
            'primary_media' => new ProductMediaResource($this->whenLoaded('primaryMedia', fn () => $this->primaryMedia, fn () => $this->media->firstWhere('is_primary', true) ?? $this->media->first())),
            'media' => ProductMediaResource::collection($this->whenLoaded('media')),
            'options' => ProductOptionResource::collection($this->whenLoaded('options')),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
