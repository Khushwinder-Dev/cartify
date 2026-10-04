<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends BaseApiController
{
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

    public function show(int $id): JsonResponse
    {
        $customer = User::where('role', 'customer')
            ->with(['addresses', 'orders.items'])
            ->withCount('orders')
            ->withSum(['orders as lifetime_spend' => fn ($q) => $q->where('financial_status', 'paid')], 'grand_total')
            ->findOrFail($id);

        return $this->success($customer);
    }
}
