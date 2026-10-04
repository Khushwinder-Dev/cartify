'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Save,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Barcode,
  Package,
  Sliders,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface OptionInput {
  id: string;
  name: string;
  values: string[];
  currentInput: string;
}

interface VariantMatrixItem {
  id: string;
  title: string;
  options: Record<string, string>;
  sku: string;
  barcode: string;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  inventory_quantity: number;
  track_inventory: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function NewProductMatrixPage() {
  const router = useRouter();

  // Basic Information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('Acme Studio');
  const [productType, setProductType] = useState('Apparel');
  const [status, setStatus] = useState<'draft' | 'active' | 'archived'>('active');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['New Arrivals', 'Core']);

  // Global Defaults
  const [defaultPrice, setDefaultPrice] = useState(85.00);
  const [defaultComparePrice, setDefaultComparePrice] = useState<number | null>(120.00);
  const [defaultStock, setDefaultStock] = useState(25);

  // Dynamic Options Dimensions (Shopify style)
  const [options, setOptions] = useState<OptionInput[]>([
    { id: '1', name: 'Size', values: ['S', 'M', 'L', 'XL'], currentInput: '' },
    { id: '2', name: 'Color', values: ['Black', 'Navy', 'Olive'], currentInput: '' },
  ]);

  // Bulk Edit Inputs
  const [bulkPrice, setBulkPrice] = useState<string>('');
  const [bulkStock, setBulkStock] = useState<string>('');

  // Generated Matrix State
  const [variants, setVariants] = useState<VariantMatrixItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cartesian Product Calculation
  const cartesian = (arrays: string[][]): string[][] => {
    return arrays.reduce<string[][]>(
      (acc, curr) => acc.flatMap((d) => curr.map((e) => [...d, e])),
      [[]]
    );
  };

  // Re-generate or initialize variant matrix whenever options or base product changes
  const generateMatrix = () => {
    const validOptions = options.filter(
      (opt) => opt.name.trim() !== '' && opt.values.length > 0
    );

    if (validOptions.length === 0) {
      setVariants([]);
      return;
    }

    const valueArrays = validOptions.map((opt) => opt.values);
    const combinations = cartesian(valueArrays);
    const baseSku = (title ? title.trim().substring(0, 8).toUpperCase() : 'PROD').replace(/\s+/g, '-');

    const generated: VariantMatrixItem[] = combinations.map((combo, index) => {
      const optionMap: Record<string, string> = {};
      const skuTokens: string[] = [];

      combo.forEach((val, idx) => {
        const dimName = validOptions[idx].name;
        optionMap[dimName] = val;
        skuTokens.push(val.toUpperCase().replace(/[^A-Z0-9]/g, ''));
      });

      const comboTitle = combo.join(' / ');
      const sku = `${baseSku}-${skuTokens.join('-')}`;

      // Preserve existing edited values if same SKU/title matches
      const existing = variants.find((v) => v.title === comboTitle);

      return {
        id: `var-${index}`,
        title: comboTitle,
        options: optionMap,
        sku: existing ? existing.sku : sku,
        barcode: existing ? existing.barcode : '',
        price: existing ? existing.price : defaultPrice,
        compare_at_price: existing ? existing.compare_at_price : defaultComparePrice,
        cost_price: existing ? existing.cost_price : null,
        inventory_quantity: existing ? existing.inventory_quantity : defaultStock,
        track_inventory: true,
      };
    });

    setVariants(generated);
  };

  // Compute live matrix on mount or button click
  React.useEffect(() => {
    generateMatrix();
  }, []);

  // Tag helper
  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Option Handlers
  const addOptionDimension = () => {
    setOptions([
      ...options,
      { id: Date.now().toString(), name: '', values: [], currentInput: '' },
    ]);
  };

  const removeOptionDimension = (id: string) => {
    setOptions(options.filter((o) => o.id !== id));
  };

