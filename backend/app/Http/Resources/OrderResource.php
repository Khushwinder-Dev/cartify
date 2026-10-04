<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'user_id' => $this->user_id,
            'email' => $this->email,
            'customer_name' => $this->customer_name,
            'phone' => $this->phone,
            'status' => $this->status,
            'financial_status' => $this->financial_status,
            'fulfillment_status' => $this->fulfillment_status,
            'currency' => $this->currency,
            'subtotal' => (float) $this->subtotal,
            'discount_total' => (float) $this->discount_total,
            'tax_total' => (float) $this->tax_total,
            'shipping_total' => (float) $this->shipping_total,
            'grand_total' => (float) $this->grand_total,
            'idempotency_key' => $this->idempotency_key,
            'payment_method' => $this->payment_method,
            'payment_intent_id' => $this->payment_intent_id,
            'carrier' => $this->carrier,
            'tracking_number' => $this->tracking_number,
            'shipped_at' => $this->shipped_at?->toISOString(),
            'shipping_address' => $this->shipping_address,
            'billing_address' => $this->billing_address,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
