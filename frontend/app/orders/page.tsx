'use client';

import React, { useState } from 'react';
import { Search, PackageCheck, CheckCircle2, Clock, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { Order } from '@/lib/types';
import Link from 'next/link';

export default function OrderTrackingPage() {
  const [orderQuery, setOrderQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await api.getOrder(orderQuery.trim());
      setOrder(res.data);
    } catch (err: any) {
      setError(err.message || 'Order could not be located. Please verify your order number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-16 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-neutral-950 dark:text-white">Track Your Shipment</h1>
          <p className="text-sm text-neutral-500 max-w-md mx-auto">
            Enter your order confirmation number (e.g. ORD-20261004-XXXXXX) to view fulfillment timeline and live carrier dispatch status.
          </p>
        </div>

        {/* Lookup Form */}
        <form onSubmit={handleLookup} className="flex gap-2 max-w-lg mx-auto mb-10">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="e.g. ORD-20261004-ABCDEF"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs font-mono uppercase tracking-wider rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !orderQuery.trim()}
            className="px-6 py-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center space-x-1.5"
          >
            <span>{loading ? 'Locating...' : 'Track'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-semibold text-center mb-8 max-w-lg mx-auto">
            {error}
          </div>
        )}

        {/* Order Display */}
        {order && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Order Ribbon Header */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4 bg-neutral-50/50 dark:bg-neutral-950/50">
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                  Verified Order
                </span>
                <span className="font-mono font-black text-lg text-indigo-600 dark:text-indigo-400">
                  {order.order_number}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                  Payment: {order.financial_status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
                  Fulfillment: {order.fulfillment_status}
                </span>
              </div>
            </div>

            {/* Timeline Stepper */}
            <div className="p-8 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-6">
                Fulfillment Progress
              </h3>

              <div className="grid grid-cols-4 gap-2 relative">
                {[
                  { label: 'Order Placed', done: true, icon: CheckCircle2 },
                  { label: 'Payment Verified', done: order.financial_status === 'paid', icon: ShieldCheck },
                  { label: 'Dispatch Prep', done: order.fulfillment_status !== 'unfulfilled', icon: Clock },
                  { label: 'Delivered', done: order.fulfillment_status === 'fulfilled', icon: Truck },
                ].map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="text-center relative">
                      <div
                        className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-2 shadow-sm transition-colors ${
                          step.done
                            ? 'bg-indigo-600 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold block text-neutral-800 dark:text-neutral-200">
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Line Items */}
            <div className="p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Itemized Receipt ({order.items?.length || 0} line items)
              </h3>

              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800/80 text-xs"
                  >
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white block">
                        {item.product_title}
                      </span>
                      {item.variant_title && (
                        <span className="text-[11px] text-neutral-500">Variant: {item.variant_title}</span>
                      )}
                      <span className="text-[11px] text-neutral-400 block font-mono">
                        SKU: {item.sku || 'N/A'} • Qty: {item.quantity}
                      </span>
                    </div>

                    <span className="font-black text-sm text-neutral-950 dark:text-white">
                      ${Number(item.total).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1.5 mt-4">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-semibold">${Number(order.subtotal).toFixed(2)}</span>
                </div>
                {order.discount_total > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount Applied</span>
                    <span>-${Number(order.discount_total).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-500">Estimated Taxes</span>
                  <span className="font-semibold">${Number(order.tax_total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="font-semibold">
                    {order.shipping_total === 0 ? 'FREE' : `$${Number(order.shipping_total).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 text-sm font-black text-neutral-950 dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    ${Number(order.grand_total).toFixed(2)} {order.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
