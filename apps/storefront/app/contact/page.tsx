'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Package,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    topic: 'order_status',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API dispatch
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        orderNumber: '',
        topic: 'order_status',
        message: '',
      });
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#0b0c10] text-neutral-200">
      {/* Hero Header */}
      <section className="relative pt-16 pb-20 border-b border-neutral-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Care &amp; Atelier Support</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            We&apos;re Here To Assist You
          </h1>
          <p className="mt-4 text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Have questions regarding sizing, fit, garment care, or an existing shipment? Our tailoring specialists reply within 12–24 business hours.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900/60 border border-neutral-800 relative">
                <h2 className="text-2xl font-bold text-white mb-2">Send Us A Message</h2>
                <p className="text-xs text-neutral-400 mb-8">
                  Fill in your details below and our concierge team will reach out directly.
                </p>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Message Sent Successfully!</h3>
                    <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Cartify. A member of our support team will inspect your request and respond via email within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Eleanor Vance"
                          className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="eleanor@example.com"
                          className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                          Order Number (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.orderNumber}
                          onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                          placeholder="e.g. CRT-10492"
                          className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                          Topic / Subject *
                        </label>
                        <select
                          value={formData.topic}
                          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                        >
                          <option value="order_status">Order Status &amp; Tracking</option>
                          <option value="returns_exchanges">Returns &amp; Exchanges</option>
                          <option value="sizing_advice">Sizing &amp; Fit Recommendations</option>
                          <option value="garment_care">Garment Care &amp; Fabrics</option>
                          <option value="wholesale">Wholesale &amp; Press Inquiry</option>
                          <option value="other">Other Inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                        Your Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please describe how we can assist you..."
                        className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <span>Submit Message</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Direct Info & Atelier Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-6">
                <h3 className="text-lg font-bold text-white tracking-tight">Atelier &amp; Contact Direct</h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">General Customer Inquiries</p>
                      <a href="mailto:support@cartify.app" className="text-neutral-400 hover:text-indigo-400 transition">
                        support@cartify.app
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Phone &amp; SMS Concierge</p>
                      <p className="text-neutral-400">+1 (800) 555-0199</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Operating Hours</p>
                      <p className="text-neutral-400">Monday – Friday: 9am – 6pm EST</p>
                      <p className="text-neutral-500 text-[11px]">Weekend response for urgent order adjustments</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Studio &amp; Showroom</p>
                      <p className="text-neutral-400">450 Fashion Avenue, Suite 12</p>
                      <p className="text-neutral-500 text-[11px]">New York, NY 10018, United States</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Actions */}
              <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">Need Immediate Help?</h4>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    href="/orders"
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition flex flex-col items-center text-center gap-1.5 group"
                  >
                    <Package className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
                    <span className="text-[11px] font-semibold text-white">Track Order</span>
                  </Link>

                  <Link
                    href="/policy"
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition flex flex-col items-center text-center gap-1.5 group"
                  >
                    <RotateCcw className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                    <span className="text-[11px] font-semibold text-white">Return Policy</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
