'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Sliders,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';

interface ProductItem {
  id: number;
  title: string;
  slug: string;
  vendor: string;
  primary_media?: { url: string };
  media?: Array<{ url: string }>;
  variants?: Array<{ id: number; price: number; sku: string; title: string }>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

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

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
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

  const handleQuickAdd = async (variantId?: number) => {
    if (variantId) {
      await addToCart(variantId, 1);
      openCart();
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-24">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-xl font-bold tracking-tight">
              ATELIER & CO.
            </Link>
            <span className="text-stone-300">/</span>
            <Link href="/collections" className="text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-900">
              Categories
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-900">{collection.name}</span>
          </div>
          <Link
            href="/collections"
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Collection Hero */}
        <div className="mb-12 bg-white rounded-3xl p-8 lg:p-12 border border-stone-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-2">Category Showcase</span>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-stone-900 mb-3">{collection.name}</h1>
          <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">{collection.description}</p>
        </div>

        {/* Filter / Sort Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200 text-xs">
          <span className="text-stone-500 font-medium">{products.length} products available</span>
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-800"
            >
              <option value="latest">Latest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => {
            const price = p.variants?.[0]?.price ?? 120.00;
            const variantId = p.variants?.[0]?.id;

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition"
              >
                <Link href={`/products/${p.slug}`} className="block h-72 overflow-hidden relative bg-stone-100">
                  <img
                    src={p.primary_media?.url || p.media?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                      {p.vendor || 'Atelier Exclusive'}
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-base mb-1">
                      <Link href={`/products/${p.slug}`} className="hover:underline">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="text-sm font-bold text-stone-900 mt-2">${Number(price).toFixed(2)}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex gap-2">
                    <Link
                      href={`/products/${p.slug}`}
                      className="flex-1 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition text-center"
                    >
                      View Options
                    </Link>
                    {variantId && (
                      <button
                        onClick={() => handleQuickAdd(variantId)}
                        className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition"
                        title="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
