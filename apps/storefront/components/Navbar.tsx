'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  LogOut,
  Package,
  Heart,
  HelpCircle,
  Info,
  ArrowRight
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface MegaMenuColumn {
  title: string;
  href: string;
  links: { label: string; href: string }[];
}

interface MegaMenuFeature {
  title: string;
  image: string;
  href: string;
  alt: string;
}

interface NavCategory {
  id: string;
  label: string;
  href: string;
  isAccent?: boolean;
  megaMenu?: {
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
      mainHeading: 'New & Featured',
      mainLinkText: 'All New Arrivals',
      mainLinkHref: '/#catalog',
      columns: [
        {
          title: 'Curated Drops',
          href: '/#catalog',
          links: [
            { label: 'The Spring Capsule', href: '/#catalog' },
            { label: 'Core Foundation', href: '/#catalog' },
            { label: 'Best Sellers', href: '/#catalog' },
            { label: 'Heavyweight Basics', href: '/#catalog' },
          ],
        },
        {
          title: 'Fabrics & Craft',
          href: '/#catalog',
          links: [
            { label: 'Organic Combed Cotton', href: '/#catalog' },
            { label: '480gsm French Terry', href: '/#catalog' },
            { label: 'Japanese Melton Wool', href: '/#catalog' },
            { label: 'Normandy Flax Linen', href: '/#catalog' },
          ],
        },
      ],
      features: [
        {
          title: 'THE FOUNDATION TEE',
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
          href: '/#catalog',
          alt: 'Heavyweight organic cotton tee',
        },
        {
          title: 'THE FRENCH TERRY HOODIE',
          image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80',
          href: '/#catalog',
          alt: 'Loopback terry hoodie',
        },
      ],
    },
  },
  {
    id: 'shirts-sweaters',
    label: 'Shirts & Sweaters',
    href: '/#catalog',
    megaMenu: {
      mainHeading: 'Shirts & Sweaters',
      mainLinkText: 'All Shirts & Sweaters',
      mainLinkHref: '/#catalog',
      columns: [
        {
          title: 'All Shirts & Button Downs',
          href: '/#catalog',
          links: [
            { label: 'Long Sleeves', href: '/#catalog' },
            { label: 'Oxfords', href: '/#catalog' },
            { label: 'Flannels', href: '/#catalog' },
            { label: 'Camp Collar Shirts', href: '/#catalog' },
            { label: 'Chambray Workshirts', href: '/#catalog' },
          ],
        },
        {
          title: 'All Tees & Sweaters',
          href: '/#catalog',
          links: [
            { label: 'Tees & Polos', href: '/#catalog' },
            { label: 'Sweaters', href: '/#catalog' },
            { label: 'Sweatshirts & Hoodies', href: '/#catalog' },
            { label: 'Waffle Henleys', href: '/#catalog' },
            { label: 'Cashmere Knitwear', href: '/#catalog' },
          ],
        },
      ],
      features: [
        {
          title: 'THE JACK',
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80',
          href: '/#catalog',
          alt: 'Tailored everyday button-down oxford shirt',
        },
        {
          title: 'THE CRAWFORD COLLECTION',
          image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=700&q=80',
          href: '/#catalog',
          alt: 'Pure Mongolian Cashmere ribbed crewneck',
        },
      ],
    },
  },
  {
    id: 'bottoms',
    label: 'Bottoms',
    href: '/#catalog',
    megaMenu: {
      mainHeading: 'Bottoms',
      mainLinkText: 'All Pants & Shorts',
      mainLinkHref: '/#catalog',
      columns: [
        {
          title: 'Trousers & Chinos',
          href: '/#catalog',
          links: [
            { label: 'Relaxed Pleated Trousers', href: '/#catalog' },
            { label: 'Everyday Cotton Chinos', href: '/#catalog' },
            { label: 'Normandy Linen Pants', href: '/#catalog' },
            { label: 'Camp Fatigue Pants', href: '/#catalog' },
          ],
        },
        {
          title: 'Denim & Shorts',
          href: '/#catalog',
          links: [
            { label: 'Japanese Selvedge Denim', href: '/#catalog' },
            { label: 'Raw Indigo Jeans', href: '/#catalog' },
            { label: 'Linen Trail Shorts', href: '/#catalog' },
            { label: 'Washed Twill Shorts', href: '/#catalog' },
          ],
        },
      ],
      features: [
        {
          title: 'THE CHORE TROUSER',
          image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80',
          href: '/#catalog',
          alt: 'Linen pleated trousers',
        },
        {
          title: 'SELVEDGE DENIM',
          image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80',
          href: '/#catalog',
          alt: 'Raw Japanese selvedge denim',
        },
      ],
    },
  },
  {
    id: 'outerwear',
    label: 'Outerwear',
    href: '/#catalog',
    megaMenu: {
      mainHeading: 'Outerwear',
      mainLinkText: 'All Jackets & Coats',
      mainLinkHref: '/#catalog',
      columns: [
        {
          title: 'Jackets & Overshirts',
          href: '/#catalog',
          links: [
            { label: 'Japanese Melton Wool Overshirt', href: '/#catalog' },
            { label: 'Cotton Twill Chore Jackets', href: '/#catalog' },
            { label: 'Dry Wax Field Jackets', href: '/#catalog' },
            { label: 'Classic Harrington Jackets', href: '/#catalog' },
          ],
        },
        {
          title: 'Coats & Stormwear',
          href: '/#catalog',
          links: [
            { label: 'Structured Gabardine Trench', href: '/#catalog' },
            { label: 'Double Breasted Peacoats', href: '/#catalog' },
            { label: 'Heavy Wool Topcoats', href: '/#catalog' },
            { label: 'Waterproof Parkas', href: '/#catalog' },
          ],
        },
      ],
      features: [
        {
          title: 'THE WOOL OVERSHIRT',
          image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=80',
          href: '/#catalog',
          alt: 'Minimalist Japanese wool overshirt',
        },
        {
          title: 'THE STORM TRENCH',
          image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=700&q=80',
          href: '/#catalog',
          alt: 'Structured cotton gabardine trench coat',
        },
      ],
    },
  },
  {
    id: 'accessories',
    label: 'Accessories',
    href: '/#catalog',
    megaMenu: {
      mainHeading: 'Accessories',
      mainLinkText: 'All Everyday Carry',
      mainLinkHref: '/#catalog',
      columns: [
        {
          title: 'Leather Goods',
          href: '/#catalog',
          links: [
            { label: 'English Bridle Leather Belts', href: '/#catalog' },
            { label: 'Bifold Card Wallets', href: '/#catalog' },
            { label: 'Key Fobs & Lanyards', href: '/#catalog' },
          ],
        },
        {
          title: 'Knit & Headwear',
          href: '/#catalog',
          links: [
            { label: 'Cashmere Ribbed Beanies', href: '/#catalog' },
            { label: 'Heavy Twill 6-Panel Caps', href: '/#catalog' },
            { label: 'Merino Wool Scarves', href: '/#catalog' },
            { label: 'Canvas Field Bags', href: '/#catalog' },
          ],
        },
      ],
      features: [
        {
          title: 'THE CARD WALLET',
          image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80',
          href: '/#catalog',
          alt: 'Leather card case',
        },
        {
          title: 'CASHMERE ESSENTIALS',
          image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=700&q=80',
          href: '/#catalog',
          alt: 'Cashmere knit beanie and scarf',
        },
      ],
    },
  },
  {
    id: 'last-call',
    label: 'Last Call',
    href: '/#catalog',
    isAccent: true,
  },
];

