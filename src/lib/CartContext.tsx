'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FoodItem } from './mockData';

interface CartItem extends FoodItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('nutrabite-cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nutrabite-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: FoodItem) => {
    setItems(current => {
      const existing = current.find(i => i.id === item.id);
      if (existing) {
        return current.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(current => current.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(itemId);
    setItems(current => current.map(i => i.id === itemId ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount
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
