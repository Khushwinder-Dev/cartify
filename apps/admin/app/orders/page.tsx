'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Truck,
  Printer,
  FileText,
  CheckCircle2,
  Clock,
  ChevronDown,
  X,
  ExternalLink,
  ShieldCheck,
  Package
} from 'lucide-react';

interface OrderItem {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  financial_status: 'paid' | 'pending' | 'refunded';
  fulfillment_status: 'unfulfilled' | 'fulfilled' | 'partially_fulfilled';
  grand_total: number;
  items_count: number;
  created_at: string;
  tracking_number?: string;
  carrier?: string;
  items: Array<{ title: string; sku: string; quantity: number; price: number }>;
  shipping_address: {
    name: string;
    line1: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  };
}

const mockOrders: OrderItem[] = [
  {
    id: 'ord-101',
    order_number: 'ORD-20261004-9841',
    customer_name: 'Alexander Wright',
    email: 'alex.wright@example.com',
    financial_status: 'paid',
    fulfillment_status: 'unfulfilled',
    grand_total: 280.00,
    items_count: 2,
    created_at: '2026-10-04 10:14',
    items: [
      { title: 'Japanese Selvedge Denim Jacket - M / Indigo', sku: 'JAP-SEL-M-IND', quantity: 1, price: 185.00 },
      { title: 'Heavyweight Loopback Hoodie - L / Slate', sku: 'HW-LOOP-L-SLT', quantity: 1, price: 95.00 },
    ],
    shipping_address: {
      name: 'Alexander Wright',
      line1: '742 Evergreen Terrace',
      city: 'Portland',
      state: 'OR',
      postal: '97201',
      country: 'US',
    },
  },
  {
    id: 'ord-102',
    order_number: 'ORD-20261004-5120',
    customer_name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    financial_status: 'paid',
    fulfillment_status: 'fulfilled',
    grand_total: 140.00,
    items_count: 1,
    tracking_number: '1Z9999999999999999',
    carrier: 'UPS Ground',
    created_at: '2026-10-04 09:30',
    items: [
      { title: 'Relaxed Silk Camp Shirt - S / Off-White', sku: 'SILK-CAMP-S-WHT', quantity: 1, price: 140.00 },
    ],
    shipping_address: {
      name: 'Elena Rostova',
      line1: '1240 Broadway Ave #4B',
      city: 'Seattle',
      state: 'WA',
      postal: '98102',
      country: 'US',
    },
  },
  {
    id: 'ord-103',
    order_number: 'ORD-20261004-3310',
    customer_name: 'Marcus Vance',
    email: 'marcus.v@example.com',
    financial_status: 'pending',
    fulfillment_status: 'unfulfilled',
    grand_total: 350.00,
    items_count: 2,
    created_at: '2026-10-04 08:22',
    items: [
      { title: 'Structured Wool Trousers - 32 / Charcoal', sku: 'WOOL-TR-32-CHR', quantity: 2, price: 175.00 },
    ],
    shipping_address: {
      name: 'Marcus Vance',
      line1: '500 Market St',
      city: 'San Francisco',
      state: 'CA',
      postal: '94105',
      country: 'US',
    },
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>(mockOrders);
  const [filterFinancial, setFilterFinancial] = useState<string>('all');
  const [filterFulfillment, setFilterFulfillment] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Selected for Packing Slip modal
  const [activePackingSlip, setActivePackingSlip] = useState<OrderItem | null>(null);

  // Selected for Fulfillment Assignment modal
  const [activeFulfillmentOrder, setActiveFulfillmentOrder] = useState<OrderItem | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('FedEx Express');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.order_number.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase());

      const matchFin = filterFinancial === 'all' || o.financial_status === filterFinancial;
      const matchFul = filterFulfillment === 'all' || o.fulfillment_status === filterFulfillment;

      return matchSearch && matchFin && matchFul;
    });
  }, [orders, search, filterFinancial, filterFulfillment]);

  // Handle Tracking Assignment & Fulfillment Update
  const assignTracking = (orderId: string) => {
    if (!trackingNumberInput.trim()) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              fulfillment_status: 'fulfilled',
              tracking_number: trackingNumberInput.trim(),
              carrier: carrierInput,
            }
          : o
      )
    );

    setActiveFulfillmentOrder(null);
    setTrackingNumberInput('');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20">
      {/* Top Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 font-bold tracking-tight text-white text-lg">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-md shadow-indigo-500/20">
                EP
              </span>
              <span>Merchant Admin</span>
            </div>
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-neutral-400">
              <Link href="/dashboard" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800/60 transition">
                Dashboard
              </Link>
              <Link href="/products" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800/60 transition">
                Products
              </Link>
              <Link href="/orders" className="px-3 py-1.5 rounded-lg text-white bg-neutral-800">
                Orders
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Orders & Fulfillment</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Live transactional lifecycle, automated packing slips, and tracking assignments
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by order #, customer, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Financial:</span>
              <select
                value={filterFinancial}
                onChange={(e) => setFilterFinancial(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Fulfillment:</span>
              <select
                value={filterFulfillment}
                onChange={(e) => setFilterFulfillment(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200"
              >
                <option value="all">All</option>
                <option value="unfulfilled">Unfulfilled</option>
                <option value="fulfilled">Fulfilled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order Table */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Fulfillment</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-900/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400">
                      {order.created_at}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{order.customer_name}</span>
                      <span className="text-neutral-500 text-xs">{order.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          order.financial_status === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {order.financial_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold w-fit capitalize ${
                            order.fulfillment_status === 'fulfilled'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {order.fulfillment_status}
                        </span>
                        {order.tracking_number && (
                          <span className="text-[11px] text-neutral-500 font-mono">
                            {order.carrier}: {order.tracking_number}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ${order.grand_total.toFixed(2)}
                      <span className="block text-[11px] text-neutral-500 font-normal">
                        {order.items_count} items
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActivePackingSlip(order)}
                          title="Generate Packing Slip"
                          className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {order.fulfillment_status === 'unfulfilled' && (
                          <button
                            onClick={() => {
                              setActiveFulfillmentOrder(order);
                              setTrackingNumberInput('');
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer shadow-md shadow-indigo-600/20"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Fulfill</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Packing Slip Modal */}
        {activePackingSlip && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-8 shadow-2xl relative text-neutral-100">
              <button
                onClick={() => setActivePackingSlip(null)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-neutral-800 pb-4 mb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-white">PACKING SLIP</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">Order #{activePackingSlip.order_number}</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1.5 text-white"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>

              {/* Ship To */}
              <div className="mb-6 p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs space-y-1">
                <span className="font-semibold text-neutral-400 uppercase tracking-wider block mb-2">Ship To</span>
                <p className="font-bold text-white text-sm">{activePackingSlip.shipping_address.name}</p>
                <p className="text-neutral-300">{activePackingSlip.shipping_address.line1}</p>
                <p className="text-neutral-300">
                  {activePackingSlip.shipping_address.city}, {activePackingSlip.shipping_address.state}{' '}
                  {activePackingSlip.shipping_address.postal}
                </p>
                <p className="text-neutral-400">{activePackingSlip.shipping_address.country}</p>
              </div>

              {/* Items Snapshot */}
              <div className="space-y-3 mb-6">
                <span className="font-semibold text-neutral-400 uppercase tracking-wider text-xs block">Line Items</span>
                <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 overflow-hidden">
                  {activePackingSlip.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-neutral-950/40 text-xs">
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="text-neutral-500 font-mono">{item.sku}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-indigo-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={() => setActivePackingSlip(null)}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fulfillment Tracking Modal */}
        {activeFulfillmentOrder && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-neutral-100">
              <button
                onClick={() => setActiveFulfillmentOrder(null)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-base font-bold text-white mb-1">Assign Tracking & Fulfill</h2>
              <p className="text-xs text-neutral-400 mb-5">
                Order: <span className="font-mono text-indigo-400">{activeFulfillmentOrder.order_number}</span>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Carrier
                  </label>
                  <select
                    value={carrierInput}
                    onChange={(e) => setCarrierInput(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200"
                  >
                    <option value="FedEx Express">FedEx Express</option>
                    <option value="UPS Ground">UPS Ground</option>
                    <option value="DHL Express">DHL Express</option>
                    <option value="USPS Priority">USPS Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Tracking Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 794938210394"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => assignTracking(activeFulfillmentOrder.id)}
                  className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  Confirm Shipment & Notify Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
