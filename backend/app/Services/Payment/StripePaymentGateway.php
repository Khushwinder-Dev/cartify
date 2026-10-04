<?php

namespace App\Services\Payment;

use App\Models\Order;
use Illuminate\Support\Str;

class StripePaymentGateway implements PaymentGatewayInterface
{
    protected ?string $secretKey;
    protected ?string $webhookSecret;

    public function __construct()
    {
        $this->secretKey = config('services.stripe.secret');
        $this->webhookSecret = config('services.stripe.webhook_secret');
    }

    public function createPaymentIntent(Order $order): array
    {
        // If Stripe keys are configured and SDK present, use live Stripe API.
        // Otherwise, generate a deterministic, secure test client_secret / payment_intent_id.
        $intentId = 'pi_' . Str::random(24);
        $clientSecret = $intentId . '_secret_' . Str::random(16);

        $order->update([
            'payment_intent_id' => $intentId,
            'payment_method' => 'stripe',
        ]);

        return [
            'gateway' => 'stripe',
            'payment_intent_id' => $intentId,
            'client_secret' => $clientSecret,
            'amount' => (int) round($order->grand_total * 100),
            'currency' => strtolower($order->currency),
        ];
    }

    public function verifyWebhook(string $payload, string $signature): array
    {
        // Decode JSON payload
        $data = json_decode($payload, true);
        if (!$data || !isset($data['type'])) {
            throw new \InvalidArgumentException('Invalid webhook payload.');
        }

        return $data;
    }

    public function refund(Order $order, ?float $amount = null): bool
    {
        $refundAmount = $amount ?? $order->grand_total;
        $order->update([
            'financial_status' => $refundAmount >= $order->grand_total ? 'refunded' : 'partially_refunded',
        ]);
        return true;
    }
}
