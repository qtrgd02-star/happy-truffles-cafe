"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { CorporateAccount } from "@/app/lib/types";

interface CorporateContextType {
  accounts: CorporateAccount[];
  addAccount: (account: Omit<CorporateAccount, "id">) => void;
  updateAccount: (id: string, updates: Partial<CorporateAccount>) => void;
  getAccount: (id: string) => CorporateAccount | undefined;
  placeBulkOrder: (accountId: string, items: any[], total: number) => { success: boolean; error?: string };
}

const CorporateContext = createContext<CorporateContextType | undefined>(undefined);

export function CorporateProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<CorporateAccount[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("corporateAccounts");
    if (saved) {
      try { setAccounts(JSON.parse(saved)); } catch (e) { console.error("Failed to parse corporate accounts", e); }
    }
  }, []);

  useEffect(() => { localStorage.setItem("corporateAccounts", JSON.stringify(accounts)); }, [accounts]);

  const addAccount = useCallback((account: Omit<CorporateAccount, "id">) => {
    const newAccount: CorporateAccount = { ...account, id: `corp_${Date.now()}` };
    setAccounts((prev) => [...prev, newAccount]);
  }, []);

  const updateAccount = useCallback((id: string, updates: Partial<CorporateAccount>) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  }, []);

  const getAccount = useCallback((id: string) => accounts.find((a) => a.id === id), [accounts]);

  const placeBulkOrder = useCallback((accountId: string, items: any[], total: number) => {
    const account = accounts.find((a) => a.id === accountId);
    if (!account) {
      return { success: false, error: "Account not found" };
    }
    if (total > account.creditLimit) {
      return { success: false, error: "Order exceeds credit limit" };
    }
    updateAccount(accountId, { balance: account.balance + total });
    return { success: true };
  }, [accounts, updateAccount]);

  return (
    <CorporateContext.Provider value={{ accounts, addAccount, updateAccount, getAccount, placeBulkOrder }}>
      {children}
    </CorporateContext.Provider>
  );
}

export function useCorporate() {
  const context = useContext(CorporateContext);
  if (!context) throw new Error("useCorporate must be used within CorporateProvider");
  return context;
}