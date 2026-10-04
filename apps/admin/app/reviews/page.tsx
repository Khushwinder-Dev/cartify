'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Filter,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { ProductReview } from '@ecommerce/types';

const mockReviews: ProductReview[] = [
  {
    id: 1,
    product_id: 1,
    customer_name: 'David Miller',
    rating: 5,
    title: 'Outstanding quality and drape',
    comment: 'The 15oz Japanese denim has an incredible weight and rigidity that softens perfectly. Stitching details are clean.',
    is_verified_purchase: true,
    status: 'approved',
    product: { id: 1, title: 'Japanese Selvedge Denim Jacket', slug: 'japanese-selvedge-denim-jacket', status: 'active' },
    created_at: '2026-10-02',
  },
  {
    id: 2,
    product_id: 2,
    customer_name: 'Chloe Zhang',
    rating: 4,
    title: 'Heavy and warm hoodie',
    comment: 'Great loopback terry fabric. Runs slightly boxy which is exactly what I was hoping for.',
    is_verified_purchase: true,
    status: 'pending',
    product: { id: 2, title: 'Heavyweight Loopback Hoodie', slug: 'heavyweight-loopback-hoodie', status: 'active' },
    created_at: '2026-10-03',
  },
  {
    id: 3,
    product_id: 3,
    customer_name: 'Anonymous',
    rating: 1,
    title: 'Did not fit',
    comment: 'SPAM message / inappropriate text.',
    is_verified_purchase: false,
    status: 'rejected',
    product: { id: 3, title: 'Relaxed Silk Camp Shirt', slug: 'relaxed-silk-camp-shirt', status: 'draft' },
    created_at: '2026-09-29',
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>(mockReviews);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem('admin_token');
      try {
        const res = await fetch(`${API_BASE}/admin/reviews`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.data) && data.data.length > 0) {
            setReviews(data.data);
          }
        }
      } catch (e) {}
    };
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected') => {
    const token = localStorage.getItem('admin_token');
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );

    try {
      await fetch(`${API_BASE}/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
    } catch (e) {}
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    setReviews((prev) => prev.filter((r) => r.id !== id));

    try {
      await fetch(`${API_BASE}/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (e) {}
  };

  const filteredReviews = reviews.filter((r) => {
    const matchSearch =
      r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.comment && r.comment.toLowerCase().includes(search.toLowerCase())) ||
      (r.product?.title && r.product.title.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20">
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 font-bold tracking-tight text-white text-lg">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-md shadow-indigo-500/20">
                EP
              </span>
              <span>Merchant Admin</span>
            </div>
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-neutral-400">
              <Link href="/dashboard" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800/60 transition">
                Dashboard
              </Link>
              <Link href="/products" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800/60 transition">
                Products
              </Link>
              <Link href="/orders" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800/60 transition">
                Orders
              </Link>
              <Link href="/discounts" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800/60 transition">
                Discounts
              </Link>
              <Link href="/inventory" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800/60 transition">
                Inventory
              </Link>
              <Link href="/reviews" className="px-3 py-1.5 rounded-lg text-white bg-neutral-800">
                Reviews
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
              <span>Customer Reviews & Moderation</span>
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Verify authentic buyer feedback, approve public social proof, and block spam
            </p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-4 mb-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by customer, product, or comment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400">Moderation Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200"
            >
              <option value="all">All Reviews</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-neutral-700'}`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-white text-sm">{review.title || 'Review'}</span>
                  {review.is_verified_purchase && (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      <ShieldCheck className="w-3 h-3" /> Verified Buyer
                    </span>
                  )}
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                      review.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : review.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {review.status}
                  </span>
                </div>

                <p className="text-sm text-neutral-300">{review.comment}</p>

                <div className="flex items-center gap-4 text-xs text-neutral-500 pt-1">
                  <span>By <strong className="text-neutral-300">{review.customer_name}</strong></span>
                  <span>•</span>
                  <span>Product: <strong className="text-indigo-400">{review.product?.title || 'Catalog Item'}</strong></span>
                </div>
              </div>

              {/* Moderation Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {review.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(review.id, 'approved')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                {review.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(review.id, 'rejected')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-1.5 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-950/30 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="bg-neutral-900/40 rounded-2xl border border-neutral-800 p-12 text-center text-neutral-500 text-sm">
              No product reviews found matching criteria.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
