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

interface CustomerAddress {
  id: number;
  first_name: string;
  last_name: string;
  company?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
}

export default function CustomerAccountPage() {
  const router = useRouter();
  const { user, token, logout, login, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    first_name: '',
    last_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    phone: '',
    is_default: false,
  });
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

    async function loadCustomerAddresses() {
      if (!token) return;
      setLoadingAddresses(true);
      try {
        const API_BASE = getApiBase();
        const res = await fetch(`${API_BASE}/addresses`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setAddresses(Array.isArray(data.data) ? data.data : []);
        }
      } catch (err) {
        console.error('Error fetching addresses:', err);
      } finally {
        setLoadingAddresses(false);
      }
    }

    if (user && token) {
      loadCustomerOrders();
      loadCustomerAddresses();
    }
  }, [user, token]);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingAddress(true);
    try {
      const API_BASE = getApiBase();
      const res = await fetch(`${API_BASE}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses((prev) => {
          if (addressForm.is_default) {
            return [data.data, ...prev.map((a) => ({ ...a, is_default: false }))];
          }
          return [data.data, ...prev];
        });
        setShowAddAddressModal(false);
        setAddressForm({
          first_name: '',
          last_name: '',
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'India',
          phone: '',
          is_default: false,
        });
      }
    } catch (err) {
      console.error('Error creating address:', err);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    if (!token) return;
    try {
      const API_BASE = getApiBase();
      const res = await fetch(`${API_BASE}/addresses/${id}/default`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setAddresses((prev) =>
          prev.map((a) => ({ ...a, is_default: a.id === id }))
        );
      }
    } catch (err) {
      console.error('Error updating default address:', err);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!token) return;
    try {
      const API_BASE = getApiBase();
      const res = await fetch(`${API_BASE}/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

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
                  <div>
                    <h2 className="text-lg font-serif font-bold text-neutral-900 dark:text-white">Shipping Addresses</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Manage delivery addresses for faster checkout</p>
                  </div>
                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:opacity-90 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="py-12 flex justify-center items-center">
                    <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                    <MapPin className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">No saved addresses yet</p>
                    <p className="text-xs text-neutral-500 mt-1">Add your shipping details for seamless one-click checkout.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-5 rounded-2xl border transition relative space-y-3 ${
                          addr.is_default
                            ? 'border-indigo-500/50 bg-indigo-50/20 dark:bg-indigo-950/20'
                            : 'border-neutral-200 dark:border-neutral-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                            {addr.first_name} {addr.last_name}
                          </span>
                          {addr.is_default ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                              Default
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono">
                          {addr.address_line1} {addr.address_line2 ? `, ${addr.address_line2}` : ''}<br />
                          {addr.city}, {addr.state} {addr.postal_code}<br />
                          {addr.country} {addr.phone ? `• ${addr.phone}` : ''}
                        </p>
                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/60 flex justify-end">
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Address Modal */}
                {showAddAddressModal && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-neutral-950 dark:text-white">Add Delivery Address</h3>
                        <button
                          onClick={() => setShowAddAddressModal(false)}
                          className="p-1 rounded-full text-neutral-400 hover:text-neutral-950 dark:hover:text-white cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleCreateAddress} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-neutral-500 font-bold mb-1">First Name *</label>
                            <input
                              required
                              type="text"
                              value={addressForm.first_name}
                              onChange={(e) => setAddressForm({ ...addressForm, first_name: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g. Khushwinder"
                            />
                          </div>
                          <div>
                            <label className="block text-neutral-500 font-bold mb-1">Last Name *</label>
                            <input
                              required
                              type="text"
                              value={addressForm.last_name}
                              onChange={(e) => setAddressForm({ ...addressForm, last_name: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g. Singh"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-neutral-500 font-bold mb-1">Address Line 1 *</label>
                          <input
                            required
                            type="text"
                            value={addressForm.address_line1}
                            onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Flat/House No., Street, Area"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-neutral-500 font-bold mb-1">City *</label>
                            <input
                              required
                              type="text"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g. Noida"
                            />
                          </div>
                          <div>
                            <label className="block text-neutral-500 font-bold mb-1">State *</label>
                            <input
                              required
                              type="text"
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g. UP"
                            />
                          </div>
                          <div>
                            <label className="block text-neutral-500 font-bold mb-1">Postal Code *</label>
                            <input
                              required
                              type="text"
                              value={addressForm.postal_code}
                              onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g. 201301"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-neutral-500 font-bold mb-1">Country</label>
                            <input
                              type="text"
                              value={addressForm.country}
                              onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-neutral-500 font-bold mb-1">Phone</label>
                            <input
                              type="text"
                              value={addressForm.phone}
                              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="+91 98765 43210"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            id="is_default"
                            checked={addressForm.is_default}
                            onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                            className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="is_default" className="text-xs text-neutral-600 dark:text-neutral-400 font-medium cursor-pointer">
                            Set as default shipping address
                          </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-3">
                          <button
                            type="button"
                            onClick={() => setShowAddAddressModal(false)}
                            className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={savingAddress}
                            className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
                          >
                            {savingAddress ? 'Saving...' : 'Save Address'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
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
