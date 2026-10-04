'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { cart, openCart } = useCart();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-lg text-neutral-900 dark:text-white block leading-none">
                ATELIER
              </span>
              <span className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold">
                Shopify Headless LTS
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                !isAdmin
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Storefront</span>
            </Link>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Admin Switch */}
          <Link
            href={isAdmin ? '/' : '/admin'}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide flex items-center space-x-1.5 border transition-all ${
              isAdmin
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-sm'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{isAdmin ? 'Back to Store' : 'Admin Portal'}</span>
          </Link>

          {/* Cart Trigger */}
          <button
            id="cart-drawer-trigger"
            onClick={openCart}
            aria-label="Shopping Cart"
            className="relative p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center text-neutral-800 dark:text-neutral-200"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart && cart.items_count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50">
                {cart.items_count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
