"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase/config";

export interface InventoryItem {
  id: string;
  menuItemId: number;
  title: string;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  category: string;
  updatedAt: string;
}

interface InventoryContextType {
  items: InventoryItem[];
  updateStock: (menuItemId: number, quantity: number) => Promise<void>;
  setStock: (menuItemId: number, stock: number) => Promise<void>;
  getStock: (menuItemId: number) => InventoryItem | undefined;
  isLowStock: (menuItemId: number) => boolean;
  refresh: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    if (!db) return;
    const unsubscribe = onSnapshot(
      collection(db, "inventory"),
      (snapshot) => {
        const inventoryItems = snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() } as InventoryItem));
        setItems(inventoryItems);
      },
      (error) => {
        console.error("Firestore inventory listener failed:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const updateStock = useCallback(async (menuItemId: number, quantity: number) => {
    const existing = items.find((i) => i.menuItemId === menuItemId);
    if (!existing) return;

    const newStock = Math.max(0, existing.stock - quantity);
    if (db) {
      await updateDoc(doc(db, "inventory", existing.id), { stock: newStock, updatedAt: new Date().toISOString() });
    } else {
      setItems((prev) => prev.map((i) => (i.menuItemId === menuItemId ? { ...i, stock: newStock, updatedAt: new Date().toISOString() } : i)));
    }
  }, [items]);

  const setStock = useCallback(async (menuItemId: number, stock: number) => {
    const existing = items.find((i) => i.menuItemId === menuItemId);
    if (!existing) return;

    if (db) {
      await updateDoc(doc(db, "inventory", existing.id), { stock, updatedAt: new Date().toISOString() });
    } else {
      setItems((prev) => prev.map((i) => (i.menuItemId === menuItemId ? { ...i, stock, updatedAt: new Date().toISOString() } : i)));
    }
  }, [items]);

  const getStock = useCallback((menuItemId: number) => {
    return items.find((i) => i.menuItemId === menuItemId);
  }, [items]);

  const isLowStock = useCallback((menuItemId: number) => {
    const item = items.find((i) => i.menuItemId === menuItemId);
    if (!item) return false;
    return item.stock <= item.lowStockThreshold;
  }, [items]);

  const refresh = useCallback(() => {
    // Triggered by Firestore listener automatically
  }, []);

  return (
    <InventoryContext.Provider value={{ items, updateStock, setStock, getStock, isLowStock, refresh }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used within InventoryProvider");
  return context;
}
