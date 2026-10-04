'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Mail,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('success');
    setEmail('');
  };

  return (
    <footer className="bg-white dark:bg-zinc-950 text-neutral-900 dark:text-zinc-100 border-t border-neutral-200 dark:border-zinc-800 mt-auto transition-colors duration-200">
      {/* 1. VIP Newsletter Strip with Editorial Split */}
      <div className="border-b border-neutral-200 dark:border-zinc-800 bg-neutral-50/60 dark:bg-zinc-900/60 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500 dark:text-zinc-400">
                <Sparkles className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />
                Private Atelier Access
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-serif">
                Join the Cartify Circle.
              </h3>
              <p className="text-sm text-neutral-600 dark:text-zinc-400 max-w-md">
                Subscribe for private seasonal drop alerts, archive releases, and complimentary concierge styling.
              </p>
            </div>

            <div className="lg:col-span-6">
              {status === 'success' ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Welcome to the inner circle.</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">Use invitation code <span className="font-mono font-bold tracking-wider">CARTIFY15</span> for 15% off your first order.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-zinc-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === 'error') setStatus('idle');
                        }}
                        placeholder="Enter your personal email"
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-neutral-300 dark:border-zinc-700 rounded-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white focus:border-transparent transition shadow-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-zinc-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
                    >
                      <span>Join Atelier</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {status === 'error' && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Please enter a valid email address.</p>
                  )}
                  <p className="text-[11px] text-neutral-500 dark:text-zinc-400">
                    By submitting your email, you agree to receive communications from Cartify. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Sockets (4 Columns + Brand Description) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-black text-sm tracking-tight">
                C
              </span>
              <span className="font-extrabold text-xl tracking-[0.2em] text-neutral-950 dark:text-white">
                CARTIFY
              </span>
            </Link>
            <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed max-w-xs">
              Architectural silhouettes, French terry knitwear, and Japanese selvedge denim crafted with uncompromising material precision.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-[10px] font-semibold tracking-wider text-neutral-700 dark:text-zinc-300 uppercase">
                <Globe className="w-3 h-3 text-neutral-500 dark:text-zinc-400" />
                Shipping Worldwide
              </span>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-950 dark:text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-zinc-400">
              <li>
                <Link href="/#catalog" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  French Terry Hoodies
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  Tailored Trousers
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  Wool &amp; Cashmere Outerwear
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  Heavyweight Tees
                </Link>
              </li>
              <li>
                <Link href="/#lookbook" className="hover:text-neutral-950 dark:hover:text-white transition-colors font-medium text-neutral-900 dark:text-zinc-200 flex items-center gap-1">
                  <span>Editorial Lookbook</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Client Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-950 dark:text-white mb-4">
              Client Services
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-zinc-400">
              <li>
                <Link href="/orders" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link href="/policy" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  Concierge &amp; Sizing
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  Member Portal
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <a href="mailto:concierge@cartify.app" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  concierge@cartify.app
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-950 dark:text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  Our Atelier Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  Flagship Showrooms
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="https://cartify-dashboard.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors inline-flex items-center gap-1 font-medium"
                >
                  <span>Merchant Admin</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Sustainability & Fabrics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-950 dark:text-white mb-4">
              Sustainability &amp; Craft
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-zinc-400">
              <li>
                <span className="text-neutral-800 dark:text-zinc-200 font-medium block">460 GSM French Terry</span>
                <span className="text-[11px] text-neutral-500 dark:text-zinc-500">Custom milled in Portugal</span>
              </li>
              <li>
                <span className="text-neutral-800 dark:text-zinc-200 font-medium block">Japanese Kurabo Denim</span>
                <span className="text-[11px] text-neutral-500 dark:text-zinc-500">14.5oz shuttle-loom selvedge</span>
              </li>
              <li>
                <span className="text-neutral-800 dark:text-zinc-200 font-medium block">GOTS Certified Organic</span>
                <span className="text-[11px] text-neutral-500 dark:text-zinc-500">Zero synthetic chemical wash</span>
              </li>
              <li>
                <span className="text-neutral-800 dark:text-zinc-200 font-medium block">Carbon Neutral Shipping</span>
                <span className="text-[11px] text-neutral-500 dark:text-zinc-500">100% offset fulfillment</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Payment Badges & Trust Strip */}
        <div className="mt-14 pt-8 border-t border-neutral-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 mr-2">
              Guaranteed Checkout
            </span>
            {/* Minimalist Monochrome Badges */}
            <span className="px-2.5 py-1 rounded border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900 text-[10px] font-semibold text-neutral-700 dark:text-zinc-300 tracking-wider uppercase">
              Apple Pay
            </span>
            <span className="px-2.5 py-1 rounded border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900 text-[10px] font-semibold text-neutral-700 dark:text-zinc-300 tracking-wider uppercase">
              Google Pay
            </span>
            <span className="px-2.5 py-1 rounded border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900 text-[10px] font-semibold text-neutral-700 dark:text-zinc-300 tracking-wider uppercase">
              Visa
            </span>
            <span className="px-2.5 py-1 rounded border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900 text-[10px] font-semibold text-neutral-700 dark:text-zinc-300 tracking-wider uppercase">
              Mastercard
            </span>
            <span className="px-2.5 py-1 rounded border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900 text-[10px] font-semibold text-neutral-700 dark:text-zinc-300 tracking-wider uppercase">
              UPI / RuPay
            </span>
            <span className="px-2.5 py-1 rounded border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900 text-[10px] font-semibold text-neutral-700 dark:text-zinc-300 tracking-wider uppercase">
              Klarna
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              256-bit SSL Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-zinc-300">
              <RotateCcw className="w-4 h-4 text-neutral-600 dark:text-zinc-400" />
              30-Day Complimentary Returns
            </span>
          </div>
        </div>

        {/* 4. Copyright & Discreet Legal Links */}
        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} Cartify Atelier Inc. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <Link href="/about" className="hover:text-neutral-900 dark:hover:text-white transition">About</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-neutral-900 dark:hover:text-white transition">Contact</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white transition">Terms</Link>
            <span>•</span>
            <Link href="/policy" className="hover:text-neutral-900 dark:hover:text-white transition">Policies</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition">Privacy</Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-neutral-700 dark:text-zinc-300 font-medium">India (INR ₹)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
