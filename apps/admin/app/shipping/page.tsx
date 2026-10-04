'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Clock,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  X,
  ExternalLink
} from 'lucide-react';

interface ShippingMethod {
  id: number;
  name: string;
  code: string;
  description: string | null;
  cost: number | string;
  free_threshold: number | string | null;
  estimated_days: string | null;
  carrier: string | null;
  is_active: boolean;
  position: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function ShippingManagementPage() {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [deletingMethod, setDeletingMethod] = useState<ShippingMethod | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    carrier: '',
    cost: '5.00',
    free_threshold: '',
    estimated_days: '3-5 Business Days',
    description: '',
    is_active: true,
  });

  const fetchShippingMethods = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      const res = await fetch(`${API_BASE}/admin/shipping`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        const json = await res.json();
        setMethods(json.data || []);
      } else {
        throw new Error('Failed to load shipping methods');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error fetching shipping methods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const handleOpenAdd = () => {
    setEditingMethod(null);
    setFormData({
      name: '',
      code: '',
      carrier: 'FedEx Ground',
      cost: '5.00',
      free_threshold: '75.00',
      estimated_days: '3-5 Business Days',
      description: 'Standard ground delivery to residential or commercial addresses.',
      is_active: true,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (m: ShippingMethod) => {
    setEditingMethod(m);
    setFormData({
      name: m.name,
      code: m.code,
      carrier: m.carrier || '',
      cost: String(m.cost),
      free_threshold: m.free_threshold ? String(m.free_threshold) : '',
      estimated_days: m.estimated_days || '',
      description: m.description || '',
      is_active: m.is_active,
    });
    setIsAddModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    setErrorMsg(null);
    const token = localStorage.getItem('admin_token');

    const payload = {
      name: formData.name,
      code: formData.code || undefined,
      carrier: formData.carrier || null,
      cost: parseFloat(formData.cost) || 0,
      free_threshold: formData.free_threshold ? parseFloat(formData.free_threshold) : null,
      estimated_days: formData.estimated_days || null,
      description: formData.description || null,
      is_active: formData.is_active,
    };

    try {
      const url = editingMethod
        ? `${API_BASE}/admin/shipping/${editingMethod.id}`
        : `${API_BASE}/admin/shipping`;
      const method = editingMethod ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.message || 'Operation failed');
      }

      setSuccessMsg(editingMethod ? 'Shipping method updated' : 'Shipping method created');
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsAddModalOpen(false);
      fetchShippingMethods();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save shipping method');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_BASE}/admin/shipping/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        setMethods((prev) =>
          prev.map((m) => (m.id === id ? { ...m, is_active: !m.is_active } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deletingMethod) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_BASE}/admin/shipping/${deletingMethod.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        setMethods((prev) => prev.filter((m) => m.id !== deletingMethod.id));
        setDeletingMethod(null);
        setSuccessMsg('Shipping method deleted');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Delete failed');
    }
  };

  const filteredMethods = methods.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.carrier && m.carrier.toLowerCase().includes(search.toLowerCase())) ||
    m.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20 transition-colors">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Truck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Shipping & Fulfillment</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
              Configure shipping zones, flat rates, free shipping order thresholds, and carriers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchShippingMethods}
              className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white shadow-xs transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Shipping Method</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fade-in shadow-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center gap-2 animate-fade-in shadow-xs">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-5 shadow-xs dark:shadow-lg transition-colors">
            <div className="text-slate-500 dark:text-neutral-500 text-xs font-semibold uppercase tracking-wider">Active Methods</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {methods.filter((m) => m.is_active).length} <span className="text-sm font-normal text-slate-400 dark:text-neutral-400">/ {methods.length} Total</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2">Available for checkout selection</p>
          </div>
          <div className="bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-5 shadow-xs dark:shadow-lg transition-colors">
            <div className="text-slate-500 dark:text-neutral-500 text-xs font-semibold uppercase tracking-wider">Primary Carriers</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">FedEx, DHL, UPS</div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2">Domestic & International coverage</p>
          </div>
          <div className="bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-5 shadow-xs dark:shadow-lg transition-colors">
            <div className="text-slate-500 dark:text-neutral-500 text-xs font-semibold uppercase tracking-wider">Free Delivery Tier</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">Over $75.00</div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2">Applies automatically at checkout</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-xs dark:shadow-xl transition-colors">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search methods, carriers, or service codes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Shipping Methods Table */}
        <div className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl overflow-hidden shadow-xs dark:shadow-xl transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-neutral-950/80 text-slate-600 dark:text-neutral-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-neutral-800">
                <tr>
                  <th className="py-4 px-6">Method & Carrier</th>
                  <th className="py-4 px-4">Est. Delivery</th>
                  <th className="py-4 px-4">Flat Rate</th>
                  <th className="py-4 px-4">Free Shipping Above</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/60 bg-white dark:bg-neutral-950/40">
                {filteredMethods.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-neutral-900/50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white text-sm">{m.name}</div>
                          <div className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5">
                            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">{m.code}</span>
                            {m.carrier && (
                              <>
                                <span className="text-slate-300 dark:text-neutral-600">•</span>
                                <span className="text-slate-500 dark:text-neutral-400">{m.carrier}</span>
                              </>
                            )}
                          </div>
                          {m.description && (
                            <div className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1 max-w-sm">{m.description}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-neutral-300">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                        <span>{m.estimated_days || 'Standard transit'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {parseFloat(String(m.cost)) === 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
                        ) : (
                          `$${parseFloat(String(m.cost)).toFixed(2)}`
                        )}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {m.free_threshold ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium">
                          Orders &gt; ${parseFloat(String(m.free_threshold)).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-neutral-500">None</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggle(m.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition cursor-pointer text-[11px] ${
                          m.is_active
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                            : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-neutral-700 hover:bg-slate-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${m.is_active ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-slate-400 dark:bg-neutral-500'}`} />
                        {m.is_active ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingMethod(m)}
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredMethods.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-neutral-500">
                      No shipping methods found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-slate-900 dark:text-neutral-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{editingMethod ? 'Edit Shipping Method' : 'New Shipping Method'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-400 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-neutral-400 font-semibold mb-1">Method Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard Ground Shipping"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-neutral-400 font-semibold mb-1">Service Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. standard-ground"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-neutral-400 font-semibold mb-1">Carrier Provider</label>
                  <input
                    type="text"
                    placeholder="e.g. FedEx, DHL, UPS"
                    value={formData.carrier}
                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-neutral-400 font-semibold mb-1">Flat Rate Cost ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-neutral-400 font-semibold mb-1">Free Shipping Above ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Leave blank for none"
                    value={formData.free_threshold}
                    onChange={(e) => setFormData({ ...formData, free_threshold: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-neutral-400 font-semibold mb-1">Estimated Delivery Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 2-3 Business Days"
                  value={formData.estimated_days}
                  onChange={(e) => setFormData({ ...formData, estimated_days: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-neutral-400 font-semibold mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Customer-facing note displayed during checkout..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="modal-active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="modal-active" className="text-slate-700 dark:text-neutral-300 font-medium">
                  Active (Display option at checkout)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : editingMethod ? 'Update Method' : 'Create Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-slate-900 dark:text-neutral-100">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Shipping Method?</h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-neutral-300">
              Are you sure you want to permanently delete <strong className="text-slate-900 dark:text-white">"{deletingMethod.name}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingMethod(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition cursor-pointer"
              >
                Delete Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
