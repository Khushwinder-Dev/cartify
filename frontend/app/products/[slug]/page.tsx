'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  AlertTriangle,
  Layers,
  Tag,
  Star,
  Zap,
  Info,
  Package,
  Cpu,
  Share2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Product, ProductVariant } from '@/lib/types';
import { useCart } from '@/context/CartContext';

// Color map for realistic option color swatches
const COLOR_SWATCH_MAP: Record<string, string> = {
  Oatmeal: '#E3DCce',
  Charcoal: '#2D3139',
  'Forest Green': '#2C402E',
  'Midnight Black': '#111318',
  'Polar White': '#F8FAFC',
  'Obsidian Black': '#18181B',
  'Silver Mist': '#CBD5E1',
  'Sandstone Tan': '#D4C4B7',
  'Solid Walnut': '#5C4033',
  'Natural Oak': '#D7C4A5',
  'Matte Black': '#1F2937',
  'Arctic White': '#F1F5F9',
  Navy: '#1E293B',
  'Heather Grey': '#94A3B8',
  Caramel: '#C28448',
  Black: '#09090B',
  'Off-White': '#F5F5F4',
};

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { addToCart, openCheckout } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'shipping' | 'guarantee'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await api.getProduct(slug);
        const prod = res.data;
        setProduct(prod);

        // Primary media
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

        // Fetch related products
        const catalogRes = await api.getProducts({ per_page: 4 });
        setRelatedProducts(catalogRes.data.filter((p) => p.slug !== slug));
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

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

    const active = matched || prod.variants[0];
    setSelectedVariant(active);

    if (active.media && active.media.length > 0) {
      setSelectedMediaUrl(active.media[0].url);
    }

    return active;
  };

  const handleOptionSelect = (optionName: string, value: string) => {
    if (!product) return;
    const nextSelections = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(nextSelections);
    findMatchingVariant(product, nextSelections);
  };

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

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    try {
      await addToCart(selectedVariant.id, quantity);
      openCheckout();
    } finally {
      setIsAdding(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-[520px] bg-neutral-200 dark:bg-neutral-800 rounded-3xl" />
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
  const savingsAmount = compareAtPrice && compareAtPrice > currentPrice ? compareAtPrice - currentPrice : 0;
  const savingsPercent = compareAtPrice && compareAtPrice > currentPrice ? Math.round((savingsAmount / compareAtPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalog</span>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-neutral-700 dark:text-neutral-300">{product.product_type || 'Products'}</span>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-neutral-900 dark:text-white line-clamp-1">{product.title}</span>
          </Link>

          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center space-x-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* High-Resolution Media Gallery (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md relative group">
              <img
                src={selectedMediaUrl || product.primary_media?.url}
                alt={product.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {product.vendor && (
                <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
                  {product.vendor}
                </span>
              )}
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

          {/* Purchasing Box & Interactive Variant Matrix (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-amber-500 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-xs font-semibold text-neutral-500 ml-1">5.0 (48 verified reviews)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
                {product.title}
              </h1>

              {/* Price & Savings Pill */}
              <div className="mt-3 flex items-baseline space-x-3">
                <span className="text-3xl font-black text-neutral-950 dark:text-white">
                  ${currentPrice.toFixed(2)}
                </span>
                {compareAtPrice && compareAtPrice > currentPrice && (
                  <>
                    <span className="text-lg line-through text-neutral-400">
                      ${compareAtPrice.toFixed(2)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400">
                      Save ${savingsAmount.toFixed(2)} ({savingsPercent}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* SKU, Barcode & Real-Time Stock Status */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                {selectedVariant?.sku && (
                  <span className="font-mono text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                    SKU: <strong>{selectedVariant.sku}</strong>
                  </span>
                )}

                {isOutOfStock ? (
                  <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 font-bold flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" /> Low Stock: Only {stockQuantity} remaining!
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> In Stock ({stockQuantity} units)
                  </span>
                )}
              </div>
            </div>

            <hr className="border-neutral-200 dark:border-neutral-800" />

            {/* DYNAMIC MULTI-DIMENSIONAL VARIANT OPTIONS */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-5">
                {product.options.map((option) => {
                  const isColorOption = option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('dial');

                  return (
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
                          const swatchColor = COLOR_SWATCH_MAP[val.value];

                          if (isColorOption && swatchColor) {
                            return (
                              <button
                                key={val.id}
                                type="button"
                                onClick={() => handleOptionSelect(option.name, val.value)}
                                title={val.value}
                                className={`w-8 h-8 rounded-full border-2 transition-all relative flex items-center justify-center ${
                                  isSelected
                                    ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-neutral-950 scale-110 border-white'
                                    : 'border-neutral-300 dark:border-neutral-700 opacity-80 hover:opacity-100 hover:scale-105'
                                }`}
                                style={{ backgroundColor: swatchColor }}
                              >
                                {isSelected && (
                                  <Check
                                    className={`w-3.5 h-3.5 ${
                                      ['#F8FAFC', '#F1F5F9', '#D7C4A5', '#E3DCce'].includes(swatchColor)
                                        ? 'text-neutral-900'
                                        : 'text-white'
                                    }`}
                                  />
                                )}
                              </button>
                            );
                          }

                          return (
                            <button
                              key={val.id}
                              type="button"
                              onClick={() => handleOptionSelect(option.name, val.value)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide border transition-all relative ${
                                isSelected
                                  ? 'border-neutral-950 dark:border-white bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md'
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
                  );
                })}
              </div>
            )}

            {/* Purchasing Action Buttons */}
            <div className="space-y-3 pt-3">
              <div className="flex space-x-3">
                {/* Quantity Stepper */}
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
                    disabled={quantity >= stockQuantity && !selectedVariant?.allow_backorders}
                    className="w-10 h-10 flex items-center justify-center font-bold text-neutral-600 hover:text-neutral-950 dark:hover:text-white disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  id="add-to-cart-button"
                  onClick={handleAddToCart}
                  disabled={isAdding || isOutOfStock}
                  className="flex-1 py-4 px-6 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold rounded-2xl shadow-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    {isOutOfStock ? 'Combination Sold Out' : isAdding ? 'Adding to Cart...' : 'Add to Bag'}
                  </span>
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={isAdding || isOutOfStock}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-600/25 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Instant Checkout • ${(currentPrice * quantity).toFixed(2)}</span>
              </button>

              {/* Guarantee Value Props */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span>Free express delivery on orders $100+</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Hassle-free 30-day global returns</span>
                </div>
              </div>
            </div>

            {/* Comprehensive Specification Tabs */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'materials', label: 'Materials & Care' },
                  { id: 'shipping', label: 'Fulfillment' },
                  { id: 'guarantee', label: 'Concurrency Lock' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeTab === t.id
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed min-h-[80px]">
                {activeTab === 'overview' && (
                  <p className="whitespace-pre-line">{product.description}</p>
                )}

                {activeTab === 'materials' && (
                  <div className="space-y-2">
                    <p>• Hand-finished with premium industrial-grade raw materials.</p>
                    <p>• Strict tolerance checks and environmental lifecycle compliance.</p>
                    <p>• Maintenance: Wipe clean with soft microfiber cloth. Avoid abrasive detergents.</p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p>• Ships same day if ordered before 3:00 PM EST.</p>
                    <p>• Express international DHL/FedEx with live door-to-door tracking.</p>
                    <p>• Customs and import tariffs calculated at checkout with DDP delivery.</p>
                  </div>
                )}

                {activeTab === 'guarantee' && (
                  <div className="space-y-2 bg-indigo-50 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-indigo-950 dark:text-indigo-300">
                    <span className="font-bold flex items-center gap-1 text-indigo-700 dark:text-indigo-400">
                      <ShieldCheck className="w-4 h-4" /> Atomic Concurrency Protection
                    </span>
                    <p>
                      This item is tracked in MySQL 8 with pessimistic row locking (`lockForUpdate`). When checkout executes, inventory is atomically reserved, eliminating any risk of overselling or race conditions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="text-xl font-black text-neutral-950 dark:text-white mb-6">
              You Might Also Admire
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="group block rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 hover:border-neutral-400 transition-all shadow-sm"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-3">
                    <img
                      src={rel.primary_media?.url || rel.media?.[0]?.url || ''}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {rel.title}
                  </h4>
                  <span className="text-sm font-extrabold text-neutral-900 dark:text-white mt-1 block">
                    ${rel.min_price?.toFixed(2)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
