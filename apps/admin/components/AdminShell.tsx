'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopNav from '@/components/AdminTopNav';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return (
      <main className="min-h-screen w-full bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col transition-colors duration-200">
        {children}
      </main>
    );
  }

  return (
    <>
      <AdminSidebar />
      <div className="md:pl-64 flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-200">
        <AdminTopNav />
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
