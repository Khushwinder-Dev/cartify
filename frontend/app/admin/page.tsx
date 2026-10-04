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
  RefreshCw,
  Box,
  Truck,
  RotateCcw,
  Percent,
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
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'inventory' | 'discounts'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    total_sales: 12450.0,
    total_orders: 42,
    total_customers: 28,
    active_products: 5,
    average_order_value: 296.42,
  });
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Shopify Product Creator Modal State
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

  // New Discount Form State
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [newDiscountCode, setNewDiscountCode] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [newDiscountValue, setNewDiscountValue] = useState(15);
  const [newDiscountMinSubtotal, setNewDiscountMinSubtotal] = useState(50);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
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

      const invRes = await api.getAdminInventory();
      if (invRes.data?.items) {
        setInventoryItems(invRes.data.items);
      }

      const discRes = await api.getAdminDiscounts();
      if (discRes.data) {
        setDiscounts(discRes.data);
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

  // Bulk Edit Matrix Utilities
  const applyBulkPrice = (price: number) => {
    setVariantMatrix(variantMatrix.map((v) => ({ ...v, price })));
  };

  const applyBulkInventory = (inventory_quantity: number) => {
    setVariantMatrix(variantMatrix.map((v) => ({ ...v, inventory_quantity })));
  };

  // Dynamic Option Dimension Management
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

  const updateMatrixRow = (index: number, field: keyof VariantMatrixRow, value: any) => {
    const updated = [...variantMatrix];
    updated[index] = { ...updated[index], [field]: value };
    setVariantMatrix(updated);
  };

  // Quick Restock Action (adds +10 units to variant in DB)
  const handleQuickRestock = async (variantId: number, count = 10) => {
    try {
      await api.adjustVariantInventory(variantId, count);
      setStatusMessage(`Restocked SKU by +${count} units!`);
      await loadAllData();
    } catch (e: any) {
      setStatusMessage(`Restock failed: ${e.message}`);
    }
  };

  // Order Status Actions
  const handleUpdateOrderStatus = async (orderId: number, type: 'fulfillment' | 'financial', status: string) => {
    try {
      if (type === 'fulfillment') {
        await api.updateOrderFulfillment(orderId, status);
      } else {
        await api.updateOrderFinancial(orderId, status);
      }
      setStatusMessage(`Order updated to ${status}!`);
      await loadAllData();
    } catch (e: any) {
      setStatusMessage(`Update failed: ${e.message}`);
    }
  };

  // Publish New Product to Laravel Backend
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

      setStatusMessage('Product and Cartesian Variant Matrix published successfully!');
      setIsCreatorOpen(false);
      setNewTitle('');
      await loadAllData();
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message || 'Could not save product'}`);
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Create Coupon
  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscountCode.trim()) return;

    try {
      await api.createAdminDiscount({
        code: newDiscountCode.toUpperCase().trim(),
        type: newDiscountType,
        value: newDiscountValue,
        min_subtotal: newDiscountMinSubtotal,
        is_active: true,
      });
      setStatusMessage(`Discount ${newDiscountCode.toUpperCase()} activated!`);
      setIsDiscountModalOpen(false);
      setNewDiscountCode('');
      await loadAllData();
    } catch (e: any) {
      setStatusMessage(`Could not create discount: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider rounded-lg">
                Shopify Back-Office
              </span>
              <span className="text-xs text-neutral-400 font-semibold">• EAV Matrix &amp; Stock Locks</span>
            </div>
            <h1 className="text-2xl font-black text-neutral-950 dark:text-white mt-1">Admin Control Center</h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCreatorOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Product (Variant Matrix)</span>
            </button>

            <button
              onClick={() => setIsDiscountModalOpen(true)}
              className="px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs rounded-xl shadow-sm hover:opacity-90 transition-all flex items-center space-x-1.5"
            >
              <Percent className="w-4 h-4" />
              <span>New Coupon</span>
            </button>
          </div>
        </div>

        {/* Status Message Notification */}
        {statusMessage && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-2xl flex items-center justify-between animate-in fade-in">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Real-Time KPIs Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-neutral-950 dark:text-white">
              ${Number(metrics.total_sales).toFixed(2)}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Live Stripe Captured</span>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-neutral-950 dark:text-white">{metrics.total_orders}</div>
            <span className="text-[11px] text-neutral-500 mt-1 block">Avg ${Number(metrics.average_order_value).toFixed(2)} / order</span>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Live Catalog</span>
              <Package className="w-4 h-4 text-violet-500" />
            </div>
            <div className="text-2xl font-black text-neutral-950 dark:text-white">{metrics.active_products}</div>
            <span className="text-[11px] text-neutral-500 mt-1 block">Active In Storefront</span>
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

        {/* Tab Controls Bar */}
        <div className="flex space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 overflow-x-auto">
          {[
            { id: 'products', label: `Products (${products.length})` },
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'inventory', label: `Inventory Matrix (${inventoryItems.length})` },
            { id: 'discounts', label: `Coupons (${discounts.length})` },
            { id: 'analytics', label: 'Revenue Performance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PRODUCT CATALOG */}
        {activeTab === 'products' && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-base text-neutral-950 dark:text-white">Product Catalog</h2>
                <span className="text-xs text-neutral-500">Cartesian variant matrices backed by MySQL 8 InnoDB</span>
              </div>
              <button
                onClick={() => setIsCreatorOpen(true)}
                className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
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
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
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

        {/* TAB 2: ORDERS & FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-base text-neutral-950 dark:text-white">Customer Orders &amp; Fulfillment</h2>
                <span className="text-xs text-neutral-500">Immutable line items snapshot with locked prices</span>
              </div>
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
                    <th className="py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-medium">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-500">
                        No orders recorded yet. Process an order through the storefront checkout!
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
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            o.financial_status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                          }`}>
                            {o.financial_status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            o.fulfillment_status === 'fulfilled'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                              : 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                          }`}>
                            {o.fulfillment_status}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-black text-neutral-900 dark:text-white">
                          ${Number(o.grand_total).toFixed(2)}
                        </td>
                        <td className="py-4 px-6 space-x-2">
                          {o.financial_status !== 'paid' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'financial', 'paid')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                            >
                              Mark Paid
                            </button>
                          )}
                          {o.fulfillment_status !== 'fulfilled' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'fulfillment', 'fulfilled')}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                            >
                              Fulfill
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY MATRIX */}
        {activeTab === 'inventory' && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-base text-neutral-950 dark:text-white">Inventory Stock Levels</h2>
                <span className="text-xs text-neutral-500">Atomic inventory levels across all variant combinations</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-6">Product &amp; Variant</th>
                    <th className="py-3 px-6">SKU</th>
                    <th className="py-3 px-6">Price</th>
                    <th className="py-3 px-6">In Stock</th>
                    <th className="py-3 px-6">Quick Replenish</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-medium">
                  {inventoryItems.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="py-3.5 px-6">
                        <span className="font-bold text-neutral-900 dark:text-white block">
                          {item.product?.title || 'Product'}
                        </span>
                        <span className="text-neutral-500 text-[11px]">{item.title}</span>
                      </td>
                      <td className="py-3.5 px-6 font-mono text-neutral-600 dark:text-neutral-400">
                        {item.sku || 'N/A'}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-neutral-900 dark:text-white">
                        ${Number(item.price).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`font-black text-sm ${
                            item.inventory_quantity <= 5 ? 'text-amber-600' : 'text-emerald-600'
                          }`}
                        >
                          {item.inventory_quantity} units
                        </span>
                      </td>
                      <td className="py-3.5 px-6 space-x-2">
                        <button
                          onClick={() => handleQuickRestock(item.id, 5)}
                          className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded font-bold text-[11px]"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleQuickRestock(item.id, 20)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded font-bold text-[11px]"
                        >
                          +20 Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS & DISCOUNTS */}
        {activeTab === 'discounts' && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-base text-neutral-950 dark:text-white">Active Promotional Coupons</h2>
                <span className="text-xs text-neutral-500">Auto-calculated discounts applied at checkout</span>
              </div>
              <button
                onClick={() => setIsDiscountModalOpen(true)}
                className="px-3.5 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold rounded-lg shadow-sm"
              >
                + Create Coupon
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-6">Coupon Code</th>
                    <th className="py-3 px-6">Discount</th>
                    <th className="py-3 px-6">Min Purchase</th>
                    <th className="py-3 px-6">Usage Times</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-medium">
                  {discounts.map((d) => (
                    <tr key={d.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="py-4 px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                        {d.code}
                      </td>
                      <td className="py-4 px-6 font-bold text-neutral-900 dark:text-white">
                        {d.type === 'percentage' ? `${d.value}% OFF` : `$${d.value} OFF`}
                      </td>
                      <td className="py-4 px-6 text-neutral-600 dark:text-neutral-400">
                        {d.min_subtotal ? `$${d.min_subtotal}` : 'No Minimum'}
                      </td>
                      <td className="py-4 px-6 text-neutral-600 dark:text-neutral-400">
                        {d.times_used} uses {d.usage_limit ? `/ ${d.usage_limit}` : ''}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: REVENUE & SALES PERFORMANCE */}
        {activeTab === 'analytics' && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="font-bold text-lg text-neutral-950 dark:text-white">7-Day Gross Sales Velocity</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Automated settlement via Stripe Payment Intents</p>
            </div>

            {/* Visual SVG Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-4 pt-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              {[
                { day: 'Mon', amount: 1420 },
                { day: 'Tue', amount: 2180 },
                { day: 'Wed', amount: 1890 },
                { day: 'Thu', amount: 2650 },
                { day: 'Fri', amount: 3100 },
                { day: 'Sat', amount: 4200 },
                { day: 'Sun', amount: 3800 },
              ].map((bar, i) => {
                const heightPercent = Math.round((bar.amount / 4500) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[10px] font-bold text-neutral-500 group-hover:text-indigo-600 transition-colors">
                      ${bar.amount}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 via-violet-500 to-indigo-400 rounded-xl transition-all duration-500 hover:brightness-110"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{bar.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SHOPIFY DYNAMIC PRODUCT & VARIANT CREATOR MODAL */}
        {isCreatorOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
              {/* Header */}
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

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
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
                      Category
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

                {/* DYNAMIC OPTION DIMENSIONS */}
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

                      {/* Interactive Value Pills */}
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

                {/* CARTESIAN VARIANT MATRIX TABLE WITH BULK EDIT */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                        Cartesian Variant Matrix ({variantMatrix.length} combinations)
                      </h4>
                      <span className="text-[11px] text-neutral-500">Bulk edit prices and inventory before publishing</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => applyBulkPrice(basePrice)}
                        className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-bold rounded"
                      >
                        Set All ${basePrice}
                      </button>
                      <button
                        type="button"
                        onClick={() => applyBulkInventory(baseInventory)}
                        className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-bold rounded"
                      >
                        Set All Stock {baseInventory}
                      </button>
                    </div>
                  </div>

                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 font-semibold uppercase sticky top-0">
                        <tr>
                          <th className="py-2.5 px-4">Variant</th>
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

        {/* CREATE DISCOUNT MODAL */}
        {isDiscountModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">Create Discount Coupon</h3>
                <button onClick={() => setIsDiscountModalOpen(false)}>
                  <X className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              <form onSubmit={handleCreateDiscount} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIP20"
                    value={newDiscountCode}
                    onChange={(e) => setNewDiscountCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs uppercase font-mono tracking-wider rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Type
                    </label>
                    <select
                      value={newDiscountType}
                      onChange={(e) => setNewDiscountType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Value
                    </label>
                    <input
                      type="number"
                      required
                      value={newDiscountValue}
                      onChange={(e) => setNewDiscountValue(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Minimum Cart Subtotal ($)
                  </label>
                  <input
                    type="number"
                    value={newDiscountMinSubtotal}
                    onChange={(e) => setNewDiscountMinSubtotal(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md mt-4"
                >
                  Activate Coupon
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
