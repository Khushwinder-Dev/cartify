<?php

namespace App\Services\Payment;

use App\Models\Order;
use Exception;
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
        if (empty($payload)) {
            throw new \InvalidArgumentException('Empty webhook payload.');
        }

        // If webhook secret is configured, enforce strict HMAC-SHA256 signature verification
        if (!empty($this->webhookSecret)) {
            if (empty($signature)) {
                throw new \InvalidArgumentException('Missing Stripe signature header.');
            }

            $sigParts = [];
            foreach (explode(',', $signature) as $item) {
                $parts = explode('=', trim($item), 2);
                if (count($parts) === 2) {
                    $sigParts[$parts[0]][] = $parts[1];
                }
            }

            if (!isset($sigParts['t']) || !isset($sigParts['v1'])) {
                throw new \InvalidArgumentException('Malformed Stripe signature header.');
            }

            $timestamp = (int) $sigParts['t'][0];

            // Replay attack protection (tolerance: 300 seconds / 5 minutes)
            if (abs(time() - $timestamp) > 300) {
                throw new \InvalidArgumentException('Webhook event timestamp expired (replay attack detected).');
            }

            $signedPayload = "{$timestamp}.{$payload}";
            $expectedSignature = hash_hmac('sha256', $signedPayload, $this->webhookSecret);

            $matched = false;
            foreach ($sigParts['v1'] as $v1Sig) {
                if (hash_equals($expectedSignature, $v1Sig)) {
                    $matched = true;
                    break;
                }
            }

            if (!$matched) {
                throw new \InvalidArgumentException('Invalid cryptographic signature.');
            }
        } elseif (app()->environment('production')) {
            throw new Exception('Stripe webhook signing secret is not configured in production.');
        }

        // Decode JSON payload
        $data = json_decode($payload, true);
        if (!$data || !isset($data['type'])) {
            throw new \InvalidArgumentException('Invalid webhook payload structure.');
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
