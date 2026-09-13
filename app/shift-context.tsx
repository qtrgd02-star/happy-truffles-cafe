"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { collection, addDoc, doc, updateDoc, onSnapshot, query as firestoreQuery, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase/config";

export interface Shift {
  id: string;
  cashierName: string;
  cashierEmail: string;
  startTime: string;
  endTime?: string;
  openingCash: number;
  closingCash?: number;
  expectedCash?: number;
  transactions: ShiftTransaction[];
  status: "open" | "closed";
}

export interface ShiftTransaction {
  id: string;
  type: "sale" | "refund" | "cash_in" | "cash_out";
  amount: number;
  orderId?: string;
  note?: string;
  timestamp: string;
}

interface ShiftContextType {
  activeShift: Shift | null;
  shifts: Shift[];
  startShift: (cashierName: string, openingCash: number) => Promise<void>;
  endShift: (closingCash: number) => Promise<void>;
  addTransaction: (transaction: Omit<ShiftTransaction, "id" | "timestamp">) => Promise<void>;
  getShiftSummary: (shiftId: string) => { totalSales: number; totalRefunds: number; netCash: number } | null;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export function ShiftProvider({ children }: { children: ReactNode }) {
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    if (!db) return;
    const q = firestoreQuery(collection(db, "shifts"), orderBy("startTime", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const shiftsData = snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() } as Shift));
        setShifts(shiftsData);
        const current = shiftsData.find((s) => s.status === "open");
        setActiveShift(current || null);
      },
      (error) => {
        console.error("Firestore shifts listener failed:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const startShift = useCallback(async (cashierName: string, openingCash: number) => {
    if (!db) return;
    try {
      const docRef = await addDoc(collection(db, "shifts"), {
        cashierName,
        cashierEmail: "",
        startTime: serverTimestamp(),
        openingCash,
        status: "open",
        transactions: [],
      });
    } catch (error) {
      console.error("Failed to start shift:", error);
    }
  }, []);

  const endShift = useCallback(async (closingCash: number) => {
    if (!activeShift || !db) return;
    try {
      const expectedCash = activeShift.openingCash + activeShift.transactions.reduce((sum, t) => sum + t.amount, 0);
      await updateDoc(doc(db, "shifts", activeShift.id), {
        endTime: serverTimestamp(),
        closingCash,
        expectedCash,
        status: "closed",
      });
    } catch (error) {
      console.error("Failed to end shift:", error);
    }
  }, [activeShift]);

  const addTransaction = useCallback(async (transaction: Omit<ShiftTransaction, "id" | "timestamp">) => {
    if (!activeShift || !db) return;
    try {
      const newTransaction: ShiftTransaction = {
        ...transaction,
        id: `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        timestamp: new Date().toISOString(),
      };
      await updateDoc(doc(db, "shifts", activeShift.id), {
        transactions: [...activeShift.transactions, newTransaction],
      });
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  }, [activeShift]);

  const getShiftSummary = useCallback((shiftId: string) => {
    const shift = shifts.find((s) => s.id === shiftId);
    if (!shift) return null;
    const totalSales = shift.transactions.filter((t) => t.type === "sale").reduce((sum, t) => sum + t.amount, 0);
    const totalRefunds = shift.transactions.filter((t) => t.type === "refund").reduce((sum, t) => sum + t.amount, 0);
    const netCash = shift.transactions.reduce((sum, t) => sum + t.amount, 0);
    return { totalSales, totalRefunds, netCash };
  }, [shifts]);

  return (
    <ShiftContext.Provider value={{ activeShift, shifts, startShift, endShift, addTransaction, getShiftSummary }}>
      {children}
    </ShiftContext.Provider>
  );
}

export function useShifts() {
  const context = useContext(ShiftContext);
  if (!context) {
    return {
      activeShift: null,
      shifts: [],
      startShift: async () => {},
      endShift: async () => {},
      addTransaction: async () => {},
      getShiftSummary: () => null,
    };
  }
  return context;
}
