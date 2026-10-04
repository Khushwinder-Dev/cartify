'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Heart,
  ArrowRight,
  Sparkles,
  Truck,
  RotateCcw,
  Scissors
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import SearchDialog from './SearchDialog';
import ThemeToggle from './ThemeToggle';

interface MegaMenuLink {
  label: string;
  href: string;
  badge?: 'NEW' | 'ICON' | 'CORE' | 'LIMITED';
}

interface MegaMenuColumn {
  title: string;
  href: string;
  links: MegaMenuLink[];
}

interface MegaMenuFeature {
  title: string;
  subtitle?: string;
  tag?: string;
  image: string;
  href: string;
  alt: string;
  ctaText?: string;
}

interface NavCategory {
  id: string;
  label: string;
  href: string;
  isAccent?: boolean;
  megaMenu?: {
    eyebrow?: string;
    mainHeading: string;
    mainLinkText: string;
    mainLinkHref: string;
    columns: MegaMenuColumn[];
    features: MegaMenuFeature[];
  };
}

const navCategories: NavCategory[] = [
  {
    id: 'new-featured',
    label: 'New & Featured',
    href: '/#catalog',
    megaMenu: {
      eyebrow: 'SPRING / SUMMER 2026 DROP',
      mainHeading: 'New & Featured Arrivals',
      mainLinkText: 'Explore Entire Collection',
      mainLinkHref: '/#catalog',
      columns: [
        {
          title: 'Curated Drops',
          href: '/#catalog',
          links: [
            { label: 'The Foundation Capsule', href: '/#catalog', badge: 'NEW' },
            { label: 'Heavyweight Loopback Fleece', href: '/#catalog', badge: 'ICON' },
            { label: 'Selvedge Denim Drop', href: '/#catalog', badge: 'LIMITED' },
            { label: 'Spring Linen Overalls', href: '/#catalog' },
            { label: 'Best Seller Archive', href: '/#catalog' },
          ],
        },
        {
          title: 'Apparel Categories',
          href: '/#catalog',
          links: [
            { label: 'Overshirts & Jackets', href: '/#catalog' },
            { label: 'French Terry Hoodies', href: '/#catalog' },
            { label: 'Heavyweight Crewnecks', href: '/#catalog' },
            { label: 'Tailored Wide Trousers', href: '/#catalog' },
            { label: '280 GSM Relaxed Tees', href: '/#catalog' },
          ],
        },
        {
          title: 'Craft & Fabric Origin',
          href: '/#catalog',
          links: [
            { label: 'Japanese Melton Wool (420 GSM)', href: '/#catalog', badge: 'CORE' },
            { label: 'Portuguese Organic Cotton', href: '/#catalog' },
            { label: '14.5oz Kurabo Shuttle Loom', href: '/#catalog' },
            { label: 'GOTS Organic Certifications', href: '/about' },
            { label: 'Our Atelier Production', href: '/about' },
          ],
        },
      ],
      features: [
        {
          title: 'THE FOUNDATION HOODIE',
          subtitle: '500 GSM Portuguese Loopback Terry',
          tag: 'LIMITED DROP',
          image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
          href: '/#catalog',
          alt: 'Heavyweight loopback terry hoodie',
          ctaText: 'Shop the Look',
        },
        {
          title: 'RAW SELVEDGE CAPSULE',
          subtitle: '14.5oz Shuttle Loom Kurabo Denim',
          tag: 'EXCLUSIVE',
          image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
          href: '/#catalog',
          alt: 'Raw selvedge denim collection',
          ctaText: 'Explore Denim',
        },
      ],
    },
  },
  {
    id: 'tops-knitwear',
    label: 'Tops & Knitwear',
    href: '/#catalog',
    megaMenu: {
      eyebrow: 'Milled Everyday Silhouettes',
      mainHeading: 'Artisanal Tops & Knitwear',
      mainLinkText: 'View All Tops',
      mainLinkHref: '/#catalog',
      columns: [
        {
          title: 'T-Shirts & Base Layers',
          href: '/#catalog',
          links: [
            { label: '280 GSM Boxy Heavyweight Tee', href: '/#catalog', badge: 'ICON' },
            { label: 'Waffle-Knit Thermal Henleys', href: '/#catalog' },
            { label: 'Classic Crewneck Essentials', href: '/#catalog', badge: 'CORE' },
            { label: 'Drop-Shoulder Long Sleeves', href: '/#catalog' },
            { label: 'Fine Gauge Merino Polos', href: '/#catalog' },
          ],
        },
        {
          title: 'Sweats & Knitwear',
          href: '/#catalog',
          links: [
            { label: 'Heavy French Terry Hoodies', href: '/#catalog', badge: 'NEW' },
            { label: 'Ribbed Crewneck Sweatshirts', href: '/#catalog' },
            { label: 'Pure Mongolian Cashmere Knits', href: '/#catalog', badge: 'LIMITED' },
            { label: 'Half-Zip Milano Stitch Sweaters', href: '/#catalog' },
            { label: 'Cardigans with Horn Buttons', href: '/#catalog' },
          ],
        },
        {
          title: 'Button-Downs & Overshirts',
          href: '/#catalog',
          links: [
            { label: 'Japanese Chambray Workshirts', href: '/#catalog' },
            { label: 'Heavy Oxford Cloth Button Downs', href: '/#catalog' },
            { label: 'Camp Collar Tencel Shirts', href: '/#catalog' },
            { label: 'Flannel Overshirts', href: '/#catalog' },
          ],
        },
      ],
      features: [
        {
          title: 'THE 280GSM RELAXED TEE',
          subtitle: 'Double-needle bound collar that never curls',
          tag: 'CORE ICON',
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
          href: '/#catalog',
          alt: 'Relaxed cotton heavyweight t-shirt',
          ctaText: 'Discover Tees',
        },
        {
          title: 'THE CRAWFORD CASHMERE',
          subtitle: 'Grade-A 2-ply Mongolian Cashmere',
          tag: 'PRIVATE ATELIER',
          image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
          href: '/#catalog',
          alt: 'Pure cashmere ribbed sweater',
          ctaText: 'Shop Knitwear',
        },
      ],
    },
  },
  {
    id: 'outerwear',
    label: 'Outerwear',
    href: '/#catalog',
    megaMenu: {
      eyebrow: 'Architectural Layering',
      mainHeading: 'Jackets & Tailored Outerwear',
      mainLinkText: 'All Outerwear & Coats',
      mainLinkHref: '/#catalog',
      columns: [
        {
          title: 'Jackets & Overshirts',
          href: '/#catalog',
          links: [
            { label: 'Japanese Melton Wool Overshirt', href: '/#catalog', badge: 'ICON' },
            { label: 'Heavy Cotton Twill Chore Coats', href: '/#catalog' },
            { label: 'Waxed Canvas Field Jackets', href: '/#catalog', badge: 'NEW' },
            { label: 'Unlined Linen Studio Jackets', href: '/#catalog' },
          ],
        },
        {
          title: 'Overcoats & Trenchwear',
          href: '/#catalog',
          links: [
            { label: 'Gabardine Double-Breasted Trench', href: '/#catalog', badge: 'LIMITED' },
            { label: 'Heavyweight Melton Wool Topcoats', href: '/#catalog' },
            { label: 'Primaloft Insulated Utility Parkas', href: '/#catalog' },
            { label: 'Classic Peacoats', href: '/#catalog' },
          ],
        },
        {
          title: 'Technical Sourcing',
          href: '/#catalog',
          links: [
            { label: 'Water-Repellent Dry-Wax Finish', href: '/#catalog' },
            { label: 'Recycled Primaloft Insulation', href: '/#catalog' },
            { label: 'Custom Horn & Corozo Buttons', href: '/#catalog' },
          ],
        },
      ],
      features: [
        {
          title: 'THE MELTON OVERSHIRT',
          subtitle: '420 GSM Double-Faced Japanese Wool',
          tag: 'BEST SELLER',
          image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
          href: '/#catalog',
          alt: 'Japanese wool overshirt jacket',
          ctaText: 'Explore Jacket',
        },
        {
          title: 'THE GABARDINE TRENCH',
          subtitle: 'Waterproof tight-weave cotton stormwear',
          tag: 'NEW ARRIVAL',
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
          href: '/#catalog',
          alt: 'Trench coat outerwear',
          ctaText: 'View Trench',
        },
      ],
    },
  },
  {
    id: 'bottoms',
    label: 'Bottoms',
    href: '/#catalog',
    megaMenu: {
      eyebrow: 'Precision Cut Tailoring',
      mainHeading: 'Pants, Denim & Trousers',
      mainLinkText: 'Explore All Bottoms',
      mainLinkHref: '/#catalog',
      columns: [
        {
          title: 'Denim & Selvedge',
          href: '/#catalog',
          links: [
            { label: '14.5oz Kurabo Selvedge Denim', href: '/#catalog', badge: 'ICON' },
            { label: 'Relaxed Taper Raw Indigo Jeans', href: '/#catalog' },
            { label: 'Vintage Washed Stone Denim', href: '/#catalog' },
            { label: 'Straight-Leg Ecru Denim', href: '/#catalog', badge: 'NEW' },
          ],
        },
        {
          title: 'Trousers & Chinos',
          href: '/#catalog',
          links: [
            { label: 'Relaxed Single-Pleat Trousers', href: '/#catalog', badge: 'CORE' },
            { label: 'Heavy Cotton Twill Camp Fatigue', href: '/#catalog' },
            { label: 'Normandy Linen Studio Pants', href: '/#catalog' },
            { label: 'Everyday Tailored Chinos', href: '/#catalog' },
          ],
        },
        {
          title: 'Tailoring & Sizing',
          href: '/#catalog',
          links: [
            { label: 'Complimentary Atelier Hemming', href: '/contact' },
            { label: 'Inseam & Rise Measurement Guide', href: '/policy' },
            { label: 'Selvedge Shrink-to-Fit Manual', href: '/policy' },
          ],
        },
      ],
      features: [
        {
          title: 'THE SINGLE-PLEAT TROUSER',
          subtitle: 'Tropical wool blend with relaxed drape',
          tag: 'STUDIO ESSENTIAL',
          image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
          href: '/#catalog',
          alt: 'Pleated trousers',
          ctaText: 'Shop Trousers',
        },
        {
          title: '14.5OZ SHUTTLE DENIM',
          subtitle: 'Red-line selvedge ID woven on vintage Toyoda looms',
          tag: 'HERITAGE CRAFT',
          image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
          href: '/#catalog',
          alt: 'Raw selvedge denim jeans',
          ctaText: 'Shop Selvedge',
        },
      ],
    },
  },
  {
    id: 'accessories',
    label: 'Accessories',
    href: '/#catalog',
    megaMenu: {
      eyebrow: 'Everyday Leather & Goods',
      mainHeading: 'Curated Accessories',
      mainLinkText: 'All Everyday Carry',
      mainLinkHref: '/#catalog',
      columns: [
        {
          title: 'Vegetable-Tanned Leather',
          href: '/#catalog',
          links: [
            { label: 'English Bridle Leather Belts', href: '/#catalog', badge: 'ICON' },
            { label: 'Minimalist Bifold Card Cases', href: '/#catalog', badge: 'NEW' },
            { label: 'Solid Brass Key Fobs', href: '/#catalog' },
            { label: 'Waxed Canvas Carryall Duffel', href: '/#catalog' },
          ],
        },
        {
          title: 'Knit & Headwear',
          href: '/#catalog',
          links: [
            { label: '7-Gauge Cashmere Ribbed Beanie', href: '/#catalog' },
            { label: 'Heavy Twill Unstructured Caps', href: '/#catalog' },
            { label: 'Italian Merino Wool Scarves', href: '/#catalog' },
            { label: 'Organic Combed Cotton Socks (3-Pack)', href: '/#catalog', badge: 'CORE' },
          ],
        },
        {
          title: 'Atelier Care',
          href: '/#catalog',
          links: [
            { label: 'Natural Beeswax Leather Dressing', href: '/#catalog' },
            { label: 'Cashmere Comb & Cedar Blocks', href: '/#catalog' },
          ],
        },
      ],
      features: [
        {
          title: 'BRIDLE LEATHER BELTS',
          subtitle: 'Hand-burnished edges with solid brass buckles',
          tag: 'LEATHER GOODS',
          image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
          href: '/#catalog',
          alt: 'Handmade leather belt',
          ctaText: 'View Leather Goods',
        },
        {
          title: 'CASHMERE HEADWEAR',
          subtitle: 'Ultra-soft Scottish spun cashmere yarns',
          tag: 'WARMTH',
          image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',
          href: '/#catalog',
          alt: 'Cashmere beanie and accessories',
          ctaText: 'Shop Hats & Scarves',
        },
      ],
    },
  },
  {
    id: 'last-call',
    label: 'Sale',
    href: '/#catalog',
    isAccent: true,
  },
];

