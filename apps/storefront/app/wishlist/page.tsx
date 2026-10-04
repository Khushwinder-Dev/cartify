'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  Sparkles,
  Check,
  Package
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface WishlistItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    title: string;
    slug: string;
    primary_media?: { url: string };
    variants?: Array<{ id: number; price: number; sku: string; title: string }>;
  };
}

const mockWishlist: WishlistItem[] = [
  {
    id: 1,
    product_id: 1,
    product: {
      id: 1,
      title: 'Japanese Selvedge Denim Jacket',
      slug: 'japanese-selvedge-denim-jacket',
      primary_media: { url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80' },
      variants: [{ id: 1, price: 185.00, sku: 'JAP-SEL-S-IND', title: 'S / Indigo' }],
    },
  },
  {
    id: 2,
    product_id: 2,
    product: {
      id: 2,
      title: 'Heavyweight Loopback Hoodie',
      slug: 'heavyweight-loopback-hoodie',
      primary_media: { url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80' },
      variants: [{ id: 4, price: 95.00, sku: 'HW-LOOP-M-SLT', title: 'M / Slate' }],
    },
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(mockWishlist);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const { addToCart, openCart } = useCart();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const guestToken = localStorage.getItem('wishlist_token') || 'guest_token';
        const res = await fetch(`${API_BASE}/wishlist`, {
          headers: { 'X-Guest-Token': guestToken },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.data?.items) && data.data.items.length > 0) {
            setItems(data.data.items);
          }
        }
      } catch (e) {}
    };
    fetchWishlist();
  }, []);

  const handleRemove = (itemId: number) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    const variantId = item.product.variants?.[0]?.id;
    if (variantId) {
      await addToCart(variantId, 1);
      setAddedIds((prev) => [...prev, item.id]);
      setTimeout(() => {
        openCart();
      }, 300);
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
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Wishlist</span>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-3">
              <Heart className="w-7 h-7 text-rose-500 fill-current" />
              <span>Saved Items & Wishlist</span>
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Curate your personal wardrobe picks and move items directly to checkout when ready
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 bg-stone-200 text-stone-700 rounded-full w-fit">
            {items.length} items saved
          </span>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-1">Your wishlist is empty</h2>
            <p className="text-xs text-stone-500 mb-6">
              Browse our bespoke denim, knitwear, and leather goods to add items to your wishlist.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Collection</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const price = item.product.variants?.[0]?.price ?? 150.00;
              const isAdded = addedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition"
                >
                  <div className="h-64 overflow-hidden relative bg-stone-100">
                    <img
                      src={
                        item.product.primary_media?.url ||
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={item.product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-stone-400 hover:text-rose-500 rounded-full shadow transition"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-stone-900 text-base mb-1">
                        <Link href={`/products/${item.product.slug}`} className="hover:underline">
                          {item.product.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-stone-500 mb-3">
                        {item.product.variants?.[0]?.title || 'Standard Edition'}
                      </p>
                      <p className="text-sm font-bold text-stone-900">${price.toFixed(2)}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex gap-3">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-900 hover:bg-stone-800 text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Move to Cart</span>
                          </>
                        )}
                      </button>
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
