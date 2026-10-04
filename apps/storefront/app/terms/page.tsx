import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Cartify Apparel',
  description: 'Review the Cartify Terms of Service governing order placement, account usage, intellectual property, and sales policies.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0b0c10] text-neutral-300">
      {/* Header */}
      <section className="relative pt-16 pb-16 border-b border-neutral-800/80 bg-neutral-950/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400">
            Last Updated: October 4, 2026 • Effective Date: January 1, 2026
          </p>
        </div>
      </section>

      {/* Document Body */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-sm leading-relaxed">
          {/* Section 1 */}
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-xs">01.</span>
              Acceptance of Terms
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Welcome to Cartify (&quot;Cartify&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By visiting our website, creating an account, or purchasing apparel and accessories from our storefront, you agree to be bound by these Terms of Service (&quot;Terms&quot;) and our Privacy Policy. If you do not agree to all terms and conditions, you may not access the website or use our services.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-xs">02.</span>
              User Accounts &amp; Security
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              When creating an account with Cartify, you must provide accurate, current, and complete information. You are solely responsible for safeguarding the credentials you use to access your account and for any activities or actions under your password. Notify our security team immediately at <a href="mailto:security@cartify.app" className="text-indigo-400 hover:underline">security@cartify.app</a> if you detect unauthorized account activity.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-xs">03.</span>
              Orders, Pricing &amp; Currency
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              All prices displayed on Cartify are listed in United States Dollars (USD) unless specified otherwise. We reserve the right to correct typographical pricing errors, cancel orders placed with erroneous pricing, or adjust product offerings at any time prior to shipment. An order confirmation email signifies receipt of your order request, not final binding acceptance.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-xs">04.</span>
              Payment &amp; Cryptographic Processing
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Payment card transactions are tokenized and processed securely via PCI-DSS Level 1 compliant gateways (Stripe, PayPal). Cartify does not store full credit card numbers or security CVV codes on our servers. By providing a payment method, you represent that you are authorized to use that payment vehicle.
            </p>
          </div>

          {/* Section 5 */}
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-xs">05.</span>
              Shipping &amp; Risk of Loss
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Title and risk of loss for all purchased merchandise pass to you upon our delivery of the package to the authorized shipping carrier (FedEx, UPS, DHL). While we provide real-time package tracking and support, Cartify is not liable for carrier delays caused by customs hold-ups, severe weather, or force majeure events.
            </p>
          </div>

          {/* Section 6 */}
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-xs">06.</span>
              Returns, Exchanges &amp; Refunds
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              We offer a 30-day return policy for unworn, unwashed apparel in original packaging with tags attached. Please visit our <Link href="/policy" className="text-indigo-400 hover:underline">Return &amp; Refund Policy</Link> for detailed step-by-step instructions on generating prepaid return labels.
            </p>
          </div>

          {/* Section 7 */}
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-xs">07.</span>
              Intellectual Property
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              All content on Cartify, including designs, photography, text, graphics, logos, garment patterns, and code, is the exclusive property of Cartify Apparel Inc. and is protected by United States and international copyright, trademark, and trade dress laws.
            </p>
          </div>

          {/* Section 8 */}
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-xs">08.</span>
              Governing Law &amp; Jurisdiction
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              These Terms and any disputes arising out of or related to your purchase shall be governed by and construed in accordance with the laws of the State of New York, United States, without giving effect to any conflict of law principles.
            </p>
          </div>

          {/* Section 9 */}
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-xs">09.</span>
              Contact Information
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              For questions concerning these Terms of Service, please reach out to our legal department at <a href="mailto:legal@cartify.app" className="text-indigo-400 hover:underline">legal@cartify.app</a> or mail Cartify Apparel Inc., Attn: Legal Counsel, 450 Fashion Avenue, Suite 12, New York, NY 10018.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
