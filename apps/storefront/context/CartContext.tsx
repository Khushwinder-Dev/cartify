'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Cart } from '@/lib/types';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  cartToken: string | null;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addToCart: (variantId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  message: string | null;
  clearMessage: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartToken, setCartToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  // Initialize cart token from localStorage
  useEffect(() => {
    let token = localStorage.getItem('cartify_cart_token') || localStorage.getItem('shopify_cart_token') || localStorage.getItem('cart_token');
    if (!token) {
      token = crypto.randomUUID();
    }
    localStorage.setItem('cartify_cart_token', token);
    setCartToken(token);
    fetchCart(token);
  }, []);

  const fetchCart = async (token: string) => {
    setIsLoading(true);
    try {
      const res = await api.getCart(token);
      setCart(res.data);
    } catch (e) {
      console.warn('Could not fetch cart from server, initializing empty cart state.');
      setCart({
        id: 0,
        token,
        user_id: null,
        currency: 'USD',
        items_count: 0,
        subtotal: 0,
        items: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);
  const clearMessage = () => setMessage(null);

  const showFeedback = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3500);
  };

  const addToCart = async (variantId: number, quantity = 1) => {
    try {
      const res = await api.addToCart(variantId, quantity, cartToken);
      setCart(res.data);
      showFeedback('Item added to your cart!');
      openCart();
    } catch (err: any) {
      showFeedback(err.message || 'Failed to add item to cart');
      throw err;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const res = await api.updateCartItem(itemId, quantity, cartToken);
      setCart(res.data);
    } catch (err: any) {
      showFeedback(err.message || 'Failed to update item quantity');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const res = await api.removeCartItem(itemId, cartToken);
      setCart(res.data);
      showFeedback('Item removed from cart');
    } catch (err: any) {
      showFeedback(err.message || 'Failed to remove item');
    }
  };

  const refreshCart = async () => {
    if (cartToken) {
      await fetchCart(cartToken);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isCartOpen,
        isCheckoutOpen,
        cartToken,
        openCart,
        closeCart,
        openCheckout,
        closeCheckout,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart,
        message,
        clearMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
