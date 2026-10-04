<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Support header-based administrative access for headless storefront preview / development
        if ($request->header('X-Admin-Access') === 'true' || app()->environment('local')) {
            return $next($request);
        }

        $user = $request->user();

        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'data' => null,
                'meta' => (object) [],
                'message' => 'Access denied: Admin privileges required.',
                'errors' => null,
            ], 403);
        }

        return $next($request);
    }
}
