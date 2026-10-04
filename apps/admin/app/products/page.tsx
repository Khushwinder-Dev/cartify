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
  Edit3,
  Trash2,
  Tag
} from 'lucide-react';

interface ProductItem {
  id: number;
  title: string;
  slug: string;
  status: 'active' | 'draft' | 'archived';
  vendor: string;
  product_type: string;
  variant_count: number;
  total_inventory: number;
  min_price: number;
  max_price: number;
  created_at: string;
}

const mockProducts: ProductItem[] = [
  {
    id: 1,
    title: 'Japanese Selvedge Denim Jacket',
    slug: 'japanese-selvedge-denim-jacket',
    status: 'active',
    vendor: 'Kuroki Mills',
    product_type: 'Outerwear',
    variant_count: 12,
    total_inventory: 140,
    min_price: 185.00,
    max_price: 215.00,
    created_at: '2026-10-01',
  },
  {
    id: 2,
    title: 'Heavyweight Loopback Hoodie',
    slug: 'heavyweight-loopback-hoodie',
    status: 'active',
    vendor: 'Acme Studio',
    product_type: 'Apparel',
    variant_count: 8,
    total_inventory: 64,
    min_price: 95.00,
    max_price: 95.00,
    created_at: '2026-10-02',
  },
  {
    id: 3,
    title: 'Relaxed Silk Camp Shirt',
    slug: 'relaxed-silk-camp-shirt',
    status: 'draft',
    vendor: 'Como Silks',
    product_type: 'Shirts',
    variant_count: 6,
    total_inventory: 18,
    min_price: 140.00,
    max_price: 140.00,
    created_at: '2026-10-03',
  },
  {
    id: 4,
    title: 'Structured Wool Trousers',
    slug: 'structured-wool-trousers',
    status: 'archived',
    vendor: 'Biella Weavers',
    product_type: 'Pants',
    variant_count: 10,
    total_inventory: 0,
    min_price: 165.00,
    max_price: 165.00,
    created_at: '2026-09-28',
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function AdminProductsPage() {
  const [data, setData] = useState<ProductItem[]>(mockProducts);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (res.ok) {
          const result = await res.json();
          if (Array.isArray(result.data) && result.data.length > 0) {
            setData(result.data.map((p: any) => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
              status: p.status || 'draft',
              vendor: p.vendor || 'Acme Studio',
              product_type: p.product_type || 'Apparel',
              variant_count: p.variants?.length || 1,
              total_inventory: p.variants?.reduce((sum: number, v: any) => sum + (v.inventory_quantity || 0), 0) || 0,
              min_price: p.min_price || (p.variants?.[0]?.price ? parseFloat(p.variants[0].price) : 0),
              max_price: p.max_price || (p.variants?.[0]?.price ? parseFloat(p.variants[0].price) : 0),
              created_at: p.created_at?.split('T')[0] || '2026-10-04',
            })));
          }
        }
      } catch (e) {
        // Fallback to mock data for local testing
      }
    };
    fetchProducts();
  }, []);

  // Filtered by dropdown status
  const filteredData = useMemo(() => {
    if (statusFilter === 'all') return data;
    return data.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  // Bulk Status Change
  const handleBulkStatusChange = (newStatus: 'active' | 'draft' | 'archived') => {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    setData((prev) =>
      prev.map((item, idx) =>
        selectedIndices.includes(idx) ? { ...item, status: newStatus } : item
      )
    );
    setRowSelection({});
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
            <span className="font-semibold text-white block">{row.original.title}</span>
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
              for {row.original.variant_count} variants
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20">
      {/* Top Header */}
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
              <Link href="/products" className="px-3 py-1.5 rounded-lg text-white bg-neutral-800">
                Products
              </Link>
              <Link href="/orders" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800/60 transition">
                Orders
              </Link>
            </nav>
          </div>

          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Product Matrix</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Catalog & Inventory</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Powered by TanStack Table with multi-column sorting and atomic bulk status mutations
            </p>
          </div>

          {/* Bulk Action Controls */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700/80 px-4 py-2 rounded-xl text-xs shadow-xl animate-fade-in">
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
        </div>

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
    </div>
  );
}
