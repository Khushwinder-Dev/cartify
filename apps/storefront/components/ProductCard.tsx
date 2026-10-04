'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, Heart, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { LuxuryProduct } from '@/data/mock-clothing-catalog';
import { formatPrice } from '@/lib/currency';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: LuxuryProduct;
  onQuickView?: (product: LuxuryProduct) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [addingSize, setAddingSize] = useState<string | null>(null);
  const [addedSize, setAddedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Active image: if color has specific image, use it; on hover, show secondary image
  const currentColor = product.colors[selectedColorIdx] || product.colors[0];
  const activeImage = isHovered
    ? product.secondary_image
    : currentColor?.image || product.primary_image;

  const handleQuickAddSize = async (size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setAddingSize(size);
    try {
      // Add product with fake/first variant ID
      await addToCart(product.id, 1);
      setAddedSize(size);
      setTimeout(() => setAddedSize(null), 2000);
    } catch (err) {
      console.error('Failed to quick add size:', err);
    } finally {
      setAddingSize(null);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      className="group relative flex flex-col bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/90 dark:border-neutral-800/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Container with 4:5 Aspect Ratio */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={activeImage}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                product.badge === 'Limited Drop'
                  ? 'bg-rose-600 text-white'
                  : product.badge === 'Best Seller'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                  : product.badge === 'Low Stock'
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist & Quick View Floating Action Buttons */}
        <div className="absolute top-3.5 right-3.5 flex flex-col gap-2 z-10">
          <button
            onClick={handleToggleWishlist}
            className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition shadow-md cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 dark:bg-neutral-900/90 text-neutral-700 dark:text-neutral-300 hover:text-rose-500'
            }`}
            aria-label="Wishlist item"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 backdrop-blur-md flex items-center justify-center transition shadow-md opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Quick preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Slide-Up Quick Add Size Pill Drawer */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/85 via-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 text-center">
            {addedSize ? `Added ${addedSize} to bag!` : 'Quick Select Size'}
          </span>
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => handleQuickAddSize(size, e)}
                disabled={addingSize !== null}
                className={`min-w-8 h-8 px-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                  addedSize === size
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/90 hover:bg-white text-neutral-950 active:scale-95 shadow-xs'
                }`}
              >
                {addingSize === size ? (
                  <span className="w-3 h-3 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                ) : addedSize === size ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  size
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Swatches & Type */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              {product.product_type}
            </span>

            {/* Color Swatch Selectors */}
            {product.colors.length > 0 && (
              <div className="flex items-center gap-1.5">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedColorIdx(idx);
                    }}
                    title={color.name}
                    className={`w-3.5 h-3.5 rounded-full border transition cursor-pointer ${
                      selectedColorIdx === idx
                        ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-white dark:ring-offset-neutral-900 scale-110'
                        : 'border-neutral-300 dark:border-neutral-700 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <Link href={`/products/${product.slug}`}>{product.title}</Link>
          </h3>

          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline justify-between pt-1 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-neutral-950 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && (
              <span className="text-xs line-through text-neutral-400">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          <span className="text-[10px] font-semibold text-neutral-400 font-mono">
            ★ {product.rating} ({product.reviews_count})
          </span>
        </div>
      </div>
    </div>
  );
}
