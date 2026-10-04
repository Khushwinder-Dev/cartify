import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Leaf,
  Award,
  ArrowRight,
  CheckCircle2,
  Heart,
  Globe2,
  Scissors
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Cartify | Modern Everyday Clothing & Essentials',
  description: 'Learn about the Cartify philosophy: custom-milled textiles, Japanese selvedge denim, ethical ateliers, and clothing engineered to last decades.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0b0c10] text-neutral-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 border-b border-neutral-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Cartify Atelier &amp; Philosophy</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            We build clothing for the person who values <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 font-serif italic font-normal">longevity over novelty.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Cartify began with a simple question: why do everyday basics pill after three washes, lose their shape, and end up in landfills? We set out to engineer clothing using heritage milling techniques and custom-developed fabrics.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#catalog"
              className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-white/10 flex items-center gap-2"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/80 text-xs font-bold uppercase tracking-wider transition"
            >
              <span>Get In Touch</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="border-b border-neutral-800/80 bg-neutral-950/40 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white font-mono">100%</p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">GOTS Organic Cotton</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-indigo-400 font-mono">480 GSM</p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Loopback French Terry</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-violet-400 font-mono">0</p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Synthetic Fillers</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">30-Day</p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Wear &amp; Wash Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-20 border-b border-neutral-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Our Four Guiding Principles</h2>
            <p className="text-sm text-neutral-400 mt-3">Every stitch, button, and hem is calibrated to provide effortless comfort and timeless silhouette.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Bespoke Mill Specifications</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                We do not source off-the-rack warehouse fabrics. Our heavyweight jersey and fleece are custom knit on vintage circular loopwheel looms, creating a dense, breathable weave that holds its structure indefinitely.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sustainable &amp; Low-Impact</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                From plant-based botanical dye washes to recycled corozo nut buttons, our materials eliminate petroleum-derived microplastics and reduce manufacturing water consumption by 65%.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ethical Fair-Wage Workshops</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                We partner with specialized tailoring workshops in Portugal, Japan, and Italy. Artisans work in safe, natural-light facilities earning guaranteed living wages 35% above regional minimums.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zero Fast-Fashion Waste</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                We produce small, calibrated drop batches rather than thousands of speculative SKUs. This eliminates deadstock inventory and ensures every garment produced finds a permanent home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Material Provenance */}
      <section className="py-20 border-b border-neutral-800/80 bg-neutral-950/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Provenance &amp; Sourcing</span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2 mb-6">
                Only The World&apos;s Finest Raw Fibers
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Japanese Melton Wool (380 GSM)</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Milled in Bishu, Japan with thermal retention and water-repellent dense weave.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Normandy Flax Linen</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Harvested in Northern France with airy breathability and natural temperature regulation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Inner Mongolian Grade-A Cashmere</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">2-ply 12-gauge combed cashmere with cloud-like handfeel that softens after every wash.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">GOTS Organic Long-Staple Cotton</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Free from synthetic pesticides, hypoallergenic, and pre-shrunk to prevent size loss.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">The Cartify Lifetime Promise</h3>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-md mx-auto">
                If any Cartify garment experiences seam unraveling, zipper failure, or button loss during normal wear, we offer free complimentary repairs or replacement.
              </p>
              <div className="pt-2">
                <Link
                  href="/policy"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
                >
                  Read our full warranty &amp; repair policy →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-white">Ready to elevate your daily rotation?</h2>
          <p className="text-sm text-neutral-400 mt-3 mb-8">
            Experience the difference of custom-weight textiles and mindful tailoring.
          </p>
          <Link
            href="/#catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold uppercase tracking-wider transition shadow-xl shadow-white/10"
          >
            <span>Shop The Latest Drop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
