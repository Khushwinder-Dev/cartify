<?php

namespace App\Http\Controllers\Api;

use App\Models\ShippingMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ShippingController extends BaseApiController
{
    /**
     * Public or Admin: Get list of shipping methods.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ShippingMethod::query();

        // If 'active_only' query parameter is passed (for checkout)
        if ($request->boolean('active_only')) {
            $query->where('is_active', true);
        }

        $methods = $query->orderBy('position')->orderBy('id')->get();
        return $this->success($methods);
    }

    /**
     * Admin: Store a new shipping method.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:100|unique:shipping_methods,code',
            'description' => 'nullable|string|max:500',
            'cost' => 'required|numeric|min:0',
            'free_threshold' => 'nullable|numeric|min:0',
            'estimated_days' => 'nullable|string|max:100',
            'carrier' => 'nullable|string|max:100',
            'is_active' => 'nullable|boolean',
            'position' => 'nullable|integer',
        ]);

        if (empty($validated['code'])) {
            $validated['code'] = Str::slug($validated['name']);
            $count = 1;
            while (ShippingMethod::where('code', $validated['code'])->exists()) {
                $validated['code'] = Str::slug($validated['name']) . '-' . $count++;
            }
        }

        $method = ShippingMethod::create($validated);
        return $this->success($method, 'Shipping method created successfully', [], 201);
    }

    /**
     * Admin: Get a single shipping method.
     */
    public function show(int $id): JsonResponse
    {
        $method = ShippingMethod::findOrFail($id);
        return $this->success($method);
    }

    /**
     * Admin: Update shipping method.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $method = ShippingMethod::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:100|unique:shipping_methods,code,' . $id,
            'description' => 'nullable|string|max:500',
            'cost' => 'sometimes|required|numeric|min:0',
            'free_threshold' => 'nullable|numeric|min:0',
            'estimated_days' => 'nullable|string|max:100',
            'carrier' => 'nullable|string|max:100',
            'is_active' => 'nullable|boolean',
            'position' => 'nullable|integer',
        ]);

        $method->update($validated);
        return $this->success($method, 'Shipping method updated successfully');
    }

    /**
     * Admin: Quick toggle status.
     */
    public function toggle(int $id): JsonResponse
    {
        $method = ShippingMethod::findOrFail($id);
        $method->update(['is_active' => !$method->is_active]);

        return $this->success($method, 'Shipping method status toggled');
    }

    /**
     * Admin: Delete shipping method.
     */
    public function destroy(int $id): JsonResponse
    {
        $method = ShippingMethod::findOrFail($id);
        $method->delete();

        return $this->success(null, 'Shipping method deleted successfully');
    }
}
