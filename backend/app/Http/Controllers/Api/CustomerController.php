<?php

namespace App\Http\Controllers\Api;

use App\Models\CustomerAddress;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CustomerController extends BaseApiController
{
    /**
     * Admin: List customers with CRM stats and search.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'customer')
            ->withCount('orders')
            ->withSum(['orders as lifetime_spend' => fn ($q) => $q->where('financial_status', 'paid')], 'grand_total')
            ->with('defaultAddress');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->latest('id')->paginate(20);
        return $this->paginated($customers);
    }

    /**
     * Admin: Get single customer with detailed addresses and order history.
     */
    public function show(int $id): JsonResponse
    {
        $customer = User::where('role', 'customer')
            ->with(['addresses', 'orders.items'])
            ->withCount('orders')
            ->withSum(['orders as lifetime_spend' => fn ($q) => $q->where('financial_status', 'paid')], 'grand_total')
            ->findOrFail($id);

        return $this->success($customer);
    }

    /**
     * Admin: Create a new customer profile.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:50',
            'password' => 'nullable|string|min:6',
            'address' => 'nullable|array',
            'address.first_name' => 'nullable|string|max:100',
            'address.last_name' => 'nullable|string|max:100',
            'address.address_line1' => 'nullable|string|max:255',
            'address.city' => 'nullable|string|max:100',
            'address.state' => 'nullable|string|max:100',
            'address.postal_code' => 'nullable|string|max:20',
            'address.country' => 'nullable|string|max:100',
        ]);

        $password = !empty($validated['password']) ? $validated['password'] : 'password123';

        $customer = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($password),
            'role' => 'customer',
        ]);

        if (!empty($validated['address']) && !empty($validated['address']['address_line1'])) {
            $names = explode(' ', $customer->name, 2);
            CustomerAddress::create([
                'user_id' => $customer->id,
                'first_name' => $validated['address']['first_name'] ?? ($names[0] ?? $customer->name),
                'last_name' => $validated['address']['last_name'] ?? ($names[1] ?? ''),
                'address_line1' => $validated['address']['address_line1'],
                'city' => $validated['address']['city'] ?? '',
                'state' => $validated['address']['state'] ?? '',
                'postal_code' => $validated['address']['postal_code'] ?? '',
                'country' => $validated['address']['country'] ?? 'US',
                'phone' => $customer->phone,
                'is_default' => true,
            ]);
        }

        $customer->load(['defaultAddress', 'addresses']);
        return $this->success($customer, 'Customer created successfully', [], 201);
    }

    /**
     * Admin: Update customer profile.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $customer = User::where('role', 'customer')->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:50',
            'password' => 'nullable|string|min:6',
            'address' => 'nullable|array',
            'address.address_line1' => 'nullable|string|max:255',
            'address.city' => 'nullable|string|max:100',
            'address.state' => 'nullable|string|max:100',
            'address.postal_code' => 'nullable|string|max:20',
            'address.country' => 'nullable|string|max:100',
        ]);

        $updateData = [
            'name' => $validated['name'] ?? $customer->name,
            'email' => $validated['email'] ?? $customer->email,
            'phone' => array_key_exists('phone', $validated) ? $validated['phone'] : $customer->phone,
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $customer->update($updateData);

        // Update default address if provided
        if (!empty($validated['address']) && !empty($validated['address']['address_line1'])) {
            $names = explode(' ', $customer->name, 2);
            $addr = $customer->defaultAddress()->first();
            if ($addr) {
                $addr->update([
                    'first_name' => $validated['address']['first_name'] ?? $addr->first_name,
                    'last_name' => $validated['address']['last_name'] ?? $addr->last_name,
                    'address_line1' => $validated['address']['address_line1'],
                    'city' => $validated['address']['city'] ?? $addr->city,
                    'state' => $validated['address']['state'] ?? $addr->state,
                    'postal_code' => $validated['address']['postal_code'] ?? $addr->postal_code,
                    'country' => $validated['address']['country'] ?? $addr->country,
                ]);
            } else {
                CustomerAddress::create([
                    'user_id' => $customer->id,
                    'first_name' => $names[0] ?? $customer->name,
                    'last_name' => $names[1] ?? '',
                    'address_line1' => $validated['address']['address_line1'],
                    'city' => $validated['address']['city'] ?? '',
                    'state' => $validated['address']['state'] ?? '',
                    'postal_code' => $validated['address']['postal_code'] ?? '',
                    'country' => $validated['address']['country'] ?? 'US',
                    'phone' => $customer->phone,
                    'is_default' => true,
                ]);
            }
        }

        $customer->load(['defaultAddress', 'addresses']);
        return $this->success($customer, 'Customer updated successfully');
    }

    /**
     * Admin: Delete customer profile.
     */
    public function destroy(int $id): JsonResponse
    {
        $customer = User::where('role', 'customer')->findOrFail($id);

        // Delete associated addresses
        $customer->addresses()->delete();
        $customer->delete();

        return $this->success(null, 'Customer deleted successfully');
    }
}
