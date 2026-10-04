'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  ChevronRight,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import { Customer } from '@ecommerce/types';

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Alexander Wright',
    email: 'alex.wright@example.com',
    role: 'customer',
    phone: '+1 503 555 0192',
    orders_count: 5,
    lifetime_spend: 1420.50,
    created_at: '2026-03-12',
    default_address: {
      type: 'shipping',
      address_lines: '742 Evergreen Terrace',
      city: 'Portland',
      state: 'OR',
      postal_code: '97201',
      country: 'United States',
    }
  },
  {
    id: 2,
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    role: 'customer',
    phone: '+1 206 555 4910',
    orders_count: 3,
    lifetime_spend: 640.00,
    created_at: '2026-05-18',
    default_address: {
      type: 'shipping',
      address_lines: '1240 Broadway Ave #4B',
      city: 'Seattle',
      state: 'WA',
      postal_code: '98102',
      country: 'United States',
    }
  },
  {
    id: 3,
    name: 'Marcus Vance',
    email: 'marcus.v@example.com',
    role: 'customer',
    phone: '+1 415 555 7783',
    orders_count: 8,
    lifetime_spend: 2890.00,
    created_at: '2026-01-20',
    default_address: {
      type: 'shipping',
      address_lines: '500 Market St',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94105',
      country: 'United States',
    }
  }
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem('admin_token');
      try {
        const res = await fetch(`${API_BASE}/admin/customers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.data) && data.data.length > 0) {
            setCustomers(data.data);
          }
        }
      } catch (e) {}
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Users className="w-6 h-6 text-indigo-400" />
              <span>Customer Relationship Management (CRM)</span>
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Buyer accounts, lifetime customer values (LTV), and transaction histories
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-4 mb-6 shadow-xl max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search customer by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Orders</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-neutral-900/50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block text-sm">{cust.name}</span>
                    <span className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> Member since {cust.created_at?.split('T')[0] || '2026-03'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-neutral-300 block">{cust.email}</span>
                    <span className="text-neutral-500 text-[11px]">{cust.phone || 'No phone recorded'}</span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400">
                    {cust.default_address
                      ? `${cust.default_address.city}, ${cust.default_address.state}`
                      : 'Not on file'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {cust.orders_count || 1} orders
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm">
                    ${Number(cust.lifetime_spend || 0).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold transition"
                    >
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Customer Dossier Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-neutral-100">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold text-white mb-1">{selectedCustomer.name}</h2>
              <p className="text-xs text-neutral-400 mb-6">{selectedCustomer.email}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-xs uppercase text-neutral-400 font-semibold block mb-1">Lifetime Value</span>
                  <span className="text-xl font-extrabold text-emerald-400">
                    ${Number(selectedCustomer.lifetime_spend || 0).toFixed(2)}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-xs uppercase text-neutral-400 font-semibold block mb-1">Total Orders</span>
                  <span className="text-xl font-extrabold text-white">
                    {selectedCustomer.orders_count || 1}
                  </span>
                </div>
              </div>

              {selectedCustomer.default_address && (
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1 mb-6">
                  <span className="font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                    Primary Address
                  </span>
                  <p className="text-white font-medium">{selectedCustomer.default_address.address_lines}</p>
                  <p className="text-neutral-400">
                    {selectedCustomer.default_address.city}, {selectedCustomer.default_address.state}{' '}
                    {selectedCustomer.default_address.postal_code}
                  </p>
                  <p className="text-neutral-500">{selectedCustomer.default_address.country}</p>
                </div>
              )}

              <div className="text-right">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
