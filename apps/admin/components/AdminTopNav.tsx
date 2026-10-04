'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Plus,
  Bell,
  Server,
  Layers,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

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
    <header className="sticky top-0 z-30 h-16 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 px-6 flex items-center justify-between">
      {/* Left: Breadcrumb / Section Header */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="text-neutral-500">Merchant Back-Office</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
        <span className="text-white font-bold">{currentTitle}</span>
        {segments[1] && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-indigo-400 capitalize">{segments[1]}</span>
          </>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* API Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 font-medium">
          <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>API 127.0.0.1:8000</span>
        </div>

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
