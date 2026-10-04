'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  ArrowUpRight,
  Layers,
  Cpu,
  ShieldCheck,
  Eye,
  ShoppingBag,
  Star,
  CheckCircle2,
  Tag,
  ArrowRight,
  Flame,
  Zap,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import QuickViewModal from '@/components/QuickViewModal';
import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<string>('latest');

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  // Card hovered image tracking
  const [hoveredCardImage, setHoveredCardImage] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchProducts();
  }, [search, selectedType, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        search: search || undefined,
        product_type: selectedType !== 'all' ? selectedType : undefined,
        sort,
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.variants?.[0];
    if (!variant) return;

    setAddingId(product.id);
    try {
      await addToCart(variant.id, 1);
    } finally {
      setAddingId(null);
    }
  };

  const openQuickView = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  // Client-side faceted price and stock filtering
  const filteredProducts = products.filter((p) => {
    if (inStockOnly && !p.is_available) return false;
    const price = p.min_price || 0;
    if (priceFilter === 'under200' && price >= 200) return false;
    if (priceFilter === '200to500' && (price < 200 || price > 500)) return false;
    if (priceFilter === 'over500' && price <= 500) return false;
    return true;
  });

  const categories = [
    { id: 'all', label: 'All Artifacts' },
    { id: 'Apparel', label: 'Apparel' },
    { id: 'Accessories', label: 'Timepieces & Horology' },
    { id: 'Electronics', label: 'Acoustics' },
    { id: 'Furniture', label: 'Living & Desks' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Editorial Luxury Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-gradient-to-b from-white via-neutral-50/50 to-neutral-100/60 dark:from-neutral-950 dark:via-neutral-900/40 dark:to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Headless Shopify Architecture • Laravel 12 &amp; Next.js 16</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-neutral-950 dark:text-white">
                Engineered Goods. <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500">
                  Cartesian Precision.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                Explore an ultra-responsive headless storefront powered by real-time Cartesian variant generators, pessimistic row-level checkout locks, and zero-overselling guarantees.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#catalog"
                  className="px-6 py-3.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-xl transition-all flex items-center space-x-2 group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 font-bold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all flex items-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Admin Studio (:3001) ↗</span>
                </a>
              </div>

              {/* Architecture Highlights Chips */}
              <div className="grid grid-cols-3 gap-3 pt-8 border-t border-neutral-200 dark:border-neutral-800/80">
                <div className="flex items-center space-x-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  <Layers className="w-4 h-4 text-violet-500" />
                  <span>EAV Multi-Variant</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Pessimistic Locks</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  <Cpu className="w-4 h-4 text-indigo-500" />
                  <span>Idempotent Checkout</span>
                </div>
              </div>
            </div>

            {/* Right Featured Drop Spotlight Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 p-3 group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden relative bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
                    alt="Featured Drop"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="px-2.5 py-1 bg-amber-500 text-neutral-950 font-black text-[10px] uppercase tracking-wider rounded-md inline-block w-max mb-2">
                      Spotlight Drop
                    </span>
                    <h3 className="text-xl font-bold">Aerospace Titanium Chronograph</h3>
                    <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                      Grade 5 aerospace titanium, Japanese automatic movement, sapphire anti-reflective crystal.
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-black">$450.00</span>
                      <Link
                        href="/products/aerospace-titanium-chronograph-watch"
                        className="px-4 py-2 bg-white text-neutral-950 text-xs font-bold rounded-xl hover:bg-neutral-100 transition-colors flex items-center gap-1"
                      >
                        <span>Configure Matrix</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Flash Strip */}
      <section className="bg-indigo-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-semibold gap-2">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Limited Launch Promotion: Apply code <strong>FLASH25</strong> for 25% discount on all orders over $150!</span>
          </div>
          <span className="text-indigo-200">Instant Cart Validation • Concurrency Guaranteed</span>
        </div>
      </section>

      {/* Interactive Filter & Search Control Center */}
      <section id="catalog" className="sticky top-16 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedType(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedType === cat.id
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by title, vendor, tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Secondary Filter Bar: Price Bracket, In-Stock Toggle, Sort */}
          <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-neutral-100 dark:border-neutral-800/60 gap-3">
            <div className="flex items-center space-x-4">
              {/* Price Filters */}
              <div className="flex items-center space-x-1 text-neutral-600 dark:text-neutral-400">
                <span className="font-semibold text-neutral-900 dark:text-white mr-1">Price:</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'under200', label: '< $200' },
                  { id: '200to500', label: '$200 - $500' },
                  { id: 'over500', label: '$500+' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPriceFilter(p.id)}
                    className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-colors ${
                      priceFilter === p.id
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold'
                        : 'hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* In-Stock Toggle */}
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 text-[11px]">
                  In Stock Only
                </span>
              </label>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-neutral-500 font-medium">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1 text-neutral-800 dark:text-neutral-200 font-semibold focus:outline-none"
              >
                <option value="latest">Newest Releases</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="title_asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-3 bg-white dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800">
                <div className="bg-neutral-200 dark:bg-neutral-800 aspect-[4/5] rounded-2xl" />
                <div className="bg-neutral-200 dark:bg-neutral-800 h-4 rounded w-3/4" />
                <div className="bg-neutral-200 dark:bg-neutral-800 h-4 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-4">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">No matching products found</h3>
            <p className="text-sm text-neutral-500 max-w-sm mx-auto">
              We couldn&apos;t find artifacts matching your active filters. Try adjusting price range or query.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedType('all');
                setPriceFilter('all');
                setInStockOnly(false);
              }}
              className="px-5 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold rounded-xl"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const primaryImage =
                product.primary_media?.url ||
                product.media?.[0]?.url ||
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

              const secondaryImage =
                product.media && product.media.length > 1 ? product.media[1].url : null;

              const activeDisplayImage = hoveredCardImage[product.id] || primaryImage;

              const hasRange =
                product.min_price !== null &&
                product.max_price !== null &&
                product.min_price !== product.max_price;

              return (
                <div
                  key={product.id}
                  className="group rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800/90 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 shadow-sm hover:shadow-2xl overflow-hidden flex flex-col justify-between"
                >
                  {/* Image & Quick Action Overlay */}
                  <div
                    className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
                    onMouseEnter={() => {
                      if (secondaryImage) {
                        setHoveredCardImage({ ...hoveredCardImage, [product.id]: secondaryImage });
                      }
                    }}
                    onMouseLeave={() => {
                      const updated = { ...hoveredCardImage };
                      delete updated[product.id];
                      setHoveredCardImage(updated);
                    }}
                  >
                    <Link href={`/products/${product.slug}`}>
                      <img
                        src={activeDisplayImage}
                        alt={product.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </Link>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      {product.vendor ? (
                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                          {product.vendor}
                        </span>
                      ) : <span />}

                      {product.variants && product.variants.length > 1 && (
                        <span className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-800 dark:text-neutral-200 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                          {product.variants.length} Variants
                        </span>
                      )}
                    </div>

                    {/* Quick View & Quick Add Floating Action Bar */}
                    <div className="absolute bottom-3 inset-x-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={(e) => openQuickView(product, e)}
                        className="flex-1 py-2 px-3 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-neutral-900 dark:text-white text-xs font-bold rounded-xl shadow-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Quick View</span>
                      </button>

                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        disabled={addingId === product.id || !product.is_available}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-colors flex items-center justify-center disabled:opacity-50"
                        title="Quick Add to Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body Details */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                        <span>{product.product_type || 'Curated'}</span>
                        {product.is_available ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In Stock
                          </span>
                        ) : (
                          <span className="text-rose-500 font-bold">Sold Out</span>
                        )}
                      </div>

                      <Link href={`/products/${product.slug}`} className="block">
                        <h3 className="font-bold text-sm text-neutral-950 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                    </div>

                    {/* Price and Option Preview */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                      <span className="text-base font-black text-neutral-900 dark:text-white">
                        {hasRange
                          ? `$${product.min_price?.toFixed(2)} - $${product.max_price?.toFixed(2)}`
                          : `$${product.min_price?.toFixed(2)}`}
                      </span>

                      <Link
                        href={`/products/${product.slug}`}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        Configure →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Social Proof & Customer Reviews Banner */}
      <section className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center space-x-1 text-amber-400 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
              Trusted by 14,000+ Collectors Worldwide
            </h2>
            <p className="text-sm text-neutral-500 mt-2">
              Verified feedback on materials, variant precision, and express delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center space-x-2 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                &ldquo;The Japanese wool overshirt in Oatmeal drape is phenomenal. The variant options gave me exact sizing clarity and the checkout was instantaneous.&rdquo;
              </p>
              <div className="flex items-center space-x-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs">
                <span className="font-bold text-neutral-900 dark:text-white">Marcus Vance</span>
                <span className="text-neutral-400">• Verified Buyer (Tokyo)</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center space-x-2 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                &ldquo;Aerospace Titanium Chronograph with the Milanese mesh strap feels like a $2,000 Swiss piece. Arrived in 2 days with real-time tracking.&rdquo;
              </p>
              <div className="flex items-center space-x-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs">
                <span className="font-bold text-neutral-900 dark:text-white">Sophia Chen</span>
                <span className="text-neutral-400">• Verified Buyer (San Francisco)</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center space-x-2 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                &ldquo;The solid walnut desk was easy to assemble and height preset is whisper quiet. Applied WELCOME10 coupon at checkout seamlessly.&rdquo;
              </p>
              <div className="flex items-center space-x-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs">
                <span className="font-bold text-neutral-900 dark:text-white">David K. Miller</span>
                <span className="text-neutral-400">• Verified Buyer (London)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}
