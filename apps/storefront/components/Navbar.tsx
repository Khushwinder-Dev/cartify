'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  LogOut,
  Sparkles,
  Menu,
  X,
  Package,
  Heart,
  ChevronDown
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { cart, openCart } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const navLinks = [
    { label: 'Shop All', href: '/#catalog' },
    { label: 'Outerwear', href: '/#catalog' },
    { label: 'Hoodies', href: '/#catalog' },
    { label: 'T-Shirts', href: '/#catalog' },
    { label: 'Denim & Pants', href: '/#catalog' },
    { label: 'Collections', href: '/collections' },
  ];

  return (
    <>
      {/* Top Promotional Ribbon */}
      <div className="bg-neutral-900 text-white text-[11px] font-medium py-2 px-4 text-center border-b border-neutral-800 flex items-center justify-center gap-2">
        <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
          Spring Drop
        </span>
        <span className="text-neutral-300">
          Complimentary shipping on orders over $75 • Use code <strong className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">CARTIFY10</strong> for 10% off
        </span>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-[#0b0c10]/90 backdrop-blur-md border-b border-neutral-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-400 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                C
              </div>
              <span className="font-extrabold tracking-tight text-xl text-white font-sans">
                CARTIFY
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-neutral-300">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800/60 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Track Orders Link */}
            <Link
              href="/orders"
              className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-2 py-1 transition"
            >
              <Package className="w-3.5 h-3.5 text-neutral-400" />
              <span>Track Order</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
            </Link>

            {/* Customer Authentication State */}
            {user ? (
              <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold text-neutral-200 hover:text-indigo-400 transition"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {userInitials}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 transition"
              >
                <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Cart Trigger */}
            <button
              id="cart-drawer-trigger"
              onClick={openCart}
              aria-label="Shopping Cart"
              className="relative p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {cart && cart.items_count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-neutral-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cart.items_count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-800 bg-[#0b0c10] px-4 py-4 space-y-3">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 transition"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 transition flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-indigo-400" />
                <span>Track Order</span>
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 transition flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-indigo-400" />
                <span>My Account</span>
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
