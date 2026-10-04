'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface CategoryTile {
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  href: string;
  gridSpan: string;
}

const CATEGORIES: CategoryTile[] = [
  {
    title: 'Heavyweight Fleece & Hoodies',
    subtitle: '500gsm custom-milled French terry in architectural boxy cuts',
    badge: 'Core Foundation',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
    href: '/#catalog',
    gridSpan: 'md:col-span-8 md:row-span-2 min-h-[380px] md:min-h-[480px]',
  },
  {
    title: 'Minimalist Melton Outerwear',
    subtitle: 'Double-faced Japanese wool overshirts & storm coats',
    badge: 'Drop 01',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    href: '/#catalog',
    gridSpan: 'md:col-span-4 min-h-[280px] md:min-h-[230px]',
  },
  {
    title: 'Tailored Pleated Trousers',
    subtitle: 'Relaxed wide-leg silhouettes in drape-heavy wool',
    badge: 'New Season',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    href: '/#catalog',
    gridSpan: 'md:col-span-4 min-h-[280px] md:min-h-[230px]',
  },
  {
    title: '14oz Japanese Selvedge Denim',
    subtitle: 'Woven in Kojima on vintage Toyoda shuttle looms',
    badge: 'Artisan Denim',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    href: '/#catalog',
    gridSpan: 'md:col-span-6 min-h-[320px]',
  },
  {
    title: 'Pure Mongolian Cashmere',
    subtitle: '7-gauge featherlight knitwear with hand-finished ribs',
    badge: 'Heirloom Knit',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    href: '/#catalog',
    gridSpan: 'md:col-span-6 min-h-[320px]',
  },
];

export default function BentoCategoryGrid() {
  return (
    <section className="py-20 sm:py-28 bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Dimensions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              DISCOVER BY CATEGORY
            </h2>
          </div>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md leading-relaxed">
            Every garment begins with custom textile development. Explore our permanent silhouettes and limited seasonal drops.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {CATEGORIES.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`group relative rounded-3xl overflow-hidden border border-neutral-800/80 bg-neutral-900 flex flex-col justify-end p-6 sm:p-8 cursor-pointer ${item.gridSpan}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:via-black/25 transition-colors" />
              </div>

              {/* Top Badge */}
              <div className="absolute top-5 left-5 z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/50 backdrop-blur-md border border-white/20 text-white">
                  {item.badge}
                </span>
              </div>

              {/* Bottom Content & Floating CTA */}
              <div className="relative z-10 space-y-2 flex items-end justify-between gap-4">
                <div className="max-w-md">
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-300 font-normal leading-relaxed line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>

                <div className="shrink-0 w-11 h-11 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-xl group-hover:bg-indigo-400 group-hover:text-white transition-all transform group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
