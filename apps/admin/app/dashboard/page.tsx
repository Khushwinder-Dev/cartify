'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Layers,
  ChevronRight,
  Clock,
  Users,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
  MapPin,
  Calendar,
  Mail,
  Phone,
  UserCheck
} from 'lucide-react';

interface CustomerAddress {
  id?: number;
  first_name?: string;
  last_name?: string;
  address_line1?: string;
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
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 28450.00,
    totalOrders: 142,
    totalCustomers: 4,
    lowStockCount: 2,
    topSelling: [
      { id: 1, title: 'Minimalist Japanese Wool Overshirt', sales: 48, revenue: 8880.00 },
      { id: 2, title: 'Heavyweight Organic Cotton T-Shirt', sales: 39, revenue: 1872.00 },
      { id: 3, title: 'Relaxed Linen Pleated Trousers', sales: 31, revenue: 4340.00 },
    ],
    lowStockVariants: [
      { id: 101, sku: 'WOOL-SHIRT-M-OAT', title: 'Japanese Wool Overshirt / M / Oatmeal', stock: 2, threshold: 5 },
      { id: 102, sku: 'TEE-COTTON-L-WHT', title: 'Heavyweight Cotton Tee / L / White', stock: 1, threshold: 5 },
    ]
  });

  // Customers State for Dashboard
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Customer Form Data
  const [customerForm, setCustomerForm] = useState({
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

  const fetchDashboardData = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    try {
      // 1. Fetch Analytics Metrics
      const res = await fetch(`${API_BASE}/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      if (res.ok) {
        const resJson = await res.json();
        const metricsPayload = resJson.data?.metrics || resJson.metrics;
        if (metricsPayload) {
          setMetrics((prev) => ({
            ...prev,
            totalRevenue: metricsPayload.total_sales ?? prev.totalRevenue,
            totalOrders: metricsPayload.total_orders ?? prev.totalOrders,
            totalCustomers: metricsPayload.total_customers ?? prev.totalCustomers,
          }));
        }
      }

      // 2. Fetch All Registered Customers from MySQL
      const custRes = await fetch(`${API_BASE}/admin/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      if (custRes.ok) {
        const custData = await custRes.json();
        const list = Array.isArray(custData.data) ? custData.data : (Array.isArray(custData.data?.data) ? custData.data.data : []);
        setCustomers(list);
        setMetrics((prev) => ({ ...prev, totalCustomers: list.length }));
      }
    } catch (err) {
      console.warn('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenAddCustomer = () => {
    setEditingCustomer(null);
    setCustomerForm({
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
    setIsAddCustomerOpen(true);
  };

  const handleOpenEditCustomer = (c: Customer) => {
    setEditingCustomer(c);
    const addr = c.default_address || (c.addresses && c.addresses[0]);
    setCustomerForm({
      name: c.name,
      email: c.email,
      phone: c.phone || '',
      password: '',
      address_line1: addr?.address_line1 || '',
      city: addr?.city || '',
      state: addr?.state || '',
      postal_code: addr?.postal_code || '',
      country: addr?.country || 'United States',
    });
    setIsAddCustomerOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name.trim() || !customerForm.email.trim()) return;

    setSavingCustomer(true);
    setErrorMsg(null);
    const token = localStorage.getItem('admin_token');

    const payload: any = {
      name: customerForm.name,
      email: customerForm.email,
      phone: customerForm.phone || null,
    };

    if (customerForm.password) {
      payload.password = customerForm.password;
    }

    if (customerForm.address_line1) {
      payload.address = {
        address_line1: customerForm.address_line1,
        city: customerForm.city || null,
        state: customerForm.state || null,
        postal_code: customerForm.postal_code || null,
        country: customerForm.country || 'United States',
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
        throw new Error(resJson.message || 'Customer modification failed');
      }

      setSuccessMsg(editingCustomer ? `Successfully updated ${customerForm.name}` : `Created customer account for ${customerForm.name}`);
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsAddCustomerOpen(false);
      fetchDashboardData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save customer modification');
    } finally {
      setSavingCustomer(false);
    }
  };

  const handleDeleteCustomer = async () => {
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
        setSuccessMsg('Customer account deleted successfully');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Customer deletion failed');
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (c.phone && c.phone.includes(customerSearch))
  );

  return (
    <div className="min-h-full bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Top Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Merchant Intelligence & Customer CRM</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Live transactional performance, inventory control, and registered buyer management.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Refresh Dashboard"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenAddCustomer}
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

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Revenue</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              ${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% this billing cycle</span>
            </div>
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Orders</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {metrics.totalOrders}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
              <span>98.6% fulfillment rate</span>
            </div>
          </div>

          {/* Registered Customers Card */}
          <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Registered Customers
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {customers.length || metrics.totalCustomers}
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-indigo-400 font-medium">
              <span>Active in MySQL database</span>
            </div>
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Low Stock Alerts</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-400 tracking-tight">
              {metrics.lowStockVariants.length}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400/80 font-medium">
              <span>Requires replenishment</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* REGISTERED CUSTOMERS LISTING & MODIFICATION TABLE ON DASHBOARD */}
        {/* ============================================================== */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Users className="w-4 h-4" />
                </span>
                <h2 className="text-base font-bold text-white">Registered Customers Directory & Modifications</h2>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-time MySQL customer accounts with inline edit options, contact info, and lifetime value.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search registered customers..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-56"
                />
              </div>

              <button
                onClick={handleOpenAddCustomer}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Customer</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Lifetime Spend</th>
                  <th className="py-3 px-4 text-right">Edit & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40">
                {filteredCustomers.map((cust) => {
                  const addr = cust.default_address || (cust.addresses && cust.addresses[0]);
                  return (
                    <tr key={cust.id} className="hover:bg-neutral-900/50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                            {cust.name ? cust.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-white block text-sm">{cust.name}</span>
                            <span className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" /> Joined {cust.created_at?.split('T')[0] || '2026-10'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="text-neutral-200 block font-medium">{cust.email}</span>
                          <span className="text-neutral-500 text-[11px]">{cust.phone || 'No phone recorded'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-neutral-400">
                        {addr?.city && addr?.state
                          ? `${addr.city}, ${addr.state}`
                          : addr?.country || 'No address set'}
                      </td>

                      <td className="py-3 px-4 font-semibold text-white">
                        <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-[11px]">
                          {cust.orders_count || 0} orders
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-emerald-400 text-sm">
                        ${Number(cust.lifetime_spend || 0).toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                            title="View Dossier"
                          >
                            Dossier
                          </button>
                          <button
                            onClick={() => handleOpenEditCustomer(cust)}
                            className="p-1.5 rounded-lg bg-indigo-950/40 border border-indigo-900/50 hover:bg-indigo-900/60 text-indigo-300 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs font-semibold px-2"
                            title="Modify Customer Details"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDeletingCustomer(cust)}
                            className="p-1.5 rounded-lg bg-red-950/30 border border-red-900/40 hover:bg-red-900/50 text-red-400 transition cursor-pointer"
                            title="Delete Customer Account"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredCustomers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-500">
                      No matching registered customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tables Section: Top Selling & Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Selling Variants */}
          <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Top-Selling Garments</span>
              </h2>
              <Link href="/products" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-4">
              {metrics.topSelling.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{item.sales} units fulfilled</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">${item.revenue.toFixed(2)}</p>
                    <p className="text-xs text-neutral-500">Gross revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Warnings */}
          <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Low-Stock Inventory Warnings</span>
              </h2>
              <Link href="/inventory" className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition">
                Manage Stock
              </Link>
            </div>
            <div className="space-y-4">
              {metrics.lowStockVariants.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {item.sku}
                      </span>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {item.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ============================================================== */}
      {/* ADD / EDIT CUSTOMER MODAL DIRECTLY ON DASHBOARD                */}
      {/* ============================================================== */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span>{editingCustomer ? `Modify Customer: ${editingCustomer.name}` : 'New Customer Account'}</span>
              </h3>
              <button
                onClick={() => setIsAddCustomerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sophia Laurent"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
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
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +1 (555) 234-5678"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  {editingCustomer ? 'Reset Password (Leave blank to keep unchanged)' : 'Account Password'}
                </label>
                <input
                  type="password"
                  placeholder={editingCustomer ? '••••••••' : 'Minimum 6 characters'}
                  value={customerForm.password}
                  onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
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
                    value={customerForm.address_line1}
                    onChange={(e) => setCustomerForm({ ...customerForm, address_line1: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. New York"
                      value={customerForm.city}
                      onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                      className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">State</label>
                    <input
                      type="text"
                      placeholder="e.g. NY"
                      value={customerForm.state}
                      onChange={(e) => setCustomerForm({ ...customerForm, state: e.target.value })}
                      className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">Zip</label>
                    <input
                      type="text"
                      placeholder="e.g. 10018"
                      value={customerForm.postal_code}
                      onChange={(e) => setCustomerForm({ ...customerForm, postal_code: e.target.value })}
                      className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCustomer}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50 cursor-pointer"
                >
                  {savingCustomer ? 'Saving...' : editingCustomer ? 'Save Modifications' : 'Create Customer'}
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
                <p className="text-xs text-neutral-400">This action permanently removes the user and all addresses.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300">
              Are you sure you want to permanently remove <strong className="text-white">"{deletingCustomer.name}"</strong> ({deletingCustomer.email})?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingCustomer(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Dossier Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-neutral-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-lg">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedCustomer.name}</h3>
                <p className="text-xs text-neutral-400">Customer ID: #{selectedCustomer.id}</p>
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
                    <span>Total Orders</span>
                  </div>
                  <span className="font-bold text-white text-base">{selectedCustomer.orders_count || 0}</span>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
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
                      {selectedCustomer.default_address?.address_line1 || selectedCustomer.addresses?.[0]?.address_line1}
                    </p>
                    <p>
                      {selectedCustomer.default_address?.city || selectedCustomer.addresses?.[0]?.city}, {selectedCustomer.default_address?.state || selectedCustomer.addresses?.[0]?.state} {selectedCustomer.default_address?.postal_code || selectedCustomer.addresses?.[0]?.postal_code}
                    </p>
                    <p className="text-neutral-500">
                      {selectedCustomer.default_address?.country || selectedCustomer.addresses?.[0]?.country || 'United States'}
                    </p>
                  </div>
                ) : (
                  <p className="text-neutral-500">No primary shipping address recorded.</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  const c = selectedCustomer;
                  setSelectedCustomer(null);
                  handleOpenEditCustomer(c);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Modify Customer Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