const announcements = [
  'FREE SHIPPING ON ALL ORDERS OVER ₹999',
  'TAKE 10% OFF YOUR FIRST ORDER WITH CODE: CARTIFY10',
  'COMPLIMENTARY GIFT PACKAGING ON ORDERS OVER ₹1,999',
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

  // Search popover state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>('shirts-sweaters');

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/#catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const activeCategory = navCategories.find((c) => c.id === activeMenuId);

  return (
    <>
      {/* 1. Top Announcement Bar (Taylor Stitch Style) */}
      <div className="bg-black text-white py-2 px-4 select-none relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrevAnnouncement}
            className="p-1 text-neutral-400 hover:text-white transition cursor-pointer"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center font-bold tracking-[0.16em] uppercase text-[11px] sm:text-xs text-neutral-100 font-sans transition-all duration-300">
            {announcements[announcementIndex]}
          </div>

          <button
            onClick={handleNextAnnouncement}
            className="p-1 text-neutral-400 hover:text-white transition cursor-pointer"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Clean Crisp White) */}
      <header
        className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200 shadow-sm"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-neutral-800 hover:text-black cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="flex items-center group">
              <span className="font-extrabold tracking-[0.22em] text-2xl text-neutral-900 font-sans uppercase">
                CARTIFY
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Categories */}
          <nav className="hidden lg:flex items-center space-x-7 h-full">
            {navCategories.map((cat) => {
              const isActive = activeMenuId === cat.id;
              return (
                <div
                  key={cat.id}
                  className="h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                >
                  <Link
                    href={cat.href}
                    className={`relative py-7 text-sm font-semibold tracking-wide transition-colors ${cat.isAccent
                      ? 'text-rose-600 hover:text-rose-700'
                      : isActive
                        ? 'text-neutral-950'
                        : 'text-neutral-700 hover:text-neutral-950'
                      }`}
                  >
                    <span>{cat.label}</span>
                    {/* Active Underline Highlight matching the reference image */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right: Utility Links & Icons */}
          <div className="flex items-center gap-5 text-neutral-800">
            {/* About & Help text links */}
            <Link
              href="/#about"
              className="hidden xl:inline-block text-xs font-semibold tracking-wide hover:text-black transition"
            >
              About
            </Link>
            <Link
              href="/#faq"
              className="hidden xl:inline-block text-xs font-semibold tracking-wide hover:text-black transition"
            >
              Help
            </Link>

            {/* Search Icon Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:text-black transition cursor-pointer text-neutral-700"
              aria-label="Search Catalog"
              title="Search Products"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Account Icon */}
            {user ? (
              <div className="relative group">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-1 text-xs font-semibold text-neutral-800 hover:text-black"
                >
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 hover:text-black transition cursor-pointer text-neutral-700"
                aria-label="Account Login"
                title="Sign In"
              >
                <UserIcon className="w-5 h-5 stroke-[1.8]" />
              </Link>
            )}

            {/* Shopping Bag Icon with Count Badge */}
            <button
              onClick={openCart}
              className="relative p-2 hover:text-black transition cursor-pointer text-neutral-700"
              aria-label="Cart Bag"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {cart && cart.items_count > 0 && (
                <span className="absolute top-0 right-0 bg-neutral-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.items_count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. Dropdown Mega Menu (Full-Width Taylor Stitch Layout) */}
        {activeCategory?.megaMenu && (
          <div
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-neutral-200 shadow-2xl transition-all duration-200 z-40 animate-fade-in"
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-7xl mx-auto px-8 py-10">
              <div className="grid grid-cols-12 gap-10">
                {/* Left 6 Columns: Category Heading & Subcategory Text Links */}
                <div className="col-span-6 flex flex-col justify-between pr-4">
                  {/* Category Main Heading & Overview Link */}
                  <div className="mb-6">
                    <h2 className="font-serif text-3xl font-medium text-neutral-900 tracking-tight">
                      {activeCategory.megaMenu.mainHeading}
                    </h2>
                    <Link
                      href={activeCategory.megaMenu.mainLinkHref}
                      className="inline-block text-sm font-semibold text-sky-700 hover:text-sky-900 transition mt-1.5"
                    >
                      {activeCategory.megaMenu.mainLinkText}
                    </Link>
                  </div>

                  {/* Two Sub-columns of links (matching screenshot layout) */}
                  <div className="grid grid-cols-2 gap-8 pt-2">
                    {activeCategory.megaMenu.columns.map((col, idx) => (
                      <div key={idx} className="space-y-3">
                        <Link
                          href={col.href}
                          className="font-semibold text-sm text-sky-700 hover:text-sky-900 transition block mb-2"
                        >
                          {col.title}
                        </Link>
                        <ul className="space-y-2 text-sm text-neutral-700">
                          {col.links.map((link, lIdx) => (
                            <li key={lIdx}>
                              <Link
                                href={link.href}
                                className="hover:text-black transition-colors block text-[13px] leading-relaxed"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 6 Columns: 2 Featured Image Cards */}
                <div className="col-span-6 grid grid-cols-2 gap-6">
                  {activeCategory.megaMenu.features.map((feature, fIdx) => (
                    <Link
                      key={fIdx}
                      href={feature.href}
                      className="group flex flex-col items-center"
                    >
                      <div className="w-full aspect-[4/5] relative bg-neutral-100 overflow-hidden shadow-sm">
                        <img
                          src={feature.image}
                          alt={feature.alt}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>
                      <span className="mt-3.5 text-xs font-bold tracking-[0.16em] uppercase text-neutral-900 text-center group-hover:text-sky-700 transition font-sans">
                        {feature.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Interactive Quick Search Bar Overlay */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-full bg-white border-b border-neutral-200 shadow-xl p-4 z-40 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search shirts, knitwear, selvedge denim, overshirts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shrink-0"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* 5. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl z-10 animate-slide-in">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <span className="font-extrabold tracking-[0.2em] text-xl text-neutral-900 font-sans uppercase">
                CARTIFY
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-neutral-700 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Categories Accordion */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {navCategories.map((cat) => {
                const isExpanded = expandedMobileCategory === cat.id;
                return (
                  <div key={cat.id} className="border-b border-neutral-100 pb-2">
                    <button
                      onClick={() =>
                        setExpandedMobileCategory(isExpanded ? null : cat.id)
                      }
                      className="w-full flex items-center justify-between py-2 text-left text-sm font-bold tracking-wide text-neutral-900 uppercase"
                    >
                      <span className={cat.isAccent ? 'text-rose-600' : ''}>
                        {cat.label}
                      </span>
                      {cat.megaMenu && (
                        <ChevronDown
                          className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''
                            }`}
                        />
                      )}
                    </button>

                    {/* Accordion Content */}
                    {cat.megaMenu && isExpanded && (
                      <div className="pl-3 pt-2 pb-4 space-y-4">
                        <Link
                          href={cat.megaMenu.mainLinkHref}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-xs font-bold text-sky-700 uppercase tracking-wider"
                        >
                          {cat.megaMenu.mainLinkText} &rarr;
                        </Link>

                        {cat.megaMenu.columns.map((col, cIdx) => (
                          <div key={cIdx} className="space-y-1.5">
                            <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                              {col.title}
                            </span>
                            <ul className="space-y-1 pl-2">
                              {col.links.map((link, lIdx) => (
                                <li key={lIdx}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-xs text-neutral-700 hover:text-black block py-0.5"
                                  >
                                    {link.label}
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
                              className="block text-center"
                            >
                              <div className="aspect-[4/5] bg-neutral-100 overflow-hidden rounded">
                                <img
                                  src={f.image}
                                  alt={f.alt}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-800 mt-1 block">
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
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-2 text-xs">
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-neutral-700 hover:text-black py-1 font-semibold"
              >
                <Package className="w-4 h-4" />
                <span>Track Orders</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-neutral-700 hover:text-black py-1 font-semibold"
              >
                <Heart className="w-4 h-4" />
                <span>My Wishlist</span>
              </Link>
              {user ? (
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                  <span className="font-semibold text-neutral-900 truncate">
                    {user.name}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-rose-600 hover:underline font-bold"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-neutral-700 hover:text-black py-1 font-semibold"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
