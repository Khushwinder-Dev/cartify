'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Percent,
  DollarSign,
  AlertCircle,
  X,
  Copy,
  Check,
  Search
} from 'lucide-react';
import { Discount } from '@ecommerce/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

const mockDiscounts: Discount[] = [
  {
    id: 1,
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    min_subtotal: 50.00,
    usage_limit: 500,
    times_used: 124,
    is_active: true,
    expires_at: '2026-12-31',
    created_at: '2026-09-01',
  },
  {
    id: 2,
    code: 'VIP50OFF',
    type: 'fixed',
    value: 50,
    min_subtotal: 200.00,
    usage_limit: 50,
    times_used: 38,
    is_active: true,
    expires_at: '2026-10-31',
    created_at: '2026-10-01',
  },
  {
    id: 3,
    code: 'FLASHFALL',
    type: 'percentage',
    value: 20,
    min_subtotal: null,
    usage_limit: 100,
    times_used: 100,
    is_active: false,
    expires_at: '2026-10-03',
    created_at: '2026-09-25',
  },
];

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [newCode, setNewCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(15);
  const [minSubtotal, setMinSubtotal] = useState<string>('');
  const [usageLimit, setUsageLimit] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDiscounts = async () => {
      const token = localStorage.getItem('admin_token');
      try {
        const res = await fetch(`${API_BASE}/admin/discounts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.data)) {
            setDiscounts(data.data);
          }
        }
      } catch (e) {
        // Fallback to mock data
      }
    };
    fetchDiscounts();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('admin_token');

    const payload = {
      code: newCode.toUpperCase().trim(),
      type,
      value: Number(value),
      min_subtotal: minSubtotal ? Number(minSubtotal) : null,
      usage_limit: usageLimit ? Number(usageLimit) : null,
      expires_at: expiresAt || null,
      is_active: true,
    };

    try {
      const res = await fetch(`${API_BASE}/admin/discounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        setDiscounts([result.data, ...discounts]);
      } else {
        // Optimistic UI for local test
        const mockNew: Discount = {
          id: Date.now(),
          ...payload,
          times_used: 0,
        };
        setDiscounts([mockNew, ...discounts]);
      }

      setIsModalOpen(false);
      setNewCode('');
      setMinSubtotal('');
      setUsageLimit('');
      setExpiresAt('');
    } catch (err) {
      const mockNew: Discount = {
        id: Date.now(),
        ...payload,
        times_used: 0,
      };
      setDiscounts([mockNew, ...discounts]);
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    try {
      await fetch(`${API_BASE}/admin/discounts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (e) {}
    setDiscounts(discounts.filter((d) => d.id !== id));
  };

  const filteredDiscounts = discounts.filter((d) =>
    d.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20 transition-colors">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Tag className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>Discounts &amp; Promotions Engine</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
              Configure promotional codes, percentage discounts, minimum cart spend, and usage caps
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Discount</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-4 mb-6 shadow-xs dark:shadow-xl max-w-md transition-colors">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search coupon code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Discount Table */}
        <div className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl overflow-hidden shadow-xs dark:shadow-xl transition-colors">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950/80 text-slate-600 dark:text-neutral-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount Value</th>
                <th className="py-3.5 px-4">Threshold</th>
                <th className="py-3.5 px-4">Usage Limit</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/60 bg-white dark:bg-neutral-950/40">
              {filteredDiscounts.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 dark:hover:bg-neutral-900/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-sm bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 px-2.5 py-1 rounded-lg">
                        {d.code}
                      </span>
                      <button
                        onClick={() => handleCopy(d.code)}
                        className="text-slate-400 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        title="Copy code"
                      >
                        {copiedCode === d.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {d.type === 'percentage' ? `${d.value}% Off` : `$${Number(d.value).toFixed(2)} Off`}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-neutral-400">
                    {d.min_subtotal ? `Min $${Number(d.min_subtotal).toFixed(2)}` : 'None'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-neutral-300">
                    <span className="font-medium text-slate-900 dark:text-white">{d.times_used}</span>
                    <span className="text-slate-500 dark:text-neutral-500"> / {d.usage_limit ?? '∞'} used</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        d.is_active
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-neutral-700'
                      }`}
                    >
                      {d.is_active ? 'Active' : 'Expired / Limit Reached'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="p-1.5 rounded-lg text-slate-400 dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDiscounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-neutral-500">
                    No discount codes created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create Discount Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-900 dark:text-neutral-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Create Promotion Code</h2>

              <form onSubmit={handleCreateDiscount} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-slate-600 dark:text-neutral-400 mb-1.5">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FLASH20"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-slate-600 dark:text-neutral-400 mb-1.5">
                      Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-slate-600 dark:text-neutral-400 mb-1.5">
                      Value *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-slate-600 dark:text-neutral-400 mb-1.5">
                      Min Subtotal ($)
                    </label>
                    <input
                      type="number"
                      placeholder="Optional"
                      value={minSubtotal}
                      onChange={(e) => setMinSubtotal(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-slate-600 dark:text-neutral-400 mb-1.5">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      placeholder="Unlimited"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-slate-600 dark:text-neutral-400 mb-1.5">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Save Promotion Rule'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
