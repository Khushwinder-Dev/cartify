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
      <main className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col">
        {children}
      </main>
    );
  }

  return (
    <>
      <AdminSidebar />
      <div className="md:pl-64 flex flex-col min-h-screen bg-neutral-950">
        <AdminTopNav />
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
