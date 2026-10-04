'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, ShoppingBag, ShieldCheck, Truck, RotateCcw, AlertTriangle, Layers, Tag } from 'lucide-react';
import { api } from '@/lib/api';
import { Product, ProductVariant } from '@/lib/types';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await api.getProduct(slug);
        const prod = res.data;
        setProduct(prod);

        // Set primary media
        const primary = prod.primary_media?.url || prod.media?.[0]?.url || '';
        setSelectedMediaUrl(primary);

        // Pre-select first value for each option dimension
        const initialSelections: Record<string, string> = {};
        prod.options?.forEach((opt) => {
          if (opt.values && opt.values.length > 0) {
            initialSelections[opt.name] = opt.values[0].value;
          }
        });
        setSelectedOptions(initialSelections);

        // Match initial variant
        findMatchingVariant(prod, initialSelections);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  // Find variant that satisfies selected option dimensions
  const findMatchingVariant = (prod: Product, selections: Record<string, string>) => {
    if (!prod.variants || prod.variants.length === 0) return null;

    const matched = prod.variants.find((variant) => {
      if (!variant.option_values || variant.option_values.length === 0) {
        return true;
      }
      return Object.entries(selections).every(([optName, valName]) => {
        return variant.option_values?.some((ov) => ov.value === valName);
      });
    });

    setSelectedVariant(matched || prod.variants[0]);
    return matched;
  };

  const handleOptionSelect = (optionName: string, value: string) => {
    if (!product) return;
    const nextSelections = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(nextSelections);
    findMatchingVariant(product, nextSelections);
  };

  // Check if a specific option value combination is available in stock
  const isCombinationAvailable = (optionName: string, value: string): boolean => {
    if (!product?.variants) return false;
    const prospective = { ...selectedOptions, [optionName]: value };

    const matching = product.variants.find((v) => {
      return Object.entries(prospective).every(([optName, valName]) => {
        return v.option_values?.some((ov) => ov.value === valName);
      });
    });

    return matching ? matching.is_available : false;
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    try {
      await addToCart(selectedVariant.id, quantity);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-[500px] bg-neutral-200 dark:bg-neutral-800 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
            <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
            <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <Link href="/" className="mt-4 inline-block text-indigo-600 font-semibold">
          Return to catalog
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.min_price || 0);
  const compareAtPrice = selectedVariant?.compare_at_price ? Number(selectedVariant.compare_at_price) : null;
  const isOutOfStock = selectedVariant ? !selectedVariant.is_available : false;
  const stockQuantity = selectedVariant?.inventory_quantity || 0;
  const isLowStock = stockQuantity > 0 && stockQuantity <= 5;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Media Gallery (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md">
              <img
                src={selectedMediaUrl || product.primary_media?.url}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Thumbnail Strip */}
            {product.media && product.media.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.media.map((med) => (
                  <button
                    key={med.id}
                    onClick={() => setSelectedMediaUrl(med.url)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedMediaUrl === med.url
                        ? 'border-indigo-600 shadow-md scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={med.url} alt={med.alt_text || 'Thumbnail'} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Purchasing Box (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {product.vendor && (
                <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400">
                  {product.vendor}
                </span>
              )}
              <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white mt-1">
                {product.title}
              </h1>

              {/* Price & Savings */}
              <div className="mt-3 flex items-baseline space-x-3">
                <span className="text-3xl font-black text-neutral-950 dark:text-white">
                  ${currentPrice.toFixed(2)}
                </span>
                {compareAtPrice && compareAtPrice > currentPrice && (
                  <>
                    <span className="text-lg line-through text-neutral-400">
                      ${compareAtPrice.toFixed(2)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400">
                      Save ${(compareAtPrice - currentPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* SKU & Inventory Status */}
              <div className="mt-3 flex items-center space-x-4 text-xs">
                {selectedVariant?.sku && (
                  <span className="font-mono text-neutral-500">
                    SKU: <strong>{selectedVariant.sku}</strong>
                  </span>
                )}
                {isOutOfStock ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold">
                    Sold Out
                  </span>
                ) : isLowStock ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Only {stockQuantity} remaining!
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock ({stockQuantity} available)
                  </span>
                )}
              </div>
            </div>

            <hr className="border-neutral-200 dark:border-neutral-800" />

            {/* Dynamic Multi-Dimensional Variant Option Selectors */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-5">
                {product.options.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                        {option.name}:{' '}
                        <span className="font-normal text-neutral-500">{selectedOptions[option.name]}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {option.values?.map((val) => {
                        const isSelected = selectedOptions[option.name] === val.value;
                        const available = isCombinationAvailable(option.name, val.value);

                        return (
                          <button
                            key={val.id}
                            type="button"
                            onClick={() => handleOptionSelect(option.name, val.value)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all relative ${
                              isSelected
                                ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                                : available
                                ? 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400'
                                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/50 text-neutral-400 dark:text-neutral-600 cursor-not-allowed line-through'
                            }`}
                          >
                            {val.value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Stepper & Add to Cart */}
            <div className="space-y-4 pt-4">
              <div className="flex space-x-3">
                <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-2xl p-1 bg-white dark:bg-neutral-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-neutral-600 hover:text-neutral-950 dark:hover:text-white"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-neutral-600 hover:text-neutral-950 dark:hover:text-white"
                  >
                    +
                  </button>
                </div>

                <button
                  id="add-to-cart-button"
                  onClick={handleAddToCart}
                  disabled={isAdding || isOutOfStock}
                  className="flex-1 py-4 px-6 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold rounded-2xl shadow-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    {isOutOfStock ? 'Combination Sold Out' : isAdding ? 'Adding to Cart...' : 'Add to Cart'}
                  </span>
                </button>
              </div>

              {/* Value Propositions */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-indigo-500" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-emerald-500" />
                  <span>Hassle-free 30-day returns</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Description</h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
