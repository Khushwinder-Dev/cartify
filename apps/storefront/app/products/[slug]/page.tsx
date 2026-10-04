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
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Search,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Product, ProductVariant } from '@/lib/types';
import { formatPrice } from '@/lib/currency';
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
  'Optic White': '#FFFFFF',
  'Washed Black': '#242426',
  'Sand Dune': '#C2B280',
  'Natural Ecru': '#ECE6D8',
  'Navy Ink': '#17223B',
  Olive: '#556B2F',
  'Caramel Camel': '#C19A6B',
  Midnight: '#191970',
  'Classic Honey': '#D4AF37',
  'Night Charcoal': '#222326',
  'Heather Ash': '#B2BEB5',
  'Washed Olive': '#606C38',
  'Jet Black': '#0A0A0A',
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
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'shipping' | 'guarantee'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

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
        setCurrentMediaIndex(0);

        // Pre-select first value for each option dimension
        const initialSelections: Record<string, string> = {};
        prod.options?.forEach((opt) => {
          if (opt.values && opt.values.length > 0) {
            initialSelections[opt.name] = opt.values[0].value;
          }
        });
        setSelectedOptions(initialSelections);

        // Match initial variant and sync image
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

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrevSlide();
      if (e.key === 'ArrowRight') handleNextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, currentMediaIndex, product]);

  const mediaList = product?.media && product.media.length > 0
    ? product.media
    : (product?.primary_media ? [product.primary_media] : []);

  const activeMedia = mediaList[currentMediaIndex] || mediaList[0];
  const activeImageUrl = activeMedia?.url || selectedMediaUrl || product?.primary_media?.url || '';

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

    // ==============================================================
    // DYNAMIC IMAGE SWITCH AS VARIATION IS SELECTED
    // ==============================================================
    const selectedColor = selections['Color'] || selections['color'] || selections['Colour'] || '';
    const allMedia = prod.media || [];

    let targetIndex = -1;

    // 1. Direct variant media association
    if (active.media && active.media.length > 0) {
      targetIndex = allMedia.findIndex((m) => m.url === active.media![0].url);
    }

    // 2. Product media with matching product_variant_id
    if (targetIndex === -1 && allMedia.length > 0) {
      targetIndex = allMedia.findIndex((m) => m.product_variant_id === active.id);
    }

    // 3. Match by color name in alt_text or URL
    if (targetIndex === -1 && selectedColor && allMedia.length > 0) {
      targetIndex = allMedia.findIndex((m) =>
        (m.alt_text && m.alt_text.toLowerCase().includes(selectedColor.toLowerCase())) ||
        (m.url && m.url.toLowerCase().includes(selectedColor.toLowerCase()))
      );
    }

    if (targetIndex !== -1 && allMedia[targetIndex]) {
      setCurrentMediaIndex(targetIndex);
      setSelectedMediaUrl(allMedia[targetIndex].url);
    } else if (active.media && active.media.length > 0) {
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

  const handleSelectMedia = (index: number) => {
    if (index < 0 || index >= mediaList.length) return;
    setCurrentMediaIndex(index);
    const media = mediaList[index];
    if (media) {
      setSelectedMediaUrl(media.url);

      // If user clicks a thumbnail that corresponds to a distinct color, sync that variation!
      if (product?.options) {
        const colorOption = product.options.find(
          (o) => o.name.toLowerCase().includes('color') || o.name.toLowerCase().includes('colour')
        );
        if (colorOption && colorOption.values && media.alt_text) {
          const matchedVal = colorOption.values.find((val) =>
            media.alt_text?.toLowerCase().includes(val.value.toLowerCase())
          );
          if (matchedVal && selectedOptions[colorOption.name] !== matchedVal.value) {
            const nextSelections = { ...selectedOptions, [colorOption.name]: matchedVal.value };
            setSelectedOptions(nextSelections);
            if (product.variants) {
              const matched = product.variants.find((v) =>
                Object.entries(nextSelections).every(([k, vVal]) =>
                  v.option_values?.some((ov) => ov.value === vVal)
                )
              );
              if (matched) setSelectedVariant(matched);
            }
          }
        }
      }
    }
  };

  const handlePrevSlide = () => {
    const total = mediaList.length;
    if (total <= 1) return;
    const nextIndex = currentMediaIndex > 0 ? currentMediaIndex - 1 : total - 1;
    handleSelectMedia(nextIndex);
  };

  const handleNextSlide = () => {
    const total = mediaList.length;
    if (total <= 1) return;
    const nextIndex = currentMediaIndex < total - 1 ? currentMediaIndex + 1 : 0;
    handleSelectMedia(nextIndex);
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
            className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ============================================================== */}
          {/* HIGH-RESOLUTION INTERACTIVE MEDIA GALLERY (SLIDER & ZOOM)      */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image Slider */}
            <div
              className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl group select-none"
            >
              <img
                src={activeImageUrl}
                alt={activeMedia?.alt_text || product.title}
                className="w-full h-full object-cover object-center transition-opacity duration-300"
              />

              {/* Vendor Tag */}
              {product.vendor && (
                <span className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full z-10 pointer-events-none shadow">
                  {product.vendor}
                </span>
              )}

              {/* Slide Counter & Lightbox Expand Trigger */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                {mediaList.length > 1 && (
                  <span className="bg-black/70 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1.5 rounded-full shadow">
                    {String(currentMediaIndex + 1).padStart(2, '0')} / {String(mediaList.length).padStart(2, '0')}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="p-2 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-black/90 transition shadow cursor-pointer"
                  title="Expand to Fullscreen Lightbox"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Floating Next/Previous Navigation Buttons */}
              {mediaList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    aria-label="Previous slide"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Next slide"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Slider Dots Indicator */}
            {mediaList.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 py-1">
                {mediaList.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectMedia(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentMediaIndex === idx
                        ? 'w-7 bg-indigo-600 dark:bg-indigo-400'
                        : 'w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnails Carousel */}
            {mediaList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
                {mediaList.map((med, idx) => {
                  const isSelected = currentMediaIndex === idx;
                  return (
                    <button
                      key={med.id || idx}
                      type="button"
                      onClick={() => handleSelectMedia(idx)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/30 scale-105 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                      }`}
                    >
                      <img
                        src={med.url}
                        alt={med.alt_text || `Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none" />
                      )}
                    </button>
                  );
                })}
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

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-neutral-950 dark:text-white">
                {product.title}
              </h1>

              {/* Price & Savings Pill */}
              <div className="mt-3 flex items-baseline space-x-3">
                <span className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight text-neutral-950 dark:text-white">
                  {formatPrice(currentPrice)}
                </span>
                {compareAtPrice && compareAtPrice > currentPrice && (
                  <>
                    <span className="text-lg line-through tabular-nums text-neutral-400">
                      {formatPrice(compareAtPrice)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold tabular-nums bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400">
                      Save {formatPrice(savingsAmount)} ({savingsPercent}% OFF)
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

            {/* DYNAMIC MULTI-DIMENSIONAL VARIANT OPTIONS WITH INSTANT IMAGE SWITCH */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-5">
                {product.options.map((option) => {
                  const isColorOption = option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour');

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
                                className={`w-9 h-9 rounded-full border-2 transition-all relative flex items-center justify-center cursor-pointer ${
                                  isSelected
                                    ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-neutral-950 scale-110 border-white'
                                    : 'border-neutral-300 dark:border-neutral-700 opacity-80 hover:opacity-100 hover:scale-105'
                                }`}
                                style={{ backgroundColor: swatchColor }}
                              >
                                {isSelected && (
                                  <Check
                                    className={`w-4 h-4 ${
                                      ['#FFFFFF', '#F8FAFC', '#F1F5F9', '#D7C4A5', '#E3DCce', '#ECE6D8'].includes(swatchColor)
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
                              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide border transition-all relative cursor-pointer ${
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
                    className="w-10 h-10 flex items-center justify-center font-bold text-neutral-600 hover:text-neutral-950 dark:hover:text-white cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= stockQuantity && !selectedVariant?.allow_backorders}
                    className="w-10 h-10 flex items-center justify-center font-bold text-neutral-600 hover:text-neutral-950 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  id="add-to-cart-button"
                  onClick={handleAddToCart}
                  disabled={isAdding || isOutOfStock}
                  className="flex-1 py-4 px-6 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold rounded-2xl shadow-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
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
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-600/25 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Instant Checkout • {formatPrice(currentPrice * quantity)}</span>
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

            {/* Product Specifications & Details Accordion/Tabs */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-6 text-xs font-bold uppercase tracking-wider">
                {(['overview', 'materials', 'shipping', 'guarantee'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 transition-colors relative cursor-pointer ${
                      activeTab === tab
                        ? 'text-neutral-950 dark:text-white'
                        : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
                    )}
                  </button>
                ))}
              </div>

              <div className="py-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                {activeTab === 'overview' && (
                  <p>{product.description || 'Precision crafted with meticulous attention to tailoring and drape.'}</p>
                )}
                {activeTab === 'materials' && (
                  <div className="space-y-1">
                    <p>• 100% sustainably-sourced premium natural fibers</p>
                    <p>• Reinforced stress points & double-needle topstitching</p>
                    <p>• Pre-shrunk weave to preserve shape over decades of wear</p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-1">
                    <p>• Dispatched from our domestic fulfillment center within 24 hours.</p>
                    <p>• Tracking link emailed immediately upon carrier handoff.</p>
                    <p>• Duty-free worldwide delivery options available at checkout.</p>
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
            <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-neutral-950 dark:text-white mb-6">
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
                  <h4 className="font-semibold text-sm text-neutral-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {rel.title}
                  </h4>
                  <span className="text-sm font-bold tabular-nums text-neutral-900 dark:text-white mt-1 block">
                    ${rel.min_price?.toFixed(2)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* FULLSCREEN HIGH-RESOLUTION LIGHTBOX MODAL WITH ZOOM CONTROLS   */}
      {/* ============================================================== */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between text-white pb-3 border-b border-neutral-800 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-sm sm:text-base font-bold">{product.title}</h3>
              <p className="text-xs text-neutral-400">
                {activeMedia?.alt_text || `Image ${currentMediaIndex + 1} of ${mediaList.length}`}
              </p>
            </div>

            {/* Lightbox Zoom Controls & Close */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-neutral-900 rounded-xl p-1 border border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => setLightboxZoom((z) => Math.max(1, z - 0.5))}
                  className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono font-bold text-indigo-400">{lightboxZoom}x</span>
                <button
                  type="button"
                  onClick={() => setLightboxZoom((z) => Math.min(3, z + 0.5))}
                  className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Zoomable Viewport */}
          <div
            className="flex-1 flex items-center justify-center relative overflow-hidden my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {mediaList.length > 1 && (
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-2 sm:left-6 w-12 h-12 rounded-full bg-neutral-900/80 border border-neutral-700 text-white flex items-center justify-center hover:bg-neutral-800 hover:scale-110 active:scale-95 transition shadow-2xl z-20 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="max-w-4xl max-h-[75vh] w-full h-full flex items-center justify-center overflow-auto p-2">
              <img
                src={activeImageUrl}
                alt={activeMedia?.alt_text || product.title}
                className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl transition-transform duration-300 select-none"
                style={{ transform: `scale(${lightboxZoom})` }}
              />
            </div>

            {mediaList.length > 1 && (
              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-2 sm:right-6 w-12 h-12 rounded-full bg-neutral-900/80 border border-neutral-700 text-white flex items-center justify-center hover:bg-neutral-800 hover:scale-110 active:scale-95 transition shadow-2xl z-20 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {mediaList.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 overflow-x-auto pt-2 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              {mediaList.map((med, idx) => (
                <button
                  key={med.id || idx}
                  type="button"
                  onClick={() => handleSelectMedia(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition cursor-pointer flex-shrink-0 ${
                    currentMediaIndex === idx
                      ? 'border-indigo-500 scale-105 shadow-lg'
                      : 'border-neutral-800 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={med.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
