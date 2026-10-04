'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  RotateCcw,
  Truck,
  Lock,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

type PolicyTab = 'privacy' | 'returns' | 'shipping' | 'warranty';

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState<PolicyTab>('returns');

  return (
    <main className="min-h-screen bg-[#0b0c10] text-neutral-300">
      {/* Header */}
      <section className="relative pt-16 pb-16 border-b border-neutral-800/80 bg-neutral-950/40 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Transparency &amp; Consumer Protection</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Store Policies &amp; Guarantees
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            Everything you need to know about our 30-day wear guarantee, global shipping timelines, privacy protection, and repair commitments.
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab('returns')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'returns'
                  ? 'bg-white text-neutral-950 shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>30-Day Returns</span>
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'shipping'
                  ? 'bg-white text-neutral-950 shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Shipping Policy</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'privacy'
                  ? 'bg-white text-neutral-950 shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy &amp; Data</span>
            </button>

            <button
              onClick={() => setActiveTab('warranty')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'warranty'
                  ? 'bg-white text-neutral-950 shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Lifetime Promise</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* TAB 1: RETURNS & EXCHANGES */}
          {activeTab === 'returns' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                <div className="flex items-center gap-3 text-emerald-400">
                  <RotateCcw className="w-6 h-6" />
                  <h2 className="text-xl font-bold text-white">30-Day Hassle-Free Returns &amp; Exchanges</h2>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  We want you to love everything in your daily rotation. If a garment doesn&apos;t fit precisely as desired, you may return or exchange it within 30 days of package delivery for a full refund to your original payment method.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-2" />
                    <h4 className="text-xs font-bold text-white uppercase">Prepaid Return Label</h4>
                    <p className="text-[11px] text-neutral-400 mt-1">Pre-printed FedEx label included in every box.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-2" />
                    <h4 className="text-xs font-bold text-white uppercase">Instant Size Exchanges</h4>
                    <p className="text-[11px] text-neutral-400 mt-1">Free exchanges with zero restocking fees.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-2" />
                    <h4 className="text-xs font-bold text-white uppercase">Fast Refund Processing</h4>
                    <p className="text-[11px] text-neutral-400 mt-1">Funds returned within 3 business days of receipt.</p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                <h3 className="text-base font-bold text-white">Return Eligibility Guidelines</h3>
                <ul className="space-y-3 text-xs sm:text-sm text-neutral-400 list-disc list-inside">
                  <li>Garments must be unworn, unwashed, and in original resellable condition with hangtags attached.</li>
                  <li>Accessories and socks must remain unopened in their original sealed protective packaging.</li>
                  <li>Items marked as &quot;Final Archive Sale&quot; are eligible for store credit or exchange only.</li>
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                <h3 className="text-base font-bold text-white">How To Initiate A Return</h3>
                <ol className="space-y-3 text-xs sm:text-sm text-neutral-400 list-decimal list-inside">
                  <li>Locate your order number from your confirmation email or <Link href="/orders" className="text-indigo-400 hover:underline">Orders portal</Link>.</li>
                  <li>Affix the prepaid FedEx label to the original resealable mailer box.</li>
                  <li>Drop off the package at any authorized FedEx drop-off location or schedule a free courier pickup.</li>
                  <li>Once received at our warehouse, our inspection team will release your refund within 72 hours.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: SHIPPING POLICY */}
          {activeTab === 'shipping' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                <div className="flex items-center gap-3 text-indigo-400">
                  <Truck className="w-6 h-6" />
                  <h2 className="text-xl font-bold text-white">Shipping Rates &amp; Delivery Estimates</h2>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  All orders are dispatched from our carbon-neutral distribution facility in New Jersey. Orders placed before 1:00 PM EST ship the same business day.
                </p>

                <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-2xl overflow-hidden mt-6">
                  <div className="p-4 bg-neutral-950 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">Standard Ground Delivery</p>
                      <p className="text-neutral-500">FedEx Ground / USPS Priority (3–5 Business Days)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">FREE on orders over $75</p>
                      <p className="text-neutral-500">$5.00 for orders under $75</p>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900/30 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">Express 2-Day Air</p>
                      <p className="text-neutral-500">Guaranteed 2 business day domestic courier</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">$15.00 flat rate</p>
                      <p className="text-neutral-500">FREE over $150</p>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-950 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">Priority Overnight</p>
                      <p className="text-neutral-500">Next-day morning delivery (Mon–Fri)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">$28.00</p>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900/30 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">International Priority</p>
                      <p className="text-neutral-500">DHL Express Worldwide with prepaid duties (DDP)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">$38.00</p>
                      <p className="text-neutral-500">FREE over $250</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY & DATA POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                <div className="flex items-center gap-3 text-violet-400">
                  <Lock className="w-6 h-6" />
                  <h2 className="text-xl font-bold text-white">Privacy Policy &amp; Data Safeguards</h2>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Your privacy is paramount. Cartify adheres strictly to GDPR, CCPA, and global consumer privacy standards. We will never sell, rent, or trade your personal data with third-party data brokers.
                </p>

                <div className="space-y-6 pt-4 text-xs sm:text-sm text-neutral-400">
                  <div>
                    <h4 className="font-bold text-white mb-1">Information We Collect</h4>
                    <p>We collect essential order fulfillment details including name, shipping address, email, and phone number. Payment card numbers are securely handled by PCI-DSS Level 1 tokenized processors (Stripe/PayPal) and never pass through our database unencrypted.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-1">How We Use Your Data</h4>
                    <p>Your details are used solely to process transactions, communicate shipment tracking milestones, prevent carding fraud, and send newsletter updates if explicitly subscribed.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-1">Your Rights Under GDPR &amp; CCPA</h4>
                    <p>You have the right to request a complete copy of your stored data or request immediate deletion of your customer profile. Contact our Data Protection Officer at <a href="mailto:privacy@cartify.app" className="text-indigo-400 hover:underline">privacy@cartify.app</a>.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIFETIME PROMISE */}
          {activeTab === 'warranty' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                <div className="flex items-center gap-3 text-amber-400">
                  <FileCheck className="w-6 h-6" />
                  <h2 className="text-xl font-bold text-white">The Cartify Lifetime Repair Guarantee</h2>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  We construct clothing designed for decade-long rotations. If any Cartify garment fails due to a defect in materials or manufacturing craftsmanship, we will repair it free of charge.
                </p>

                <div className="space-y-4 pt-4 text-xs sm:text-sm text-neutral-400">
                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <p className="font-bold text-white mb-1">Covered Under Warranty:</p>
                    <p>Broken zipper teeth, seam tears, loose stitching, and failed hardware buttons under normal intended wear.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <p className="font-bold text-white mb-1">Not Covered:</p>
                    <p>Intentional alterations, bleach or harsh chemical stains, pet damage, or improper tumble drying contrary to care labels.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
