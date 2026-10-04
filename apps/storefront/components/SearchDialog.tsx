'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Sparkles, TrendingUp, Tag } from 'lucide-react';
import { LUXURY_CATALOG, LuxuryProduct } from '@/data/mock-clothing-catalog';
import { formatPrice } from '@/lib/currency';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = [
  'Heavyweight French Terry',
  'Japanese Melton Wool',
  'Selvedge Denim',
  'Cashmere Knitwear',
  'Tailored Trouser',
  'Organic Cotton Tee',
];

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LuxuryProduct[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const matched = LUXURY_CATALOG.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.product_type.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
    setResults(matched);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (slug: string) => {
    onClose();
    router.push(`/products/${slug}`);
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search luxury drops, fabrics, styles (e.g. Wool Overshirt)..."
            className="w-full bg-transparent px-4 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {query.trim() === '' ? (
            <div className="space-y-5">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Trending Drops & Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleTrendingClick(term)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Featured Curations
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {LUXURY_CATALOG.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectProduct(item.slug)}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition cursor-pointer group"
                    >
                      <img
                        src={item.primary_image}
                        alt={item.title}
                        className="w-14 h-16 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">{item.title}</p>
                        <p className="text-[11px] text-neutral-500">{item.product_type}</p>
                        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-200 mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">No products found for "{query}"</p>
              <p className="text-xs text-neutral-500">Try searching for "Hoodie", "Trouser", "Wool", or "Selvedge".</p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Matching Pieces ({results.length})
              </span>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.slug)}
                    className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={product.primary_image}
                        alt={product.title}
                        className="w-12 h-14 object-cover rounded-lg shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {product.title}
                        </h4>
                        <p className="text-[11px] text-neutral-500">{product.subtitle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-extrabold text-neutral-900 dark:text-white">
                            {formatPrice(product.price)}
                          </span>
                          {product.compare_at_price && (
                            <span className="text-[11px] line-through text-neutral-400">
                              {formatPrice(product.compare_at_price)}
                            </span>
                          )}
                          {product.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 uppercase">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
