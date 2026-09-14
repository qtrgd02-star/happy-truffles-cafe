"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Referral {
  id: string;
  code: string;
  referrerPhone: string;
  referrerName: string;
  refereePhone?: string;
  refereeName?: string;
  reward: number;
  status: "pending" | "completed" | "expired";
  createdAt: string;
}

interface ReferralContextType {
  referrals: Referral[];
  generateReferral: (phone: string, name: string) => Referral;
  applyReferral: (code: string, refereePhone: string, refereeName: string) => { success: boolean; message: string };
  getReferralsByPhone: (phone: string) => Referral[];
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export function ReferralProvider({ children }: { children: ReactNode }) {
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("referrals");
      if (saved) setReferrals(JSON.parse(saved));
    } catch (e) { console.error("Failed to load referrals", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem("referrals", JSON.stringify(referrals));
  }, [referrals]);

  const generateReferral = (phone: string, name: string): Referral => {
    const code = "REF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const referral: Referral = {
      id: "#" + Math.floor(100000 + Math.random() * 900000).toString(),
      code,
      referrerPhone: phone,
      referrerName: name,
      reward: 50,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setReferrals((prev) => [...prev, referral]);
    return referral;
  };

  const applyReferral = (code: string, refereePhone: string, refereeName: string) => {
    const ref = referrals.find((r) => r.code === code && r.status === "pending");
    if (!ref) return { success: false, message: "Invalid or expired referral code" };
    if (ref.referrerPhone === refereePhone) return { success: false, message: "Cannot refer yourself" };
    setReferrals((prev) => prev.map((r) => (r.id === ref.id ? { ...r, refereePhone, refereeName, status: "completed" } : r)));
    return { success: true, message: "Referral applied! You both earned QAR 50." };
  };

  const getReferralsByPhone = (phone: string) => referrals.filter((r) => r.referrerPhone === phone || r.refereePhone === phone);

  return (
    <ReferralContext.Provider value={{ referrals, generateReferral, applyReferral, getReferralsByPhone }}>
      {children}
    </ReferralContext.Provider>
  );
}

export function useReferrals() {
  const context = useContext(ReferralContext);
  if (!context) throw new Error("useReferrals must be used within ReferralProvider");
  return context;
}
