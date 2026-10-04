'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Sliders,
  Sparkles,
  ChevronDown,
  Star,
  Check
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';

interface ProductItem {
  id: number;
  title: string;
  slug: string;
  vendor: string;
  product_type?: string;
  primary_media?: { url: string };
  media?: Array<{ url: string }>;
  variants?: Array<{ id: number; price: number; sku: string; title: string }>;
  min_price?: number;
}

export default function CollectionProductsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { addToCart, openCart } = useCart();
  const [collection, setCollection] = useState<any>({
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: 'Bespoke tailoring, pure textiles, and modern utilitarian craftsmanship.',
  });
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('latest');
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || `http://${host}:8000/api/v1`;
        const res = await fetch(`${API_BASE}/collections/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.data?.collection) {
            setCollection(data.data.collection);
          }
          if (Array.isArray(data.data?.products)) {
            setProducts(data.data.products);
          }
        } else {
          // Fallback to general products
          const prodRes = await fetch(`${API_BASE}/products`);
          if (prodRes.ok) {
            const prodData = await prodRes.json();
            setProducts(prodData.data || []);
          }
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [slug]);

  const handleQuickAdd = async (variantId?: number, prodId?: number) => {
    if (variantId) {
      await addToCart(variantId, 1);
      if (prodId) {
        setAddedId(prodId);
        setTimeout(() => setAddedId(null), 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f4f4f6] pb-24 selection:bg-indigo-600 selection:text-white">
      {/* Editorial Header */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-neutral-800/80 bg-neutral-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-neutral-400">
            <Link href="/" className="hover:text-white transition-colors">
              Storefront
            </Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-white transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-white">{collection.name}</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-2">
              Curated Capsule
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
              {collection.name}
            </h1>
            <p className="mt-3 text-sm text-neutral-400 leading-relaxed max-w-2xl">
              {collection.description}
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter / Sort Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800/80 text-xs">
          <span className="text-neutral-400 font-medium">{products.length} artifacts available</span>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="latest">Latest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-neutral-900/60 rounded-3xl p-4 border border-neutral-800 space-y-4">
                <div className="h-72 bg-neutral-800 rounded-2xl" />
                <div className="h-4 bg-neutral-800 rounded w-2/3" />
                <div className="h-4 bg-neutral-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/40 rounded-3xl border border-neutral-800 p-8 space-y-3">
            <p className="text-base font-bold text-white">No products currently in this collection</p>
            <p className="text-xs text-neutral-400">Discover other releases in our full catalogue.</p>
            <Link
              href="/"
              className="inline-block mt-2 px-5 py-2.5 bg-white text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider"
            >
              Return to Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => {
              const price = p.variants?.[0]?.price ?? p.min_price ?? 120.00;
              const variantId = p.variants?.[0]?.id;

              return (
                <div
                  key={p.id}
                  className="bg-neutral-900/60 rounded-3xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all duration-300 shadow-xl flex flex-col justify-between group glass-panel"
                >
                  <Link href={`/products/${p.slug}`} className="block h-72 overflow-hidden relative bg-neutral-950">
                    <img
                      src={p.primary_media?.url || p.media?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {p.vendor && (
                      <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/10">
                        {p.vendor}
                      </span>
                    )}
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                          {p.product_type || 'Curated'}
                        </span>
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[10px] text-neutral-400 ml-1 font-mono">5.0</span>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-white text-base mb-1 group-hover:text-indigo-300 transition-colors">
                        <Link href={`/products/${p.slug}`}>
                          {p.title}
                        </Link>
                      </h3>
                      <p className="text-base font-black text-white mt-2">${Number(price).toFixed(2)}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-800 flex gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        className="flex-1 py-2.5 px-4 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl transition text-center shadow-md cursor-pointer"
                      >
                        Configure Matrix
                      </Link>
                      {variantId && (
                        <button
                          onClick={() => handleQuickAdd(variantId, p.id)}
                          className="p-2.5 rounded-xl border border-neutral-700 hover:border-neutral-500 bg-neutral-800 text-white transition cursor-pointer"
                          title="Quick Add to Bag"
                        >
                          {addedId === p.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ShoppingBag className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
