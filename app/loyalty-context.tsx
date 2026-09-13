"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface LoyaltyAccount {
  phone: string;
  name: string;
  points: number;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

interface LoyaltyContextType {
  accounts: LoyaltyAccount[];
  addPoints: (phone: string, orderTotal: number) => void;
  redeemPoints: (phone: string, pointsToRedeem: number) => { success: boolean; remainingPoints: number };
  getAccount: (phone: string) => LoyaltyAccount | undefined;
  getPointsValue: (points: number) => number;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<LoyaltyAccount[]>([]);

  const loadAccounts = useCallback(() => {
    try {
      const saved = localStorage.getItem("loyaltyAccounts");
      if (saved) {
        setAccounts(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load loyalty accounts:", e);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const saveAccounts = (newAccounts: LoyaltyAccount[]) => {
    localStorage.setItem("loyaltyAccounts", JSON.stringify(newAccounts));
    setAccounts(newAccounts);
  };

  const addPoints = (phone: string, orderTotal: number) => {
    const pointsEarned = Math.floor(orderTotal);
    const newAccounts = [...accounts];
    const index = newAccounts.findIndex((a) => a.phone === phone);

    if (index === -1) {
      newAccounts.push({
        phone,
        name: "",
        points: pointsEarned,
        totalOrders: 1,
        totalSpent: orderTotal,
        createdAt: new Date().toISOString(),
      });
    } else {
      newAccounts[index] = {
        ...newAccounts[index],
        points: newAccounts[index].points + pointsEarned,
        totalOrders: newAccounts[index].totalOrders + 1,
        totalSpent: newAccounts[index].totalSpent + orderTotal,
      };
    }

    saveAccounts(newAccounts);
  };

  const redeemPoints = (phone: string, pointsToRedeem: number) => {
    const account = accounts.find((a) => a.phone === phone);
    if (!account || account.points < pointsToRedeem) {
      return { success: false, remainingPoints: account?.points || 0 };
    }

    const newAccounts = accounts.map((a) =>
      a.phone === phone ? { ...a, points: a.points - pointsToRedeem } : a
    );

    saveAccounts(newAccounts);
    return { success: true, remainingPoints: account.points - pointsToRedeem };
  };

  const getAccount = (phone: string) => {
    return accounts.find((a) => a.phone === phone);
  };

  const getPointsValue = (points: number) => {
    return points * 0.1; // 1 point = 0.1 QAR
  };

  return (
    <LoyaltyContext.Provider value={{ accounts, addPoints, redeemPoints, getAccount, getPointsValue }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error("useLoyalty must be used within LoyaltyProvider");
  }
  return context;
}
