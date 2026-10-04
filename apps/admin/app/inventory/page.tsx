'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  RefreshCw,
  Save,
  ArrowUpDown
} from 'lucide-react';

interface InventoryRow {
  id: number;
  product_id: number;
  product_title: string;
  variant_title: string;
  sku: string;
  barcode?: string;
  price: number;
  inventory_quantity: number;
  track_inventory: boolean;
}

const mockInventory: InventoryRow[] = [
  { id: 1, product_id: 1, product_title: 'Japanese Selvedge Denim Jacket', variant_title: 'S / Indigo', sku: 'JAP-SEL-S-IND', price: 185.00, inventory_quantity: 12, track_inventory: true },
  { id: 2, product_id: 1, product_title: 'Japanese Selvedge Denim Jacket', variant_title: 'M / Indigo', sku: 'JAP-SEL-M-IND', price: 185.00, inventory_quantity: 2, track_inventory: true },
  { id: 3, product_id: 1, product_title: 'Japanese Selvedge Denim Jacket', variant_title: 'L / Indigo', sku: 'JAP-SEL-L-IND', price: 185.00, inventory_quantity: 0, track_inventory: true },
  { id: 4, product_id: 2, product_title: 'Heavyweight Loopback Hoodie', variant_title: 'M / Slate', sku: 'HW-LOOP-M-SLT', price: 95.00, inventory_quantity: 18, track_inventory: true },
  { id: 5, product_id: 2, product_title: 'Heavyweight Loopback Hoodie', variant_title: 'L / Slate', sku: 'HW-LOOP-L-SLT', price: 95.00, inventory_quantity: 4, track_inventory: true },
  { id: 6, product_id: 3, product_title: 'Relaxed Silk Camp Shirt', variant_title: 'M / Off-White', sku: 'SILK-CAMP-M-WHT', price: 140.00, inventory_quantity: 22, track_inventory: true },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryRow[]>(mockInventory);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      const token = localStorage.getItem('admin_token');
      try {
        const res = await fetch(`${API_BASE}/admin/inventory`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.data) && data.data.length > 0) {
            setItems(data.data);
          }
        }
      } catch (e) {}
    };
    fetchInventory();
  }, []);

  const handleAdjustStock = async (id: number, delta: number) => {
    setSavingId(id);
    const token = localStorage.getItem('admin_token');

    setItems((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, inventory_quantity: Math.max(0, row.inventory_quantity + delta) }
          : row
      )
    );

    try {
      await fetch(`${API_BASE}/admin/variants/${id}/inventory`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ adjustment: delta }),
      });
    } catch (e) {} finally {
      setSavingId(null);
    }
  };

  const handleSetStock = async (id: number, exactQty: number) => {
    setSavingId(id);
    const token = localStorage.getItem('admin_token');

    setItems((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, inventory_quantity: Math.max(0, exactQty) } : row
      )
    );

    try {
      await fetch(`${API_BASE}/admin/variants/${id}/inventory`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ inventory_quantity: exactQty }),
      });
    } catch (e) {} finally {
      setSavingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.product_title.toLowerCase().includes(search.toLowerCase()) ||
      item.variant_title.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());

    const matchLowStock = lowStockOnly ? item.inventory_quantity <= 5 : true;

    return matchSearch && matchLowStock;
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
              <Link href="/inventory" className="px-3 py-1.5 rounded-lg text-white bg-neutral-800">
                Inventory
              </Link>
              <Link href="/customers" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-800/60 transition">
                Customers
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Package className="w-6 h-6 text-indigo-400" />
              <span>Inventory & Stock Adjustments</span>
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Pessimistic concurrency safe stock levels with quick batch steppers and low-stock alarms
            </p>
          </div>
        </div>

        {/* Search & Low Stock Toggle */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-4 mb-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by SKU, product, or variant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              lowStockOnly
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Show Low Stock Only (&le; 5 units)</span>
          </button>
        </div>

        {/* Inventory Table */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">SKU / Variant</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-900/50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-white block text-sm">{item.sku}</span>
                    <span className="text-neutral-400">{item.variant_title}</span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300 font-medium">
                    {item.product_title}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.inventory_quantity === 0
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : item.inventory_quantity <= 5
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {item.inventory_quantity === 0 ? 'Out of Stock' : item.inventory_quantity <= 5 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      value={item.inventory_quantity}
                      onChange={(e) => handleSetStock(item.id, parseInt(e.target.value, 10) || 0)}
                      className="w-20 px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs font-bold text-white text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleAdjustStock(item.id, -10)}
                        title="Remove 10 units"
                        className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-[11px]"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => handleAdjustStock(item.id, -1)}
                        title="Remove 1 unit"
                        className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAdjustStock(item.id, 1)}
                        title="Add 1 unit"
                        className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAdjustStock(item.id, 10)}
                        title="Add 10 units"
                        className="px-2 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-mono text-[11px]"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
