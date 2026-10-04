'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  FolderTree,
  Boxes,
  Tag,
  Users,
  UserPlus,
  MessageSquare,
  ExternalLink,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  Server,
  Activity,
  Truck,
  CreditCard,
  BarChart3,
  RotateCcw,
  ShoppingCart,
  Mail,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Overview & Analytics',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Sales Report', href: '/sales', icon: BarChart3, badge: 'Insights', badgeColor: 'bg-indigo-500/20 text-indigo-400' },
    ],
  },
  {
    title: 'Customers',
    items: [
      { label: 'All Customers', href: '/customers', icon: Users, badge: 'CRM', badgeColor: 'bg-indigo-500/20 text-indigo-400' },
      { label: 'Add Customer', href: '/customers?action=new', icon: UserPlus },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Products', href: '/products', icon: Package },
      { label: 'Variant Matrix', href: '/products/new', icon: Layers, badge: 'New', badgeColor: 'bg-indigo-500/20 text-indigo-400' },
      { label: 'Categories', href: '/categories', icon: FolderTree },
      { label: 'Inventory', href: '/inventory', icon: Boxes, badge: 'Alerts', badgeColor: 'bg-amber-500/20 text-amber-400' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Orders', href: '/orders', icon: ShoppingBag, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-400' },
      { label: 'Return Orders', href: '/returns', icon: RotateCcw, badge: 'RMA', badgeColor: 'bg-purple-500/20 text-purple-400' },
      { label: 'Abandoned Carts', href: '/abandoned-carts', icon: ShoppingCart, badge: 'Recovery', badgeColor: 'bg-amber-500/20 text-amber-400' },
      { label: 'Shipping & Delivery', href: '/shipping', icon: Truck },
      { label: 'Payment Gateways', href: '/payments', icon: CreditCard },
    ],
  },
  {
    title: 'Marketing & Comms',
    items: [
      { label: 'Email Notifications', href: '/notifications', icon: Mail, badge: 'Templates', badgeColor: 'bg-indigo-500/20 text-indigo-400' },
      { label: 'Discounts', href: '/discounts', icon: Tag },
      { label: 'Reviews', href: '/reviews', icon: MessageSquare },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('admin_user');
      if (userStr) {
        try {
          setAdminUser(JSON.parse(userStr));
        } catch {
          // ignore
        }
      }
    }
  }, [pathname]);

  // If on login page, do not render sidebar
  if (pathname === '/login') {
    return null;
  }

  const handleLogout = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (token) {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch {
        // ignore network error on logout
      }
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/login');
  };

  const initials = adminUser?.name
    ? adminUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AD';

  const NavContent = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800/80 text-slate-700 dark:text-zinc-300 w-64 select-none transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 dark:border-zinc-800/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base leading-none">
                CARTIFY
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/30">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium">Merchant Studio</span>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5">
              {group.title}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isDashboard = item.href === '/dashboard';
              const basePath = item.href.split('?')[0];
              const isActionNew = item.href.includes('action=new');
              const isActive = isDashboard
                ? pathname === '/dashboard' || pathname === '/'
                : !isActionNew && pathname === basePath;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setMobileOpen(false);
                    if (isActionNew && typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('open-add-customer'));
                    }
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-semibold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info & User */}
      <div className="p-3 border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/60 space-y-2">
        {/* Switch to Storefront */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-zinc-900/60 hover:bg-slate-200/80 dark:hover:bg-zinc-900 border border-slate-200 dark:border-neutral-800/60 transition group"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span>Storefront (Port 3000)</span>
          </div>
          <ExternalLink className="w-3 h-3 text-slate-400 dark:text-neutral-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
        </a>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/60 dark:bg-zinc-900/40 border border-slate-200/80 dark:border-neutral-800/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow shrink-0">
              {initials}
            </div>
            <div className="text-left text-xs leading-tight min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[130px]">
                {adminUser?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate max-w-[130px]">
                {adminUser?.email || 'admin@admin.com'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 z-40 w-64">
        {NavContent}
      </aside>

      {/* Mobile Hamburger Trigger */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 shadow-xl"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Slide-in Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 h-full">
            {NavContent}
          </div>
        </div>
      )}
    </>
  );
}
