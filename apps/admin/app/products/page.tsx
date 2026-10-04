'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import {
  Search,
  Plus,
  ArrowUpDown,
  Filter,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Layers,
  Edit2,
  Trash2,
  Tag,
  CheckCircle,
  AlertCircle,
  Package,
  RefreshCw,
  X,
  ExternalLink,
  DollarSign
} from 'lucide-react';

interface ProductItem {
  id: number;
  title: string;
  slug: string;
  description?: string;
  status: 'active' | 'draft' | 'archived';
  vendor: string;
  product_type: string;
  variant_count: number;
  total_inventory: number;
  min_price: number;
  max_price: number;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function AdminProductsPage() {
  const [data, setData] = useState<ProductItem[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vendor: 'Cartify Apparel',
    product_type: 'Apparel',
    status: 'active' as 'active' | 'draft' | 'archived',
    price: '85.00',
    compare_at_price: '110.00',
    inventory_quantity: '25',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80',
    tags: 'clothing, new',
  });

  const fetchProducts = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const result = await res.json();
        const list = Array.isArray(result.data) ? result.data : [];
        setData(list.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description || '',
          status: p.status || 'draft',
          vendor: p.vendor || 'Cartify Apparel',
          product_type: p.product_type || 'Apparel',
          variant_count: p.variants?.length || 1,
          total_inventory: p.variants?.reduce((sum: number, v: any) => sum + (v.inventory_quantity || 0), 0) || 0,
          min_price: p.min_price || (p.variants?.[0]?.price ? parseFloat(p.variants[0].price) : 0),
          max_price: p.max_price || (p.variants?.[0]?.price ? parseFloat(p.variants[0].price) : 0),
          created_at: p.created_at?.split('T')[0] || '2026-10-04',
        })));
      }
    } catch (e: any) {
      setErrorMsg('Failed to load products from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      vendor: 'Cartify Basics',
      product_type: 'Apparel',
      status: 'active',
      price: '65.00',
      compare_at_price: '80.00',
      inventory_quantity: '30',
      image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      tags: 'apparel, clothing',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      description: p.description || '',
      vendor: p.vendor,
      product_type: p.product_type,
      status: p.status,
      price: String(p.min_price || '0'),
      compare_at_price: String(p.max_price || ''),
      inventory_quantity: String(p.total_inventory || '0'),
      image_url: '',
      tags: 'apparel, clothing',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSaving(true);
    setErrorMsg(null);
    const token = localStorage.getItem('admin_token');

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload: any = {
      title: formData.title,
      description: formData.description || null,
      vendor: formData.vendor || null,
      product_type: formData.product_type || null,
      status: formData.status,
      tags: tagsArray,
      price: parseFloat(formData.price) || 0,
      base_price: parseFloat(formData.price) || 0,
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      inventory_quantity: parseInt(formData.inventory_quantity, 10) || 0,
      base_inventory: parseInt(formData.inventory_quantity, 10) || 0,
    };

    if (formData.image_url) {
      payload.media = [
        {
          url: formData.image_url,
          alt_text: formData.title,
          is_primary: true,
        },
      ];
    }

    try {
      const url = editingProduct
        ? `${API_BASE}/admin/products/${editingProduct.id}`
        : `${API_BASE}/admin/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.message || 'Operation failed');
      }

      setSuccessMsg(editingProduct ? 'Product updated successfully' : 'Product created successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsAddModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_BASE}/admin/products/${deletingProduct.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        setData((prev) => prev.filter((p) => p.id !== deletingProduct.id));
        setDeletingProduct(null);
        setSuccessMsg('Product deleted successfully');
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Delete operation failed');
    }
  };

  // Filtered by dropdown status
  const filteredData = useMemo(() => {
    if (statusFilter === 'all') return data;
    return data.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  // Bulk Status Change
  const handleBulkStatusChange = async (newStatus: 'active' | 'draft' | 'archived') => {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    const selectedProducts = selectedIndices.map((idx) => filteredData[idx]).filter(Boolean);
    const token = localStorage.getItem('admin_token');

    for (const prod of selectedProducts) {
      try {
        await fetch(`${API_BASE}/admin/products/${prod.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch (err) {}
    }

    setData((prev) =>
      prev.map((item) =>
        selectedProducts.some((p) => p.id === item.id) ? { ...item, status: newStatus } : item
      )
    );
    setRowSelection({});
    setSuccessMsg(`Updated status for ${selectedProducts.length} products to ${newStatus}`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const columns = useMemo<ColumnDef<ProductItem>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <button
            onClick={table.getToggleAllRowsSelectedHandler()}
            className="p-1 hover:text-white text-neutral-400 cursor-pointer"
          >
            {table.getIsAllRowsSelected() ? (
              <CheckSquare className="w-4 h-4 text-indigo-500" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <button
            onClick={row.getToggleSelectedHandler()}
            className="p-1 hover:text-white text-neutral-400 cursor-pointer"
          >
            {row.getIsSelected() ? (
              <CheckSquare className="w-4 h-4 text-indigo-500" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>
        ),
      },
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs hover:text-white"
          >
            <span>Product</span>
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <span className="font-semibold text-white block text-sm">{row.original.title}</span>
            <span className="text-xs text-neutral-500 font-mono">/{row.original.slug}</span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = row.original.status;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                s === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : s === 'draft'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
              }`}
            >
              {s}
            </span>
          );
        },
      },
      {
        accessorKey: 'total_inventory',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs hover:text-white"
          >
            <span>Inventory</span>
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <span
              className={`font-semibold ${
                row.original.total_inventory <= 5 ? 'text-amber-400' : 'text-neutral-200'
              }`}
            >
              {row.original.total_inventory} in stock
            </span>
            <span className="block text-xs text-neutral-500">
              for {row.original.variant_count} variant{row.original.variant_count !== 1 ? 's' : ''}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'vendor',
        header: 'Vendor & Type',
        cell: ({ row }) => (
          <div className="text-xs text-neutral-300">
            <span className="font-medium text-white block">{row.original.vendor}</span>
            <span className="text-neutral-500">{row.original.product_type}</span>
          </div>
        ),
      },
      {
        accessorKey: 'min_price',
        header: 'Price Range',
        cell: ({ row }) => {
          const { min_price, max_price } = row.original;
          return (
            <span className="font-semibold text-white text-xs">
              {min_price === max_price
                ? `$${min_price.toFixed(2)}`
                : `$${min_price.toFixed(2)} - $${max_price.toFixed(2)}`}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleOpenEdit(row.original)}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
              title="Edit Product"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeletingProduct(row.original)}
              className="p-1.5 rounded-lg bg-red-950/30 border border-red-900/40 hover:bg-red-900/50 text-red-400 transition cursor-pointer"
              title="Delete Product"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      rowSelection,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="min-h-full bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Package className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white">Catalog & Products</h1>
            </div>
            <p className="text-sm text-neutral-400 mt-1">
              Add, update, adjust prices and stock, or delete apparel garments with multi-variant synchronization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/products/new"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold transition"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Variant Matrix</span>
            </Link>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Bulk Action Controls */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700/80 px-4 py-2 rounded-xl text-xs shadow-xl animate-fade-in mb-6">
            <span className="font-semibold text-indigo-400">{selectedCount} selected</span>
            <span className="text-neutral-600">|</span>
            <button
              onClick={() => handleBulkStatusChange('active')}
              className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition font-medium cursor-pointer"
            >
              Set Active
            </button>
            <button
              onClick={() => handleBulkStatusChange('draft')}
              className="px-2.5 py-1 rounded bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 transition font-medium cursor-pointer"
            >
              Set Draft
            </button>
            <button
              onClick={() => handleBulkStatusChange('archived')}
              className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-400 hover:text-white transition font-medium cursor-pointer"
            >
              Archive
            </button>
          </div>
        )}

        {/* Search & Filters Filter Bar */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search products, vendors, or slugs..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="draft">Draft Only</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* TanStack Table */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="py-3.5 px-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-neutral-900/50 transition">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3.5 px-4 text-neutral-300">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="py-12 text-center text-neutral-500">
                      No matching products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950/60 text-xs text-neutral-400">
            <div>
              Showing {table.getRowModel().rows.length} of {filteredData.length} records
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-400" />
                <span>{editingProduct ? 'Edit Product' : 'Add New Product'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Mongolian Cashmere Sweater"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Compare-at Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Regular price"
                    value={formData.compare_at_price}
                    onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.inventory_quantity}
                    onChange={(e) => setFormData({ ...formData, inventory_quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Vendor / Brand</label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Product Category</label>
                  <input
                    type="text"
                    value={formData.product_type}
                    onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {!editingProduct && (
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Primary Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Material specs, tailored fit details, styling tips..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800/80 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Product?</h3>
                <p className="text-xs text-neutral-400">This permanently removes the product and all variants.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300">
              Are you sure you want to permanently delete <strong className="text-white">"{deletingProduct.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
