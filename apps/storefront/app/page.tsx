'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  Flame,
  Filter,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';
import BentoCategoryGrid from '@/components/BentoCategoryGrid';
import ProductCard from '@/components/ProductCard';
import ShopTheLook from '@/components/ShopTheLook';
import SocialProofSection from '@/components/SocialProofSection';
import QuickViewModal from '@/components/QuickViewModal';
import { LUXURY_CATALOG, LuxuryProduct } from '@/data/mock-clothing-catalog';
import { Product } from '@/lib/types';

// Convert mock luxury product to full Product structure for QuickViewModal
function convertLuxuryToProduct(lp: LuxuryProduct): Product {
  return {
    id: lp.id,
    title: lp.title,
    slug: lp.slug,
    description: lp.description,
    vendor: 'Cartify Atelier',
    product_type: lp.product_type,
    min_price: lp.price,
    max_price: lp.price,
    is_available: true,
    primary_media: {
      id: 1,
      product_id: lp.id,
      url: lp.primary_image,
      position: 0,
      is_primary: true
    } as any,
    media: [
      { id: 1, product_id: lp.id, url: lp.primary_image, position: 0, is_primary: true },
      { id: 2, product_id: lp.id, url: lp.secondary_image, position: 1, is_primary: false },
      ...lp.colors.map((c, i) => ({
        id: 10 + i,
        product_id: lp.id,
        url: c.image,
        position: i + 2,
        is_primary: false
      }))
    ] as any,
    options: [
      {
        id: 1,
        product_id: lp.id,
        name: 'Size',
        position: 1,
        values: lp.sizes.map((s, idx) => ({
          id: idx + 1,
          product_option_id: 1,
          value: s,
          position: idx
        })) as any
      },
      {
        id: 2,
        product_id: lp.id,
        name: 'Color',
        position: 2,
        values: lp.colors.map((c, idx) => ({
          id: 20 + idx,
          product_option_id: 2,
          value: c.name,
          position: idx
        })) as any
      }
    ] as any,
    variants: lp.sizes.flatMap((s, sIdx) =>
      lp.colors.map((c, cIdx) => ({
        id: lp.id * 100 + sIdx * 10 + cIdx,
        product_id: lp.id,
        sku: `${lp.slug.toUpperCase()}-${s}-${c.name.slice(0, 3).toUpperCase()}`,
        price: lp.price,
        compare_at_price: lp.compare_at_price || null,
        is_available: true,
        inventory_quantity: 24,
        title: `${s} / ${c.name}`,
        option_values: [
          { id: sIdx + 1, option_id: 1, value: s },
          { id: 20 + cIdx, option_id: 2, value: c.name }
        ],
        media: [{ id: 10 + cIdx, url: c.image, position: 0 }]
      }))
    ) as any
  } as unknown as Product;
}

export default function LuxuryStorefrontHomePage() {
  const [activeTab, setActiveTab] = useState<'new' | 'trending' | 'essentials'>('trending');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Filter products by tab
  const getFilteredProducts = () => {
    let list = LUXURY_CATALOG;

    if (activeTab === 'new') {
      list = list.filter((p) => p.badge === 'New Arrival' || p.badge === 'Limited Drop');
    } else if (activeTab === 'trending') {
      list = list.filter((p) => p.badge === 'Best Seller' || p.badge === 'Low Stock' || p.badge === 'Curated');
    } else if (activeTab === 'essentials') {
      list = list.filter(
        (p) =>
          p.product_type === 'Tops' ||
          p.product_type === 'Bottoms' ||
          p.product_type === 'Knitwear'
      );
    }

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.product_type === selectedCategory);
    }

    return list;
  };

  const handleOpenQuickView = (lp: LuxuryProduct) => {
    setQuickViewProduct(convertLuxuryToProduct(lp));
    setIsQuickViewOpen(true);
  };

  const filteredItems = getFilteredProducts();

  const categories = ['All', 'Tops', 'Outerwear', 'Bottoms', 'Knitwear', 'Accessories'];

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-950 selection:text-white">
      {/* 1. Full-Bleed Editorial Hero Carousel */}
      <HeroCarousel />

      {/* 2. Curated Bento Category Grid */}
      <BentoCategoryGrid />

      {/* 3. Dynamic Product Showcase ("Trending Drops", "New Arrivals", "Essentials") */}
      <section id="catalog" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-neutral-500 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight font-serif">
              Seasonal Releases &amp; Drops
            </h2>
            <p className="text-sm text-neutral-500 mt-1 max-w-xl">
              Precision-cut tailoring, high-density cotton fleece, and Japanese selvedge denim built to withstand daily rotation.
            </p>
          </div>

          {/* Luxury Tabbed Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200/80 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'trending'
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Trending Drops</span>
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'new'
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Arrivals</span>
            </button>

            <button
              onClick={() => setActiveTab('essentials')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'essentials'
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Essentials</span>
            </button>
          </div>
        </div>

        {/* Sub-Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-xs text-neutral-400 ml-auto hidden sm:block">
            Showing {filteredItems.length} curated pieces
          </span>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={handleOpenQuickView}
            />
          ))}
        </div>

        {/* Bottom Banner inside Catalog */}
        <div className="mt-14 p-8 rounded-3xl bg-neutral-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-1 text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
              Limited Archive Release
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Looking for custom sizing or bespoke atelier fabrics?
            </h3>
            <p className="text-xs text-neutral-400 max-w-xl">
              Our tailoring team offers complimentary sleeve adjustments, inseam hemming, and private fitting consultations.
            </p>
          </div>
          <Link
            href="/contact"
            className="relative z-10 px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition shrink-0 cursor-pointer shadow"
          >
            Consult Atelier
          </Link>
        </div>
      </section>

      {/* 4. Interactive Lookbook / "Shop The Look" */}
      <ShopTheLook />

      {/* 5. Value Proposition & Social Proof Strip */}
      <SocialProofSection />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}
