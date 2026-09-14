"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SplitPayment {
  id: string;
  orderId: string;
  totalAmount: number;
  splits: { id: string; name: string; amount: number; method: "cash" | "card" }[];
  status: "pending" | "completed" | "partial";
  createdAt: string;
}

interface SplitBillingContextType {
  splitBills: SplitPayment[];
  createSplitBill: (bill: Omit<SplitPayment, "id" | "createdAt" | "status">) => void;
  completeSplit: (id: string) => void;
}

const SplitBillingContext = createContext<SplitBillingContextType | undefined>(undefined);

export function SplitBillingProvider({ children }: { children: ReactNode }) {
  const [splitBills, setSplitBills] = useState<SplitPayment[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("splitBills");
      if (saved) setSplitBills(JSON.parse(saved));
    } catch (e) { console.error("Failed to load split bills", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem("splitBills", JSON.stringify(splitBills));
  }, [splitBills]);

  const createSplitBill = (bill: Omit<SplitPayment, "id" | "createdAt" | "status">) => {
    const newBill: SplitPayment = {
      ...bill,
      id: "#" + Math.floor(100000 + Math.random() * 900000).toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setSplitBills((prev) => [newBill, ...prev]);
  };

  const completeSplit = (id: string) => {
    setSplitBills((prev) => prev.map((b) => (b.id === id ? { ...b, status: "completed" } : b)));
  };

  return (
    <SplitBillingContext.Provider value={{ splitBills, createSplitBill, completeSplit }}>
      {children}
    </SplitBillingContext.Provider>
  );
}

export function useSplitBilling() {
  const context = useContext(SplitBillingContext);
  if (!context) throw new Error("useSplitBilling must be used within SplitBillingProvider");
  return context;
}
