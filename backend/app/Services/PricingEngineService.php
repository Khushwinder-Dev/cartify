<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Discount;

class PricingEngineService
{
    /**
     * Calculate comprehensive price breakdown for a cart or line items.
     *
     * @param Cart $cart
     * @param string|null $discountCode
     * @param array $shippingAddress
     * @return array
     */
    public function calculate(Cart $cart, ?string $discountCode = null, array $shippingAddress = []): array
    {
        $cart->loadMissing('items.variant.product');

        $subtotal = 0.00;
        foreach ($cart->items as $item) {
            $unitPrice = $item->variant ? (float) $item->variant->price : (float) $item->price;
            $subtotal += $unitPrice * $item->quantity;
        }
        $subtotal = round($subtotal, 2);

        // 1. Discount calculation
        $discountAmount = 0.00;
        $appliedDiscount = null;
        if (!empty($discountCode)) {
            $discount = Discount::where('code', strtoupper(trim($discountCode)))->first();
            if ($discount && $discount->isValid($subtotal)) {
                $discountAmount = $discount->calculateDiscount($subtotal);
                $appliedDiscount = $discount;
            }
        }

        $taxableAmount = max(0.00, $subtotal - $discountAmount);

        // 2. Dynamic / Tiered tax rates based on country or state
        $taxRate = 0.08; // 8% standard tax default
        $country = strtoupper($shippingAddress['country'] ?? 'US');
        if (in_array($country, ['GB', 'DE', 'FR'])) {
            $taxRate = 0.20; // 20% VAT
        } elseif ($country === 'CA') {
            $taxRate = 0.13; // 13% HST
        }
        $taxTotal = round($taxableAmount * $taxRate, 2);

        // 3. Database-driven Shipping Rate Engine
        $shippingRateType = $shippingAddress['shipping_rate'] ?? 'standard';
        $shippingMethod = \App\Models\ShippingMethod::where('code', $shippingRateType)
            ->where('is_active', true)
            ->first();

        if (!$shippingMethod) {
            $shippingMethod = \App\Models\ShippingMethod::where('is_active', true)
                ->orderBy('position')
                ->first();
        }

        if ($shippingMethod) {
            if ($shippingMethod->free_threshold !== null && $subtotal >= (float) $shippingMethod->free_threshold) {
                $shippingTotal = 0.00;
            } else {
                $shippingTotal = (float) $shippingMethod->cost;
            }
        } else {
            $shippingTotal = $shippingRateType === 'express' ? 25.00 : 10.00;
        }

        // 4. Grand total
        $grandTotal = round($taxableAmount + $taxTotal + $shippingTotal, 2);

        return [
            'subtotal' => $subtotal,
            'discount_total' => $discountAmount,
            'discount_code' => $appliedDiscount?->code,
            'tax_rate' => $taxRate,
            'tax_total' => $taxTotal,
            'shipping_total' => $shippingTotal,
            'grand_total' => $grandTotal,
            'currency' => $cart->currency ?: 'USD',
        ];
    }
}
