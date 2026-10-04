<?php

namespace App\Http\Controllers\Api;

use App\Models\PaymentGateway;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentGatewayController extends BaseApiController
{
    /**
     * Get list of payment gateways.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PaymentGateway::query();

        if ($request->boolean('active_only')) {
            $query->where('is_active', true);
        }

        $gateways = $query->orderBy('position')->orderBy('id')->get();
        return $this->success($gateways);
    }

    /**
     * Store new payment gateway.
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
        return $this->success($gateway, 'Payment gateway configured successfully', [], 201);
    }

    /**
     * Get single gateway.
     */
    public function show(int $id): JsonResponse
    {
        $gateway = PaymentGateway::findOrFail($id);
        return $this->success($gateway);
    }

    /**
     * Update payment gateway.
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
        return $this->success($gateway, 'Payment gateway updated successfully');
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
