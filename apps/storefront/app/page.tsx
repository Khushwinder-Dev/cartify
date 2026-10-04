'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle,
  Clock,
  Compass,
  Cpu,
  Eye,
  Flame,
  Globe,
  Heart,
  Layers,
  Lock,
  Plus,
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

export default function StorefrontHomePage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<string>('latest');

  // Spotlight card active variant/image
  const [spotlightColor, setSpotlightColor] = useState('Obsidian Black');

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
    { id: 'Accessories', label: 'Horology' },
    { id: 'Electronics', label: 'Acoustics' },
    { id: 'Furniture', label: 'Living & Desks' },
  ];

  const collections = [
    {
      title: 'Japanese Melton Wool',
      subtitle: 'Heavyweight Drape & French Seams',
      category: 'Apparel',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      tag: 'SS/26 Collection',
      href: '/collections/minimalist-apparel',
    },
    {
      title: 'Aerospace Grade 5 Titanium',
      subtitle: 'Sapphire Crystal & Automatic Movement',
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      tag: 'Precision Horology',
      href: '/collections/timepieces-horology',
    },
    {
      title: 'Studio Monitor Acoustics',
      subtitle: 'Beryllium Drivers & Acoustic Baffles',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      tag: 'High Fidelity',
      href: '/collections/acoustics-audio',
    },
    {
      title: 'Solid American Walnut',
      subtitle: 'Motorized Dual-Motor Standing Desks',
      category: 'Furniture',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      tag: 'Workspace Architecture',
      href: '/collections/living-desks',
    },
  ];

  const brandMarquee = [
    'NORAGI STUDIO',
    'KYOTO HOROLOGY',
    'KURA ACOUSTICS',
    'ATELIER ARCHIVE',
    'SELVEDGE LABS',
    'BESPOKE PRECISION',
    'CARTESIAN OBJECTS',
    'MONOCHROME LIVING',
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f4f4f6] selection:bg-indigo-600 selection:text-white">
      {/* 1. Atmospheric Luxury Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-neutral-800/80">
        {/* Dynamic Glow Ambient Accents */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6">
              {/* Luxury Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>SS/26 CAPSULE EVENT • SELF-HOSTED BESPOKE ARCHITECTURE</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-[1.08] text-white">
                Engineered Objects <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300">
                  For Discerning Living.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed">
                Hand-finished Japanese textiles, aerospace titanium horology, and acoustic masterworks. Synthesized via dynamic Cartesian variant matrix engines and atomic pessimistic checkout locks.
              </p>

              {/* CTA Group */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#catalog"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-white/5 flex items-center space-x-2 group cursor-pointer"
                >
                  <span>Explore SS/26 Capsule</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <Link
                  href="/collections"
                  className="px-6 py-3.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 hover:bg-neutral-900 font-bold text-xs uppercase tracking-wider text-neutral-300 hover:text-white transition-all flex items-center space-x-2"
                >
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span>Browse Collections</span>
                </Link>

                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl border border-indigo-500/20 bg-indigo-950/20 hover:bg-indigo-950/40 text-indigo-400 text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Admin Studio (:3001) ↗</span>
                </a>
              </div>

              {/* Architecture Highlights Chips */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-800/80">
                <div className="flex items-center space-x-2 text-xs font-bold text-neutral-300">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                  <span>Cartesian Multi-Variant</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-neutral-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>MySQL 8 Pessimistic Lock</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-neutral-300">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>Zero-Overselling Guard</span>
                </div>
              </div>
            </div>

            {/* Right Featured Drop Spotlight 3D Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900/80 p-3 group glass-panel glass-card-hover">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden relative bg-neutral-950">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85"
                    alt="Featured Drop"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black text-[10px] uppercase tracking-wider rounded-md inline-block shadow">
                        SS/26 Spotlight Drop
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        In Stock • Only 4 Left
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-serif text-white">Aerospace Titanium Chronograph</h3>
                    <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                      Grade 5 aerospace titanium, Japanese automatic movement, sapphire anti-reflective crystal.
                    </p>

                    {/* Interactive Swatches on Spotlight Card */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Finish:</span>
                      {['Obsidian Black', 'Silver Mist', 'Natural Titanium'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setSpotlightColor(c)}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition ${
                            spotlightColor === c
                              ? 'bg-white text-neutral-950 font-bold'
                              : 'bg-neutral-800 text-neutral-300 hover:text-white'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-white">$450.00</span>
                        <span className="text-xs text-neutral-400 line-through ml-2">$580.00</span>
                      </div>
                      <Link
                        href="/products/aerospace-titanium-chronograph-watch"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1"
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

      {/* 2. Brand Partner Infinite Marquee */}
      <section className="border-b border-neutral-800/80 bg-neutral-950/40 py-4 overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {[...brandMarquee, ...brandMarquee].map((brand, i) => (
            <div key={i} className="flex items-center gap-8 text-neutral-400 hover:text-white transition-colors">
              <span className="text-xs font-extrabold tracking-[0.25em] uppercase font-mono">{brand}</span>
              <span className="text-indigo-500 text-xs">◆</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Curated Capsule Collections Grid */}
      <section className="py-16 border-b border-neutral-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 block mb-1">
              Curated Capsules
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Four Core Design Dimensions
            </h2>
          </div>
          <Link
            href="/collections"
            className="text-xs font-bold text-neutral-400 hover:text-white transition flex items-center gap-1 group"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col, idx) => (
            <Link
              key={idx}
              href={col.href}
              className="group relative rounded-3xl overflow-hidden border border-neutral-800 hover:border-neutral-600 bg-neutral-900 transition-all duration-500 shadow-lg hover:shadow-2xl flex flex-col justify-end p-5 min-h-[340px]"
            >
              {/* Background Photography */}
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-60 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

              {/* Content */}
              <div className="relative z-10 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 backdrop-blur-md text-white border border-white/20 inline-block">
                  {col.tag}
                </span>
                <h3 className="text-lg font-serif font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-1">{col.subtitle}</p>

                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                  <span>Explore Capsule</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Interactive Filter & Search Control Center */}
      <section id="catalog" className="sticky top-16 z-30 bg-[#0b0c10]/95 backdrop-blur-xl border-b border-neutral-800/80 py-4 shadow-xl">
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

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search artifacts, vendors, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-800 bg-neutral-900/80 text-white placeholder-neutral-500 focus:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
              />
            </div>
          </div>

          {/* Secondary Filter Bar: Price Bracket, In-Stock Toggle, Sort */}
          <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-neutral-800/60 gap-3">
            <div className="flex items-center space-x-4">
              {/* Price Filters */}
              <div className="flex items-center space-x-1 text-neutral-400">
                <span className="font-semibold text-neutral-300 mr-1">Price:</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'under200', label: '< $200' },
                  { id: '200to500', label: '$200 - $500' },
                  { id: 'over500', label: '$500+' },
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

              {/* In-Stock Toggle */}
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
                <option value="latest">Newest Releases</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="title_asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Main Product Catalog Grid */}
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
          <div className="text-center py-24 bg-neutral-900/60 rounded-3xl border border-neutral-800 p-8 space-y-4">
            <h3 className="text-xl font-bold text-white">No matching products found</h3>
            <p className="text-sm text-neutral-400 max-w-sm mx-auto">
              We couldn&apos;t find artifacts matching your active filters. Try adjusting price range or query.
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
                  className="group rounded-3xl bg-neutral-900/70 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden flex flex-col justify-between"
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
                        <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                          {product.vendor}
                        </span>
                      ) : <span />}

                      {product.variants && product.variants.length > 1 && (
                        <span className="bg-neutral-900/80 backdrop-blur-md text-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-neutral-700">
                          {product.variants.length} Variants
                        </span>
                      )}
                    </div>

                    {/* Quick View & Quick Add Floating Action Bar */}
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
                        title="Quick Add to Bag"
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
                        <span className="uppercase tracking-wider text-[10px] font-bold">{product.product_type || 'Curated'}</span>
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

                      {/* Rating Stars preview */}
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

      {/* 6. Architectural Reliability & Engineering Highlights */}
      <section className="bg-neutral-950/60 border-t border-neutral-800/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-2">
              System Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Engineered with Mathematical Precision
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              How our self-hosted headless infrastructure guarantees zero overselling and instantaneous response times.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Pessimistic Concurrency</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                MySQL 8 `lockForUpdate` reserves inventory row-level during checkout execution, eliminating all race conditions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Cartesian Synthesis</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Dynamically computes full permutations across sizing, finishes, and dimensions with synchronized SKU barcoding.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Idempotent Pipeline</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Unique idempotency tokens prevent duplicate charges even under unstable mobile network conditions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Global DDP Logistics</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Customs duties and import taxes calculated automatically at checkout for door-to-door express delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Social Proof & Customer Reviews */}
      <section className="bg-neutral-950 border-t border-neutral-800/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center space-x-1 text-amber-400 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">
              Trusted by 14,000+ Collectors Worldwide
            </h2>
            <p className="text-xs text-neutral-400 mt-2">
              Verified feedback on materials, variant precision, and express delivery.
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
                &ldquo;The Japanese wool overshirt in Oatmeal drape is phenomenal. The variant options gave me exact sizing clarity and the checkout was instantaneous.&rdquo;
              </p>
              <div className="flex items-center space-x-2 pt-2 border-t border-neutral-800 text-xs">
                <span className="font-bold text-white">Marcus Vance</span>
                <span className="text-neutral-500">• Verified Buyer (Tokyo)</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="flex items-center space-x-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                &ldquo;Aerospace Titanium Chronograph with the Milanese mesh strap feels like a $2,000 Swiss piece. Arrived in 2 days with real-time tracking.&rdquo;
              </p>
              <div className="flex items-center space-x-2 pt-2 border-t border-neutral-800 text-xs">
                <span className="font-bold text-white">Sophia Chen</span>
                <span className="text-neutral-500">• Verified Buyer (San Francisco)</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="flex items-center space-x-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                &ldquo;The solid walnut desk was easy to assemble and height preset is whisper quiet. Applied WELCOME10 coupon at checkout seamlessly.&rdquo;
              </p>
              <div className="flex items-center space-x-2 pt-2 border-t border-neutral-800 text-xs">
                <span className="font-bold text-white">David K. Miller</span>
                <span className="text-neutral-500">• Verified Buyer (London)</span>
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
