'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Truck,
  MapPin,
  Lock,
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getApiBase } from '@/lib/config';

const API_BASE = getApiBase();

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartToken, refreshCart } = useCart();
  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;

  const [step, setStep] = useState<'shipping' | 'delivery' | 'payment'>('shipping');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  // Form State
  const [shippingAddress, setShippingAddress] = useState({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '+1 555 019 2831',
    addressLine1: '450 Sutter St, Suite 1200',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94108',
    country: 'United States',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const shippingCost = shippingMethod === 'express' ? 25.00 : 10.00;
  const grandTotal = subtotal + shippingCost;

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvv: '888',
  });

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'shipping') {
      if (!shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.postalCode) {
        setError('Please complete all required address fields.');
        return;
      }
      setError(null);
      setStep('delivery');
    } else if (step === 'delivery') {
      setStep('payment');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Concurrency idempotency key
    const idempotencyKey = `chk_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const payload = {
      cart_token: cartToken || localStorage.getItem('cart_token'),
      email: shippingAddress.email,
      customer_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      phone: shippingAddress.phone,
      idempotency_key: idempotencyKey,
      shipping_address: {
        address_line1: shippingAddress.addressLine1,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postal_code: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      shipping_method: shippingMethod,
      payment_method: 'credit_card',
    };

    try {
      const res = await fetch(`${API_BASE}/checkout/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Payment processing failed. Please check stock or card details.');
      }

      setOrderComplete(data.order || { order_number: 'ORD-' + Math.floor(Math.random() * 100000) });
      localStorage.removeItem('cart_token');
      await refreshCart();
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout processing.');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-stone-50 py-16 px-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl border border-stone-200 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">Order Confirmed!</h1>
          <p className="text-stone-600 text-sm mb-6">
            Thank you for your purchase. We have received your order and atomic stock reservations have been confirmed.
          </p>
          <div className="bg-stone-50 rounded-2xl p-4 mb-6 border border-stone-200 text-xs font-mono space-y-1">
            <p className="text-stone-500">Order Reference</p>
            <p className="text-stone-900 font-bold text-base">{orderComplete.order_number}</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition"
            >
              Continue Shopping
            </Link>
            <Link
              href="/account"
              className="flex-1 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-sm transition"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight">
            ATELIER & CO.
          </Link>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Flow */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-4 mb-10 text-xs font-semibold uppercase tracking-wider">
          <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-stone-900' : 'text-stone-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'}`}>
              1
            </span>
            <span>Shipping</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-300" />
          <div className={`flex items-center gap-2 ${step === 'delivery' ? 'text-stone-900' : 'text-stone-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 'delivery' ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'}`}>
              2
            </span>
            <span>Delivery Method</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-300" />
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-stone-900' : 'text-stone-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'}`}>
              3
            </span>
            <span>Payment</span>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 max-w-4xl mx-auto">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-2 space-y-8">
            {step === 'shipping' && (
              <form onSubmit={handleNextStep} className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
                <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-stone-700" />
                  <span>Shipping Address</span>
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      State / Region
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold transition"
                  >
                    Continue to Delivery
                  </button>
                </div>
              </form>
            )}

            {step === 'delivery' && (
              <form onSubmit={handleNextStep} className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
                <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-stone-700" />
                  <span>Select Delivery Rate</span>
                </h2>

                <div className="space-y-4">
                  <label className={`block p-4 rounded-2xl border cursor-pointer transition ${shippingMethod === 'standard' ? 'border-stone-900 bg-stone-50' : 'border-stone-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="w-4 h-4 text-stone-900"
                        />
                        <div>
                          <p className="font-semibold text-stone-900 text-sm">Standard Insured Ground</p>
                          <p className="text-xs text-stone-500">Delivered within 3-5 business days</p>
                        </div>
                      </div>
                      <span className="font-bold text-sm">$10.00</span>
                    </div>
                  </label>

                  <label className={`block p-4 rounded-2xl border cursor-pointer transition ${shippingMethod === 'express' ? 'border-stone-900 bg-stone-50' : 'border-stone-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'express'}
                          onChange={() => setShippingMethod('express')}
                          className="w-4 h-4 text-stone-900"
                        />
                        <div>
                          <p className="font-semibold text-stone-900 text-sm">Priority Courier Express</p>
                          <p className="text-xs text-stone-500">Next business day signature delivery</p>
                        </div>
                      </div>
                      <span className="font-bold text-sm">$25.00</span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="px-5 py-2.5 text-stone-600 hover:text-stone-900 text-sm font-medium"
                  >
                    Back to Address
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold transition"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}

            {step === 'payment' && (
              <form onSubmit={handlePlaceOrder} className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
                <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-stone-700" />
                  <span>Payment Information</span>
                </h2>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Simulated test mode enabled. No actual charges will be deducted.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardInfo.cardNumber}
                    onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={cardInfo.expDate}
                      onChange={(e) => setCardInfo({ ...cardInfo, expDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      required
                      value={cardInfo.cvv}
                      onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep('delivery')}
                    className="px-5 py-2.5 text-stone-600 hover:text-stone-900 text-sm font-medium"
                  >
                    Back to Delivery
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-stone-900 hover:bg-stone-800 active:bg-black text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <span>Authorize & Pay ${grandTotal.toFixed(2)}</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary Side */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
              <h3 className="font-serif font-bold text-stone-900 text-base">Order Summary</h3>

              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-stone-900">{item.variant?.product?.title || 'Catalog Product'}</p>
                      <p className="text-stone-500">{item.variant?.title} × {item.quantity}</p>
                    </div>
                    <span className="font-bold text-stone-900">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                {cartItems.length === 0 && (
                  <p className="py-4 text-xs text-stone-400 italic">No items in cart</p>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t border-stone-100 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimated Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-100">
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
