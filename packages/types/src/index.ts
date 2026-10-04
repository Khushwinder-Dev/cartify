/**
 * Shared TypeScript models for the E-Commerce Platform
 * Monorepo: packages/types
 */

export type ProductStatus = 'draft' | 'active' | 'archived';

export interface ProductOptionValue {
  id: number;
  product_option_id: number;
  value: string;
  position: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductOption {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values?: ProductOptionValue[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  variant_id?: number | null;
  url: string;
  alt_text?: string | null;
  position: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  title?: string | null;
  sku: string;
  barcode?: string | null;
  price: number | string;
  compare_at_price?: number | string | null;
  cost_price?: number | string | null;
  inventory_quantity: number;
  track_inventory: boolean;
  allow_backorders?: boolean;
  weight?: number | null;
  product?: Product;
  option_values?: ProductOptionValue[];
  image?: ProductImage | null;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  status: ProductStatus;
  vendor?: string | null;
  product_type?: string | null;
  tags?: string[] | null;
  published_at?: string | null;
  options?: ProductOption[];
  variants?: ProductVariant[];
  images?: ProductImage[];
  media?: ProductImage[];
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string | null;
  addresses?: CustomerAddress[];
  created_at?: string;
  updated_at?: string;
}

export interface CustomerAddress {
  id?: number;
  customer_id?: number;
  user_id?: number;
  type: 'billing' | 'shipping';
  first_name?: string;
  last_name?: string;
  address_lines: string;
  address_line_1?: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string | null;
  is_default?: boolean;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_variant_id: number;
  quantity: number;
  price: number | string;
  variant?: ProductVariant;
  created_at?: string;
  updated_at?: string;
}

export interface Cart {
  id: number;
  token: string;
  user_id?: number | null;
  currency: string;
  items: CartItem[];
  subtotal?: number;
  discount_total?: number;
  tax_total?: number;
  shipping_total?: number;
  grand_total?: number;
  created_at?: string;
  updated_at?: string;
}

export type OrderStatus = 'open' | 'closed' | 'cancelled';
export type FinancialStatus = 'pending' | 'authorized' | 'paid' | 'refunded' | 'partially_refunded';
export type FulfillmentStatus = 'unfulfilled' | 'partially_fulfilled' | 'fulfilled' | 'cancelled';

export interface OrderItem {
  id: number;
  order_id: number;
  product_variant_id?: number | null;
  title_snapshot: string;
  sku?: string | null;
  unit_price: number | string;
  quantity: number;
  subtotal: number | string;
  variant?: ProductVariant;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id?: number | null;
  user_id?: number | null;
  email: string;
  customer_name?: string | null;
  phone?: string | null;
  status: OrderStatus;
  financial_status: FinancialStatus;
  fulfillment_status: FulfillmentStatus;
  currency: string;
  subtotal: number | string;
  discount_total?: number | string;
  tax_total: number | string;
  shipping_total: number | string;
  grand_total: number | string;
  idempotency_key?: string | null;
  payment_method?: string | null;
  tracking_number?: string | null;
  carrier?: string | null;
  shipping_address?: CustomerAddress | Record<string, any>;
  billing_address?: CustomerAddress | Record<string, any>;
  items?: OrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface VariantMatrixOptionInput {
  name: string;
  values: string[];
}

export interface VariantMatrixGeneratedItem {
  options: Record<string, string>; // e.g. { "Size": "M", "Color": "Red" }
  title: string;
  sku: string;
  price: number;
  compare_at_price?: number | null;
  cost_price?: number | null;
  inventory_quantity: number;
  track_inventory: boolean;
  weight?: number | null;
}
