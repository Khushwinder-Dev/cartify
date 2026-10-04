<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\UserResource;
use App\Models\Cart;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends BaseApiController
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:30',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
            'phone' => $validated['phone'] ?? null,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        // Auto create cart for user
        Cart::firstOrCreate(['user_id' => $user->id], ['currency' => 'USD']);

        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Registration successful', [], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'guest_cart_token' => 'nullable|uuid',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials provided.'],
            ]);
        }

        // Revoke prior tokens for a single-session posture or create new
        $token = $user->createToken('auth-token')->plainTextToken;

        // Merge guest cart if token provided
        if (!empty($validated['guest_cart_token'])) {
            $guestCart = Cart::where('token', $validated['guest_cart_token'])->first();
            if ($guestCart) {
                $userCart = Cart::firstOrCreate(['user_id' => $user->id], ['currency' => 'USD']);
                $userCart->mergeGuestCart($guestCart);
            }
        }

        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Login successful');
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success(new UserResource($request->user()));
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'Logged out successfully');
    }
}
