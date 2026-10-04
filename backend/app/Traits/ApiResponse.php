<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

trait ApiResponse
{
    /**
     * Standard success envelope: { data, meta, message, errors }
     */
    protected function success(
        mixed $data = null,
        string $message = 'Success',
        array $meta = [],
        int $status = 200
    ): JsonResponse {
        return response()->json([
            'data' => $data,
            'meta' => (object) $meta,
            'message' => $message,
            'errors' => null,
        ], $status);
    }

    /**
     * Standard error envelope: { data, meta, message, errors }
     */
    protected function error(
        string $message = 'An error occurred',
        mixed $errors = null,
        int $status = 400,
        array $meta = []
    ): JsonResponse {
        return response()->json([
            'data' => null,
            'meta' => (object) $meta,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    /**
     * Standard paginated response envelope
     */
    protected function paginated(
        mixed $paginator,
        mixed $resourceClass = null,
        string $message = 'Success'
    ): JsonResponse {
        $items = $paginator->items();
        if ($resourceClass) {
            $items = $resourceClass::collection($items);
        }

        return response()->json([
            'data' => $items,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'has_more' => $paginator->hasMorePages(),
            ],
            'message' => $message,
            'errors' => null,
        ], 200);
    }
}
