'use client';

import React from 'react';
import { Feather, Truck, RotateCcw, Leaf, Star, Quote } from 'lucide-react';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const TRUST_PILLARS = [
  {
    icon: Feather,
    title: 'Ethically Crafted Materials',
    description: 'Custom-milled 500gsm GOTS organic cotton and certified non-mulesed wool.',
  },
  {
    icon: Truck,
    title: 'Express Insured Delivery',
    description: 'Complimentary shipping over ₹999 with real-time tracking on every order.',
  },
  {
    icon: RotateCcw,
    title: 'Seamless 30-Day Returns',
    description: 'Effortless domestic returns and size exchanges with prepaid shipping labels.',
  },
  {
    icon: Leaf,
    title: 'Carbon-Neutral Fulfillment',
    description: '100% biodegradable garment polybags and recycled FSC-certified cartons.',
  },
];

const UGC_POSTS = [
  {
    handle: '@elena_nordic',
    location: 'Stockholm, SE',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    quote: 'The drape on the Japanese Melton Overshirt is unparalleled. Pure minimalist perfection.',
  },
  {
    handle: '@marcus_vance',
    location: 'Tokyo, JP',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    quote: 'Heavyweight French Terry that actually keeps its boxy structure after dozens of washes.',
  },
  {
    handle: '@claire_arch',
    location: 'Paris, FR',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    quote: 'Tailored trousers with the comfort of sweatpants. Essential for daily architecture studio wear.',
  },
  {
    handle: '@julian_craft',
    location: 'Berlin, DE',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    quote: 'The 14oz raw selvedge denim break-in process is addictive. Top tier craftsmanship.',
  },
];

export default function SocialProofSection() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800/80 shadow-xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-950 dark:text-white tracking-tight">
                  {pillar.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* UGC & Community Strip */}
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1.5">
                <InstagramIcon className="w-4 h-4" />
                <span>#CartifyStudio Community</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight">
                STYLED ACROSS THE GLOBE
              </h3>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition flex items-center gap-1"
            >
              <span>Follow @CartifyStudio</span>
              <span>→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {UGC_POSTS.map((post, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-end aspect-[3/4]"
              >
                <img
                  src={post.image}
                  alt={post.handle}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                <div className="relative z-10 p-5 space-y-2 text-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold">{post.handle}</span>
                    <span className="text-[10px] text-neutral-300 font-mono">{post.location}</span>
                  </div>
                  <p className="text-xs text-neutral-200 font-light leading-relaxed italic line-clamp-3">
                    &ldquo;{post.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-1 text-amber-400 pt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
