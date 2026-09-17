"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { useUser } from "@/app/user-context";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  notes?: string;
  customizations?: { name: string; values: string[]; priceAdjustment: number }[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  updateItemNotes: (id: number, notes: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { getUserKey } = useUser();
  const [cart, setCart] = useState<CartItem[]>([]);
  const isSyncingRef = useRef(false);

  const getCartKey = () => getUserKey("cart");

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const saved = localStorage.getItem(getCartKey());
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
        localStorage.removeItem(getCartKey());
      }
    }
  }, [getCartKey]);

  const syncToApi = useCallback(async (cartData?: CartItem[]) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartData ?? cart),
      });
      if (!res.ok) throw new Error("Failed to sync cart");
    } catch (e) {
      console.error("Cart sync failed:", e);
    } finally {
      isSyncingRef.current = false;
    }
  }, [cart]);

  // Save cart to localStorage and sync to API whenever it changes
  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
    syncToApi(cart);
  }, [cart, syncToApi, getCartKey]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const updateItemNotes = (id: number, notes: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const syncCart = useCallback(async () => {
    await syncToApi();
  }, [syncToApi]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, updateItemNotes, clearCart, cartCount, cartTotal, syncCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
