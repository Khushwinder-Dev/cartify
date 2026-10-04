'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Compass
} from 'lucide-react';
import { Collection } from '@ecommerce/types';

const mockCollections: Collection[] = [
  {
    id: 1,
    name: 'Autumn / Winter Capsule',
    slug: 'autumn-winter-capsule',
    description: 'Heavyweight selvedge denim, loopback fleece, and structured outerwear designed for lower temperatures.',
    image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    products_count: 8,
  },
  {
    id: 2,
    name: 'Minimalist Essentials',
    slug: 'minimalist-essentials',
    description: 'Everyday staples cut from long-staple organic cotton and combed wool with tailored drape.',
    image_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    products_count: 14,
  },
  {
    id: 3,
    name: 'Tailored Shirting & Silks',
    slug: 'tailored-shirting',
    description: 'Camp collar silks and poplin button-downs tailored for contemporary elegance.',
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80',
    is_featured: false,
    products_count: 6,
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function CollectionsDirectoryPage() {
  const [collections, setCollections] = useState<Collection[]>(mockCollections);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
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
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-24">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-xl font-bold tracking-tight">
              ATELIER & CO.
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Categories</span>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Products</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-2">Curated Taxonomies</span>
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-3">Seasonal Collections</h1>
          <p className="text-sm text-stone-600">
            Explore meticulously tailored apparel and handcrafted accessories organized by style and material composition.
          </p>
        </div>

        <div className="space-y-12">
          {collections.map((col, idx) => (
            <div
              key={col.id}
              className={`flex flex-col ${
                idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
              } gap-8 items-center bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm p-6 lg:p-8`}
            >
              <div className="w-full md:w-1/2 h-80 lg:h-96 rounded-2xl overflow-hidden bg-stone-100 relative group">
                <img
                  src={col.image_url || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80'}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="w-full md:w-1/2 space-y-4 md:px-6">
                <span className="text-xs font-mono uppercase text-indigo-600 font-semibold tracking-wider block">
                  Collection 0{idx + 1}
                </span>
                <h2 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900">
                  {col.name}
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {col.description}
                </p>
                <div className="pt-4">
                  <Link
                    href={`/collections/${col.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition group shadow-md"
                  >
                    <span>Browse {col.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
