'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface HeroSlide {
  id: number;
  eyebrow: string;
  headline: string;
  subtext: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  imageDesktop: string;
  imageMobile: string;
  tag: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    eyebrow: 'SPRING / SUMMER 2026 EDITION',
    headline: 'THE ARCHITECTURE OF COMFORT',
    subtext: 'Engineered with custom-milled 500gsm loopback cotton and Japanese double-weave wool. Designed for effortless modern silhouettes.',
    primaryCtaText: 'Explore Collection',
    primaryCtaHref: '#catalog',
    secondaryCtaText: 'View Lookbook',
    secondaryCtaHref: '#lookbook',
    imageDesktop: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85',
    imageMobile: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
    tag: 'Drop 01 // Foundation',
  },
  {
    id: 2,
    eyebrow: 'EXCLUSIVE TEXTILE CAPSULE',
    headline: 'JAPANESE SELVEDGE & TAILORING',
    subtext: '14oz shuttle-loom raw denim paired with relaxed pleated trousers. Crafted in Kojima with uncompromised artisan discipline.',
    primaryCtaText: 'Shop Tailoring',
    primaryCtaHref: '#catalog',
    secondaryCtaText: 'The Selvedge Guide',
    secondaryCtaHref: '#catalog',
    imageDesktop: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=85',
    imageMobile: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1000&q=85',
    tag: 'Artisan Series // 2026',
  },
  {
    id: 3,
    eyebrow: 'HEIRLOOM LUXURY KNITWEAR',
    headline: 'FEATHERLIGHT MONGOLIAN CASHMERE',
    subtext: 'Spun from Grade-A combed cashmere for thermal mastery and buttery hand-feel. Modern silhouettes built for a lifetime.',
    primaryCtaText: 'Explore Knitwear',
    primaryCtaHref: '#catalog',
    secondaryCtaText: 'Fabric Transparency',
    secondaryCtaHref: '/about',
    imageDesktop: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2000&q=85',
    imageMobile: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=85',
    tag: 'Grade-A Pure Fiber',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-advance timer (6 seconds per slide)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      // Swiped Left
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    } else if (distance < -50) {
      // Swiped Right
      setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative w-full h-[85vh] sm:h-[90vh] max-h-[920px] min-h-[580px] overflow-hidden bg-neutral-950 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Editorial Hero Carousel"
    >
      {/* Slides Container */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = currentSlide === idx;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Cinematic Film Grain / Gradient Overlay */}
            <div className="absolute inset-0">
              <picture>
                <source media="(max-width: 768px)" srcSet={slide.imageMobile} />
                <img
                  src={slide.imageDesktop}
                  alt={slide.headline}
                  className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </picture>
              {/* Dual Vignette Gradients for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-end pb-16 sm:pb-24">
              <div className="max-w-2xl space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Eyebrow Pill */}
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase bg-white/10 backdrop-blur-md border border-white/20 text-white">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    {slide.eyebrow}
                  </span>
                  <span className="text-white/60 text-xs font-mono hidden sm:inline">{slide.tag}</span>
                </div>

                {/* Big Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] font-sans drop-shadow-sm">
                  {slide.headline}
                </h1>

                {/* Subtext */}
                <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-xl">
                  {slide.subtext}
                </p>

                {/* CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                  <Link
                    href={slide.primaryCtaText.toLowerCase().includes('men') ? '#catalog' : slide.primaryCtaHref}
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white text-neutral-950 font-extrabold text-xs sm:text-sm tracking-wide uppercase shadow-2xl hover:bg-neutral-100 active:scale-95 transition-all"
                  >
                    <span>{slide.primaryCtaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href={slide.secondaryCtaHref}
                    className="inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase transition-all"
                  >
                    {slide.secondaryCtaText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide Navigation Arrows */}
      <div className="hidden sm:flex absolute z-30 bottom-12 right-12 items-center gap-2">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
          aria-label="Previous Hero Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
          aria-label="Next Hero Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Dots Bar */}
      <div className="absolute z-30 bottom-6 left-1/2 -translate-x-1/2 sm:left-12 sm:translate-x-0 flex items-center gap-2.5">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 transition-all rounded-full cursor-pointer ${
              currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
