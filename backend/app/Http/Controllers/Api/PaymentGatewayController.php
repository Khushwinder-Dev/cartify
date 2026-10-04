<?php

namespace App\Http\Controllers\Api;

use App\Models\PaymentGateway;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentGatewayController extends BaseApiController
{
    /**
     * Get list of payment gateways (Public storefront safe version).
     */
    public function index(Request $request): JsonResponse
    {
        $query = PaymentGateway::query();

        if ($request->boolean('active_only') || !$request->user()?->isAdmin()) {
            $query->where('is_active', true);
        }

        $gateways = $query->orderBy('position')->orderBy('id')->get();

        // For non-admin, only expose safe public credentials (e.g. publishable key, client ID)
        $isAdmin = $request->user()?->isAdmin();
        $data = $gateways->map(function ($gateway) use ($isAdmin) {
            $item = [
                'id' => $gateway->id,
                'name' => $gateway->name,
                'code' => $gateway->code,
                'description' => $gateway->description,
                'instructions' => $gateway->instructions,
                'is_active' => $gateway->is_active,
                'is_test_mode' => $gateway->is_test_mode,
                'transaction_fee_percent' => $gateway->transaction_fee_percent,
                'position' => $gateway->position,
                'public_credentials' => $gateway->public_credentials,
            ];

            if ($isAdmin) {
                $item['credentials'] = $gateway->credentials;
            }

            return $item;
        });

        return $this->success($data);
    }

    /**
     * Store new payment gateway (Admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:100|unique:payment_gateways,code',
            'description' => 'nullable|string|max:500',
            'instructions' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'is_test_mode' => 'nullable|boolean',
            'transaction_fee_percent' => 'nullable|numeric|min:0|max:100',
            'credentials' => 'nullable|array',
            'position' => 'nullable|integer',
        ]);

        if (empty($validated['code'])) {
            $validated['code'] = Str::slug($validated['name']);
            $count = 1;
            while (PaymentGateway::where('code', $validated['code'])->exists()) {
                $validated['code'] = Str::slug($validated['name']) . '-' . $count++;
            }
        }

        $gateway = PaymentGateway::create($validated);
        return $this->success($gateway->makeVisible('credentials'), 'Payment gateway configured successfully', [], 201);
    }

    /**
     * Get single gateway (Admin only).
     */
    public function show(int $id): JsonResponse
    {
        $gateway = PaymentGateway::findOrFail($id);
        return $this->success($gateway->makeVisible('credentials'));
    }

    /**
     * Update payment gateway (Admin only).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $gateway = PaymentGateway::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:100|unique:payment_gateways,code,' . $id,
            'description' => 'nullable|string|max:500',
            'instructions' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'is_test_mode' => 'nullable|boolean',
            'transaction_fee_percent' => 'nullable|numeric|min:0|max:100',
            'credentials' => 'nullable|array',
            'position' => 'nullable|integer',
        ]);

        // Merge credentials if provided
        if (isset($validated['credentials']) && is_array($validated['credentials'])) {
            $existing = $gateway->credentials ?? [];
            $validated['credentials'] = array_merge($existing, $validated['credentials']);
        }

        $gateway->update($validated);
        return $this->success($gateway->makeVisible('credentials'), 'Payment gateway updated successfully');
    }

    /**
     * Quick toggle active status.
     */
    public function toggle(int $id): JsonResponse
    {
        $gateway = PaymentGateway::findOrFail($id);
        $gateway->update(['is_active' => !$gateway->is_active]);

        return $this->success($gateway, 'Payment gateway status updated');
    }

    /**
     * Delete payment gateway.
     */
    public function destroy(int $id): JsonResponse
    {
        $gateway = PaymentGateway::findOrFail($id);
        $gateway->delete();

        return $this->success(null, 'Payment gateway removed successfully');
    }
}
