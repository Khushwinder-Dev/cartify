'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Key,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  X,
  Settings2,
  DollarSign,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface PaymentGateway {
  id: number;
  name: string;
  code: string;
  description: string | null;
  instructions: string | null;
  is_active: boolean;
  is_test_mode: boolean;
  transaction_fee_percent: number | string;
  credentials: Record<string, string> | null;
  position: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function PaymentGatewaysPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<PaymentGateway | null>(null);
  const [deletingGateway, setDeletingGateway] = useState<PaymentGateway | null>(null);
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  // Config Form
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    instructions: '',
    is_active: true,
    is_test_mode: true,
    transaction_fee_percent: '2.90',
    publishable_key: '',
    secret_key: '',
    webhook_secret: '',
    client_id: '',
    client_secret: '',
  });

  const fetchGateways = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      const res = await fetch(`${API_BASE}/admin/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        const json = await res.json();
        setGateways(json.data || []);
      } else {
        throw new Error('Failed to load payment gateways');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error fetching payment gateways');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  const handleOpenConfig = (g: PaymentGateway) => {
    setEditingGateway(g);
    const creds = g.credentials || {};
    setFormData({
      name: g.name,
      code: g.code,
      description: g.description || '',
      instructions: g.instructions || '',
      is_active: g.is_active,
      is_test_mode: g.is_test_mode,
      transaction_fee_percent: String(g.transaction_fee_percent || '0'),
      publishable_key: creds.publishable_key || '',
      secret_key: creds.secret_key || '',
      webhook_secret: creds.webhook_secret || '',
      client_id: creds.client_id || '',
      client_secret: creds.secret || '',
    });
    setShowSecret(false);
    setIsConfigModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingGateway(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      instructions: '',
      is_active: true,
      is_test_mode: true,
      transaction_fee_percent: '0.00',
      publishable_key: '',
      secret_key: '',
      webhook_secret: '',
      client_id: '',
      client_secret: '',
    });
    setShowSecret(false);
    setIsAddModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    setErrorMsg(null);
    const token = localStorage.getItem('admin_token');

    const credentials: Record<string, string> = {};
    if (formData.publishable_key) credentials.publishable_key = formData.publishable_key;
    if (formData.secret_key) credentials.secret_key = formData.secret_key;
    if (formData.webhook_secret) credentials.webhook_secret = formData.webhook_secret;
    if (formData.client_id) credentials.client_id = formData.client_id;
    if (formData.client_secret) credentials.secret = formData.client_secret;

    const payload: any = {
      name: formData.name,
      code: formData.code || undefined,
      description: formData.description || null,
      instructions: formData.instructions || null,
      is_active: formData.is_active,
      is_test_mode: formData.is_test_mode,
      transaction_fee_percent: parseFloat(formData.transaction_fee_percent) || 0,
      credentials: Object.keys(credentials).length > 0 ? credentials : null,
    };

    try {
      const url = editingGateway
        ? `${API_BASE}/admin/payments/${editingGateway.id}`
        : `${API_BASE}/admin/payments`;
      const method = editingGateway ? 'PUT' : 'POST';

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

      setSuccessMsg(editingGateway ? 'Gateway settings updated' : 'Payment gateway created');
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsConfigModalOpen(false);
      setIsAddModalOpen(false);
      fetchGateways();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save gateway configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_BASE}/admin/payments/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        setGateways((prev) =>
          prev.map((g) => (g.id === id ? { ...g, is_active: !g.is_active } : g))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deletingGateway) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_BASE}/admin/payments/${deletingGateway.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        setGateways((prev) => prev.filter((g) => g.id !== deletingGateway.id));
        setDeletingGateway(null);
        setSuccessMsg('Gateway removed');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Delete failed');
    }
  };

  const filteredGateways = gateways.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.code.toLowerCase().includes(search.toLowerCase()) ||
    (g.description && g.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-full bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <CreditCard className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white">Payment Gateways</h1>
            </div>
            <p className="text-sm text-neutral-400 mt-1">
              Configure payment processors, API credential vaults, sandbox test environments, and processing surcharges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchGateways}
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
              <span>Add Custom Gateway</span>
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

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
            <div className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Active Processors</div>
            <div className="text-2xl font-bold text-white mt-1">
              {gateways.filter((g) => g.is_active).length} <span className="text-sm font-normal text-neutral-400">/ {gateways.length} Configured</span>
            </div>
            <p className="text-xs text-neutral-400 mt-2">Enabled for checkout checkout flow</p>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
            <div className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Environment</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">Sandbox / Test Mode</div>
            <p className="text-xs text-neutral-400 mt-2">Zero risk test transactions enabled</p>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
            <div className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Security Protocol</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">PCI-DSS Compliant</div>
            <p className="text-xs text-neutral-400 mt-2">Direct tokenization & webhook verify</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search payment gateways or methods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Gateways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGateways.map((g) => {
            const hasCreds = g.credentials && Object.keys(g.credentials).length > 0;
            return (
              <div
                key={g.id}
                className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-neutral-700/80 transition space-y-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-indigo-400 shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{g.name}</h3>
                        <span className="text-[11px] font-mono text-neutral-400">{g.code}</span>
                      </div>
                    </div>

                    {/* Active Toggle Button */}
                    <button
                      onClick={() => handleToggle(g.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                        g.is_active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${g.is_active ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
                      {g.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                    {g.description || 'Seamless checkout integration for customer orders.'}
                  </p>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px]">
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-medium border ${
                        g.is_test_mode
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {g.is_test_mode ? 'Test Mode (Sandbox)' : 'Production (Live)'}
                    </span>

                    {parseFloat(String(g.transaction_fee_percent)) > 0 && (
                      <span className="px-2.5 py-0.5 rounded-md font-medium bg-neutral-800 border border-neutral-700 text-neutral-300">
                        Fee: {g.transaction_fee_percent}%
                      </span>
                    )}

                    {hasCreds ? (
                      <span className="px-2.5 py-0.5 rounded-md font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center gap-1">
                        <Key className="w-3 h-3" />
                        <span>API Keys Vaulted</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md font-medium bg-neutral-800/80 border border-neutral-700/80 text-neutral-400">
                        No Credentials Required
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">
                    ID #{g.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenConfig(g)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition cursor-pointer"
                    >
                      <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Configure</span>
                    </button>
                    <button
                      onClick={() => setDeletingGateway(g)}
                      className="p-1.5 rounded-xl bg-red-950/30 border border-red-900/40 hover:bg-red-900/50 text-red-400 transition cursor-pointer"
                      title="Remove Gateway"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Configuration Modal */}
      {(isConfigModalOpen || isAddModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-400" />
                <span>{editingGateway ? `Configure ${editingGateway.name}` : 'New Payment Gateway'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsConfigModalOpen(false);
                  setIsAddModalOpen(false);
                }}
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Gateway Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe Card Payments"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Gateway Code</label>
                  <input
                    type="text"
                    placeholder="e.g. stripe, paypal"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Fee Surcharge (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 2.9"
                    value={formData.transaction_fee_percent}
                    onChange={(e) => setFormData({ ...formData, transaction_fee_percent: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Customer Description</label>
                <input
                  type="text"
                  placeholder="e.g. Pay securely with credit/debit card, Apple Pay, Google Pay"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* API Credentials Vault Section */}
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>API Credentials Vault</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showSecret ? 'Hide Secrets' : 'Reveal'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-neutral-500 text-[11px] mb-1">Publishable Key / Client ID</label>
                  <input
                    type="text"
                    placeholder="pk_test_... or Client ID"
                    value={formData.publishable_key || formData.client_id}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, publishable_key: val, client_id: val });
                    }}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-neutral-100 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 text-[11px] mb-1">Secret Key / API Token</label>
                  <input
                    type={showSecret ? 'text' : 'password'}
                    placeholder="sk_test_... or Secret Token"
                    value={formData.secret_key || formData.client_secret}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, secret_key: val, client_secret: val });
                    }}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-neutral-100 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 text-[11px] mb-1">Webhook Secret (Optional)</label>
                  <input
                    type={showSecret ? 'text' : 'password'}
                    placeholder="whsec_..."
                    value={formData.webhook_secret}
                    onChange={(e) => setFormData({ ...formData, webhook_secret: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-neutral-100 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Instructions / Payment Details</label>
                <textarea
                  rows={2}
                  placeholder="Instructions displayed on order checkout (e.g. bank account details or COD instructions)..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pg-active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 bg-neutral-950 border-neutral-800 focus:ring-indigo-500"
                  />
                  <label htmlFor="pg-active" className="text-neutral-300 font-medium">
                    Active on Checkout
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pg-test"
                    checked={formData.is_test_mode}
                    onChange={(e) => setFormData({ ...formData, is_test_mode: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-neutral-950 border-neutral-800 focus:ring-amber-500"
                  />
                  <label htmlFor="pg-test" className="text-amber-400 font-medium">
                    Sandbox / Test Mode
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsConfigModalOpen(false);
                    setIsAddModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingGateway ? 'Save Settings' : 'Create Gateway'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800/80 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Payment Gateway?</h3>
                <p className="text-xs text-neutral-400">Customers will no longer be able to select this gateway.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300">
              Are you sure you want to permanently remove <strong className="text-white">"{deletingGateway.name}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingGateway(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition"
              >
                Remove Gateway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
