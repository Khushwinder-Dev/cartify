<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\DiscountResource;
use App\Models\Discount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DiscountController extends BaseApiController
{
    public function validateCode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'subtotal' => 'nullable|numeric|min:0',
        ]);

        $code = strtoupper(trim($validated['code']));
        $discount = Discount::where('code', $code)->first();

        if (!$discount || !$discount->isValid($validated['subtotal'] ?? null)) {
            return $this->error('Discount code is invalid, expired, or minimum purchase not met.', null, 422);
        }

        $calculated = $discount->calculateDiscount((float) ($validated['subtotal'] ?? 0));

        return $this->success([
            'discount' => new DiscountResource($discount),
            'discount_amount' => $calculated,
        ], 'Discount code applied');
    }

    public function index(): JsonResponse
    {
        $discounts = Discount::latest()->paginate(20);
        return $this->paginated($discounts, DiscountResource::class);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:discounts,code',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_subtotal' => 'nullable|numeric|min:0',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['code'] = strtoupper(trim($validated['code']));
        $discount = Discount::create($validated);

        return $this->success(new DiscountResource($discount), 'Discount created', [], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $discount = Discount::findOrFail($id);
        $discount->delete();
        return $this->success(null, 'Discount deleted');
    }
}
