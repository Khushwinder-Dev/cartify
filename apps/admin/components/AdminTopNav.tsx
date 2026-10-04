'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Plus,
  ChevronRight,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminTopNav() {
  const pathname = usePathname();
  const [apiOnline, setApiOnline] = useState<boolean>(true);

  if (pathname === '/login') {
    return null;
  }

  // Format breadcrumbs from pathname
  const segments = pathname.split('/').filter(Boolean);
  const currentTitle = segments[0]
    ? segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
    : 'Dashboard';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800/80 px-6 flex items-center justify-between transition-colors duration-200">
      {/* Left: Breadcrumb / Section Header */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="text-slate-500 dark:text-zinc-400">Merchant Back-Office</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-600" />
        <span className="text-slate-900 dark:text-white font-bold">{currentTitle}</span>
        {segments[1] && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-600" />
            <span className="text-indigo-600 dark:text-indigo-400 capitalize">{segments[1]}</span>
          </>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* API Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] text-slate-600 dark:text-zinc-400 font-medium">
          <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-500 dark:bg-emerald-400 animate-pulse' : 'bg-amber-500 dark:bg-amber-400'}`} />
          <span>API 127.0.0.1:8000</span>
        </div>

        {/* Theme Toggle (Light / Dark / System) */}
        <ThemeToggle />

        {/* Create Matrix Quick Action */}
        <Link
          href="/products/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ New Matrix</span>
        </Link>
      </div>
    </header>
  );
}
