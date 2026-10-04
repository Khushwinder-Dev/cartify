'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Package,
  MapPin,
  Clock,
  ChevronRight,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Plus,
  Loader2,
  LogIn,
  KeyRound,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getApiBase } from '@/lib/config';

interface OrderItem {
  id: number;
  order_number: string;
  created_at: string;
  grand_total: number;
  financial_status: string;
  fulfillment_status: string;
  items_count: number;
}

const mockAddresses = [
  {
    id: 1,
    type: 'shipping',
    address_line1: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    postal_code: '97477',
    country: 'United States',
    is_default: true,
  },
];

export default function CustomerAccountPage() {
  const router = useRouter();
  const { user, token, logout, login, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [demoLoggingIn, setDemoLoggingIn] = useState(false);

  // Fetch real customer orders if available
  useEffect(() => {
    async function loadCustomerOrders() {
      if (!token) return;
      setLoadingOrders(true);
      try {
        const API_BASE = getApiBase();
        const res = await fetch(`${API_BASE}/orders`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
          setOrders(items);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    }

    if (user && token) {
      loadCustomerOrders();
    }
  }, [user, token]);

  const handleQuickDemoLogin = async () => {
    setDemoLoggingIn(true);
    try {
      await login('customer@customer.com', 'password123');
    } catch (e) {
      console.error(e);
    } finally {
      setDemoLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 dark:bg-neutral-950 text-neutral-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="text-xs uppercase font-mono tracking-wider">Loading Customer Account...</span>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!user) {
    return (
      <div className="min-h-[80vh] bg-stone-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 text-neutral-900 dark:text-neutral-100">
        <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
            <UserIcon className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white">Sign In Required</h1>
            <p className="text-xs text-neutral-500 mt-2">
              Please authenticate to access your order history, verified saved addresses, and profile details.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/login"
              className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </Link>

            <button
              onClick={handleQuickDemoLogin}
              disabled={demoLoggingIn}
              className="w-full py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {demoLoggingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4 text-indigo-500" />
              )}
              <span>Instant Demo Login (customer@customer.com)</span>
            </button>
          </div>

          <p className="text-xs text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // 3. Authenticated State
  const memberDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '2026';

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-20">
      {/* Sub-Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white">Customer Account</h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Verified Client
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Signed in as <strong className="text-neutral-800 dark:text-neutral-200">{user.email}</strong> • Member since {memberDate}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Account Portal */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <aside className="space-y-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'orders'
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-md'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Orders</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'addresses'
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-md'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'profile'
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-md'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile Details</span>
            </button>
          </aside>

          {/* Tab Content */}
          <div className="md:col-span-3">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif font-bold text-neutral-900 dark:text-white">Purchase History</h2>
                  <Link
                    href="/"
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Continue Shopping →
                  </Link>
                </div>

                {loadingOrders ? (
                  <div className="py-12 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Package className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto" />
                    <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">No Orders Placed Yet</p>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      Explore our engineered collection and items ordered with this account will appear right here.
                    </p>
                    <Link
                      href="/"
                      className="inline-block px-4 py-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      Browse Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {orders.map((ord) => (
                      <div key={ord.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white">{ord.order_number}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                                ord.fulfillment_status === 'fulfilled'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                                  : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                              }`}
                            >
                              {ord.fulfillment_status}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500">Placed on {new Date(ord.created_at).toLocaleDateString()} • {ord.items_count || 1} items</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-bold text-neutral-900 dark:text-white text-base">${Number(ord.grand_total).toFixed(2)}</span>
                          <Link
                            href={`/orders?id=${ord.order_number}`}
                            className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex items-center gap-1"
                          >
                            <span>Track</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif font-bold text-neutral-900 dark:text-white">Shipping Addresses</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 relative space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                          Primary Delivery
                        </span>
                        {addr.is_default && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {addr.address_line1} <br />
                        {addr.city}, {addr.state} {addr.postal_code} <br />
                        {addr.country}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
                <h2 className="text-lg font-serif font-bold text-neutral-900 dark:text-white">Personal Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg text-xs">
                  <div>
                    <span className="block font-bold uppercase tracking-wider text-neutral-500 mb-1">Full Name</span>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{user.name}</p>
                  </div>
                  <div>
                    <span className="block font-bold uppercase tracking-wider text-neutral-500 mb-1">Email Address</span>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{user.email}</p>
                  </div>
                  <div>
                    <span className="block font-bold uppercase tracking-wider text-neutral-500 mb-1">Phone Number</span>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{user.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="block font-bold uppercase tracking-wider text-neutral-500 mb-1">Customer Since</span>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{memberDate}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-xs font-bold uppercase tracking-wider hover:bg-rose-100 transition"
                  >
                    Log Out of Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
