<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductVariantService
{
    /**
     * Generate or update dynamic options and the Cartesian variant matrix for a product.
     *
     * @param Product $product
     * @param array $optionsData Array of ['name' => 'Size', 'values' => ['S', 'M', 'L']]
     * @param array $defaultVariantValues ['price' => 50, 'inventory_quantity' => 10, ...]
     * @return Product
     */
    public function generateVariantsFromOptions(
        Product $product,
        array $optionsData,
        array $defaultVariantValues = []
    ): Product {
        return DB::transaction(function () use ($product, $optionsData, $defaultVariantValues) {
            $createdOptions = [];
            $allValuesList = [];

            // 1. Synchronize options and values
            foreach ($optionsData as $position => $opt) {
                if (empty($opt['name']) || empty($opt['values'])) {
                    continue;
                }

                $option = ProductOption::updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'name' => trim($opt['name']),
                    ],
                    [
                        'position' => $position,
                    ]
                );

                $createdOptions[] = $option;
                $valueModels = [];

                foreach ($opt['values'] as $valPos => $val) {
                    $trimmedVal = trim($val);
                    if ($trimmedVal === '') {
                        continue;
                    }

                    $optionValue = ProductOptionValue::updateOrCreate(
                        [
                            'product_option_id' => $option->id,
                            'value' => $trimmedVal,
                        ],
                        [
                            'position' => $valPos,
                        ]
                    );
                    $valueModels[] = $optionValue;
                }

                if (!empty($valueModels)) {
                    $allValuesList[] = $valueModels;
                }
            }

            // If no valid options, ensure a default single variant exists
            if (empty($allValuesList)) {
                if ($product->variants()->count() === 0) {
                    $product->variants()->create(array_merge([
                        'title' => 'Default Title',
                        'sku' => $this->generateBaseSku($product->title),
                        'price' => $defaultVariantValues['price'] ?? 0.00,
                        'inventory_quantity' => $defaultVariantValues['inventory_quantity'] ?? 0,
                        'track_quantity' => true,
                        'allow_backorders' => false,
                    ], $defaultVariantValues));
                }
                return $product->load(['options.values', 'variants.optionValues', 'media']);
            }

            // 2. Compute Cartesian Product of option values
            $cartesianProduct = $this->cartesianProduct($allValuesList);

            // 3. Sync variants for each combination
            $existingVariants = $product->variants()->with('optionValues')->get();
            $handledVariantIds = [];

            foreach ($cartesianProduct as $combination) {
                // combination is an array of ProductOptionValue models
                $combinationValueIds = array_map(fn ($ov) => $ov->id, $combination);
                sort($combinationValueIds);

                $title = implode(' / ', array_map(fn ($ov) => $ov->value, $combination));
                $skuSuffix = implode('-', array_map(fn ($ov) => strtoupper(Str::slug($ov->value)), $combination));
                $sku = $this->generateBaseSku($product->title) . '-' . $skuSuffix;

                // Find matching existing variant with the exact combination
                $matchedVariant = $existingVariants->first(function ($variant) use ($combinationValueIds) {
                    $varValIds = $variant->optionValues->pluck('id')->all();
                    sort($varValIds);
                    return $varValIds === $combinationValueIds;
                });

                if ($matchedVariant) {
                    $matchedVariant->update(['title' => $title]);
                    $handledVariantIds[] = $matchedVariant->id;
                } else {
                    $newVariant = $product->variants()->create(array_merge([
                        'title' => $title,
                        'sku' => $this->ensureUniqueSku($sku),
                        'price' => $defaultVariantValues['price'] ?? 0.00,
                        'compare_at_price' => $defaultVariantValues['compare_at_price'] ?? null,
                        'cost_price' => $defaultVariantValues['cost_price'] ?? null,
                        'inventory_quantity' => $defaultVariantValues['inventory_quantity'] ?? 0,
                        'track_quantity' => true,
                        'allow_backorders' => false,
                    ], $defaultVariantValues));

                    $newVariant->optionValues()->sync($combinationValueIds);
                    $handledVariantIds[] = $newVariant->id;
                }
            }

            return $product->load(['options.values', 'variants.optionValues', 'media']);
        });
    }

    /**
     * Bulk update variant details (e.g. price, inventory, sku from admin table).
     */
    public function bulkUpdateVariants(Product $product, array $variantsPayload): void
    {
        DB::transaction(function () use ($product, $variantsPayload) {
            foreach ($variantsPayload as $item) {
                if (empty($item['id'])) {
                    continue;
                }

                $variant = $product->variants()->find($item['id']);
                if ($variant) {
                    $variant->update(array_filter([
                        'sku' => $item['sku'] ?? $variant->sku,
                        'price' => isset($item['price']) ? (float) $item['price'] : $variant->price,
                        'compare_at_price' => array_key_exists('compare_at_price', $item)
                            ? ($item['compare_at_price'] !== null ? (float) $item['compare_at_price'] : null)
                            : $variant->compare_at_price,
                        'cost_price' => array_key_exists('cost_price', $item)
                            ? ($item['cost_price'] !== null ? (float) $item['cost_price'] : null)
                            : $variant->cost_price,
                        'inventory_quantity' => isset($item['inventory_quantity'])
                            ? (int) $item['inventory_quantity']
                            : $variant->inventory_quantity,
                        'track_quantity' => isset($item['track_quantity'])
                            ? (bool) $item['track_quantity']
                            : $variant->track_quantity,
                        'allow_backorders' => isset($item['allow_backorders'])
                            ? (bool) $item['allow_backorders']
                            : $variant->allow_backorders,
                        'weight' => array_key_exists('weight', $item)
                            ? ($item['weight'] !== null ? (float) $item['weight'] : null)
                            : $variant->weight,
                    ], fn ($v) => $v !== null));
                }
            }
        });
    }

    /**
     * Compute the Cartesian product of an array of arrays.
     */
    private function cartesianProduct(array $input): array
    {
        $result = [[]];

        foreach ($input as $values) {
            $append = [];
            foreach ($result as $product) {
                foreach ($values as $item) {
                    $append[] = array_merge($product, [$item]);
                }
            }
            $result = $append;
        }

        return $result;
    }

    private function generateBaseSku(string $title): string
    {
        $slug = strtoupper(Str::slug(substr($title, 0, 16)));
        return $slug ?: 'PROD';
    }

    private function ensureUniqueSku(string $sku): string
    {
        $original = $sku;
        $counter = 1;
        while (ProductVariant::where('sku', $sku)->exists()) {
            $sku = "{$original}-{$counter}";
            $counter++;
        }
        return $sku;
    }
}
