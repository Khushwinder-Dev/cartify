'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Check, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/currency';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!product) return;

    const primary = product.primary_media?.url || product.media?.[0]?.url || '';
    setSelectedMediaUrl(primary);

    const initialSelections: Record<string, string> = {};
    product.options?.forEach((opt) => {
      if (opt.values && opt.values.length > 0) {
        initialSelections[opt.name] = opt.values[0].value;
      }
    });
    setSelectedOptions(initialSelections);

    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleOptionSelect = (optionName: string, value: string) => {
    const nextSelections = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(nextSelections);

    const matched = product.variants?.find((variant) => {
      if (!variant.option_values || variant.option_values.length === 0) return true;
      return Object.entries(nextSelections).every(([optName, valName]) => {
        return variant.option_values?.some((ov) => ov.value === valName);
      });
    });

    if (matched) {
      setSelectedVariant(matched);
      if (matched.media && matched.media.length > 0) {
        setSelectedMediaUrl(matched.media[0].url);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    try {
      await addToCart(selectedVariant.id, quantity);
      onClose();
    } finally {
      setIsAdding(false);
    }
  };

  const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.min_price || 0);
  const compareAtPrice = selectedVariant?.compare_at_price ? Number(selectedVariant.compare_at_price) : null;
  const isOutOfStock = selectedVariant ? !selectedVariant.is_available : false;
  const stockQuantity = selectedVariant?.inventory_quantity || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 relative">
            <img
              src={selectedMediaUrl || product.primary_media?.url || ''}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.vendor && (
              <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {product.vendor}
              </span>
            )}
          </div>

          {/* Purchasing Box */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                {product.product_type || 'Curated Design'}
              </span>
              <h2 className="text-xl font-black text-neutral-950 dark:text-white mt-1">
                {product.title}
              </h2>

              <div className="mt-3 flex items-baseline space-x-3">
                <span className="text-2xl font-black text-neutral-950 dark:text-white">
                  {formatPrice(currentPrice)}
                </span>
                {compareAtPrice && compareAtPrice > currentPrice && (
                  <span className="text-sm line-through text-neutral-400">
                    {formatPrice(compareAtPrice)}
                  </span>
                )}
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">
                    Sold Out
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> In Stock ({stockQuantity})
                  </span>
                )}
              </div>

              {/* Dynamic Option Selectors */}
              {product.options && product.options.length > 0 && (
                <div className="mt-5 space-y-3">
                  {product.options.map((opt) => (
                    <div key={opt.id}>
                      <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        {opt.name}: <span className="font-normal text-neutral-500">{selectedOptions[opt.name]}</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {opt.values?.map((val) => {
                          const isSelected = selectedOptions[opt.name] === val.value;
                          return (
                            <button
                              key={val.id}
                              onClick={() => handleOptionSelect(opt.name, val.value)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                isSelected
                                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-sm'
                                  : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400'
                              }`}
                            >
                              {val.value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || isOutOfStock}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdding ? 'Adding...' : isOutOfStock ? 'Sold Out' : 'Quick Add to Bag'}</span>
                </button>
              </div>

              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="w-full py-2 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center gap-1"
              >
                <span>View Full Product Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
