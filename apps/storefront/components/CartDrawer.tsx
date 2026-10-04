'use client';

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/currency';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeItem, openCheckout } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isApplyingCode, setIsApplyingCode] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart?.subtotal || 0;
  const discountAmount = appliedDiscount?.amount || 0;
  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const estimatedShipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + estimatedShipping);

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountCode.trim()) return;

    setIsApplyingCode(true);
    setDiscountError(null);

    try {
      const res = await api.validateDiscount(discountCode, subtotal);
      setAppliedDiscount({
        code: res.data.discount.code,
        amount: res.data.discount_amount,
      });
      setDiscountCode('');
    } catch (err: any) {
      setDiscountError(err.message || 'Invalid or expired coupon');
    } finally {
      setIsApplyingCode(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col transform transition-transform ease-out duration-300">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-serif font-bold tracking-tight text-neutral-950 dark:text-white">Your Shopping Cart</h2>
              <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full font-semibold text-neutral-600 dark:text-neutral-400 tabular-nums">
                {cart?.items_count || 0}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-neutral-50 dark:bg-neutral-950/60 p-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span>
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    🎉 You unlocked Free Express Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-neutral-900 dark:text-white">{formatPrice(freeShippingThreshold - subtotal)}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-neutral-500">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!cart || cart.items?.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">Your cart is empty</h3>
                <p className="text-sm text-neutral-500 mb-6 max-w-xs">
                  Discover our curated catalog of luxury apparel, watches, and minimalist furniture.
                </p>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-4 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/80 dark:border-neutral-800/80 transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 relative">
                    <img
                      src={
                        item.variant?.media?.[0]?.url ||
                        item.variant?.product?.primary_media?.url ||
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={item.variant?.title || 'Product'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white line-clamp-1">
                        {item.variant?.product?.title || 'Luxury Item'}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {item.variant?.title !== 'Default Title' ? item.variant?.title : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1.5 border border-neutral-200 dark:border-neutral-700 rounded-lg p-0.5 bg-white dark:bg-neutral-900">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="w-6 h-6 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">
                          {formatPrice(item.total)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart && (cart.items?.length ?? 0) > 0 && (
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-4">
              {/* Discount Code Form */}
              <form onSubmit={handleApplyDiscount} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. WELCOME10)"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-wider"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isApplyingCode || !discountCode}
                  className="px-4 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isApplyingCode ? '...' : 'Apply'}
                </button>
              </form>

              {appliedDiscount && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                  <span className="flex items-center gap-1 font-semibold">
                    <Tag className="w-3.5 h-3.5" /> Coupon: {appliedDiscount.code}
                  </span>
                  <span>-{formatPrice(appliedDiscount.amount)}</span>
                </div>
              )}

              {discountError && <p className="text-xs text-rose-500 font-medium">{discountError}</p>}

              {/* Subtotal, Shipping, Grand Total */}
              <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums text-neutral-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="tabular-nums">{estimatedShipping === 0 ? <strong className="text-emerald-600">FREE</strong> : formatPrice(estimatedShipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-950 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span>Estimated Total</span>
                  <span className="text-indigo-600 dark:text-indigo-400 text-base tabular-nums">
                    {formatPrice(estimatedTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="proceed-to-checkout-btn"
                onClick={openCheckout}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 hover:opacity-95 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-neutral-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-bit Encrypted Checkout • Free 30-Day Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
