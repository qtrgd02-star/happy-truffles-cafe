"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { BirthdayReward } from "@/app/lib/types";

interface BirthdayContextType {
  rewards: BirthdayReward[];
  addReward: (reward: Omit<BirthdayReward, "rewardClaimed">) => void;
  claimReward: (phone: string) => boolean;
  getReward: (phone: string) => BirthdayReward | undefined;
}

const BirthdayContext = createContext<BirthdayContextType | undefined>(undefined);

export function BirthdayProvider({ children }: { children: ReactNode }) {
  const [rewards, setRewards] = useState<BirthdayReward[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("birthdayRewards");
    if (saved) {
      try { setRewards(JSON.parse(saved)); } catch (e) { console.error("Failed to parse birthday rewards", e); }
    }
  }, []);

  useEffect(() => { localStorage.setItem("birthdayRewards", JSON.stringify(rewards)); }, [rewards]);

  const addReward = useCallback((reward: Omit<BirthdayReward, "rewardClaimed">) => {
    setRewards((prev) => {
      if (prev.some((r) => r.phone === reward.phone)) return prev;
      return [...prev, { ...reward, rewardClaimed: false }];
    });
  }, []);

  const claimReward = useCallback((phone: string) => {
    setRewards((prev) => {
      const index = prev.findIndex((r) => r.phone === phone);
      if (index === -1 || prev[index].rewardClaimed) return prev;
      const updated = [...prev];
      updated[index] = { ...updated[index], rewardClaimed: true, lastClaimed: new Date().toISOString() };
      return updated;
    });
    return true;
  }, []);

  const getReward = useCallback((phone: string) => rewards.find((r) => r.phone === phone), [rewards]);

  return (
    <BirthdayContext.Provider value={{ rewards, addReward, claimReward, getReward }}>
      {children}
    </BirthdayContext.Provider>
  );
}

export function useBirthday() {
  const context = useContext(BirthdayContext);
  if (!context) throw new Error("useBirthday must be used within BirthdayProvider");
  return context;
}