'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
  UserCheck
} from 'lucide-react';

interface CustomerAddress {
  id?: number;
  first_name?: string;
  last_name?: string;
  address_line1?: string;
  address_lines?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  orders_count?: number;
  lifetime_spend?: number | string;
  created_at?: string;
  default_address?: CustomerAddress | null;
  addresses?: CustomerAddress[];
  orders?: any[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address_line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
  });

  const fetchCustomers = async () => {
    setLoading(true);
    setErrorMsg(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    try {
      const res = await fetch(`${API_BASE}/admin/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        // BaseApiController returns paginated data inside data.data or directly in data
        const list = Array.isArray(data.data) ? data.data : (Array.isArray(data.data?.data) ? data.data.data : []);
        setCustomers(list);
      } else {
        throw new Error('Failed to load customers');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error loading customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      address_line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'United States',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    const addr = c.default_address || (c.addresses && c.addresses[0]);
    setFormData({
      name: c.name,
      email: c.email,
      phone: c.phone || '',
      password: '',
      address_line1: addr?.address_line1 || addr?.address_lines || '',
      city: addr?.city || '',
      state: addr?.state || '',
      postal_code: addr?.postal_code || '',
      country: addr?.country || 'United States',
    });
    setIsAddModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    setSaving(true);
    setErrorMsg(null);
    const token = localStorage.getItem('admin_token');

    const payload: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    if (formData.address_line1) {
      payload.address = {
        address_line1: formData.address_line1,
        city: formData.city || null,
        state: formData.state || null,
        postal_code: formData.postal_code || null,
        country: formData.country || 'United States',
      };
    }

    try {
      const url = editingCustomer
        ? `${API_BASE}/admin/customers/${editingCustomer.id}`
        : `${API_BASE}/admin/customers`;
      const method = editingCustomer ? 'PUT' : 'POST';

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

      setSuccessMsg(editingCustomer ? 'Customer profile updated' : 'Customer created successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsAddModalOpen(false);
      fetchCustomers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save customer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCustomer) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_BASE}/admin/customers/${deletingCustomer.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== deletingCustomer.id));
        setDeletingCustomer(null);
        if (selectedCustomer?.id === deletingCustomer.id) {
          setSelectedCustomer(null);
        }
        setSuccessMsg('Customer deleted successfully');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Delete failed');
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  return (
    <div className="min-h-full bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white">Customer Relationship Management (CRM)</h1>
            </div>
            <p className="text-sm text-neutral-400 mt-1">
              Buyer accounts, lifetime customer values (LTV), shipping destinations, and full account CRUD.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCustomers}
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Search */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-4 mb-6 shadow-xl max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Orders</th>
                  <th className="py-4 px-4">Lifetime Spend</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40">
                {filteredCustomers.map((cust) => {
                  const addr = cust.default_address || (cust.addresses && cust.addresses[0]);
                  return (
                    <tr key={cust.id} className="hover:bg-neutral-900/50 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                            {cust.name ? cust.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-white block text-sm">{cust.name}</span>
                            <span className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" /> Member since {cust.created_at?.split('T')[0] || '2026-04'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="text-neutral-300 block font-medium">{cust.email}</span>
                          <span className="text-neutral-500 text-[11px]">{cust.phone || 'No phone recorded'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-neutral-400">
                        {addr?.city && addr?.state
                          ? `${addr.city}, ${addr.state}`
                          : addr?.country || 'No address set'}
                      </td>

                      <td className="py-4 px-4 font-semibold text-white">
                        <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 text-[11px]">
                          {cust.orders_count || 0} orders
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-emerald-400 text-sm">
                        ${Number(cust.lifetime_spend || 0).toFixed(2)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Dossier
                          </button>
                          <button
                            onClick={() => handleOpenEdit(cust)}
                            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
                            title="Edit Customer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingCustomer(cust)}
                            className="p-1.5 rounded-lg bg-red-950/30 border border-red-900/40 hover:bg-red-900/50 text-red-400 transition cursor-pointer"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredCustomers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500">
                      No matching customers found.
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span>{editingCustomer ? 'Edit Customer Profile' : 'New Customer Account'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sophia Laurent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sophia@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +1 (555) 234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  {editingCustomer ? 'Reset Password (Leave blank to keep current)' : 'Account Password'}
                </label>
                <input
                  type="password"
                  placeholder={editingCustomer ? '••••••••' : 'Minimum 6 characters'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Address Details */}
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-3">
                <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Default Shipping Address</span>
                </div>

                <div>
                  <label className="block text-neutral-500 text-[11px] mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 450 Fashion Avenue, Suite 12"
                    value={formData.address_line1}
                    onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">State / Province</label>
                    <input
                      type="text"
                      placeholder="e.g. NY"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">Zip Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 10018"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingCustomer ? 'Update Customer' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800/80 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Customer Account?</h3>
                <p className="text-xs text-neutral-400">This permanently removes user and address data.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300">
              Are you sure you want to permanently remove customer account for <strong className="text-white">"{deletingCustomer.name}"</strong> ({deletingCustomer.email})?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingCustomer(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Dossier Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-neutral-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-lg">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedCustomer.name}</h3>
                <p className="text-xs text-neutral-400">Account ID: #{selectedCustomer.id}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Email Address</span>
                  </div>
                  <span className="font-semibold text-white break-all">{selectedCustomer.email}</span>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Phone Number</span>
                  </div>
                  <span className="font-semibold text-white">{selectedCustomer.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Completed Orders</span>
                  </div>
                  <span className="font-bold text-white text-base">{selectedCustomer.orders_count || 0}</span>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lifetime Value (LTV)</span>
                  </div>
                  <span className="font-bold text-emerald-400 text-base">
                    ${Number(selectedCustomer.lifetime_spend || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                <div className="flex items-center gap-1.5 text-neutral-400 font-semibold mb-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Primary Address</span>
                </div>
                {selectedCustomer.default_address || (selectedCustomer.addresses && selectedCustomer.addresses[0]) ? (
                  <div className="text-neutral-300 space-y-1">
                    <p className="font-semibold text-white">
                      {selectedCustomer.default_address?.address_line1 || selectedCustomer.default_address?.address_lines || selectedCustomer.addresses?.[0]?.address_line1}
                    </p>
                    <p>
                      {selectedCustomer.default_address?.city || selectedCustomer.addresses?.[0]?.city}, {selectedCustomer.default_address?.state || selectedCustomer.addresses?.[0]?.state} {selectedCustomer.default_address?.postal_code || selectedCustomer.addresses?.[0]?.postal_code}
                    </p>
                    <p className="text-neutral-500">
                      {selectedCustomer.default_address?.country || selectedCustomer.addresses?.[0]?.country || 'United States'}
                    </p>
                  </div>
                ) : (
                  <p className="text-neutral-500">No primary shipping address recorded yet.</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  const c = selectedCustomer;
                  setSelectedCustomer(null);
                  handleOpenEdit(c);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
