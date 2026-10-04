'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Mail,
  Copy,
  CheckCircle,
  Clock,
  DollarSign,
  AlertCircle,
  Search,
  Filter,
  ArrowUpRight,
  Send,
  Eye,
  X,
  ExternalLink,
  Percent,
  RefreshCw,
  User,
  ShoppingBag,
} from 'lucide-react';

interface CartItem {
  id: number;
  title: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

interface AbandonedCart {
  id: number;
  cartToken: string;
  customerName: string;
  email: string;
  phone: string;
  abandonedAt: string;
  itemsCount: number;
  subtotal: number;
  status: 'unrecovered' | 'reminder_sent' | 'recovered';
  items: CartItem[];
}

export default function AdminAbandonedCartsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unrecovered' | 'reminder_sent' | 'recovered'>('all');
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);
  const [emailModalCart, setEmailModalCart] = useState<AbandonedCart | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [discountCode, setDiscountCode] = useState('RECOVER10');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Realistic mock data for Cartify apparel abandoned checkouts
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([
    {
      id: 101,
      cartToken: 'cart_tok_9824_a1b2',
      customerName: 'Marcus Vance',
      email: 'marcus.v@example.com',
      phone: '+1 (555) 349-8812',
      abandonedAt: '2 hours ago',
      itemsCount: 2,
      subtotal: 325.00,
      status: 'unrecovered',
      items: [
        {
          id: 1,
          title: 'Minimalist Japanese Wool Overshirt',
          variant: 'Charcoal / L',
          price: 185.00,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
        },
        {
          id: 2,
          title: 'Relaxed Linen Pleated Trousers',
          variant: 'Natural Ecru / 34',
          price: 140.00,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=400&q=80',
        },
      ],
    },
    {
      id: 102,
      cartToken: 'cart_tok_7719_f3e4',
      customerName: 'Claire Dupont',
      email: 'claire.dupont@paris.fr',
      phone: '+33 6 12 34 56 78',
      abandonedAt: '5 hours ago',
      itemsCount: 1,
      subtotal: 265.00,
      status: 'reminder_sent',
      items: [
        {
          id: 3,
          title: 'Pure Mongolian Cashmere Crewneck',
          variant: 'Caramel Camel / M',
          price: 265.00,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80',
        },
      ],
    },
    {
      id: 103,
      cartToken: 'cart_tok_5541_c9d8',
      customerName: 'Elena Rostova',
      email: 'elena.rostova@design.com',
      phone: '+1 (555) 778-9012',
      abandonedAt: 'Yesterday',
      itemsCount: 3,
      subtotal: 498.00,
      status: 'unrecovered',
      items: [
        {
          id: 4,
          title: 'Structured Cotton Gabardine Trench',
          variant: 'Classic Honey / M',
          price: 340.00,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80',
        },
        {
          id: 5,
          title: 'Heavyweight Organic Cotton T-Shirt',
          variant: 'Optic White / M',
          price: 48.00,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
        },
      ],
    },
    {
      id: 104,
      cartToken: 'cart_tok_3320_b5a6',
      customerName: 'Lucas Thorne',
      email: 'lucas.thorne@brooklyn.co',
      phone: '+1 (555) 912-3344',
      abandonedAt: '2 days ago',
      itemsCount: 1,
      subtotal: 110.00,
      status: 'recovered',
      items: [
        {
          id: 6,
          title: 'French Terry Loopback Hoodie',
          variant: 'Heather Ash / L',
          price: 110.00,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
        },
      ],
    },
  ]);

  const handleCopyRecoveryUrl = (cart: AbandonedCart) => {
    const recoveryUrl = `http://localhost:3000/checkout?cart_token=${cart.cartToken}&discount=${discountCode}`;
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(recoveryUrl);
      setSuccessToast(`Copied recovery link for ${cart.customerName}!`);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const handleSendRecoveryEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalCart) return;

    setSendingEmail(true);
    setTimeout(() => {
      setAbandonedCarts((prev) =>
        prev.map((c) =>
          c.id === emailModalCart.id ? { ...c, status: 'reminder_sent' as const } : c
        )
      );
      setSendingEmail(false);
      setEmailModalCart(null);
      setSuccessToast(`Recovery email dispatched to ${emailModalCart.email}!`);
      setTimeout(() => setSuccessToast(null), 3000);
    }, 700);
  };

  const filteredCarts = abandonedCarts.filter((cart) => {
    const matchesSearch =
      cart.customerName.toLowerCase().includes(search.toLowerCase()) ||
      cart.email.toLowerCase().includes(search.toLowerCase()) ||
      cart.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || cart.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAbandonedValue = abandonedCarts
    .filter((c) => c.status !== 'recovered')
    .reduce((sum, c) => sum + c.subtotal, 0);

  const totalRecoveredValue = abandonedCarts
    .filter((c) => c.status === 'recovered')
    .reduce((sum, c) => sum + c.subtotal, 0);

  return (
    <div className="min-h-full bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShoppingCart className="w-4 h-4" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white">Abandoned Carts Recovery</h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Recover high-intent shopper checkouts with automated reminders and discount incentives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400">
              Recovery Benchmark: <strong className="text-emerald-400 font-semibold">18.4% industry average</strong>
            </span>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in shadow-lg">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Unrecovered Cart Value
            </span>
            <div className="text-3xl font-extrabold text-amber-400 tracking-tight mt-3">
              ${totalAbandonedValue.toFixed(2)}
            </div>
            <div className="mt-2 text-xs text-neutral-500 font-medium">
              3 active sessions eligible for email
            </div>
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Recovered Revenue
            </span>
            <div className="text-3xl font-extrabold text-emerald-400 tracking-tight mt-3">
              ${totalRecoveredValue.toFixed(2)}
            </div>
            <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+24.5% vs last month</span>
            </div>
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Recovery Conversion Rate
            </span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-3">
              25.0%
            </div>
            <div className="mt-2 text-xs text-neutral-400 font-medium">
              1 of 4 checkouts converted
            </div>
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Automated Flow Status
            </span>
            <div className="text-3xl font-extrabold text-indigo-400 tracking-tight mt-3">
              Active
            </div>
            <div className="mt-2 text-xs text-neutral-400 font-medium">
              Sends 1h & 24h after abandonment
            </div>
          </div>
        </div>

        {/* Table Filter & Search Controls */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search buyer name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-1 text-xs">
                {(['all', 'unrecovered', 'reminder_sent', 'recovered'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1 rounded-lg font-medium capitalize transition cursor-pointer ${
                      statusFilter === tab
                        ? 'bg-neutral-800 text-white font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tab.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-neutral-400">
              Showing <strong>{filteredCarts.length}</strong> checkout sessions
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Garments Abandoned</th>
                  <th className="py-3 px-4">Cart Value</th>
                  <th className="py-3 px-4">Time Since Session</th>
                  <th className="py-3 px-4">Recovery Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40">
                {filteredCarts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-neutral-900/50 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-white block text-sm">{cart.customerName}</span>
                        <span className="text-neutral-400 text-xs">{cart.email}</span>
                        <span className="text-neutral-500 text-[11px] block">{cart.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 overflow-hidden">
                          {cart.items.map((item) => (
                            <img
                              key={item.id}
                              src={item.image}
                              alt={item.title}
                              className="inline-block h-8 w-8 rounded-lg object-cover ring-2 ring-neutral-900"
                            />
                          ))}
                        </div>
                        <span className="text-neutral-300 font-medium">
                          {cart.itemsCount} {cart.itemsCount === 1 ? 'garment' : 'garments'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white text-sm">
                      ${cart.subtotal.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{cart.abandonedAt}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {cart.status === 'unrecovered' ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
                          Unrecovered
                        </span>
                      ) : cart.status === 'reminder_sent' ? (
                        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-semibold flex items-center gap-1 w-fit">
                          <Mail className="w-3 h-3" /> Reminder Sent
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> Recovered
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCart(cart)}
                          className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                          title="View Cart Contents"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleCopyRecoveryUrl(cart)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
                          title="Copy Direct Recovery URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {cart.status !== 'recovered' && (
                          <button
                            onClick={() => setEmailModalCart(cart)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send Email</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCarts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-500">
                      No matching abandoned carts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Cart Dossier Modal */}
        {selectedCart && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-neutral-100">
              <button
                onClick={() => setSelectedCart(null)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Cart Session: #{selectedCart.id}</h3>
                  <p className="text-xs text-neutral-400">{selectedCart.customerName} • {selectedCart.email}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
                {selectedCart.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-white text-xs">{item.title}</p>
                        <p className="text-[11px] text-neutral-400">{item.variant}</p>
                        <p className="text-[10px] text-neutral-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-white text-xs">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs mb-6">
                <span className="text-neutral-400 font-semibold">Total Recoverable Subtotal:</span>
                <span className="font-extrabold text-emerald-400 text-base">${selectedCart.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => setSelectedCart(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const c = selectedCart;
                    setSelectedCart(null);
                    setEmailModalCart(c);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
                >
                  Send Recovery Email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Recovery Email Modal */}
        {emailModalCart && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-neutral-100">
              <button
                onClick={() => setEmailModalCart(null)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Send Cart Recovery Email</h3>
                  <p className="text-xs text-neutral-400">Recipient: {emailModalCart.email}</p>
                </div>
              </div>

              <form onSubmit={handleSendRecoveryEmail} className="space-y-4 text-xs mt-4">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Subject Line</label>
                  <input
                    type="text"
                    defaultValue="You left something timeless behind at Cartify"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Incentive Discount Code</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-indigo-400 uppercase font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-neutral-500 shrink-0">10% OFF coupon</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                  <p className="font-semibold text-neutral-200">Email Preview Content:</p>
                  <p>
                    "Hi {emailModalCart.customerName}, we saved the garments in your bag. Complete your order today and use code <strong>{discountCode}</strong> for 10% off."
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setEmailModalCart(null)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingEmail ? 'Sending...' : 'Dispatch Email'}</span>
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
