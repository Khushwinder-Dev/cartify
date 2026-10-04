import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Cartify Apparel',
  description: 'Learn how Cartify protects your personal information, encrypts transaction data, and complies with CCPA and GDPR.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0b0c10] text-neutral-300">
      <section className="relative pt-16 pb-16 border-b border-neutral-800/80 bg-neutral-950/40 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection &amp; Confidentiality</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400">
            Last Updated: October 4, 2026 • Compliant with GDPR &amp; CCPA
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-sm leading-relaxed">
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              We collect information you provide directly to us when placing an order, registering an account, or communicating with customer support. This includes name, shipping and billing address, email address, and phone number.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white">2. Tokenized Payment Security</h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              All payment credentials are tokenized directly with Stripe and PayPal under PCI-DSS Level 1 encryption standards. Cartify never stores full credit card numbers, CVVs, or bank account credentials on our web servers.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white">3. Third-Party Data Sharing</h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Cartify does not sell, monetise, or trade your personal data. We only share delivery details with logistics carriers (FedEx, DHL, UPS) exclusively to fulfill your shipments.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white">4. Your Data Rights &amp; Deletion</h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Under GDPR and CCPA, you have the right to request a complete copy of your personal data or request permanent deletion of your profile. To exercise your rights, email our team at <a href="mailto:privacy@cartify.app" className="text-indigo-400 hover:underline">privacy@cartify.app</a>.
            </p>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/policy"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              <span>View all Store Policies (Returns, Shipping, Lifetime Guarantee)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
