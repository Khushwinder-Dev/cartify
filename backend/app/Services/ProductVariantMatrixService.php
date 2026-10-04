<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use App\Models\ProductVariant;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductVariantMatrixService
{
    /**
     * Compute the Cartesian product and build the in-memory variant matrix
     * from dynamic option dimensions (Shopify-style).
     *
     * @param array<int, array{name: string, values: array<int, string>}> $optionsData
     * @param array{
     *     base_sku?: string,
     *     price?: float,
     *     compare_at_price?: float|null,
     *     cost_price?: float|null,
     *     inventory_quantity?: int,
     *     track_inventory?: bool,
     *     weight?: float|null
     * } $defaults
     * @return array<int, array{
     *     title: string,
     *     sku: string,
     *     price: float,
     *     compare_at_price: float|null,
     *     cost_price: float|null,
     *     inventory_quantity: int,
     *     track_inventory: bool,
     *     weight: float|null,
     *     options: array<string, string>
     * }>
     */
    public function generateCombinations(array $optionsData, array $defaults = []): array
    {
        // 1. Sanitize and filter empty options/values
        $cleanDimensions = [];
        foreach ($optionsData as $option) {
            $name = trim($option['name'] ?? '');
            $rawValues = $option['values'] ?? [];

            $values = array_values(array_unique(array_filter(
                array_map('trim', is_array($rawValues) ? $rawValues : explode(',', (string) $rawValues)),
                fn ($v) => $v !== ''
            )));

            if ($name !== '' && !empty($values)) {
                $cleanDimensions[] = [
                    'name' => $name,
                    'values' => $values,
                ];
            }
        }

        if (empty($cleanDimensions)) {
            return [];
        }

        // 2. Extract values list for Cartesian product calculation
        $valuesList = array_map(fn ($dim) => $dim['values'], $cleanDimensions);
        $cartesian = $this->calculateCartesianProduct($valuesList);

        $baseSku = strtoupper($defaults['base_sku'] ?? 'PROD');
        $defaultPrice = (float) ($defaults['price'] ?? 0.00);
        $defaultComparePrice = isset($defaults['compare_at_price']) ? (float) $defaults['compare_at_price'] : null;
        $defaultCostPrice = isset($defaults['cost_price']) ? (float) $defaults['cost_price'] : null;
        $defaultInventory = (int) ($defaults['inventory_quantity'] ?? 0);
        $trackInventory = (bool) ($defaults['track_inventory'] ?? true);
        $weight = isset($defaults['weight']) ? (float) $defaults['weight'] : null;

        $matrix = [];

        // 3. Map each tuple back to dimension names and synthesize variant attributes
        foreach ($cartesian as $combinationValues) {
            $optionMap = [];
            $skuTokens = [];

            foreach ($combinationValues as $idx => $val) {
                $dimName = $cleanDimensions[$idx]['name'];
                $optionMap[$dimName] = $val;
                $skuTokens[] = strtoupper(Str::slug($val));
            }

            $title = implode(' / ', $combinationValues);
            $skuSuffix = implode('-', $skuTokens);
            $sku = "{$baseSku}-{$skuSuffix}";

            $matrix[] = [
                'title' => $title,
                'sku' => $sku,
                'price' => $defaultPrice,
                'compare_at_price' => $defaultComparePrice,
                'cost_price' => $defaultCostPrice,
                'inventory_quantity' => $defaultInventory,
                'track_inventory' => $trackInventory,
                'weight' => $weight,
                'options' => $optionMap,
            ];
        }

        return $matrix;
    }

    /**
     * Persist the dynamic option schema and Cartesian variants into MySQL.
     * Synchronizes existing variants and prevents accidental stock loss.
     *
     * @param Product $product
     * @param array<int, array{name: string, values: array<int, string>}> $optionsData
     * @param array<int, array<string, mixed>> $customVariantsData Override data (from matrix editor)
     * @return Product
     */
    public function syncProductMatrix(Product $product, array $optionsData, array $customVariantsData = []): Product
    {
        return DB::transaction(function () use ($product, $optionsData, $customVariantsData) {
            $createdOptions = [];
            $allValuesList = [];

            // 1. Sync ProductOption and ProductOptionValue records
            foreach ($optionsData as $pos => $opt) {
                $optName = trim($opt['name'] ?? '');
                $values = array_filter(array_map('trim', $opt['values'] ?? []), fn ($v) => $v !== '');

                if ($optName === '' || empty($values)) {
                    continue;
                }

                $optionModel = ProductOption::updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'name' => $optName,
                    ],
                    [
                        'position' => $pos,
                    ]
                );
                $createdOptions[] = $optionModel;

                $valueModels = [];
                foreach ($values as $valPos => $val) {
                    $valueModels[] = ProductOptionValue::updateOrCreate(
                        [
                            'product_option_id' => $optionModel->id,
                            'value' => $val,
                        ],
                        [
                            'position' => $valPos,
                        ]
                    );
                }
                $allValuesList[] = $valueModels;
            }

            // 2. Compute Cartesian Product of value models
            $cartesian = !empty($allValuesList) ? $this->calculateCartesianProduct($allValuesList) : [];
            $existingVariants = $product->variants()->with('optionValues')->get();
            $handledVariantIds = [];

            // Index custom variants payload by signature
            $customIndexed = [];
            foreach ($customVariantsData as $cVar) {
                if (!empty($cVar['sku'])) {
                    $customIndexed[$cVar['sku']] = $cVar;
                }
                if (!empty($cVar['title'])) {
                    $customIndexed[$cVar['title']] = $cVar;
                }
            }

            // 3. Reconcile or create variant rows
            foreach ($cartesian as $combination) {
                /** @var array<ProductOptionValue> $combination */
                $valueIds = array_map(fn ($ov) => $ov->id, $combination);
                sort($valueIds);

                $title = implode(' / ', array_map(fn ($ov) => $ov->value, $combination));
                $skuSuffix = implode('-', array_map(fn ($ov) => strtoupper(Str::slug($ov->value)), $combination));
                $baseSku = strtoupper(Str::slug(substr($product->title, 0, 14))) ?: 'PROD';
                $defaultSku = "{$baseSku}-{$skuSuffix}";

                $custom = $customIndexed[$defaultSku] ?? $customIndexed[$title] ?? [];

                // Match with existing variant
                $matchedVariant = $existingVariants->first(function ($var) use ($valueIds) {
                    $ids = $var->optionValues->pluck('id')->all();
                    sort($ids);
                    return $ids === $valueIds;
                });

                $variantData = [
                    'title' => $title,
                    'sku' => $custom['sku'] ?? ($matchedVariant?->sku ?? $this->ensureUniqueSku($defaultSku, $matchedVariant?->id)),
                    'barcode' => $custom['barcode'] ?? $matchedVariant?->barcode,
                    'price' => isset($custom['price']) ? (float) $custom['price'] : ($matchedVariant?->price ?? 0.00),
                    'compare_at_price' => array_key_exists('compare_at_price', $custom) ? $custom['compare_at_price'] : $matchedVariant?->compare_at_price,
                    'cost_price' => array_key_exists('cost_price', $custom) ? $custom['cost_price'] : $matchedVariant?->cost_price,
                    'inventory_quantity' => isset($custom['inventory_quantity']) ? (int) $custom['inventory_quantity'] : ($matchedVariant?->inventory_quantity ?? 0),
                    'track_inventory' => isset($custom['track_inventory']) ? (bool) $custom['track_inventory'] : ($matchedVariant?->track_inventory ?? true),
                    'weight' => array_key_exists('weight', $custom) ? $custom['weight'] : $matchedVariant?->weight,
                ];

                if ($matchedVariant) {
                    $matchedVariant->update($variantData);
                    $handledVariantIds[] = $matchedVariant->id;
                } else {
                    $newVariant = $product->variants()->create($variantData);
                    $newVariant->optionValues()->sync($valueIds);
                    $handledVariantIds[] = $newVariant->id;
                }
            }

            return $product->load(['options.values', 'variants.optionValues', 'media']);
        });
    }

    /**
     * Compute iterative Cartesian product of multiple arrays.
     *
     * @param array<int, array<int, mixed>> $arrays
     * @return array<int, array<int, mixed>>
     */
    public function calculateCartesianProduct(array $arrays): array
    {
        $result = [[]];

        foreach ($arrays as $items) {
            $append = [];
            foreach ($result as $subResult) {
                foreach ($items as $item) {
                    $append[] = array_merge($subResult, [$item]);
                }
            }
            $result = $append;
        }

        return $result;
    }

    /**
     * Ensure generated SKU is unique in the database.
     */
    protected function ensureUniqueSku(string $sku, ?int $ignoreVariantId = null): string
    {
        $candidate = $sku;
        $counter = 1;

        while (
            ProductVariant::where('sku', $candidate)
                ->when($ignoreVariantId, fn ($q) => $q->where('id', '!=', $ignoreVariantId))
                ->exists()
        ) {
            $candidate = "{$sku}-{$counter}";
            $counter++;
        }

        return $candidate;
    }
}
