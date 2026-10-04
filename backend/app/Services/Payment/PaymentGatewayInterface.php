<?php

namespace App\Services\Payment;

use App\Models\Order;

interface PaymentGatewayInterface
{
    /**
     * Create or initialize a payment intent / charge.
     */
    public function createPaymentIntent(Order $order): array;

    /**
     * Verify payment status or webhook signature.
     */
    public function verifyWebhook(string $payload, string $signature): array;

    /**
     * Refund payment.
     */
    public function refund(Order $order, ?float $amount = null): bool;
}
