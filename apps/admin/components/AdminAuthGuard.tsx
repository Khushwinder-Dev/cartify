'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // If on /login, let it render directly without blocking
    if (pathname === '/login') {
      setAuthorized(true);
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('admin_user') : null;

    if (!token || !userStr) {
      router.replace('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.replace('/login');
        return;
      }
      setAuthorized(true);
    } catch {
      router.replace('/login');
    }
  }, [pathname, router]);

  // When on login page, always render children immediately
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Prevent flash of protected dashboard content before checking token
  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 flex flex-col items-center justify-center text-slate-500 dark:text-neutral-400 gap-3 transition-colors duration-200">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-500" />
        <span className="text-xs uppercase tracking-widest font-mono">Verifying Admin Credentials...</span>
      </div>
    );
  }

  return <>{children}</>;
}
