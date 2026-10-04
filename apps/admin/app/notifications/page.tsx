'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Bell,
  CheckCircle,
  Eye,
  Edit2,
  Send,
  Save,
  Smartphone,
  Monitor,
  Code,
  Sparkles,
  Search,
  Check,
  X,
  FileText,
  RotateCcw,
  ShoppingCart,
  UserCheck,
  Truck,
  ShieldCheck,
} from 'lucide-react';

interface NotificationTemplate {
  id: string;
  category: 'orders' | 'customers' | 'recovery' | 'returns';
  name: string;
  trigger: string;
  subject: string;
  description: string;
  isActive: boolean;
  variables: string[];
  bodyHtml: string;
}

export default function AdminNotificationsPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'orders' | 'customers' | 'recovery' | 'returns'>('all');
  const [search, setSearch] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [testEmailAddress, setTestEmailAddress] = useState('admin@admin.com');
  const [sendingTest, setSendingTest] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Enterprise Store Email Templates
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: 'order_confirmation',
      category: 'orders',
      name: 'Order Confirmation',
      trigger: 'Sent automatically after customer completes checkout & payment is confirmed.',
      subject: 'Order {{ order.number }} confirmed - Thank you for shopping with Cartify',
      description: 'Provides itemized order invoice, shipping address, and delivery estimate.',
      isActive: true,
      variables: ['{{ order.number }}', '{{ customer.name }}', '{{ order.total }}', '{{ order.items }}', '{{ shipping.address }}'],
      bodyHtml: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #171717; padding: 32px; border-radius: 12px; border: 1px solid #e5e5e5;">
          <div style="border-bottom: 2px solid #171717; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; margin: 0;">CARTIFY</h1>
            <p style="font-size: 12px; color: #737373; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Atelier Tailoring & Essentials</p>
          </div>
          <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 12px 0;">Order Confirmed</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #525252;">Hi <strong>Sophia Laurent</strong>, we have received your order <strong>#ORD-2026-1049</strong>. Our master craftsmen are preparing your garments with utmost care.</p>
          <div style="background: #fafafa; border: 1px solid #f5f5f5; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e5e5;">
                <td style="padding: 8px 0; font-weight: 600;">Minimalist Japanese Wool Overshirt (Charcoal / M)</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 700;">$185.00</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e5e5;">
                <td style="padding: 8px 0; font-weight: 600;">Relaxed Linen Pleated Trousers (Natural Ecru / 32)</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 700;">$140.00</td>
              </tr>
              <tr>
                <td style="padding: 12px 0 0 0; font-weight: 800; font-size: 14px;">Total Paid:</td>
                <td style="padding: 12px 0 0 0; text-align: right; font-weight: 900; font-size: 16px; color: #16a34a;">$325.00</td>
              </tr>
            </table>
          </div>
          <p style="font-size: 12px; color: #a3a3a3; text-align: center; margin-top: 32px;">Cartify • 450 Fashion Avenue, New York, NY 10018</p>
        </div>
      `,
    },
    {
      id: 'order_shipped',
      category: 'orders',
      name: 'Shipping Confirmation & Tracking',
      trigger: 'Sent when order fulfillment is marked shipped with tracking number.',
      subject: 'Your Cartify shipment is on the way (Tracking: {{ tracking.number }})',
      description: 'Includes courier tracking link, carrier name, and estimated delivery window.',
      isActive: true,
      variables: ['{{ order.number }}', '{{ tracking.carrier }}', '{{ tracking.number }}', '{{ tracking.url }}'],
      bodyHtml: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #171717; padding: 32px; border-radius: 12px; border: 1px solid #e5e5e5;">
          <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; margin: 0 0 16px 0;">CARTIFY</h1>
          <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 12px 0; color: #4f46e5;">Your order has shipped!</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #525252;">Your parcel has been handed over to <strong>FedEx Express</strong>. Track its transit in real time below:</p>
          <div style="margin: 24px 0; text-align: center;">
            <a href="#" style="display: inline-block; background: #171717; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px;">Track Package (FedEx #789012345678)</a>
          </div>
          <p style="font-size: 12px; color: #737373;">Estimated Arrival: <strong>Thursday, October 8th</strong></p>
        </div>
      `,
    },
    {
      id: 'abandoned_cart_reminder',
      category: 'recovery',
      name: 'Abandoned Cart Recovery Reminder',
      trigger: 'Sent 1 hour and 24 hours after a customer leaves garments in checkout bag.',
      subject: 'You left something timeless behind at Cartify',
      description: 'Encourages checkout completion with persistent bag link and 10% coupon.',
      isActive: true,
      variables: ['{{ customer.name }}', '{{ cart.items }}', '{{ recovery.url }}', '{{ discount.code }}'],
      bodyHtml: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #171717; padding: 32px; border-radius: 12px; border: 1px solid #e5e5e5;">
          <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 8px 0;">CARTIFY</h1>
          <p style="font-size: 13px; color: #737373; margin-bottom: 24px;">Your bespoke selection is waiting.</p>
          <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 12px 0;">Did life get in the way?</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #525252;">We have saved the items in your shopping bag. To make your decision even easier, enjoy <strong>10% off</strong> your purchase today with code:</p>
          <div style="background: #f5f3ff; border: 1px dashed #818cf8; border-radius: 8px; padding: 12px; text-align: center; margin: 20px 0;">
            <span style="font-family: monospace; font-size: 18px; font-weight: 900; color: #4f46e5; letter-spacing: 2px;">RECOVER10</span>
          </div>
          <div style="text-align: center; margin: 28px 0;">
            <a href="#" style="background: #4f46e5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 14px;">Complete My Order & Save 10%</a>
          </div>
        </div>
      `,
    },
    {
      id: 'customer_welcome',
      category: 'customers',
      name: 'Customer Account Welcome',
      trigger: 'Sent immediately when a new customer registers on Cartify storefront.',
      subject: 'Welcome to Cartify - Modern Tailoring & Elevated Essentials',
      description: 'Welcomes new buyer, introduces brand philosophy, and provides $10 credit code.',
      isActive: true,
      variables: ['{{ customer.name }}', '{{ customer.email }}', '{{ store.url }}'],
      bodyHtml: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #171717; padding: 32px; border-radius: 12px; border: 1px solid #e5e5e5;">
          <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 8px 0;">CARTIFY</h1>
          <h2 style="font-size: 18px; font-weight: 700; margin: 16px 0 12px 0;">Welcome to the Atelier</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #525252;">Hi {{ customer.name }}, thank you for joining Cartify. Our pieces are crafted with timeless cuts, Japanese wools, and organic ring-spun cottons meant to last decades.</p>
          <p style="font-size: 14px; line-height: 1.6; color: #525252;">Enjoy complimentary shipping on your first order with code <strong>WELCOME10</strong>.</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="http://localhost:3000" style="background: #171717; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px;">Explore Collection</a>
          </div>
        </div>
      `,
    },
    {
      id: 'return_approved',
      category: 'returns',
      name: 'Return Authorization & RMA Label',
      trigger: 'Sent when merchant approves a customer return request.',
      subject: 'Return Authorized: {{ return.rma }} for Order {{ order.number }}',
      description: 'Provides return shipping label link and return packing instructions.',
      isActive: true,
      variables: ['{{ return.rma }}', '{{ order.number }}', '{{ return.label_url }}', '{{ return.items }}'],
      bodyHtml: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #171717; padding: 32px; border-radius: 12px; border: 1px solid #e5e5e5;">
          <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 8px 0;">CARTIFY</h1>
          <h2 style="font-size: 18px; font-weight: 700; margin: 16px 0 12px 0; color: #4f46e5;">Return Merchandise Authorization</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #525252;">Your return request <strong>#RMA-8921</strong> has been authorized. Please print the prepaid shipping label and attach it to your parcel.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="#" style="background: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px;">Download Prepaid FedEx Label</a>
          </div>
          <p style="font-size: 12px; color: #737373;">Upon receipt and quality inspection at our atelier, your refund will be automatically executed.</p>
        </div>
      `,
    },
  ]);

  const handleToggleTemplate = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setTemplates((prev) =>
      prev.map((t) => (t.id === editingTemplate.id ? editingTemplate : t))
    );
    setSuccessToast(`Template "${editingTemplate.name}" updated successfully!`);
    setTimeout(() => setSuccessToast(null), 3000);
    setEditingTemplate(null);
  };

  const handleSendTestEmail = () => {
    setSendingTest(true);
    setTimeout(() => {
      setSendingTest(false);
      setSuccessToast(`Test notification sent to ${testEmailAddress}!`);
      setTimeout(() => setSuccessToast(null), 3000);
    }, 600);
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-full bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20 transition-colors">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Mail className="w-4 h-4" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Store Email Notifications &amp; Templates</h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
              Transactional customer communications, automated checkout recovery, and shipment tracking dispatches.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-neutral-400">
              SMTP Provider: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Ready (Port 587 TLS)</strong>
            </span>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fade-in shadow-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Filter Tabs & Search */}
        <div className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs dark:shadow-xl mb-8 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search template name or subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-1 text-xs">
                {(['all', 'orders', 'customers', 'recovery', 'returns'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg font-medium capitalize transition cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-neutral-400">
              Active Templates: <strong>{templates.filter((t) => t.isActive).length} / {templates.length}</strong>
            </div>
          </div>

          {/* Templates Grid / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-neutral-400">
                        {tpl.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">{tpl.name}</h3>
                    </div>

                    {/* Active Toggle Switch */}
                    <button
                      onClick={() => handleToggleTemplate(tpl.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        tpl.isActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-neutral-800'
                      }`}
                      title={tpl.isActive ? 'Disable template' : 'Enable template'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          tpl.isActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 mb-3">
                    {tpl.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800/60 text-xs mb-3 space-y-1">
                    <span className="text-slate-500 dark:text-neutral-500 font-semibold block text-[11px]">Subject Line:</span>
                    <p className="text-slate-800 dark:text-neutral-200 font-medium truncate">{tpl.subject}</p>
                  </div>

                  <p className="text-[11px] text-slate-400 dark:text-neutral-500 italic">
                    Trigger: {tpl.trigger}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-neutral-900 mt-4">
                  <div className="flex flex-wrap gap-1">
                    {tpl.variables.slice(0, 2).map((v) => (
                      <span key={v} className="text-[10px] font-mono text-slate-600 dark:text-neutral-500 bg-slate-200 dark:bg-neutral-900 px-1.5 py-0.5 rounded">
                        {v}
                      </span>
                    ))}
                    {tpl.variables.length > 2 && (
                      <span className="text-[10px] text-slate-400 dark:text-neutral-500">+{tpl.variables.length - 2} more</span>
                    )}
                  </div>

                  <button
                    onClick={() => setEditingTemplate(tpl)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit &amp; Preview</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit & Live Preview Modal */}
        {editingTemplate && (
          <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative text-slate-900 dark:text-neutral-100 max-h-[92vh] flex flex-col">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{editingTemplate.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">Template ID: {editingTemplate.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Viewport Switcher */}
                  <div className="flex items-center bg-slate-100 dark:bg-neutral-950 rounded-xl p-1 border border-slate-200 dark:border-neutral-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        previewDevice === 'desktop' ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 dark:text-neutral-500'
                      }`}
                      title="Desktop View"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        previewDevice === 'mobile' ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 dark:text-neutral-500'
                      }`}
                      title="Mobile View"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setEditingTemplate(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-400 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Modal Content: Split Screen Form & Live Preview */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 overflow-y-auto flex-1 pr-1 text-xs">
                {/* Left Controls (5 cols) */}
                <div className="md:col-span-5 space-y-4">
                  <div>
                    <label className="block text-slate-700 dark:text-neutral-400 font-semibold mb-1">Subject Line</label>
                    <input
                      type="text"
                      value={editingTemplate.subject}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-neutral-400 font-semibold mb-1">Insert Dynamic Variables</label>
                    <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
                      {editingTemplate.variables.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            setEditingTemplate({
                              ...editingTemplate,
                              subject: editingTemplate.subject + ' ' + v,
                            });
                          }}
                          className="px-2 py-1 bg-white dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-mono border border-slate-200 dark:border-neutral-800 transition cursor-pointer"
                          title="Click to append to subject"
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Send Test Email Card */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-3">
                    <span className="font-semibold text-slate-900 dark:text-white block">Send Live Test Email</span>
                    <input
                      type="email"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      placeholder="e.g. merchant@cartify.com"
                      className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleSendTestEmail}
                      disabled={sendingTest}
                      className="w-full py-2 bg-slate-200 dark:bg-neutral-800 hover:bg-slate-300 dark:hover:bg-neutral-700 text-slate-800 dark:text-neutral-200 font-semibold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sendingTest ? 'Dispatching...' : 'Dispatch Test Email'}</span>
                    </button>
                  </div>
                </div>

                {/* Right Live Preview (7 cols) */}
                <div className="md:col-span-7 flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-wider mb-2">
                    Live Rendering Preview ({previewDevice})
                  </span>

                  <div
                    className={`bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
                      previewDevice === 'mobile' ? 'w-[320px] max-h-[480px]' : 'w-full max-h-[480px]'
                    } overflow-y-auto`}
                  >
                    <iframe
                      title="Notification Preview"
                      srcDoc={editingTemplate.bodyHtml}
                      sandbox=""
                      className="w-full h-[460px] border-0"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-neutral-800 mt-auto">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Template Modifications</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
