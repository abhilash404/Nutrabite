'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  refreshCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const [cartTotal, setCartTotal] = useState(0);

  const fetchCart = useCallback(async () => {
    if (!user?.id) {
      setItems([]);
      setCartTotal(0);
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/cart/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
        setCartTotal(data.total);
      }
    } catch(e) { console.error("Failed to fetch cart", e); }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (item: any) => {
    if (!user?.id) return;
    try {
      await fetch(`http://127.0.0.1:5000/api/cart/${user.id}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId: item.id, quantity: 1 })
      });
      fetchCart();
    } catch(e) {}
  };

  const removeFromCart = async (itemId: string) => {
    if (!user?.id) return;
    try {
      await fetch(`http://127.0.0.1:5000/api/cart/${user.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId: itemId, quantity: 0 })
      });
      fetchCart();
    } catch(e) {}
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user?.id) return;
    try {
      await fetch(`http://127.0.0.1:5000/api/cart/${user.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId: itemId, quantity })
      });
      fetchCart();
    } catch(e) {}
  };

  const clearCart = async () => {
    if (!user?.id) return;
    try {
      await fetch(`http://127.0.0.1:5000/api/cart/${user.id}/clear`, { method: 'POST' });
      fetchCart();
    } catch(e) {}
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount, refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
