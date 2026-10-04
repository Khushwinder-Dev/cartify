'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  ExternalLink,
  ArrowRight,
  CheckCircle,
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
                <p className="text-xs font-bold text-white uppercase tracking-wider">Global Express</p>
                <p className="text-[11px] text-neutral-500">DHL Express door-to-door</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Pessimistic Locks</p>
                <p className="text-[11px] text-neutral-500">Atomic inventory reservations</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">30-Day Returns</p>
                <p className="text-[11px] text-neutral-500">Hassle-free global returns</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Idempotent Orders</p>
                <p className="text-[11px] text-neutral-500">Encrypted payment security</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                ATELIER &amp; CO.
              </span>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Artisanal engineered apparel, horology, and high-fidelity acoustics. Powered by a self-hosted Laravel 12 multi-guard REST API with MySQL 8 atomic row concurrency locks and dual Next.js App Router frontends.
            </p>

            <div className="pt-2">
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-950/40 border border-indigo-800/60 hover:bg-indigo-900/50 hover:border-indigo-600 transition"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Launch Merchant Admin Studio (:3001)</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Capsules</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/collections/minimalist-apparel" className="hover:text-white transition-colors">
                  Japanese Wool &amp; Apparel
                </Link>
              </li>
              <li>
                <Link href="/collections/timepieces-horology" className="hover:text-white transition-colors">
                  Titanium Horology
                </Link>
              </li>
              <li>
                <Link href="/collections/acoustics-audio" className="hover:text-white transition-colors">
                  High-Fidelity Acoustics
                </Link>
              </li>
              <li>
                <Link href="/collections/living-desks" className="hover:text-white transition-colors">
                  Architectural Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Client Care</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In / Register
                </Link>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">Fulfillment &amp; Customs (DDP)</span>
              </li>
            </ul>
          </div>

          {/* Private Release Newsletter Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Private Releases</h4>
            <p className="text-xs text-neutral-400 mb-3">
              Receive private drop invitations and seasonal preview lookbooks.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You are on the priority list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@atelier.test"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Request Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-16 pt-8 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 ATELIER &amp; CO. Self-Hosted Architecture. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-neutral-400">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>United States (USD $)</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span>Laravel 12+ &amp; Next.js 16</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
