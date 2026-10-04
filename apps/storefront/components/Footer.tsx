'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  RotateCcw,
  CheckCircle,
  ShieldCheck,
  Lock,
  ArrowRight,
  Heart,
  Mail,
  MapPin,
  ExternalLink
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
    <footer className="bg-white text-neutral-600 border-t border-neutral-200 mt-auto">
      {/* Top Value Badges Ribbon */}
      <div className="border-b border-neutral-200 bg-neutral-50/80 py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Free Shipping</p>
                <p className="text-[11px] text-neutral-500">On all orders over $75</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">30-Day Returns</p>
                <p className="text-[11px] text-neutral-500">Prepaid return label included</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Premium Fabrics</p>
                <p className="text-[11px] text-neutral-500">100% pre-shrunk organic cotton</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Secure Checkout</p>
                <p className="text-[11px] text-neutral-500">256-bit encrypted payments</p>
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
              <div className="w-8 h-8 rounded-xl bg-neutral-950 flex items-center justify-center text-white font-black text-sm shadow-sm">
                C
              </div>
              <span className="font-extrabold tracking-tight text-xl text-neutral-950 font-sans">
                CARTIFY
              </span>
            </Link>

            <p className="text-xs text-neutral-600 leading-relaxed max-w-sm">
              Modern everyday apparel crafted with custom-milled heavyweight fleece, Japanese selvedge denim, and minimalist tailoring designed for longevity and comfort.
            </p>

            <div className="pt-2 text-xs text-neutral-500 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>450 Fashion Avenue, Suite 12, New York, NY 10018</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <a href="mailto:support@cartify.app" className="hover:text-neutral-900 transition">
                  support@cartify.app
                </a>
              </p>
            </div>
          </div>

          {/* Clothing / Shop Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-4">Clothing</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#catalog" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  All Clothing
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  Hoodies &amp; Sweats
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  Jackets &amp; Outerwear
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  T-Shirts &amp; Tops
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  Denim &amp; Trousers
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  Knitwear
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-4">Company &amp; Care</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="text-neutral-600 hover:text-neutral-950 transition-colors font-medium">
                  About Cartify
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-600 hover:text-neutral-950 transition-colors font-medium">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  Customer Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  Saved Items
                </Link>
              </li>
              <li>
                <Link href="/policy" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  Returns &amp; Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2">Join Cartify Club</h4>
            <p className="text-xs text-neutral-600 mb-3.5">
              Get 10% off your first clothing order and first access to new seasonal drops.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
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
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Strip with Legal Pages */}
        <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 Cartify Apparel Inc. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <Link href="/about" className="hover:text-neutral-900 transition">
              About
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-neutral-900 transition">
              Contact
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-neutral-900 transition">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/policy" className="hover:text-neutral-900 transition">
              Store Policies
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-neutral-900 transition">
              Privacy Policy
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-neutral-600 font-medium">USD ($)</span>
            <span>•</span>
            <a
              href="https://cartify-dashboard.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-900 transition text-[11px] inline-flex items-center gap-1"
            >
              <span>Merchant Admin</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
