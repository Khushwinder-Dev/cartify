'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, Activity, Server, Lock, Layers } from 'lucide-react';

export default function AdminHeader() {
  const [apiOnline, setApiOnline] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/health')
      .then((res) => {
        if (res.ok) setApiOnline(true);
      })
      .catch(() => setApiOnline(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-neutral-900/95 text-white border-b border-neutral-800 shadow-lg">
      {/* Top Security & Isolation Status Bar */}
      <div className="bg-gradient-to-r from-neutral-950 via-indigo-950 to-neutral-950 px-4 py-1.5 text-[11px] font-semibold text-neutral-300 border-b border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            ISOLATED BACK-OFFICE (PORT 3001)
          </span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-400 hidden sm:inline">
            Zero-impact maintenance architecture: Storefront runs safely on Port 3000
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1 text-[11px] text-neutral-400">
            <Server className="w-3 h-3 text-indigo-400" />
            Backend API: <strong className={apiOnline ? 'text-emerald-400' : 'text-amber-400'}>{apiOnline ? '127.0.0.1:8000 (Connected)' : 'Checking...'}</strong>
          </span>
          <span className="text-neutral-600">|</span>
          <span className="flex items-center gap-1 text-[11px] text-neutral-300">
            <Lock className="w-3 h-3 text-amber-400" />
            Sanctum Auth Active
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight text-lg text-white">
                ATELIER
              </span>
              <span className="text-[10px] font-black tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                ADMIN STUDIO
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Enterprise Self-Hosted Architecture
            </p>
          </div>

          <nav className="hidden xl:flex items-center space-x-1 pl-4 text-xs font-semibold text-neutral-400">
            <Link href="/dashboard" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800 transition">
              Dashboard
            </Link>
            <Link href="/products" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800 transition">
              Products
            </Link>
            <Link href="/products/new" className="px-2.5 py-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-neutral-800 transition">
              + Matrix
            </Link>
            <Link href="/categories" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800 transition">
              Categories
            </Link>
            <Link href="/inventory" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800 transition">
              Inventory
            </Link>
            <Link href="/orders" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800 transition">
              Orders
            </Link>
            <Link href="/discounts" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800 transition">
              Discounts
            </Link>
            <Link href="/customers" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800 transition">
              Customers
            </Link>
            <Link href="/reviews" className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800 transition">
              Reviews
            </Link>
          </nav>
        </div>

        {/* Right Action: External link to customer storefront */}
        <div className="flex items-center space-x-3">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors shadow-sm group"
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Open Customer Storefront (Port 3000)</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
          </a>

          <div className="hidden sm:flex items-center space-x-2 pl-3 border-l border-neutral-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-neutral-950 font-bold text-xs flex items-center justify-center shadow">
              AD
            </div>
            <div className="text-left text-xs leading-tight">
              <div className="font-semibold text-neutral-200">Admin Staff</div>
              <div className="text-[10px] text-neutral-400">Owner Role</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
