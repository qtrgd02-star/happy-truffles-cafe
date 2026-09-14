"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { SubscriptionPlan } from "@/app/lib/types";

interface SubscriptionContextType {
  plans: SubscriptionPlan[];
  userSubscriptions: { planId: string; active: boolean; startDate: string }[];
  subscribe: (planId: string) => void;
  unsubscribe: (planId: string) => void;
  getActiveSubscriptions: () => SubscriptionPlan[];
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: "weekly-coffee",
    name: "Weekly Coffee Box",
    description: "7 days of premium coffee delivered to your door",
    price: 99,
    interval: "weekly",
    items: [{ itemId: 5, quantity: 1 }],
    features: ["7 x 1L premium coffee", "Free delivery", "Pause anytime"],
  },
  {
    id: "monthly-truffles",
    name: "Monthly Truffle Box",
    description: "24 handcrafted truffles every month",
    price: 149,
    interval: "monthly",
    items: [{ itemId: 83, quantity: 2 }],
    features: ["48 mixed truffles", "Seasonal flavors", "Gift wrapping"],
  },
  {
    id: "weekly-combo",
    name: "Weekly Combo Pack",
    description: "Coffee + truffles combo every week",
    price: 159,
    interval: "weekly",
    items: [{ itemId: 5, quantity: 1 }, { itemId: 83, quantity: 1 }],
    features: ["2L coffee + 24 truffles", "Free delivery", "Priority support"],
  },
];

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plans] = useState<SubscriptionPlan[]>(DEFAULT_PLANS);
  const [userSubscriptions, setUserSubscriptions] = useState<{ planId: string; active: boolean; startDate: string }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("subscriptions");
    if (saved) {
      try { setUserSubscriptions(JSON.parse(saved)); } catch (e) { console.error("Failed to parse subscriptions", e); }
    }
  }, []);

  useEffect(() => { localStorage.setItem("subscriptions", JSON.stringify(userSubscriptions)); }, [userSubscriptions]);

  const subscribe = useCallback((planId: string) => {
    setUserSubscriptions((prev) => {
      if (prev.some((s) => s.planId === planId)) return prev;
      return [...prev, { planId, active: true, startDate: new Date().toISOString() }];
    });
  }, []);

  const unsubscribe = useCallback((planId: string) => {
    setUserSubscriptions((prev) => prev.filter((s) => s.planId !== planId));
  }, []);

  const getActiveSubscriptions = useCallback(() => {
    return userSubscriptions.filter((s) => s.active).map((s) => plans.find((p) => p.id === s.planId)!).filter(Boolean);
  }, [userSubscriptions, plans]);

  return (
    <SubscriptionContext.Provider value={{ plans, userSubscriptions, subscribe, unsubscribe, getActiveSubscriptions }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error("useSubscriptions must be used within SubscriptionProvider");
  return context;
}