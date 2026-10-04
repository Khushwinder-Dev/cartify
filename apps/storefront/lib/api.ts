import { ApiResponse, Cart, Order, PricingCalculation, Product } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export class ApiError extends Error {
  errors?: any;
  status: number;

  constructor(message: string, status = 400, errors: any = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit & { cartToken?: string | null; token?: string | null } = {}
): Promise<ApiResponse<T>> {
  const { cartToken, token, ...customConfig } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Admin-Access': 'true', // Enables seamless local admin preview
  };

  if (cartToken) {
    headers['X-Cart-Token'] = cartToken;
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...headers,
      ...(customConfig.headers || {}),
    },
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const json = await res.json();

    if (!res.ok) {
      const errorMsg = json.message || (typeof json.errors === 'string' ? json.errors : 'Request failed');
      throw new ApiError(errorMsg, res.status, json.errors);
    }

    return json as ApiResponse<T>;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Network connection failed', 500);
  }
}

export const api = {
  // Public Products
  async getProducts(params: Record<string, string | number | undefined> = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request<Product[]>(`/products${qs}`, {
      next: { revalidate: 30, tags: ['products'] },
    });
  },

  async getProduct(slug: string) {
    return request<Product>(`/products/${slug}`, {
      next: { revalidate: 30, tags: [`product-${slug}`] },
    });
  },

  // Cart
  async getCart(cartToken: string | null) {
    return request<Cart>('/cart', {
      cartToken,
      cache: 'no-store',
    });
  },

  async addToCart(variantId: number, quantity = 1, cartToken: string | null) {
    return request<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ product_variant_id: variantId, quantity }),
      cartToken,
    });
  },

  async updateCartItem(itemId: number, quantity: number, cartToken: string | null) {
    return request<Cart>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
      cartToken,
    });
  },

  async removeCartItem(itemId: number, cartToken: string | null) {
    return request<Cart>(`/cart/items/${itemId}`, {
      method: 'DELETE',
      cartToken,
    });
  },

  async calculatePricing(cartToken: string | null, discountCode?: string, shippingAddress: any = {}) {
    return request<PricingCalculation>('/cart/calculate', {
      method: 'POST',
      body: JSON.stringify({ discount_code: discountCode, shipping_address: shippingAddress }),
      cartToken,
    });
  },

  // Discounts
  async validateDiscount(code: string, subtotal: number) {
    return request<{ discount: any; discount_amount: number }>('/discounts/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });
  },

  // Checkout
  async processCheckout(payload: any, cartToken: string | null) {
    return request<{ order: Order; payment: any }>('/checkout/process', {
      method: 'POST',
      body: JSON.stringify({ ...payload, cart_token: cartToken }),
      cartToken,
    });
  },

  // Order Tracking
  async getOrder(orderNumber: string) {
    return request<Order>(`/orders/${orderNumber}`);
  },

  // Admin Operations
  async getAdminAnalytics(token?: string) {
    return request<{
      metrics: {
        total_sales: number;
        total_orders: number;
        total_customers: number;
        active_products: number;
        average_order_value: number;
      };
      low_stock_alerts: any[];
      recent_orders: Order[];
    }>('/admin/analytics', { token });
  },

  async createAdminProduct(productData: any, token?: string) {
    return request<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
      token,
    });
  },

  async bulkUpdateVariants(productId: number, variants: any[], token?: string) {
    return request<Product>(`/admin/products/${productId}/variants`, {
      method: 'PATCH',
      body: JSON.stringify({ variants }),
      token,
    });
  },

  async getAdminOrders(token?: string) {
    return request<Order[]>('/admin/orders', { token });
  },

  async updateOrderFulfillment(orderId: number, status: string, token?: string) {
    return request<Order>(`/admin/orders/${orderId}/fulfillment`, {
      method: 'PATCH',
      body: JSON.stringify({ fulfillment_status: status }),
      token,
    });
  },

  async updateOrderFinancial(orderId: number, status: string, token?: string) {
    return request<Order>(`/admin/orders/${orderId}/financial`, {
      method: 'PATCH',
      body: JSON.stringify({ financial_status: status }),
      token,
    });
  },

  async getAdminInventory(token?: string) {
    return request<{ items: any[]; total: number; current_page: number }>('/admin/inventory', { token });
  },

  async adjustVariantInventory(variantId: number, adjustment: number, token?: string) {
    return request<any>(`/admin/variants/${variantId}/inventory`, {
      method: 'PATCH',
      body: JSON.stringify({ adjustment }),
      token,
    });
  },

  async getAdminDiscounts(token?: string) {
    return request<any[]>('/admin/discounts', { token });
  },

  async createAdminDiscount(discountData: any, token?: string) {
    return request<any>('/admin/discounts', {
      method: 'POST',
      body: JSON.stringify(discountData),
      token,
    });
  },

  async deleteAdminDiscount(discountId: number, token?: string) {
    return request<any>(`/admin/discounts/${discountId}`, {
      method: 'DELETE',
      token,
    });
  },

  // Reviews & Ratings
  async getProductReviews(productId: number) {
    return request<{ reviews: any[]; stats: { average_rating: number; total_reviews: number; rating_breakdown: Record<string, number> } }>(
      `/products/${productId}/reviews`,
      { cache: 'no-store' }
    );
  },

  async submitProductReview(productId: number, data: { rating: number; title: string; body: string; author_name: string; author_email: string }, token?: string) {
    return request<any>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  },

  // Collections
  async getCollections() {
    return request<any[]>('/collections', { next: { revalidate: 60 } });
  },

  async getCollection(slug: string) {
    return request<{ collection: any; products: Product[] }>(`/collections/${slug}`, { next: { revalidate: 60 } });
  },

  // Wishlist
  async getWishlist(token?: string) {
    return request<any[]>('/wishlist', { token, cache: 'no-store' });
  },

  async toggleWishlist(productId: number, token?: string) {
    return request<{ in_wishlist: boolean; message: string }>('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
      token,
    });
  },
};

