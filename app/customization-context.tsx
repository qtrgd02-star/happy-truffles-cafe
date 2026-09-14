"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface CustomizationOption {
  id: string;
  name: string;
  type: "select" | "multi-select" | "checkbox";
  options: { label: string; price: number }[];
  required: boolean;
}

export interface SelectedCustomization {
  optionId: string;
  values: string[];
  priceAdjustment: number;
}

interface CustomizationContextType {
  itemCustomizations: Record<number, CustomizationOption[]>;
  getCustomizations: (itemId: number) => CustomizationOption[];
  setCustomizations: (itemId: number, options: CustomizationOption[]) => void;
  calculateTotal: (itemId: number, selected: SelectedCustomization[]) => number;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

const DEFAULT_CUSTOMIZATIONS: Record<number, CustomizationOption[]> = {
  1: [
    { id: "wrap", name: "Gift Wrap", type: "checkbox", options: [{ label: "Add ribbon", price: 5 }], required: false },
    { id: "note", name: "Gift Note", type: "checkbox", options: [{ label: "Add personalized note", price: 3 }], required: false },
  ],
  5: [
    { id: "size", name: "Size", type: "select", options: [{ label: "1 Liter", price: 0 }, { label: "500ml", price: -30 }], required: true },
    { id: "sugar", name: "Sugar Level", type: "select", options: [{ label: "No sugar", price: 0 }, { label: "Less sugar", price: 0 }, { label: "Regular", price: 0 }], required: true },
  ],
};

export function CustomizationProvider({ children }: { children: ReactNode }) {
  const [itemCustomizations, setItemCustomizations] = useState<Record<number, CustomizationOption[]>>(DEFAULT_CUSTOMIZATIONS);

  useEffect(() => {
    const saved = localStorage.getItem("customizations");
    if (saved) {
      try { setItemCustomizations(JSON.parse(saved)); } catch (e) { console.error("Failed to parse customizations", e); }
    }
  }, []);

  useEffect(() => { localStorage.setItem("customizations", JSON.stringify(itemCustomizations)); }, [itemCustomizations]);

  const getCustomizations = useCallback((itemId: number) => itemCustomizations[itemId] || [], [itemCustomizations]);

  const setCustomizationsForItem = useCallback((itemId: number, options: CustomizationOption[]) => {
    setItemCustomizations((prev) => ({ ...prev, [itemId]: options }));
  }, []);

  const calculateTotal = useCallback((itemId: number, selected: SelectedCustomization[]) => {
    return selected.reduce((sum, s) => sum + s.priceAdjustment, 0);
  }, []);

  return (
    <CustomizationContext.Provider value={{ itemCustomizations, getCustomizations, setCustomizations: setCustomizationsForItem, calculateTotal }}>
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomizations() {
  const context = useContext(CustomizationContext);
  if (!context) throw new Error("useCustomizations must be used within CustomizationProvider");
  return context;
}