  const addValueToOption = (optionId: string, value: string) => {
    if (!value.trim()) return;
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === optionId) {
          const trimmed = value.trim();
          if (!opt.values.includes(trimmed)) {
            return {
              ...opt,
              values: [...opt.values, trimmed],
              currentInput: '',
            };
          }
        }
        return opt;
      })
    );
  };

  const removeValueFromOption = (optionId: string, valToRemove: string) => {
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === optionId) {
          return {
            ...opt,
            values: opt.values.filter((v) => v !== valToRemove),
          };
        }
        return opt;
      })
    );
  };

  // Bulk Edit Applications
  const applyBulkPrice = () => {
    const val = parseFloat(bulkPrice);
    if (isNaN(val)) return;
    setVariants((prev) => prev.map((v) => ({ ...v, price: val })));
    setBulkPrice('');
  };

  const applyBulkStock = () => {
    const val = parseInt(bulkStock, 10);
    if (isNaN(val)) return;
    setVariants((prev) => prev.map((v) => ({ ...v, inventory_quantity: val })));
    setBulkStock('');
  };

  // Update specific variant in matrix
  const updateVariant = (index: number, field: keyof VariantMatrixItem, val: any) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  // Submit to Laravel Backend via ProductVariantMatrixService
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Product title is required.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const token = localStorage.getItem('admin_token');

    const payload = {
      title,
      description,
      status,
      vendor,
      product_type: productType,
      tags,
      options: options.map((opt) => ({
        name: opt.name,
        values: opt.values,
      })),
      variants: variants.map((v) => ({
        title: v.title,
        sku: v.sku,
        barcode: v.barcode,
        price: v.price,
        compare_at_price: v.compare_at_price,
        cost_price: v.cost_price,
        inventory_quantity: v.inventory_quantity,
        track_inventory: v.track_inventory,
      })),
    };

    try {
      const res = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to persist product variant matrix.');
      }

      setSuccessMsg(`Successfully created "${data.product?.title || title}" with ${variants.length} synchronized variants.`);
      setTimeout(() => {
        router.push('/products');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving the product matrix.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white pb-24">
      {/* Top Bar */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Shopify-Style Dynamic Variant Matrix Creator</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                  Cartesian Engine
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synchronizing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Sync Variants</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-800 text-red-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Product Details & Options Matrix */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Core Product Meta */}
            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-neutral-400">
                1. Product Information
              </h2>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Japanese Selvedge Denim Jacket"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Detailed material composition, fit guidance, and washing instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                />
              </div>
            </div>

            {/* 2. Dynamic Option Dimensions */}
            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider text-neutral-400">
                    2. Option Dimensions (Shopify Model)
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Define variants attributes (Size, Color, Material). Cartesian product calculates automatically.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addOptionDimension}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Dimension</span>
                </button>
              </div>

              <div className="space-y-4">
                {options.map((opt, optIndex) => (
                  <div key={opt.id} className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="w-1/3">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                          Dimension Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Size or Color"
                          value={opt.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOptions((prev) =>
                              prev.map((o) => (o.id === opt.id ? { ...o, name: val } : o))
                            );
                          }}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-sm text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                          Add Option Value (Press Enter)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Small, Medium, Large..."
                          value={opt.currentInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOptions((prev) =>
                              prev.map((o) => (o.id === opt.id ? { ...o, currentInput: val } : o))
                            );
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addValueToOption(opt.id, opt.currentInput);
                            }
                          }}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 rounded-lg text-sm text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeOptionDimension(opt.id)}
                        className="mt-5 p-2 text-neutral-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Value Badges */}
                    {opt.values.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {opt.values.map((v) => (
                          <span
                            key={v}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 text-xs font-medium border border-neutral-700"
                          >
                            <span>{v}</span>
                            <button
                              type="button"
                              onClick={() => removeValueFromOption(opt.id, v)}
                              className="text-neutral-400 hover:text-red-400 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={generateMatrix}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Recalculate Cartesian Matrix ({variants.length} combinations)</span>
                </button>
              </div>
            </div>

            {/* 3. Variant Matrix Table with Bulk Editing */}
            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>3. Variant Matrix & Inventory ({variants.length})</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Fast inline editing for prices, custom SKUs, and initial stock quantities.
                  </p>
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Bulk Price $"
                      value={bulkPrice}
                      onChange={(e) => setBulkPrice(e.target.value)}
                      className="w-24 px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={applyBulkPrice}
                      className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded-lg text-neutral-200 transition"
                    >
                      Apply
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="Bulk Stock"
                      value={bulkStock}
                      onChange={(e) => setBulkStock(e.target.value)}
                      className="w-24 px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={applyBulkStock}
                      className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded-lg text-neutral-200 transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto rounded-xl border border-neutral-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">Variant</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Price ($)</th>
                      <th className="py-3 px-4">Compare At ($)</th>
                      <th className="py-3 px-4">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40">
                    {variants.map((v, idx) => (
                      <tr key={v.id} className="hover:bg-neutral-900/50 transition">
                        <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                          {v.title}
                        </td>
                        <td className="py-2 px-4">
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                            className="w-36 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs font-mono text-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <input
                            type="number"
                            step="0.01"
                            value={v.price}
                            onChange={(e) => updateVariant(idx, 'price', parseFloat(e.target.value) || 0)}
                            className="w-24 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs text-emerald-400 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <input
                            type="number"
                            step="0.01"
                            value={v.compare_at_price || ''}
                            onChange={(e) => updateVariant(idx, 'compare_at_price', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="None"
                            className="w-24 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <input
                            type="number"
                            value={v.inventory_quantity}
                            onChange={(e) => updateVariant(idx, 'inventory_quantity', parseInt(e.target.value, 10) || 0)}
                            className="w-20 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                      </tr>
                    ))}
                    {variants.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-neutral-500">
                          Add option dimensions above to generate combinations.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Taxonomy & Publishing Meta */}
          <div className="space-y-6">
            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-neutral-400">
                Organization & Status
              </h2>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="active">Active (Visible on Storefront)</option>
                  <option value="draft">Draft (Back-office only)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Vendor / Brand
                </label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Product Type
                </label>
                <input
                  type="text"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Tags (Press Enter)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Denim, Premium, Autumn..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-700/60"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="hover:text-red-400 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Matrix Summary Stats */}
            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Matrix Diagnostics</span>
              </h2>
              <div className="space-y-2 text-xs text-neutral-400">
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span>Option Dimensions:</span>
                  <span className="font-semibold text-white">{options.filter(o => o.values.length > 0).length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span>Total Variant SKUs:</span>
                  <span className="font-semibold text-white">{variants.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span>Total Initial Units:</span>
                  <span className="font-semibold text-white">
                    {variants.reduce((acc, v) => acc + (v.inventory_quantity || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Inventory Strategy:</span>
                  <span className="font-semibold text-emerald-400">Strict LockForUpdate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
