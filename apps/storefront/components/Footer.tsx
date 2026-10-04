'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  RotateCcw,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  Lock,
  Globe,
  Heart
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#08090c] text-neutral-400 border-t border-neutral-800/80 mt-auto">
      {/* Top Value Badges Ribbon */}
      <div className="border-b border-neutral-800/60 bg-neutral-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Free Shipping</p>
                <p className="text-[11px] text-neutral-500">On all orders over $75</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">30-Day Returns</p>
                <p className="text-[11px] text-neutral-500">Prepaid return label included</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Premium Fabrics</p>
                <p className="text-[11px] text-neutral-500">100% pre-shrunk organic cotton</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Secure Checkout</p>
                <p className="text-[11px] text-neutral-500">256-bit encrypted checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-600/20">
                C
              </div>
              <span className="font-extrabold tracking-tight text-xl text-white font-sans">
                CARTIFY
              </span>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Modern everyday apparel crafted with custom-milled heavyweight fleece, Japanese selvedge denim, and minimalist tailoring designed for longevity and comfort.
            </p>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Clothing</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#catalog" className="hover:text-white transition-colors">
                  All Clothing
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-white transition-colors">
                  Hoodies &amp; Sweats
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-white transition-colors">
                  Jackets &amp; Outerwear
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-white transition-colors">
                  T-Shirts &amp; Tops
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-white transition-colors">
                  Denim &amp; Trousers
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-white transition-colors">
                  Knitwear
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Customer Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Saved Items
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Join Cartify Club</h4>
            <p className="text-xs text-neutral-400 mb-3">
              Get 10% off your first clothing order and first access to new season drops.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You&apos;re subscribed! Use code CARTIFY10</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-8 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 Cartify Apparel Inc. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="text-neutral-400">United States (USD $)</span>
            <span>•</span>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-300 transition text-[11px]"
            >
              Merchant Back-Office ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
