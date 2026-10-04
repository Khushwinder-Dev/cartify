<?php

namespace App\Http\Controllers\Api;

use App\Models\CustomerAddress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends BaseApiController
{
    /**
     * Get all saved addresses for the authenticated customer.
     */
    public function index(Request $request): JsonResponse
    {
        $addresses = $request->user()
            ->addresses()
            ->orderByDesc('is_default')
            ->latest('id')
            ->get();

        return $this->success($addresses, 'Customer addresses retrieved');
    }

    /**
     * Create a new address for the authenticated customer.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'company' => 'nullable|string|max:150',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'phone' => 'nullable|string|max:30',
            'is_default' => 'nullable|boolean',
        ]);

        $user = $request->user();

        // If marked as default or if this is the user's first address, ensure it becomes default
        $existingCount = $user->addresses()->count();
        $isDefault = ($validated['is_default'] ?? false) || $existingCount === 0;

        if ($isDefault) {
            $user->addresses()->update(['is_default' => false]);
        }

        $address = $user->addresses()->create([
            ...$validated,
            'is_default' => $isDefault,
        ]);

        return $this->success($address, 'Address saved successfully', 201);
    }

    /**
     * Update an existing address.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $address = $request->user()->addresses()->findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'company' => 'nullable|string|max:150',
            'address_line1' => 'sometimes|required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'sometimes|required|string|max:100',
            'state' => 'sometimes|required|string|max:100',
            'postal_code' => 'sometimes|required|string|max:20',
            'country' => 'sometimes|required|string|max:100',
            'phone' => 'nullable|string|max:30',
            'is_default' => 'nullable|boolean',
        ]);

        if (!empty($validated['is_default'])) {
            $request->user()->addresses()->where('id', '!=', $id)->update(['is_default' => false]);
        }

        $address->update($validated);

        return $this->success($address->fresh(), 'Address updated successfully');
    }

    /**
     * Set address as default.
     */
    public function setDefault(Request $request, int $id): JsonResponse
    {
        $address = $request->user()->addresses()->findOrFail($id);

        $request->user()->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return $this->success($address->fresh(), 'Default address updated');
    }

    /**
     * Delete an address.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $address = $request->user()->addresses()->findOrFail($id);
        $wasDefault = $address->is_default;
        $address->delete();

        // If the deleted address was default, promote the next available address
        if ($wasDefault) {
            $next = $request->user()->addresses()->latest('id')->first();
            if ($next) {
                $next->update(['is_default' => true]);
            }
        }

        return $this->success(null, 'Address deleted successfully');
    }
}
