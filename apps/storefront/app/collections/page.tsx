'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Compass,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { Collection } from '@ecommerce/types';

const defaultCollections: Collection[] = [
  {
    id: 1,
    name: 'Japanese Wool & Tailored Apparel',
    slug: 'minimalist-apparel',
    description: 'Heavyweight melton wool overshirts, 16oz Japanese selvedge denim, and structured outerwear designed for versatile layering and architectural drape.',
    image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    products_count: 8,
  },
  {
    id: 2,
    name: 'Aerospace Grade 5 Horology',
    slug: 'timepieces-horology',
    description: 'Bespoke chronographs forged from grade 5 titanium, anti-reflective double-domed sapphire crystals, and Japanese mechanical movements.',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    products_count: 5,
  },
  {
    id: 3,
    name: 'High-Fidelity Acoustics & Studio',
    slug: 'acoustics-audio',
    description: 'Acoustic masterworks engineered with hand-finished walnut enclosures, beryllium balanced armatures, and studio monitor precision.',
    image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=85',
    is_featured: true,
    products_count: 4,
  },
  {
    id: 4,
    name: 'Architectural Workspace & Living',
    slug: 'living-desks',
    description: 'Solid American walnut surfaces with chamfered edge geometry, dual-motor whisper-quiet synchronization, and brass task accents.',
    image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85',
    is_featured: false,
    products_count: 6,
  },
];

export default function CollectionsDirectoryPage() {
  const [collections, setCollections] = useState<Collection[]>(defaultCollections);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || `http://${host}:8000/api/v1`;
        const res = await fetch(`${API_BASE}/collections`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.data) && data.data.length > 0) {
            setCollections(data.data);
          }
        }
      } catch (e) {}
    };
    fetchCollections();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f4f4f6] pb-24 selection:bg-indigo-600 selection:text-white">
      {/* Editorial Header */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-neutral-800/80 bg-neutral-950/40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-neutral-400">
            <Link href="/" className="hover:text-white transition-colors">
              Storefront
            </Link>
            <span>/</span>
            <span className="text-white">Collections</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-2">
              Curated Taxonomy
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-black text-white tracking-tight">
              Four Core Design Dimensions
            </h1>
            <p className="mt-3 text-sm text-neutral-400 leading-relaxed max-w-2xl">
              Explore meticulously tailored apparel, aerospace horology, acoustic monitors, and living workspace objects organized by material integrity and functional purpose.
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-10">
          {collections.map((col, idx) => (
            <div
              key={col.id}
              className={`flex flex-col ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } gap-8 items-center bg-neutral-900/60 rounded-3xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all duration-300 shadow-xl p-6 lg:p-8 group glass-panel`}
            >
              {/* Media Container */}
              <div className="w-full lg:w-1/2 h-80 lg:h-[420px] rounded-2xl overflow-hidden bg-neutral-950 relative">
                <img
                  src={col.image_url || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85'}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                  Capsule 0{idx + 1}
                </span>
              </div>

              {/* Text Description */}
              <div className="w-full lg:w-1/2 space-y-4 lg:px-6">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                    Curated Series
                  </span>
                  {col.products_count && (
                    <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded-full border border-neutral-700">
                      {col.products_count} Artifacts
                    </span>
                  )}
                </div>

                <h2 className="text-2xl lg:text-3xl font-serif font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {col.name}
                </h2>

                <p className="text-sm text-neutral-400 leading-relaxed">
                  {col.description}
                </p>

                <div className="pt-4 flex items-center gap-4">
                  <Link
                    href={`/collections/${col.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-neutral-200 text-neutral-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-white/5 cursor-pointer"
                  >
                    <span>Browse Capsule</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/#catalog"
                    className="text-xs text-neutral-400 hover:text-white transition font-semibold"
                  >
                    View All in Store →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
