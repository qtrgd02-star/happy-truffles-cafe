"use client";
import { useCart } from "./cart-context";

export interface AbandonedCart {
  id: string;
  items: any[];
  total: number;
  customerEmail?: string;
  customerPhone?: string;
  abandonedAt: string;
  recovered: boolean;
}

const ABANDONED_CART_KEY = "abandonedCarts";

export function useAbandonedCart() {
  const { cart, cartTotal } = useCart();

  const saveAbandonedCart = (email?: string, phone?: string) => {
    if (cart.length === 0) return;
    try {
      const existing = JSON.parse(localStorage.getItem(ABANDONED_CART_KEY) || "[]");
      const newCart: AbandonedCart = {
        id: "#" + Math.floor(100000 + Math.random() * 900000).toString(),
        items: [...cart],
        total: cartTotal,
        customerEmail: email,
        customerPhone: phone,
        abandonedAt: new Date().toISOString(),
        recovered: false,
      };
      existing.push(newCart);
      localStorage.setItem(ABANDONED_CART_KEY, JSON.stringify(existing));
      fetch("/api/abandoned-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", cart: newCart }),
      }).catch(() => {});
    } catch (e) {
      console.error("Failed to save abandoned cart", e);
    }
  };

  const getAbandonedCarts = (): AbandonedCart[] => {
    try {
      return JSON.parse(localStorage.getItem(ABANDONED_CART_KEY) || "[]").filter((c: AbandonedCart) => !c.recovered);
    } catch { return []; }
  };

  const markRecovered = (id: string) => {
    try {
      const existing = JSON.parse(localStorage.getItem(ABANDONED_CART_KEY) || "[]");
      const updated = existing.map((c: AbandonedCart) => (c.id === id ? { ...c, recovered: true } : c));
      localStorage.setItem(ABANDONED_CART_KEY, JSON.stringify(updated));
    } catch (e) { console.error("Failed to mark cart recovered", e); }
  };

  return { saveAbandonedCart, getAbandonedCarts, markRecovered };
}
