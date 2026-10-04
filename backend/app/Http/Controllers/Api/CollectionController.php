<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ProductResource;
use App\Models\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CollectionController extends BaseApiController
{
    public function index(): JsonResponse
    {
        $collections = Collection::withCount('products')->latest()->get();
        return $this->success($collections);
    }

    public function show(string $slug): JsonResponse
    {
        $collection = Collection::where('slug', $slug)
            ->with(['products' => function ($q) {
                $q->active()->with(['primaryMedia', 'variants', 'options.values']);
            }])
            ->firstOrFail();

        return $this->success([
            'collection' => $collection,
            'products' => ProductResource::collection($collection->products),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:collections,slug',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'is_featured' => 'nullable|boolean',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $slug = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']);
        $collection = Collection::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
            'is_featured' => $validated['is_featured'] ?? false,
        ]);

        if (!empty($validated['product_ids'])) {
            $syncData = [];
            foreach ($validated['product_ids'] as $pos => $pid) {
                $syncData[$pid] = ['position' => $pos];
            }
            $collection->products()->sync($syncData);
        }

        return $this->success($collection->load('products'), 'Collection created successfully', [], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $collection = Collection::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|unique:collections,slug,' . $id,
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'is_featured' => 'nullable|boolean',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        if (!empty($validated['name']) && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $collection->update($validated);

        if (isset($validated['product_ids'])) {
            $syncData = [];
            foreach ($validated['product_ids'] as $pos => $pid) {
                $syncData[$pid] = ['position' => $pos];
            }
            $collection->products()->sync($syncData);
        }

        return $this->success($collection->load('products'), 'Collection updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $collection = Collection::findOrFail($id);
        $collection->products()->detach();
        $collection->delete();

        return $this->success(null, 'Collection deleted');
    }
}
