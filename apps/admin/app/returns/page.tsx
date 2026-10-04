'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Search,
  Filter,
  Package,
  Truck,
  ArrowRight,
  Eye,
  X,
  FileText,
  Check,
  Ban,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface ReturnRequest {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  date: string;
  itemTitle: string;
  variant: string;
  quantity: number;
  itemPrice: number;
  image: string;
  reason: string;
  customerNotes?: string;
  status: 'pending' | 'approved' | 'received' | 'refunded' | 'rejected';
  restocked: boolean;
}

export default function AdminReturnsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'received' | 'refunded' | 'rejected'>('all');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [refundingReturn, setRefundingReturn] = useState<ReturnRequest | null>(null);
  const [restockInventory, setRestockInventory] = useState(true);
  const [processingRefund, setProcessingRefund] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Return Orders data
  const [returns, setReturns] = useState<ReturnRequest[]>([
    {
      id: 'RMA-8921',
      orderNumber: 'ORD-2026-1042',
      customerName: 'Marcus Vance',
      email: 'marcus.v@example.com',
      date: '2026-10-02',
      itemTitle: 'Minimalist Japanese Wool Overshirt',
      variant: 'Oatmeal / L',
      quantity: 1,
      itemPrice: 185.00,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80',
      reason: 'Size too large - exchange for Medium',
      customerNotes: 'Garment is pristine with tags attached. Sleeves run slightly longer than anticipated.',
      status: 'pending',
      restocked: false,
    },
    {
      id: 'RMA-8918',
      orderNumber: 'ORD-2026-1038',
      customerName: 'Sophia Laurent',
      email: 'customer@customer.com',
      date: '2026-09-29',
      itemTitle: 'Relaxed Linen Pleated Trousers',
      variant: 'Navy Ink / 32',
      quantity: 1,
      itemPrice: 140.00,
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80',
      reason: 'Changed mind regarding color',
      customerNotes: 'Prefers Natural Ecru instead.',
      status: 'approved',
      restocked: false,
    },
    {
      id: 'RMA-8904',
      orderNumber: 'ORD-2026-1011',
      customerName: 'Alexander Hayes',
      email: 'a.hayes@oxford.uk',
      date: '2026-09-24',
      itemTitle: 'Pure Mongolian Cashmere Crewneck',
      variant: 'Heather Grey / XL',
      quantity: 1,
      itemPrice: 265.00,
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=400&q=80',
      reason: 'Fabric expectation mismatch',
      customerNotes: 'Returned via prepaid FedEx return label.',
      status: 'received',
      restocked: false,
    },
    {
      id: 'RMA-8890',
      orderNumber: 'ORD-2026-0994',
      customerName: 'Clara Oswald',
      email: 'clara@oswald.com',
      date: '2026-09-18',
      itemTitle: 'Structured Cotton Gabardine Trench',
      variant: 'Classic Honey / S',
      quantity: 1,
      itemPrice: 340.00,
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80',
      reason: 'Ordered two sizes to try on',
      customerNotes: 'Returning size S, keeping size M.',
      status: 'refunded',
      restocked: true,
    },
  ]);

  const handleUpdateStatus = (id: string, newStatus: ReturnRequest['status']) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    setSuccessToast(`Return request ${id} updated to ${newStatus.toUpperCase()}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleExecuteRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundingReturn) return;

    setProcessingRefund(true);
    setTimeout(() => {
      setReturns((prev) =>
        prev.map((r) =>
          r.id === refundingReturn.id
            ? { ...r, status: 'refunded' as const, restocked: restockInventory }
            : r
        )
      );
      setProcessingRefund(false);
      setRefundingReturn(null);
      setSuccessToast(`Successfully issued $${refundingReturn.itemPrice.toFixed(2)} refund for ${refundingReturn.id}!`);
      setTimeout(() => setSuccessToast(null), 3000);
    }, 800);
  };

  const filteredReturns = returns.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.itemTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRefundedAmount = returns
    .filter((r) => r.status === 'refunded')
    .reduce((sum, r) => sum + r.itemPrice * r.quantity, 0);

  const pendingCount = returns.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20 transition-colors">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <RotateCcw className="w-4 h-4" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Reverse Logistics & Returns (RMA)</h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
              Process customer return merchandise authorizations, inspect received apparel, and issue refunds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-neutral-400">
              Return Policy: <strong className="text-slate-900 dark:text-white font-semibold">30 Days • Pre-paid shipping labels</strong>
            </span>
          </div>
        </div>

        {/* Notifications */}
        {successToast && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fade-in shadow-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs dark:shadow-xl transition-colors">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Pending Authorization
            </span>
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight mt-3">
              {pendingCount}
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-neutral-500 font-medium">
              Requires merchant review
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs dark:shadow-xl transition-colors">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Approved & In Transit
            </span>
            <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight mt-3">
              {returns.filter((r) => r.status === 'approved' || r.status === 'received').length}
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-neutral-400 font-medium">
              Customer shipping back
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs dark:shadow-xl transition-colors">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Total Refunded Volume
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
              ${totalRefundedAmount.toFixed(2)}
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-neutral-400 font-medium">
              Settled to original payment methods
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs dark:shadow-xl transition-colors">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Restock Re-integration
            </span>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight mt-3">
              100%
            </div>
            <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Auto inventory adjustment
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs dark:shadow-xl transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search RMA #, order, customer, garment..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-1 text-xs">
                {(['all', 'pending', 'approved', 'received', 'refunded', 'rejected'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1 rounded-lg font-medium capitalize transition cursor-pointer ${
                      statusFilter === tab
                        ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                        : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-neutral-400">
              Total RMA requests: <strong>{filteredReturns.length}</strong>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-neutral-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-neutral-950/80 text-slate-600 dark:text-neutral-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">RMA & Order</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Garment Returned</th>
                  <th className="py-3 px-4">Return Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/60 bg-white dark:bg-neutral-950/40">
                {filteredReturns.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-neutral-900/50 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs block">{item.id}</span>
                        <span className="text-slate-500 dark:text-neutral-400 text-[11px]">{item.orderNumber}</span>
                        <span className="text-slate-400 dark:text-neutral-500 text-[10px] block mt-0.5">{item.date}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">{item.customerName}</span>
                        <span className="text-slate-500 dark:text-neutral-400 text-[11px]">{item.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={item.image} alt={item.itemTitle} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-xs">{item.itemTitle}</p>
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400">{item.variant} • ${item.itemPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="max-w-xs">
                        <span className="text-slate-800 dark:text-neutral-200 font-medium block">{item.reason}</span>
                        {item.customerNotes && (
                          <span className="text-slate-500 dark:text-neutral-500 text-[11px] line-clamp-1 italic">
                            "{item.customerNotes}"
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {item.status === 'pending' ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
                          Pending Review
                        </span>
                      ) : item.status === 'approved' ? (
                        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[11px] font-semibold">
                          Approved (Label Sent)
                        </span>
                      ) : item.status === 'received' ? (
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[11px] font-semibold">
                          Received & Inspected
                        </span>
                      ) : item.status === 'refunded' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> Refunded
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[11px] font-semibold">
                          Rejected
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedReturn(item)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'approved')}
                              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'rejected')}
                              className="p-1.5 bg-slate-100 hover:bg-rose-50 dark:bg-neutral-800 dark:hover:bg-rose-950/60 text-slate-500 hover:text-rose-600 dark:text-neutral-400 dark:hover:text-rose-400 rounded-lg transition cursor-pointer"
                              title="Reject"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {item.status === 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'received')}
                            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Mark Received
                          </button>
                        )}

                        {item.status === 'received' && (
                          <button
                            onClick={() => setRefundingReturn(item)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Issue Refund</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredReturns.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-neutral-500">
                      No matching return orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View RMA Details Modal */}
        {selectedReturn && (
          <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-900 dark:text-neutral-100">
              <button
                onClick={() => setSelectedReturn(null)}
                className="absolute top-5 right-5 text-slate-400 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedReturn.id}</h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">Order: {selectedReturn.orderNumber}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-200 dark:border-neutral-800">
                  <img src={selectedReturn.image} alt="" className="w-14 h-14 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{selectedReturn.itemTitle}</h4>
                    <p className="text-slate-500 dark:text-neutral-400">{selectedReturn.variant}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">${selectedReturn.itemPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-1">
                  <span className="text-slate-500 dark:text-neutral-500 font-semibold block">Return Reason:</span>
                  <p className="text-slate-800 dark:text-neutral-200 font-medium">{selectedReturn.reason}</p>
                  {selectedReturn.customerNotes && (
                    <p className="text-slate-500 dark:text-neutral-400 italic mt-1 pt-1 border-t border-slate-200 dark:border-neutral-900">
                      "{selectedReturn.customerNotes}"
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-200 dark:border-neutral-800">
                    <span className="text-slate-500 dark:text-neutral-500 block mb-1">Customer Contact</span>
                    <span className="font-semibold text-slate-900 dark:text-white block">{selectedReturn.customerName}</span>
                    <span className="text-slate-500 dark:text-neutral-400 text-[11px]">{selectedReturn.email}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-200 dark:border-neutral-800">
                    <span className="text-slate-500 dark:text-neutral-500 block mb-1">Return Status</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">{selectedReturn.status}</span>
                    <span className="text-slate-500 dark:text-neutral-500 text-[11px] block">Requested {selectedReturn.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-neutral-800 mt-6">
                <button
                  onClick={() => setSelectedReturn(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Issue Refund Modal */}
        {refundingReturn && (
          <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-900 dark:text-neutral-100">
              <button
                onClick={() => setRefundingReturn(null)}
                className="absolute top-5 right-5 text-slate-400 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Execute Customer Refund</h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">{refundingReturn.id} • {refundingReturn.orderNumber}</p>
                </div>
              </div>

              <form onSubmit={handleExecuteRefund} className="space-y-4 text-xs mt-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-500 dark:text-neutral-400">Garment Refund Amount:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      ${refundingReturn.itemPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                    Funds will automatically reverse through original checkout gateway (Stripe/PayPal).
                  </p>
                </div>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={restockInventory}
                    onChange={(e) => setRestockInventory(e.target.checked)}
                    className="rounded border-slate-300 dark:border-neutral-700 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-slate-700 dark:text-neutral-300 font-medium">
                    Automatically restock +1 unit of <strong>{refundingReturn.variant}</strong> to inventory
                  </span>
                </label>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setRefundingReturn(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processingRefund}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition disabled:opacity-50 cursor-pointer"
                  >
                    {processingRefund ? 'Processing...' : 'Confirm Refund'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
