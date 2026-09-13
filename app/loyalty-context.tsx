"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LoyaltyContextType {
  points: number;
  addPoints: (points: number) => void;
  redeemPoints: (points: number) => boolean;
  clearLoyalty: () => void;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("loyaltyPoints");
    if (saved) {
      try {
        setPoints(Number(saved));
      } catch (e) {
        console.error("Failed to parse loyalty points from localStorage", e);
        localStorage.removeItem("loyaltyPoints");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("loyaltyPoints", String(points));
  }, [points]);

  const addPoints = (earned: number) => {
    setPoints((prev) => prev + earned);
  };

  const redeemPoints = (cost: number) => {
    if (points >= cost) {
      setPoints((prev) => prev - cost);
      return true;
    }
    return false;
  };

  const clearLoyalty = () => setPoints(0);

  return (
    <LoyaltyContext.Provider value={{ points, addPoints, redeemPoints, clearLoyalty }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (!context) throw new Error("useLoyalty must be used within LoyaltyProvider");
  return context;
}