const announcements = [
  'COMPLIMENTARY PAN-INDIA EXPRESS SHIPPING ON ORDERS OVER ₹999',
  'SPRING / SUMMER 2026 DROP LIVE • PRIVATE ATELIER ACCESS OPEN',
  'USE CODE CARTIFY10 FOR 10% OFF YOUR FIRST ORDER',
];

export default function Navbar() {
  const { cart, openCart } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Announcement index
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  // Active Mega Menu tracking
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search dialog state (Command Palette)
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>('new-featured');

  // Rotate announcement automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevAnnouncement = () => {
    setAnnouncementIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNextAnnouncement = () => {
    setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
  };

  const handleMouseEnter = (catId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    const cat = navCategories.find((c) => c.id === catId);
    if (cat?.megaMenu) {
      setActiveMenuId(catId);
    } else {
      setActiveMenuId(null);
    }
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenuId(null);
    }, 200);
  };

  const activeCategory = navCategories.find((c) => c.id === activeMenuId);

  return (
    <>
      {/* 1. Top Announcement Bar (Editorial Minimalist Ticker) */}
      <div className="bg-neutral-950 text-white py-2.5 px-4 select-none relative z-50 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <button
            onClick={handlePrevAnnouncement}
            className="p-1 text-neutral-400 hover:text-white transition cursor-pointer"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="text-center font-bold tracking-[0.2em] uppercase text-[10.5px] sm:text-[11.5px] text-neutral-200 font-sans transition-all duration-300">
            {announcements[announcementIndex]}
          </div>

          <button
            onClick={handleNextAnnouncement}
            className="p-1 text-neutral-400 hover:text-white transition cursor-pointer"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Clean Crisp White Sticky Header with Dark Mode) */}
      <header
        className="sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-neutral-200/90 dark:border-zinc-800/80 shadow-xs transition-colors"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-6 lg:gap-10 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-neutral-900 dark:text-zinc-100 hover:text-black dark:hover:text-white cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="flex items-center group shrink-0">
              <span className="font-extrabold tracking-[0.22em] text-xl sm:text-2xl text-neutral-950 dark:text-white font-sans uppercase">
                CARTIFY
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Categories */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 h-full">
            {navCategories.map((cat) => {
              const isActive = activeMenuId === cat.id;
              return (
                <div
                  key={cat.id}
                  className="h-full flex items-center shrink-0"
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                >
                  <Link
                    href={cat.href}
                    className={`relative py-7 text-[13.5px] whitespace-nowrap transition-colors duration-150 ${
                      cat.isAccent
                        ? 'text-rose-600 hover:text-rose-700 font-semibold'
                        : isActive
                        ? 'text-neutral-950 dark:text-white font-semibold'
                        : 'text-neutral-700 dark:text-zinc-300 hover:text-neutral-950 dark:hover:text-white font-medium'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {/* Active Underline Pill */}
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-0 h-[2px] bg-neutral-950 dark:bg-white animate-in fade-in duration-150" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right: Utility Links & Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-neutral-800 dark:text-zinc-200 shrink-0">
            {/* Region / Currency Pill */}
            <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100/90 dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 text-neutral-800 dark:text-zinc-200 whitespace-nowrap shrink-0 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="whitespace-nowrap">India (₹)</span>
            </div>

            {/* Live Search Trigger (Cmd+K) */}
            <button
              onClick={() => setIsSearchDialogOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-neutral-600 dark:text-zinc-400 bg-neutral-100 dark:bg-zinc-900 hover:bg-neutral-200 dark:hover:bg-zinc-800 border border-transparent dark:border-zinc-800 transition cursor-pointer whitespace-nowrap shrink-0"
              aria-label="Search Catalog"
            >
              <Search className="w-3.5 h-3.5 text-neutral-500 dark:text-zinc-400 shrink-0" />
              <span className="hidden sm:inline font-medium">Search...</span>
              <kbd className="hidden lg:inline text-[10px] font-mono px-1 rounded bg-white dark:bg-zinc-800 text-neutral-400 dark:text-zinc-400 border border-neutral-200 dark:border-zinc-700 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle (Light / Dark / System) */}
            <ThemeToggle />

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="p-2 hover:text-black dark:hover:text-white transition cursor-pointer text-neutral-700 dark:text-zinc-300 relative"
              aria-label="View Wishlist"
              title="Saved Items"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
            </Link>

            {/* Account Icon */}
            {user ? (
              <div className="relative group">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-1 text-xs font-semibold text-neutral-800 dark:text-zinc-200 hover:text-black dark:hover:text-white"
                >
                  <div className="w-7 h-7 rounded-full bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center text-[10px] font-bold shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 hover:text-black dark:hover:text-white transition cursor-pointer text-neutral-700 dark:text-zinc-300"
                aria-label="Account Login"
                title="Sign In"
              >
                <UserIcon className="w-5 h-5 stroke-[1.75]" />
              </Link>
            )}

            {/* Shopping Bag Icon with Count Badge */}
            <button
              onClick={openCart}
              className="relative p-2 hover:text-black dark:hover:text-white transition cursor-pointer text-neutral-700 dark:text-zinc-300"
              aria-label="Cart Bag"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {cart && cart.items_count > 0 && (
                <span className="absolute top-0 right-0 bg-neutral-950 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cart.items_count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. Ultra-Premium Full-Width Mega Menu Dropdown */}
        {activeCategory?.megaMenu && (
          <div
            className="hidden lg:block absolute left-0 right-0 top-full bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl border-b border-neutral-200 dark:border-zinc-800 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.12)] z-40 transition-all duration-300 animate-in fade-in-0 slide-in-from-top-1.5"
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-7xl mx-auto px-8 py-10">
              {/* Category Header Strip */}
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-100 dark:border-zinc-800/80">
                <div className="flex items-baseline gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400 dark:text-zinc-500">
                    {activeCategory.megaMenu.eyebrow || 'CARTIFY ATELIER'}
                  </span>
                  <span className="text-neutral-300 dark:text-zinc-700">•</span>
                  <h3 className="text-lg font-bold text-neutral-950 dark:text-white tracking-tight">
                    {activeCategory.megaMenu.mainHeading}
                  </h3>
                </div>

                <Link
                  href={activeCategory.megaMenu.mainLinkHref}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-zinc-200 hover:text-neutral-600 dark:hover:text-white transition group"
                >
                  <span>{activeCategory.megaMenu.mainLinkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Grid: 3 Editorial Text Link Columns (7 Cols) + 2 Editorial Visual Cards (5 Cols) */}
              <div className="grid grid-cols-12 gap-10">
                {/* Left 7 Columns: 3 Structured Text Columns */}
                <div className="col-span-7 grid grid-cols-3 gap-8">
                  {activeCategory.megaMenu.columns.map((col, idx) => (
                    <div key={idx} className="space-y-4">
                      <div className="pb-2 border-b border-neutral-200 dark:border-zinc-800">
                        <Link
                          href={col.href}
                          className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-950 dark:text-white hover:text-neutral-600 dark:hover:text-zinc-300 transition block"
                        >
                          {col.title}
                        </Link>
                      </div>

                      <ul className="space-y-3">
                        {col.links.map((link, lIdx) => (
                          <li key={lIdx}>
                            <Link
                              href={link.href}
                              className="group flex items-center justify-between text-xs text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white transition-all py-0.5"
                            >
                              <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                                {link.label}
                              </span>
                              {link.badge && (
                                <span
                                  className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow-2xs ${
                                    link.badge === 'NEW'
                                      ? 'bg-neutral-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                                      : link.badge === 'LIMITED'
                                      ? 'bg-rose-600 text-white'
                                      : link.badge === 'ICON'
                                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                                      : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-zinc-300'
                                  }`}
                                >
                                  {link.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Right 5 Columns: 2 Curated Fashion Editorial Spotlight Cards */}
                <div className="col-span-5 grid grid-cols-2 gap-5">
                  {activeCategory.megaMenu.features.map((feature, fIdx) => (
                    <Link
                      key={fIdx}
                      href={feature.href}
                      className="group relative flex flex-col rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200/80 dark:border-zinc-800 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      {/* 4:5 Aspect Ratio Editorial Photo */}
                      <div className="aspect-[4/5] relative w-full overflow-hidden">
                        <img
                          src={feature.image}
                          alt={feature.alt}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                        {/* Top Tag Pill */}
                        {feature.tag && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md text-white border border-white/20">
                              {feature.tag}
                            </span>
                          </div>
                        )}

                        {/* Bottom Text Content & Action Pill */}
                        <div className="absolute bottom-3 inset-x-3 space-y-1.5 text-white">
                          <h4 className="text-xs font-bold uppercase tracking-wider leading-snug">
                            {feature.title}
                          </h4>
                          {feature.subtitle && (
                            <p className="text-[10px] text-neutral-300 font-light line-clamp-1">
                              {feature.subtitle}
                            </p>
                          )}
                          <div className="pt-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white group-hover:text-amber-300 transition-colors">
                              <span>{feature.ctaText || 'Shop Collection'}</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom Atelier Micro-Trust Strip inside the Mega Menu */}
              <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-zinc-800/80 grid grid-cols-3 gap-6 text-xs text-neutral-500 dark:text-zinc-400">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-zinc-900 flex items-center justify-center text-neutral-900 dark:text-zinc-100 shrink-0 border border-transparent dark:border-zinc-800">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white text-[11px] uppercase tracking-wider">
                      Complimentary Pan-India Shipping
                    </p>
                    <p className="text-[10px] text-neutral-400 dark:text-zinc-500">On all orders over ₹999</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-zinc-900 flex items-center justify-center text-neutral-900 dark:text-zinc-100 shrink-0 border border-transparent dark:border-zinc-800">
                    <Scissors className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white text-[11px] uppercase tracking-wider">
                      Complimentary Atelier Hemming
                    </p>
                    <p className="text-[10px] text-neutral-400 dark:text-zinc-500">Custom inseam lengths upon checkout</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-zinc-900 flex items-center justify-center text-neutral-900 dark:text-zinc-100 shrink-0 border border-transparent dark:border-zinc-800">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white text-[11px] uppercase tracking-wider">
                      30-Day Effortless Returns
                    </p>
                    <p className="text-[10px] text-neutral-400 dark:text-zinc-500">Prepaid domestic return consignment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Command Palette Live Search Dialog */}
        <SearchDialog
          isOpen={isSearchDialogOpen}
          onClose={() => setIsSearchDialogOpen(false)}
        />
      </header>

      {/* 4. Luxury Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-950 text-neutral-950 dark:text-zinc-100 h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300 border-r border-neutral-200 dark:border-zinc-800">
            {/* Drawer Header */}
            <div className="p-5 flex items-center justify-between border-b border-neutral-200 dark:border-zinc-800">
              <span className="font-extrabold tracking-[0.2em] text-lg text-neutral-950 dark:text-white uppercase">
                CARTIFY
              </span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded-lg transition"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Categories List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {navCategories.map((cat) => {
                const isExpanded = expandedMobileCategory === cat.id;
                return (
                  <div key={cat.id} className="border-b border-neutral-100 dark:border-zinc-800/80 pb-3">
                    <button
                      onClick={() =>
                        setExpandedMobileCategory(isExpanded ? null : cat.id)
                      }
                      className="w-full flex items-center justify-between py-2 text-left text-xs font-bold tracking-[0.16em] text-neutral-950 dark:text-zinc-100 uppercase"
                    >
                      <span className={cat.isAccent ? 'text-rose-600 dark:text-rose-400' : ''}>
                        {cat.label}
                      </span>
                      {cat.megaMenu && (
                        <ChevronDown
                          className={`w-4 h-4 text-neutral-400 dark:text-zinc-500 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>

                    {/* Accordion Content */}
                    {cat.megaMenu && isExpanded && (
                      <div className="pl-3 pt-2 pb-3 space-y-4">
                        <Link
                          href={cat.megaMenu.mainLinkHref}
                          onClick={() => setMobileMenuOpen(false)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-950 dark:text-zinc-200 uppercase tracking-wider"
                        >
                          <span>{cat.megaMenu.mainLinkText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        {cat.megaMenu.columns.map((col, cIdx) => (
                          <div key={cIdx} className="space-y-2">
                            <span className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-widest">
                              {col.title}
                            </span>
                            <ul className="space-y-1.5 pl-2">
                              {col.links.map((link, lIdx) => (
                                <li key={lIdx}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between text-xs text-neutral-700 dark:text-zinc-300 hover:text-black dark:hover:text-white py-0.5"
                                  >
                                    <span>{link.label}</span>
                                    {link.badge && (
                                      <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-zinc-300">
                                        {link.badge}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        {/* Mobile Feature Thumbnails */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {cat.megaMenu.features.map((f, fIdx) => (
                            <Link
                              key={fIdx}
                              href={f.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="group block text-center"
                            >
                              <div className="aspect-[4/5] bg-neutral-100 dark:bg-zinc-900 overflow-hidden rounded-xl border border-transparent dark:border-zinc-800">
                                <img
                                  src={f.image}
                                  alt={f.alt}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-900 dark:text-zinc-200 mt-1.5 block line-clamp-1">
                                {f.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Links in Drawer */}
            <div className="p-5 border-t border-neutral-200 dark:border-zinc-800 bg-neutral-50/80 dark:bg-zinc-900/60 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-zinc-800">
                <span className="text-neutral-500 dark:text-zinc-400 font-medium">Currency</span>
                <span className="font-bold text-neutral-900 dark:text-zinc-100">India (₹ INR)</span>
              </div>

              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-neutral-700 dark:text-zinc-300 hover:text-black dark:hover:text-white py-1 font-semibold"
              >
                <Truck className="w-4 h-4" />
                <span>Track Orders</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-neutral-700 dark:text-zinc-300 hover:text-black dark:hover:text-white py-1 font-semibold"
              >
                <Heart className="w-4 h-4" />
                <span>My Wishlist</span>
              </Link>
              {user ? (
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-zinc-800">
                  <span className="font-semibold text-neutral-900 dark:text-zinc-100 truncate">
                    {user.name}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-rose-600 dark:text-rose-400 hover:underline font-bold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-neutral-700 dark:text-zinc-300 hover:text-black dark:hover:text-white py-1 font-semibold"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In / Member Access</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
