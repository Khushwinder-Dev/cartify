'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Filter, SlidersHorizontal, ArrowUpRight, Layers, Cpu, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sort, setSort] = useState<string>('latest');

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

  const categories = ['all', 'Apparel', 'Accessories', 'Electronics', 'Furniture'];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-b from-white via-neutral-50 to-neutral-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Headless Architecture • Laravel 12 & Next.js 16 LTS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-neutral-950 dark:text-white">
              Precision Form. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500">
                Cartesian Variant Engine.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Explore high-craft goods backed by atomic stock locks, multi-dimensional option matrices, and an idempotent checkout pipeline.
            </p>

            {/* Architecture Highlights */}
            <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800/80">
              <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <Layers className="w-4 h-4 text-violet-500" />
                <span>EAV Matrix</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Pessimistic Locks</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <Cpu className="w-4 h-4 text-indigo-500" />
                <span>Instant Revalidation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="sticky top-16 z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedType(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  selectedType === cat
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-1 border border-neutral-200 dark:border-neutral-700 rounded-xl px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 mr-1" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent border-none text-neutral-700 dark:text-neutral-300 focus:outline-none text-xs"
              >
                <option value="latest">Latest Releases</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="bg-neutral-200 dark:bg-neutral-800 h-72 rounded-2xl" />
                <div className="bg-neutral-200 dark:bg-neutral-800 h-4 rounded w-3/4" />
                <div className="bg-neutral-200 dark:bg-neutral-800 h-4 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No products found</h3>
            <p className="text-sm text-neutral-500 mt-1">Try clearing your search query or filter tags.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const imageUrl =
                product.primary_media?.url ||
                product.media?.[0]?.url ||
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

              const hasRange =
                product.min_price !== null &&
                product.max_price !== null &&
                product.min_price !== product.max_price;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group block rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden flex flex-col justify-between"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Vendor Badge */}
                    {product.vendor && (
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {product.vendor}
                      </span>
                    )}

                    {/* Variant Count Badge */}
                    {product.variants && product.variants.length > 1 && (
                      <span className="absolute bottom-3 left-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-800 dark:text-neutral-200 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                        {product.variants.length} Variants
                      </span>
                    )}

                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-4 h-4 text-neutral-900 dark:text-white" />
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                      <span>{product.product_type || 'Curated'}</span>
                      {product.is_available ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In Stock
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold">Sold Out</span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-neutral-950 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {product.title}
                    </h3>

                    {/* Price Range */}
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                        {hasRange
                          ? `$${product.min_price?.toFixed(2)} - $${product.max_price?.toFixed(2)}`
                          : `$${product.min_price?.toFixed(2)}`}
                      </span>
                      <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                        Select Options →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
