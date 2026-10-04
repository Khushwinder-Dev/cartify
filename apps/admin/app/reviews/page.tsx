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
    <div className="min-h-full bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20 transition-colors">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>Customer Reviews & Moderation</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
              Verify authentic buyer feedback, approve public social proof, and block spam
            </p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-4 mb-6 shadow-xs dark:shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search by customer, product, or comment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-neutral-400">Moderation Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-neutral-200"
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
              className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-slate-300 dark:text-neutral-700'}`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{review.title || 'Review'}</span>
                  {review.is_verified_purchase && (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-medium">
                      <ShieldCheck className="w-3 h-3" /> Verified Buyer
                    </span>
                  )}
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                      review.status === 'approved'
                        ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        : review.status === 'pending'
                        ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                        : 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {review.status}
                  </span>
                </div>

                <p className="text-sm text-slate-700 dark:text-neutral-300">{review.comment}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-neutral-500 pt-1">
                  <span>By <strong className="text-slate-800 dark:text-neutral-300">{review.customer_name}</strong></span>
                  <span>•</span>
                  <span>Product: <strong className="text-indigo-600 dark:text-indigo-400">{review.product?.title || 'Catalog Item'}</strong></span>
                </div>
              </div>

              {/* Moderation Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {review.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(review.id, 'approved')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                {review.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(review.id, 'rejected')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold transition cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="bg-white dark:bg-neutral-900/40 rounded-2xl border border-slate-200 dark:border-neutral-800 p-12 text-center text-slate-500 dark:text-neutral-500 text-sm">
              No product reviews found matching criteria.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
