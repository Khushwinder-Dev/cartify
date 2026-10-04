'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderTree,
  Plus,
  Trash2,
  Edit2,
  Search,
  Sparkles,
  ExternalLink,
  Layers,
  X
} from 'lucide-react';
import { Collection } from '@ecommerce/types';

const mockCollections: Collection[] = [
  {
    id: 1,
    name: 'Autumn / Winter Capsule',
    slug: 'autumn-winter-capsule',
    description: 'Heavyweight selvedge denim, loopback fleece, and structured outerwear.',
    image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    is_featured: true,
    products_count: 8,
  },
  {
    id: 2,
    name: 'Minimalist Essentials',
    slug: 'minimalist-essentials',
    description: 'Everyday staples cut from long-staple organic cotton and combed wool.',
    image_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    is_featured: true,
    products_count: 14,
  },
  {
    id: 3,
    name: 'Tailored Shirting',
    slug: 'tailored-shirting',
    description: 'Camp collar silks and poplin button-downs tailored for contemporary silhouette.',
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    is_featured: false,
    products_count: 6,
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function AdminCategoriesPage() {
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch(`${API_BASE}/collections`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.data) && data.data.length > 0) {
            setCollections(data.data);
          }
        }
      } catch (e) {}
    };
    fetchCollections();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('admin_token');

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      image_url: imageUrl || null,
      is_featured: isFeatured,
    };

    try {
      const res = await fetch(`${API_BASE}/admin/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        setCollections([result.data, ...collections]);
      } else {
        const mockNew: Collection = {
          id: Date.now(),
          ...payload,
          products_count: 0,
        };
        setCollections([mockNew, ...collections]);
      }

      setIsModalOpen(false);
      setName('');
      setSlug('');
      setDescription('');
      setImageUrl('');
      setIsFeatured(false);
    } catch (err) {
      const mockNew: Collection = {
        id: Date.now(),
        ...payload,
        products_count: 0,
      };
      setCollections([mockNew, ...collections]);
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    setCollections(collections.filter((c) => c.id !== id));
    try {
      await fetch(`${API_BASE}/admin/collections/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (e) {}
  };

  const filtered = collections.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20 transition-colors">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <FolderTree className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>Taxonomies & Collections</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
              Curate seasonal storefront collections, navigation groups, and featured campaign landing pages
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Category</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-4 mb-6 shadow-xs dark:shadow-xl max-w-md transition-colors">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search categories by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-neutral-900/70 border border-slate-200 dark:border-neutral-800/80 rounded-2xl overflow-hidden shadow-xs dark:shadow-xl flex flex-col justify-between transition-colors"
            >
              {cat.image_url ? (
                <div className="h-44 w-full overflow-hidden relative bg-slate-100 dark:bg-neutral-950">
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                  {cat.is_featured && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md">
                      Featured
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-28 w-full bg-slate-100 dark:bg-neutral-950 flex items-center justify-center text-slate-400 dark:text-neutral-700">
                  <Layers className="w-8 h-8" />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{cat.name}</h3>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 block mb-2">/{cat.slug}</span>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2">{cat.description || 'No description provided'}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-neutral-500 font-medium">
                    {cat.products_count ?? 0} active products
                  </span>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-900 dark:text-neutral-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Create Storefront Category</h2>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-slate-600 dark:text-neutral-400 mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Minimalist Footwear"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-slate-600 dark:text-neutral-400 mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="Optional (auto-generated)"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-slate-600 dark:text-neutral-400 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-slate-600 dark:text-neutral-400 mb-1.5">
                    Banner Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="isFeatured" className="text-slate-700 dark:text-neutral-300">
                    Feature on homepage hero navigation
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Save Category'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
