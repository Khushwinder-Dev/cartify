'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, X, ShoppingBag, Check, ArrowRight, Sparkles } from 'lucide-react';
import { LUXURY_CATALOG, LuxuryProduct } from '@/data/mock-clothing-catalog';
import { formatPrice } from '@/lib/currency';
import { useCart } from '@/context/CartContext';

interface Hotspot {
  id: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  product: LuxuryProduct;
  label: string;
}

const LOOK_HOTSPOTS: Hotspot[] = [
  {
    id: 'top',
    xPercent: 48,
    yPercent: 32,
    product: LUXURY_CATALOG[0], // Minimalist Japanese Wool Overshirt
    label: 'The Overshirt',
  },
  {
    id: 'bottom',
    xPercent: 54,
    yPercent: 68,
    product: LUXURY_CATALOG[2], // Relaxed Tailored Pleated Trouser
    label: 'The Pleated Trouser',
  },
];

export default function ShopTheLook() {
  const { addToCart } = useCart();
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(LOOK_HOTSPOTS[0]);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);

  const handleAddToCart = async (product: LuxuryProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setAddingId(product.id);
    try {
      await addToCart(product.id, 1);
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 2500);
    } catch (err) {
      console.error('Failed to add look item:', err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section id="lookbook" className="py-20 sm:py-28 bg-neutral-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-xl mb-12 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Editorial Lookbook</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white">
            SHOP THE LOOK
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Click on any hotspot pin to inspect textile composition and add items directly to your wardrobe bag.
          </p>
        </div>

        {/* Main Grid: Editorial Photo + Product Highlights Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Photo Canvas */}
          <div className="lg:col-span-8 relative aspect-[4/5] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-950">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85"
              alt="Editorial Cartify Outfit Styling"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* Hotspot Pins */}
            {LOOK_HOTSPOTS.map((hotspot) => {
              const isSelected = activeHotspot?.id === hotspot.id;
              return (
                <div
                  key={hotspot.id}
                  style={{ left: `${hotspot.xPercent}%`, top: `${hotspot.yPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => setActiveHotspot(isSelected ? null : hotspot)}
                    className="relative group cursor-pointer"
                    aria-label={`Inspect ${hotspot.label}`}
                  >
                    {/* Pulsing Aura */}
                    <span className="absolute -inset-2 rounded-full bg-indigo-500/50 animate-ping" />
                    {/* Pin Center */}
                    <span
                      className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-2xl transition-transform ${
                        isSelected
                          ? 'bg-indigo-600 text-white scale-125'
                          : 'bg-white text-neutral-950 hover:scale-110'
                      }`}
                    >
                      <Plus className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-45' : ''}`} />
                    </span>
                  </button>

                  {/* Desktop Hover / Click Bubble Tooltip */}
                  {isSelected && (
                    <div className="hidden sm:block absolute left-10 top-1/2 -translate-y-1/2 z-30 w-64 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-neutral-200 dark:border-neutral-700 animate-in fade-in zoom-in-95">
                      <div className="flex gap-3 items-center">
                        <img
                          src={hotspot.product.primary_image}
                          alt={hotspot.product.title}
                          className="w-14 h-16 object-cover rounded-xl shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-indigo-500 uppercase">
                            {hotspot.label}
                          </span>
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                            {hotspot.product.title}
                          </h4>
                          <p className="text-xs font-black text-neutral-950 dark:text-neutral-100 mt-1">
                            {formatPrice(hotspot.product.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Selected Item Card Panel */}
          <div className="lg:col-span-4 space-y-6">
            {activeHotspot ? (
              <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                    {activeHotspot.label}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    ★ {activeHotspot.product.rating} ({activeHotspot.product.reviews_count})
                  </span>
                </div>

                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900">
                  <img
                    src={activeHotspot.product.primary_image}
                    alt={activeHotspot.product.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-white tracking-tight">
                    {activeHotspot.product.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {activeHotspot.product.description}
                  </p>
                  <p className="text-xs font-mono text-neutral-300 pt-1">
                    Fabric: <span className="text-indigo-400">{activeHotspot.product.fabric}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <span className="text-xs text-neutral-400 block font-medium">Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-bold tabular-nums text-white">
                        {formatPrice(activeHotspot.product.price)}
                      </span>
                      {activeHotspot.product.compare_at_price && (
                        <span className="text-xs line-through tabular-nums text-neutral-500">
                          {formatPrice(activeHotspot.product.compare_at_price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(activeHotspot.product, e)}
                    disabled={addingId === activeHotspot.product.id}
                    className="px-6 py-3.5 rounded-2xl bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
                  >
                    {addingId === activeHotspot.product.id ? (
                      <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    ) : addedId === activeHotspot.product.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-neutral-800 rounded-3xl space-y-2 text-neutral-400">
                <p className="text-sm font-semibold text-white">Select a Hotspot Pin</p>
                <p className="text-xs">Tap either the overshirt or trouser pin on the image to inspect garment specifications.</p>
              </div>
            )}

            {/* Quick Switcher Between Styled Pieces */}
            <div className="flex items-center gap-3">
              {LOOK_HOTSPOTS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setActiveHotspot(h)}
                  className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition cursor-pointer text-center border ${
                    activeHotspot?.id === h.id
                      ? 'bg-neutral-800 border-indigo-500 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
