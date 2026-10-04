'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User as UserIcon,
  Package,
  MapPin,
  Clock,
  ChevronRight,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface OrderItem {
  id: number;
  order_number: string;
  created_at: string;
  grand_total: number;
  financial_status: string;
  fulfillment_status: string;
  items_count: number;
}

interface AddressItem {
  id: number;
  type: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

const mockOrders: OrderItem[] = [
  {
    id: 1,
    order_number: 'ORD-20261004-9841',
    created_at: '2026-10-04',
    grand_total: 280.00,
    financial_status: 'paid',
    fulfillment_status: 'unfulfilled',
    items_count: 2,
  },
  {
    id: 2,
    order_number: 'ORD-20260920-4102',
    created_at: '2026-09-20',
    grand_total: 140.00,
    financial_status: 'paid',
    fulfillment_status: 'fulfilled',
    items_count: 1,
  },
];

const mockAddresses: AddressItem[] = [
  {
    id: 1,
    type: 'shipping',
    address_line1: '450 Sutter St, Suite 1200',
    city: 'San Francisco',
    state: 'CA',
    postal_code: '94108',
    country: 'United States',
    is_default: true,
  },
];

export default function CustomerAccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [user, setUser] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 555 019 2831',
    memberSince: 'March 2026',
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight">
            ATELIER & CO.
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
          >
            ← Back to Store
          </Link>
        </div>
      </header>

      {/* Main Account Portal */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-stone-900">Customer Account</h1>
          <p className="text-sm text-stone-600 mt-1">
            Manage your verified purchase history, shipping addresses, and personal profile
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <aside className="space-y-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'orders'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Order History</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'addresses'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'profile'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
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
              <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
                <h2 className="text-lg font-serif font-bold text-stone-900">Your Orders</h2>

                <div className="divide-y divide-stone-100">
                  {mockOrders.map((ord) => (
                    <div key={ord.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono font-bold text-sm text-stone-900">{ord.order_number}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                              ord.fulfillment_status === 'fulfilled'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {ord.fulfillment_status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">Placed on {ord.created_at} • {ord.items_count} items</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-stone-900 text-base">${ord.grand_total.toFixed(2)}</span>
                        <Link
                          href={`/orders?id=${ord.order_number}`}
                          className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition flex items-center gap-1"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif font-bold text-stone-900">Saved Addresses</h2>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mockAddresses.map((addr) => (
                    <div key={addr.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2 relative">
                      {addr.is_default && (
                        <span className="inline-block px-2 py-0.5 rounded bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                          Default Shipping
                        </span>
                      )}
                      <p className="text-sm font-semibold text-stone-900">{addr.address_line1}</p>
                      <p className="text-xs text-stone-600">
                        {addr.city}, {addr.state} {addr.postal_code}
                      </p>
                      <p className="text-xs text-stone-500">{addr.country}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
                <h2 className="text-lg font-serif font-bold text-stone-900">Personal Information</h2>

                <div className="grid grid-cols-2 gap-4 max-w-lg text-xs">
                  <div>
                    <span className="block font-semibold uppercase tracking-wider text-stone-500 mb-1">Full Name</span>
                    <p className="text-sm font-semibold text-stone-900">{user.name}</p>
                  </div>
                  <div>
                    <span className="block font-semibold uppercase tracking-wider text-stone-500 mb-1">Email</span>
                    <p className="text-sm font-semibold text-stone-900">{user.email}</p>
                  </div>
                  <div className="mt-4">
                    <span className="block font-semibold uppercase tracking-wider text-stone-500 mb-1">Phone</span>
                    <p className="text-sm font-semibold text-stone-900">{user.phone}</p>
                  </div>
                  <div className="mt-4">
                    <span className="block font-semibold uppercase tracking-wider text-stone-500 mb-1">Customer Since</span>
                    <p className="text-sm font-semibold text-stone-900">{user.memberSince}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
