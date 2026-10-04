'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle,
  Eye,
  Flame,
  Heart,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Truck,
  Zap,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Product, ProductVariant } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import QuickViewModal from '@/components/QuickViewModal';

export default function CartifyClothingHomePage() {
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
  const [addedId, setAddedId] = useState<number | null>(null);

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
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 2000);
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

  // Filter products by price, stock
  const filteredProducts = products.filter((p) => {
    if (inStockOnly && !p.is_available) return false;
    const price = p.min_price || 0;
    if (priceFilter === 'under100' && price >= 100) return false;
    if (priceFilter === '100to180' && (price < 100 || price > 180)) return false;
    if (priceFilter === 'over180' && price <= 180) return false;
    return true;
  });

  const categories = [
    { id: 'all', label: 'All Clothing' },
    { id: 'Jackets & Outerwear', label: 'Outerwear' },
    { id: 'Hoodies & Sweats', label: 'Hoodies & Sweats' },
    { id: 'T-Shirts & Tops', label: 'T-Shirts' },
    { id: 'Trousers & Denim', label: 'Denim & Pants' },
    { id: 'Knitwear', label: 'Knitwear' },
  ];

  const featuredLookbooks = [
    {
      title: 'Heavyweight Fleece',
      subtitle: '480gsm custom-milled French terry in boxy cuts',
      tag: 'New Drop',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      category: 'Hoodies & Sweats',
    },
    {
      title: 'Japanese Selvedge Denim',
      subtitle: 'Vintage shuttle loom 14oz red-line raw denim',
      tag: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      category: 'Trousers & Denim',
    },
    {
      title: 'Technical Utility Jackets',
      subtitle: 'Weather-resistant ripstop with Primaloft insulation',
      tag: 'Outerwear',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      category: 'Jackets & Outerwear',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f4f4f6] selection:bg-indigo-600 selection:text-white">
      {/* 1. Clean Modern Fashion Hero */}
      <section className="relative overflow-hidden border-b border-neutral-800/80 bg-gradient-to-b from-neutral-950 via-[#0e1017] to-[#0b0c10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Spring / Summer 2026 Collection</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black tracking-tight leading-[1.05] text-white">
                Modern Clothing. <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-200">
                  Elevated Essentials.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed">
                Clean silhouettes, custom-milled heavyweight fleece, Japanese selvedge denim, and minimalist tailoring crafted for effortless everyday comfort.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#catalog"
                  className="px-7 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <span>Shop New Arrivals</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={() => {
                    setSelectedType('Hoodies & Sweats');
                    const el = document.getElementById('catalog');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 hover:bg-neutral-900 font-bold text-xs uppercase tracking-wider text-neutral-300 hover:text-white transition-all cursor-pointer"
                >
                  Explore Hoodies &amp; Sweats
                </button>
              </div>

              {/* Shopping Trust Perks */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-800/80 text-xs">
                <div>
                  <p className="font-bold text-white">Free Delivery</p>
                  <p className="text-[11px] text-neutral-400">On all orders $75+</p>
                </div>
                <div>
                  <p className="font-bold text-white">30-Day Returns</p>
                  <p className="text-[11px] text-neutral-400">Prepaid return label</p>
                </div>
                <div>
                  <p className="font-bold text-white">100% Organic</p>
                  <p className="text-[11px] text-neutral-400">Custom-milled cotton</p>
                </div>
              </div>
            </div>

            {/* Right Fashion Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900 p-3 group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden relative bg-neutral-950">
                  <img
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85"
                    alt="Featured Apparel"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-wider rounded-md inline-block shadow">
                        Trending Now
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                        In Stock • Ships in 24h
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-sans text-white">Heavyweight Boxy Fleece Hoodie</h3>
                    <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                      Custom 480gsm French terry, dropped shoulders, clean double-layered hood without strings.
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-white">$95.00</span>
                        <span className="text-xs text-neutral-400 line-through ml-2">$125.00</span>
                      </div>
                      <Link
                        href="/products/heavyweight-boxy-fleece-hoodie"
                        className="px-4 py-2 bg-white text-neutral-950 text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors flex items-center gap-1"
                      >
                        <span>Select Size</span>
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

      {/* 2. Featured Clothing Capsules Grid */}
      <section className="py-12 border-b border-neutral-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Curated Clothing Drops</h2>
          <span className="text-xs text-neutral-400 font-medium">Spring / Summer 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredLookbooks.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedType(item.category);
                const el = document.getElementById('catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative rounded-3xl overflow-hidden border border-neutral-800 hover:border-neutral-700 bg-neutral-900 transition-all duration-300 cursor-pointer shadow-lg p-6 min-h-[300px] flex flex-col justify-end"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600/80 text-white inline-block">
                  {item.tag}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-300">{item.subtitle}</p>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Clean Interactive Catalog Filter & Search */}
      <section id="catalog" className="sticky top-16 z-30 bg-[#0b0c10]/95 backdrop-blur-md border-b border-neutral-800/80 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedType(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedType === cat.id
                      ? 'bg-white text-neutral-950 shadow-md font-extrabold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Clean Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search by apparel, color, fabric..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Secondary Filter Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-neutral-800/60 gap-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-neutral-400">
                <span className="font-semibold text-neutral-300 mr-1">Price:</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'under100', label: '< $100' },
                  { id: '100to180', label: '$100 - $180' },
                  { id: 'over180', label: '$180+' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPriceFilter(p.id)}
                    className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-colors cursor-pointer ${
                      priceFilter === p.id
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold'
                        : 'hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 bg-neutral-900 border-neutral-700"
                />
                <span className="font-semibold text-neutral-300 text-[11px]">
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
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-neutral-200 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
              >
                <option value="latest">Newest Drops</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="title_asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main Product Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-3 bg-neutral-900/60 p-4 rounded-3xl border border-neutral-800">
                <div className="bg-neutral-800 aspect-[4/5] rounded-2xl" />
                <div className="bg-neutral-800 h-4 rounded w-3/4" />
                <div className="bg-neutral-800 h-4 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/60 rounded-3xl border border-neutral-800 p-8 space-y-4">
            <h3 className="text-xl font-bold text-white">No items match your filters</h3>
            <p className="text-sm text-neutral-400 max-w-sm mx-auto">
              Try selecting a different category or clearing price filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedType('all');
                setPriceFilter('all');
                setInStockOnly(false);
              }}
              className="px-5 py-2 bg-white text-neutral-950 text-xs font-bold rounded-xl hover:bg-neutral-200 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const primaryImage =
                product.primary_media?.url ||
                product.media?.[0]?.url ||
                'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80';

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
                  className="group rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between"
                >
                  {/* Image & Quick Action Overlay */}
                  <div
                    className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-950 cursor-pointer"
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
                        <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/10">
                          {product.vendor}
                        </span>
                      ) : <span />}

                      {product.variants && product.variants.length > 1 && (
                        <span className="bg-neutral-900/80 backdrop-blur-md text-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-neutral-700">
                          {product.variants.length} Sizes
                        </span>
                      )}
                    </div>

                    {/* Quick View & Quick Add Floating Bar */}
                    <div className="absolute bottom-3 inset-x-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={(e) => openQuickView(product, e)}
                        className="flex-1 py-2 px-3 bg-neutral-900/90 backdrop-blur-md text-white text-xs font-bold rounded-xl shadow-lg hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-1 border border-neutral-700 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Quick View</span>
                      </button>

                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        disabled={addingId === product.id || !product.is_available}
                        className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg transition-colors flex items-center justify-center disabled:opacity-50 cursor-pointer"
                        title="Add to Bag"
                      >
                        {addedId === product.id ? (
                          <Check className="w-4 h-4 text-emerald-300" />
                        ) : (
                          <ShoppingBag className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Body Details */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                        <span className="uppercase tracking-wider text-[10px] font-bold text-indigo-400">
                          {product.product_type || 'Apparel'}
                        </span>
                        {product.is_available ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> In Stock
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold text-[11px]">Sold Out</span>
                        )}
                      </div>

                      <Link href={`/products/${product.slug}`} className="block">
                        <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                          {product.title}
                        </h3>
                      </Link>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mt-1 text-amber-400">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono">5.0</span>
                      </div>
                    </div>

                    {/* Price and Option Preview */}
                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                      <span className="text-base font-black text-white">
                        {hasRange
                          ? `$${product.min_price?.toFixed(2)} - $${product.max_price?.toFixed(2)}`
                          : `$${product.min_price?.toFixed(2)}`}
                      </span>

                      <Link
                        href={`/products/${product.slug}`}
                        className="text-xs text-indigo-400 font-bold hover:text-indigo-300 transition"
                      >
                        Choose Size →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. Customer Sizing & Quality Testimonials */}
      <section className="bg-neutral-950 border-t border-neutral-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center space-x-1 text-amber-400 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Loved by 20,000+ Everyday Wearers
            </h2>
            <p className="text-xs text-neutral-400 mt-2">
              Real reviews regarding sizing, drape, and wash durability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="flex items-center space-x-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                &ldquo;The boxy fleece hoodie has the best silhouette I have found. Fabric is substantial and the double-layered hood holds its shape perfectly.&rdquo;
              </p>
              <div className="flex items-center space-x-2 pt-2 border-t border-neutral-800 text-xs">
                <span className="font-bold text-white">Alex Rivera</span>
                <span className="text-neutral-500">• Size L • Verified Buyer</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="flex items-center space-x-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                &ldquo;14oz Selvedge Denim has a genuine heritage feel. Fits true to size through the waist with a comfortable relaxed leg.&rdquo;
              </p>
              <div className="flex items-center space-x-2 pt-2 border-t border-neutral-800 text-xs">
                <span className="font-bold text-white">Marcus Vance</span>
                <span className="text-neutral-500">• Size 32 • Verified Buyer</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="flex items-center space-x-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                &ldquo;The organic crewneck tees don&apos;t shrink or curl at the collar. Ordered three more in different colors after the first wash.&rdquo;
              </p>
              <div className="flex items-center space-x-2 pt-2 border-t border-neutral-800 text-xs">
                <span className="font-bold text-white">Hannah Moore</span>
                <span className="text-neutral-500">• Size M • Verified Buyer</span>
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
