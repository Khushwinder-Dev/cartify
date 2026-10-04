'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Layers,
  TrendingUp,
  Package,
  AlertTriangle,
  ShoppingBag,
  DollarSign,
  Tag,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Order, Product } from '@/lib/types';

interface OptionInput {
  name: string;
  values: string[];
  currentValueInput: string;
}

interface VariantMatrixRow {
  title: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  inventory_quantity: number;
  combination: string[];
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState({
    total_sales: 12450.0,
    total_orders: 42,
    total_customers: 28,
    active_products: 4,
    average_order_value: 296.42,
  });
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Shopify Product Creator
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newVendor, setNewVendor] = useState('Atelier Studio');
  const [newType, setNewType] = useState('Apparel');
  const [newDescription, setNewDescription] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80');
  const [basePrice, setBasePrice] = useState(150);
  const [baseInventory, setBaseInventory] = useState(20);

  // Dynamic Options (e.g. Size, Color)
  const [options, setOptions] = useState<OptionInput[]>([
    { name: 'Size', values: ['S', 'M', 'L'], currentValueInput: '' },
    { name: 'Color', values: ['Black', 'Off-White'], currentValueInput: '' },
  ]);

  // Generated Cartesian Matrix
  const [variantMatrix, setVariantMatrix] = useState<VariantMatrixRow[]>([]);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const prodRes = await api.getProducts();
      setProducts(prodRes.data);

      const analyticsRes = await api.getAdminAnalytics();
      if (analyticsRes.data) {
        setMetrics(analyticsRes.data.metrics);
        setLowStockAlerts(analyticsRes.data.low_stock_alerts || []);
        if (analyticsRes.data.recent_orders) {
          setOrders(analyticsRes.data.recent_orders);
        }
      }
    } catch (e) {
      console.warn('Backend server currently in local mode, using populated state.');
    } finally {
      setLoading(false);
    }
  };

  // Recalculate Cartesian Variant Matrix when options or base values change
  useEffect(() => {
    const validOptions = options.filter((o) => o.name.trim() !== '' && o.values.length > 0);
    if (validOptions.length === 0) {
      setVariantMatrix([
        {
          title: 'Default Title',
          sku: 'PROD-DEFAULT',
          price: basePrice,
          compare_at_price: null,
          inventory_quantity: baseInventory,
          combination: ['Default'],
        },
      ]);
      return;
    }

    // Cartesian product algorithm
    const cartesian = (arrays: string[][]): string[][] => {
      return arrays.reduce((acc, curr) => acc.flatMap((c) => curr.map((n) => [...c, n])), [[]] as string[][]);
    };

    const valueArrays = validOptions.map((o) => o.values);
    const combinations = cartesian(valueArrays);

    const generated: VariantMatrixRow[] = combinations.map((combo) => {
      const title = combo.join(' / ');
      const skuSuffix = combo.map((v) => v.toUpperCase().replace(/\s+/g, '-')).join('-');
      return {
        title,
        sku: `PROD-${skuSuffix}`,
        price: basePrice,
        compare_at_price: null,
        inventory_quantity: baseInventory,
        combination: combo,
      };
    });

    setVariantMatrix(generated);
  }, [options, basePrice, baseInventory]);

  // Option dimension management
  const addOptionDimension = () => {
    setOptions([...options, { name: '', values: [], currentValueInput: '' }]);
  };

  const removeOptionDimension = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleAddValuePill = (optIndex: number) => {
    const opt = options[optIndex];
    const val = opt.currentValueInput.trim();
    if (!val || opt.values.includes(val)) return;

    const updated = [...options];
    updated[optIndex].values.push(val);
    updated[optIndex].currentValueInput = '';
    setOptions(updated);
  };

  const handleRemoveValuePill = (optIndex: number, valToRemove: string) => {
    const updated = [...options];
    updated[optIndex].values = updated[optIndex].values.filter((v) => v !== valToRemove);
    setOptions(updated);
  };

  // In-table variant row editing
  const updateMatrixRow = (index: number, field: keyof VariantMatrixRow, value: any) => {
    const updated = [...variantMatrix];
    updated[index] = { ...updated[index], [field]: value };
    setVariantMatrix(updated);
  };

  // Submit product creation to Laravel Backend
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSavingProduct(true);
    setStatusMessage(null);

    try {
      const payload = {
        title: newTitle,
        vendor: newVendor,
        product_type: newType,
        description: newDescription,
        status: 'active',
        base_price: basePrice,
        base_inventory: baseInventory,
        options: options
          .filter((o) => o.name && o.values.length > 0)
          .map((o) => ({ name: o.name, values: o.values })),
        media: newMediaUrl ? [{ url: newMediaUrl, is_primary: true }] : [],
      };

      const res = await api.createAdminProduct(payload);

      // Now apply customized variant pricing/inventory from the matrix
      if (res.data && res.data.variants && res.data.variants.length > 0) {
        const variantsPayload = res.data.variants.map((v, i) => {
          const matrixMatch = variantMatrix[i];
          return {
            id: v.id,
            sku: matrixMatch?.sku || v.sku,
            price: matrixMatch?.price || v.price,
            inventory_quantity: matrixMatch?.inventory_quantity || v.inventory_quantity,
          };
        });
        await api.bulkUpdateVariants(res.data.id, variantsPayload);
      }

      setStatusMessage('Product & Cartesian Variant Matrix published successfully!');
      setIsCreatorOpen(false);
      await loadData();
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message || 'Could not save product'}`);
    } finally {
      setIsSavingProduct(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider rounded-lg">
                RBAC Control Center
              </span>
              <span className="text-xs text-neutral-400 font-semibold">• Multi-Variant EAV</span>
            </div>
            <h1 className="text-2xl font-black text-neutral-950 dark:text-white mt-1">Shopify Headless Admin</h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCreatorOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Product (Variant Matrix)</span>
            </button>
          </div>
        </div>

        {/* Status Message Notification */}
        {statusMessage && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-2xl flex items-center justify-between">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Real-Time KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-neutral-950 dark:text-white">
              ${Number(metrics.total_sales).toFixed(2)}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Paid Orders Only</span>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-neutral-950 dark:text-white">{metrics.total_orders}</div>
            <span className="text-[11px] text-neutral-500 mt-1 block">Avg ${Number(metrics.average_order_value).toFixed(2)}</span>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Products</span>
              <Package className="w-4 h-4 text-violet-500" />
            </div>
            <div className="text-2xl font-black text-neutral-950 dark:text-white">{metrics.active_products}</div>
            <span className="text-[11px] text-neutral-500 mt-1 block">Live in Catalog</span>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Low Stock SKUs</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {lowStockAlerts.length}
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">Threshold &le; 5 units</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Orders &amp; Fulfillments ({orders.length})
          </button>
        </div>

        {/* Product Catalog Tab View */}
        {activeTab === 'products' && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
              <h2 className="font-bold text-base text-neutral-950 dark:text-white">Live Products Catalog</h2>
              <span className="text-xs text-neutral-500">Auto-synced with MySQL 8 InnoDB</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-6">Product</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Vendor</th>
                    <th className="py-3 px-6">Type</th>
                    <th className="py-3 px-6">Variants</th>
                    <th className="py-3 px-6">Price Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-medium">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.primary_media?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800"
                          />
                          <div>
                            <span className="font-bold text-neutral-900 dark:text-white block">{p.title}</span>
                            <span className="text-[11px] font-mono text-neutral-400">/{p.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-neutral-600 dark:text-neutral-400">{p.vendor || 'Atelier'}</td>
                      <td className="py-4 px-6 text-neutral-600 dark:text-neutral-400">{p.product_type || 'General'}</td>
                      <td className="py-4 px-6 font-bold text-indigo-600 dark:text-indigo-400">
                        {p.variants?.length || 1} generated
                      </td>
                      <td className="py-4 px-6 font-extrabold text-neutral-900 dark:text-white">
                        ${p.min_price?.toFixed(2)} - ${p.max_price?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab View */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
              <h2 className="font-bold text-base text-neutral-950 dark:text-white">Recent Immutable Orders</h2>
              <span className="text-xs text-neutral-500">Locked Pricing &amp; Variant Snapshots</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-6">Order #</th>
                    <th className="py-3 px-6">Customer</th>
                    <th className="py-3 px-6">Financial</th>
                    <th className="py-3 px-6">Fulfillment</th>
                    <th className="py-3 px-6">Total</th>
                    <th className="py-3 px-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-medium">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-500">
                        No orders recorded yet. Complete a checkout from the storefront!
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {o.order_number}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold block">{o.customer_name || 'Guest'}</span>
                          <span className="text-neutral-400 text-[11px]">{o.email}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                            {o.financial_status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
                            {o.fulfillment_status}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-extrabold text-neutral-900 dark:text-white">
                          ${Number(o.grand_total).toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-neutral-500">
                          {new Date(o.created_at || Date.now()).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SHOPIFY-STYLE PRODUCT CREATOR MODAL */}
        {isCreatorOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950/50">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                    Shopify-Style Dynamic Product &amp; Variant Matrix Creator
                  </h3>
                </div>
                <button
                  onClick={() => setIsCreatorOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {/* General Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Product Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Brushed Mohair Cardigan"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Vendor / Brand
                    </label>
                    <input
                      type="text"
                      value={newVendor}
                      onChange={(e) => setNewVendor(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Product Category
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="Apparel">Apparel</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Default Base Price ($)
                    </label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Default Base Stock
                    </label>
                    <input
                      type="number"
                      value={baseInventory}
                      onChange={(e) => setBaseInventory(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* SHOPIFY DYNAMIC OPTIONS SECTION */}
                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-indigo-500" /> Dynamic Option Dimensions &amp; Values
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        Define option types (e.g. Size, Color) to automatically generate the Cartesian matrix.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addOptionDimension}
                      className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Option</span>
                    </button>
                  </div>

                  {options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className="p-3.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          placeholder="Option Name (e.g. Size, Color, Material)"
                          value={opt.name}
                          onChange={(e) => {
                            const updated = [...options];
                            updated[optIdx].name = e.target.value;
                            setOptions(updated);
                          }}
                          className="font-bold text-xs px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent w-48 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeOptionDimension(optIdx)}
                          className="text-neutral-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Value Pills */}
                      <div className="flex flex-wrap items-center gap-2">
                        {opt.values.map((v) => (
                          <span
                            key={v}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold"
                          >
                            <span>{v}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveValuePill(optIdx, v)}
                              className="text-indigo-400 hover:text-indigo-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}

                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            placeholder="Add value (press Enter)"
                            value={opt.currentValueInput}
                            onChange={(e) => {
                              const updated = [...options];
                              updated[optIdx].currentValueInput = e.target.value;
                              setOptions(updated);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddValuePill(optIdx);
                              }
                            }}
                            className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-40"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddValuePill(optIdx)}
                            className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold rounded-lg hover:bg-neutral-200"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* GENERATED CARTESIAN VARIANT MATRIX TABLE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                      Generated Variant Matrix ({variantMatrix.length} combinations)
                    </h4>
                    <span className="text-[11px] text-neutral-500">Bulk edit prices and inventory before publishing</span>
                  </div>

                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 font-semibold uppercase">
                        <tr>
                          <th className="py-2.5 px-4">Variant Title</th>
                          <th className="py-2.5 px-4">SKU</th>
                          <th className="py-2.5 px-4">Price ($)</th>
                          <th className="py-2.5 px-4">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {variantMatrix.map((row, idx) => (
                          <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                            <td className="py-2 px-4 font-bold text-neutral-900 dark:text-white">
                              {row.title}
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={row.sku}
                                onChange={(e) => updateMatrixRow(idx, 'sku', e.target.value)}
                                className="w-32 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-transparent font-mono text-[11px]"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="number"
                                step="0.01"
                                value={row.price}
                                onChange={(e) => updateMatrixRow(idx, 'price', Number(e.target.value))}
                                className="w-20 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-transparent font-bold text-xs"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="number"
                                value={row.inventory_quantity}
                                onChange={(e) => updateMatrixRow(idx, 'inventory_quantity', Number(e.target.value))}
                                className="w-20 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-transparent font-bold text-xs"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreatorOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateProduct}
                  disabled={isSavingProduct || !newTitle.trim()}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center space-x-1.5"
                >
                  {isSavingProduct ? (
                    <span>Syncing &amp; Generating Variants...</span>
                  ) : (
                    <>
                      <span>Publish Product &amp; Matrix</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
