export interface ApiResponse<T> {
  data: T;
  meta: Record<string, any>;
  message: string;
  errors: Record<string, string[]> | string | null;
}

export interface ProductOptionValue {
  id: number;
  product_option_id: number;
  value: string;
  position: number;
}

export interface ProductOption {
  id: number;
  name: string;
  position: number;
  values?: ProductOptionValue[];
}

export interface ProductMedia {
  id: number;
  product_id: number;
  product_variant_id: number | null;
  url: string;
  alt_text: string | null;
  position: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  title: string;
  sku: string | null;
  barcode: string | null;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  inventory_quantity: number;
  track_quantity: boolean;
  allow_backorders: boolean;
  is_available: boolean;
  weight: number | null;
  option_values?: ProductOptionValue[];
  media?: ProductMedia[];
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  status: 'draft' | 'active' | 'archived';
  vendor: string | null;
  product_type: string | null;
  tags: string[];
  published_at: string | null;
  min_price: number | null;
  max_price: number | null;
  is_available: boolean;
  primary_media?: ProductMedia;
  media?: ProductMedia[];
  options?: ProductOption[];
  variants?: ProductVariant[];
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_variant_id: number;
  quantity: number;
  price: number;
  total: number;
  variant?: ProductVariant & { product?: Product };
}

export interface Cart {
  id: number;
  token: string;
  user_id: number | null;
  currency: string;
  items_count: number;
  subtotal: number;
  items?: CartItem[];
  updated_at?: string;
}

export interface PricingCalculation {
  subtotal: number;
  discount_total: number;
  discount_code: string | null;
  tax_rate: number;
  tax_total: number;
  shipping_total: number;
  grand_total: number;
  currency: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_variant_id: number | null;
  product_title: string;
  variant_title: string | null;
  sku: string | null;
  price: number;
  quantity: number;
  total: number;
  options_snapshot: Array<{ option: string; value: string }> | null;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number | null;
  email: string;
  customer_name: string | null;
  phone: string | null;
  status: 'open' | 'closed' | 'cancelled';
  financial_status: 'pending' | 'authorized' | 'paid' | 'refunded' | 'partially_refunded';
  fulfillment_status: 'unfulfilled' | 'partially_fulfilled' | 'fulfilled' | 'cancelled';
  currency: string;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  shipping_total: number;
  grand_total: number;
  idempotency_key: string | null;
  payment_method: string | null;
  payment_intent_id: string | null;
  shipping_address: Record<string, any> | null;
  billing_address: Record<string, any> | null;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Discount {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_subtotal: number | null;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  times_used: number;
}
