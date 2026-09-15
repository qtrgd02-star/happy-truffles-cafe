"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface PromoCode {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "item";
  value: number;
  itemId?: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
  createdAt: string;
  description?: string;
}

interface PromoContextType {
  promos: PromoCode[];
  addPromo: (promo: Omit<PromoCode, "id" | "createdAt" | "usedCount">) => Promise<void>;
  updatePromo: (id: string, updates: Partial<PromoCode>) => Promise<void>;
  deletePromo: (id: string) => Promise<void>;
  validatePromo: (code: string, orderTotal: number, items: any[]) => { valid: boolean; discount: number; message: string };
  getPromoByCode: (code: string) => PromoCode | undefined;
  appliedPromo: PromoCode | null;
  applyPromo: (code: string, orderTotal: number, items?: any[]) => { success: boolean; message: string };
  removePromo: () => void;
  getDiscount: (orderTotal: number, items?: any[]) => number;
}

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export function PromoProvider({ children }: { children: ReactNode }) {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  const fetchPromos = useCallback(async () => {
    try {
      const res = await fetch("/api/promos");
      if (res.ok) {
        const data = await res.json();
        setPromos(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Failed to fetch promos:", e);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
    const interval = setInterval(fetchPromos, 30000);
    return () => clearInterval(interval);
  }, [fetchPromos]);

  const addPromo = useCallback(async (promo: Omit<PromoCode, "id" | "createdAt" | "usedCount">) => {
    try {
      const res = await fetch("/api/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promo),
      });
      if (!res.ok) throw new Error("Failed to add promo");
    } catch (e) {
      console.error("Add promo failed:", e);
      throw e;
    }
  }, []);

  const updatePromo = useCallback(async (id: string, updates: Partial<PromoCode>) => {
    try {
      const res = await fetch("/api/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update promo");
    } catch (e) {
      console.error("Update promo failed:", e);
      throw e;
    }
  }, []);

  const deletePromo = useCallback(async (id: string) => {
    try {
      const res = await fetch("/api/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      if (!res.ok) throw new Error("Failed to delete promo");
    } catch (e) {
      console.error("Delete promo failed:", e);
      throw e;
    }
  }, []);

  const validatePromo = useCallback((code: string, orderTotal: number, items: any[]) => {
    const promo = promos.find((p) => p.code.toLowerCase() === code.toLowerCase() && p.active);
    if (!promo) {
      return { valid: false, discount: 0, message: "Invalid promo code" };
    }

    const now = new Date();
    const validFrom = new Date(promo.validFrom);
    const validUntil = new Date(promo.validUntil);

    if (now < validFrom || now > validUntil) {
      return { valid: false, discount: 0, message: "Promo code has expired" };
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return { valid: false, discount: 0, message: "Promo code has reached max uses" };
    }

    if (promo.minOrderAmount && orderTotal < promo.minOrderAmount) {
      return { valid: false, discount: 0, message: `Minimum order amount is QAR ${promo.minOrderAmount}` };
    }

    let discount = 0;
    if (promo.type === "percentage") {
      discount = orderTotal * (promo.value / 100);
    } else if (promo.type === "fixed") {
      discount = Math.min(promo.value, orderTotal);
    } else if (promo.type === "item" && promo.itemId) {
      const item = items.find((i: any) => i.id === promo.itemId);
      if (item) {
        discount = item.price * item.quantity * (promo.value / 100);
      }
    }

    return { valid: true, discount, message: `Promo applied! You saved QAR ${discount.toFixed(2)}` };
  }, [promos]);

  const getPromoByCode = useCallback((code: string) => {
    const now = new Date();
    return promos.find((p) => p.code.toLowerCase() === code.toLowerCase() && p.active && new Date(p.validUntil) >= now);
  }, [promos]);

  const applyPromo = useCallback((code: string, orderTotal: number, items: any[] = []) => {
    const result = validatePromo(code, orderTotal, items);
    if (result.valid) {
      const promo = getPromoByCode(code);
      setAppliedPromo(promo || null);
    }
    return { success: result.valid, message: result.message };
  }, [validatePromo, getPromoByCode]);

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
  }, []);

  const getDiscount = useCallback((orderTotal: number, items: any[] = []) => {
    if (!appliedPromo) return 0;
    const result = validatePromo(appliedPromo.code, orderTotal, items);
    return result.valid ? result.discount : 0;
  }, [appliedPromo, validatePromo]);

  return (
    <PromoContext.Provider value={{ promos, addPromo, updatePromo, deletePromo, validatePromo, getPromoByCode, appliedPromo, applyPromo, removePromo, getDiscount }}>
      {children}
    </PromoContext.Provider>
  );
}

export function usePromos() {
  const context = useContext(PromoContext);
  if (!context) throw new Error("usePromos must be used within PromoProvider");
  return context;
}
