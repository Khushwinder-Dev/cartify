'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ShieldCheck, Compass, Sparkles, Search, PackageCheck, Zap, User as UserIcon, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { cart, openCart } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'CU';

  return (
    <>
      {/* Top Promotional Ribbon */}
      <div className="bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 text-white text-[11px] font-semibold py-1.5 px-4 text-center border-b border-indigo-900/30 flex items-center justify-center space-x-2">
        <span className="flex items-center gap-1 text-amber-400">
          <Zap className="w-3 h-3 fill-current" />
          <span>SS/26 CAPSULE EVENT:</span>
        </span>
        <span className="text-neutral-300">
          Free Worldwide Express Delivery on Orders $100+ • Use Code <strong className="text-white bg-indigo-500/30 px-1.5 py-0.5 rounded font-mono">WELCOME10</strong> for 10% Off
        </span>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-neutral-950/85 border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black tracking-tight text-lg text-neutral-950 dark:text-white block leading-none">
                  ATELIER
                </span>
                <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-bold">
                  Self-Hosted Architecture
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center space-x-1 text-xs font-bold uppercase tracking-wider">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                  pathname === '/'
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                <span>Storefront</span>
              </Link>

              <Link
                href="/collections"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                  pathname.startsWith('/collections')
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span>Collections</span>
              </Link>

              <Link
                href="/wishlist"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                  pathname.startsWith('/wishlist')
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span>Wishlist</span>
              </Link>

              <Link
                href="/orders"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                  pathname.startsWith('/orders')
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Track Order</span>
              </Link>

              <Link
                href="/account"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                  pathname.startsWith('/account')
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span>Account</span>
              </Link>
            </nav>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Customer Authentication State */}
            {user ? (
              <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1">
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {userInitials}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  className="p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 transition"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Admin Back-Office Switch */}
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              title="Open Isolated Admin Back-Office (Port 3001)"
              className="hidden lg:flex px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide items-center space-x-1.5 border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Admin Studio</span>
              <span className="text-[10px] bg-indigo-200/60 dark:bg-indigo-800/60 px-1 py-0.2 rounded font-mono">↗</span>
            </a>

            {/* Cart Trigger */}
            <button
              id="cart-drawer-trigger"
              onClick={openCart}
              aria-label="Shopping Cart"
              className="relative p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center text-neutral-800 dark:text-neutral-200"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart && cart.items_count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cart.items_count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
