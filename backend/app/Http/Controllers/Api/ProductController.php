<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductVariantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends BaseApiController
{
    public function __construct(
        protected ProductVariantService $variantService
    ) {}

    /**
     * Public catalog listing with rich filters, sorting, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->with(['primaryMedia', 'media', 'variants', 'options.values']);

        // Non-admins only see active products
        if (!$request->user() || !$request->user()->isAdmin()) {
            $query->active();
        }

        // Apply filters
        $filters = $request->only(['search', 'vendor', 'product_type', 'min_price', 'max_price']);
        $query->filter($filters);

        // Sorting
        $sort = $request->input('sort', 'latest');
        match ($sort) {
            'price_asc' => $query->orderBy(
                \App\Models\ProductVariant::select('price')
                    ->whereColumn('product_variants.product_id', 'products.id')
                    ->orderBy('price')
                    ->limit(1)
            ),
            'price_desc' => $query->orderByDesc(
                \App\Models\ProductVariant::select('price')
                    ->whereColumn('product_variants.product_id', 'products.id')
                    ->orderByDesc('price')
                    ->limit(1)
            ),
            'title_asc' => $query->orderBy('title', 'asc'),
            default => $query->latest('id'),
        };

        $perPage = min((int) $request->input('per_page', 12), 50);
        $products = $query->paginate($perPage);

        return $this->paginated($products, ProductResource::class);
    }

    /**
     * Get single product detail by slug with full variant tree.
     */
    public function show(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)
            ->with([
                'options.values',
                'variants.optionValues',
                'variants.media',
                'media',
                'primaryMedia',
            ])
            ->firstOrFail();

        return $this->success(new ProductResource($product));
    }

    /**
     * Admin: Create product with dynamic options and auto-generate Cartesian variants matrix.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug',
            'description' => 'nullable|string',
            'status' => 'required|in:draft,active,archived',
            'vendor' => 'nullable|string|max:255',
            'product_type' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'options' => 'nullable|array', // e.g. [['name' => 'Size', 'values' => ['S', 'M', 'L']]]
            'options.*.name' => 'required_with:options|string',
            'options.*.values' => 'required_with:options|array',
            'base_price' => 'nullable|numeric|min:0',
            'base_inventory' => 'nullable|integer|min:0',
            'media' => 'nullable|array',
            'media.*.url' => 'required_with:media|url',
            'media.*.alt_text' => 'nullable|string',
            'media.*.is_primary' => 'nullable|boolean',
        ]);

        $slug = !empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : Str::slug($validated['title']);

        $originalSlug = $slug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $product = Product::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'vendor' => $validated['vendor'] ?? null,
            'product_type' => $validated['product_type'] ?? null,
            'tags' => $validated['tags'] ?? [],
            'published_at' => $validated['status'] === 'active' ? now() : null,
        ]);

        // Add media
        if (!empty($validated['media'])) {
            foreach ($validated['media'] as $pos => $mediaItem) {
                $product->media()->create([
                    'url' => $mediaItem['url'],
                    'alt_text' => $mediaItem['alt_text'] ?? null,
                    'position' => $pos,
                    'is_primary' => $mediaItem['is_primary'] ?? ($pos === 0),
                ]);
            }
        }

        // Generate dynamic options and Cartesian variants
        $options = $validated['options'] ?? [];
        $defaultVariantValues = [
            'price' => $validated['base_price'] ?? 0.00,
            'inventory_quantity' => $validated['base_inventory'] ?? 0,
        ];

        $product = $this->variantService->generateVariantsFromOptions($product, $options, $defaultVariantValues);

        return $this->success(new ProductResource($product), 'Product created successfully', [], 201);
    }

    /**
     * Admin: Update product info and options.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:draft,active,archived',
            'vendor' => 'nullable|string|max:255',
            'product_type' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'options' => 'nullable|array',
        ]);

        $product->update($validated);

        if (isset($validated['options'])) {
            $product = $this->variantService->generateVariantsFromOptions($product, $validated['options']);
        }

        return $this->success(new ProductResource($product->load(['options.values', 'variants.optionValues', 'media'])), 'Product updated');
    }

    /**
     * Admin: Bulk update variants matrix (prices, inventory, SKUs).
     */
    public function bulkUpdateVariants(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'variants' => 'required|array',
            'variants.*.id' => 'required|exists:product_variants,id',
            'variants.*.price' => 'nullable|numeric|min:0',
            'variants.*.compare_at_price' => 'nullable|numeric|min:0',
            'variants.*.inventory_quantity' => 'nullable|integer|min:0',
            'variants.*.sku' => 'nullable|string',
            'variants.*.allow_backorders' => 'nullable|boolean',
        ]);

        $this->variantService->bulkUpdateVariants($product, $validated['variants']);

        return $this->success(
            new ProductResource($product->load(['options.values', 'variants.optionValues', 'media'])),
            'Variants updated successfully'
        );
    }

    /**
     * Admin: Delete product.
     */
    public function destroy(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return $this->success(null, 'Product deleted successfully');
    }
}
