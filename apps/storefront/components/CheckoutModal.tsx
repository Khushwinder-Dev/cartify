'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Lock, CreditCard, Shield, Truck, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import { Order } from '@/lib/types';

export default function CheckoutModal() {
  const { cart, isCheckoutOpen, closeCheckout, cartToken, refreshCart } = useCart();

  const [formData, setFormData] = useState({
    email: 'eleanor.vance@example.com',
    customer_name: 'Eleanor Vance',
    phone: '+1 (555) 987-6543',
    address_line1: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    postal_code: '97477',
    country: 'US',
    shipping_rate: 'standard',
    discount_code: 'WELCOME10',
    card_number: '4242 •••• •••• 4242',
    card_expiry: '12/28',
    card_cvc: '888',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Generate unique idempotency key
    const idempotencyKey = `checkout_${crypto.randomUUID()}`;

    try {
      const payload = {
        idempotency_key: idempotencyKey,
        email: formData.email,
        customer_name: formData.customer_name,
        phone: formData.phone,
        shipping_address: {
          address_line1: formData.address_line1,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          shipping_rate: formData.shipping_rate,
        },
        discount_code: formData.discount_code || undefined,
      };

      const res = await api.processCheckout(payload, cartToken);
      setCompletedOrder(res.data.order);
      await refreshCart();
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please verify your address and inventory.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/50">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
              {completedOrder ? 'Order Confirmed' : 'Idempotent Secure Checkout'}
            </h3>
          </div>
          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-bold text-neutral-950 dark:text-white">
                  Thank you for your order!
                </h4>
                <p className="text-sm text-neutral-500 mt-1">
                  A receipt and tracking details have been sent to{' '}
                  <strong className="text-neutral-800 dark:text-neutral-200">{completedOrder.email}</strong>.
                </p>
              </div>

              {/* Order Specs Badge */}
              <div className="bg-neutral-50 dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left space-y-3">
                <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500">Order Number</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    {completedOrder.order_number}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Payment Status</span>
                  <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase text-[10px]">
                    {completedOrder.financial_status}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Fulfillment</span>
                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase text-[10px]">
                    {completedOrder.fulfillment_status}
                  </span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-neutral-200 dark:border-neutral-800 font-bold">
                  <span className="text-neutral-900 dark:text-white">Total Charged</span>
                  <span className="text-base text-neutral-900 dark:text-white">
                    ${Number(completedOrder.grand_total).toFixed(2)} {completedOrder.currency}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setCompletedOrder(null);
                  closeCheckout();
                }}
                className="w-full py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Customer Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Customer Contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      required
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 focus:bg-white dark:focus:bg-neutral-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 focus:bg-white dark:focus:bg-neutral-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Shipping Address</h4>
                <div>
                  <input
                    type="text"
                    name="address_line1"
                    placeholder="Street Address (e.g. 742 Evergreen Terrace)"
                    required
                    value={formData.address_line1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 focus:bg-white dark:focus:bg-neutral-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State / Region"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="postal_code"
                    placeholder="Postal Code"
                    required
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Card Payment (Stripe)</h4>
                  <div className="flex items-center space-x-1 text-xs text-neutral-400">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>256-bit SSL</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-3">
                  <div className="relative">
                    <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      name="card_number"
                      value={formData.card_number}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="card_expiry"
                      value={formData.card_expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="password"
                      name="card_cvc"
                      value={formData.card_cvc}
                      onChange={handleInputChange}
                      placeholder="CVC"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !cart || (cart.items?.length ?? 0) === 0}
                className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/25 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Executing Atomic Checkout...
                  </span>
                ) : (
                  <span>Complete Purchase • ${Number(cart?.subtotal || 0).toFixed(2)}</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
