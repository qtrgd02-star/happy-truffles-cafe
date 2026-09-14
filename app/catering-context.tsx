"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CateringOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  eventType: string;
  guestCount: number;
  items: any[];
  total: number;
  status: "quote" | "confirmed" | "preparing" | "delivered" | "cancelled";
  notes?: string;
  createdAt: string;
}

interface CateringContextType {
  orders: CateringOrder[];
  submitCateringOrder: (order: Omit<CateringOrder, "id" | "createdAt" | "status">) => CateringOrder;
  updateStatus: (id: string, status: CateringOrder["status"]) => void;
}

const CateringContext = createContext<CateringContextType | undefined>(undefined);

export function CateringProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<CateringOrder[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cateringOrders");
      if (saved) setOrders(JSON.parse(saved));
    } catch (e) { console.error("Failed to load catering orders", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem("cateringOrders", JSON.stringify(orders));
  }, [orders]);

  const submitCateringOrder = (order: Omit<CateringOrder, "id" | "createdAt" | "status">) => {
    const newOrder: CateringOrder = {
      ...order,
      id: "CAT-" + Math.floor(100000 + Math.random() * 900000).toString(),
      status: "quote",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateStatus = (id: string, status: CateringOrder["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <CateringContext.Provider value={{ orders, submitCateringOrder, updateStatus }}>
      {children}
    </CateringContext.Provider>
  );
}

export function useCatering() {
  const context = useContext(CateringContext);
  if (!context) throw new Error("useCatering must be used within CateringProvider");
  return context;
}
