"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface WaitlistEntry {
  id: string;
  name: string;
  phone: string;
  partySize: number;
  status: "waiting" | "seated" | "cancelled";
  joinedAt: string;
  seatedAt?: string;
}

interface WaitlistContextType {
  entries: WaitlistEntry[];
  addToWaitlist: (entry: Omit<WaitlistEntry, "id" | "joinedAt" | "status">) => WaitlistEntry;
  seatGuest: (id: string) => void;
  cancelWaitlist: (id: string) => void;
  getPosition: (id: string) => number;
}

const WaitlistContext = createContext<WaitlistContextType | undefined>(undefined);

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("waitlist");
      if (saved) setEntries(JSON.parse(saved));
    } catch (e) { console.error("Failed to load waitlist", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem("waitlist", JSON.stringify(entries));
  }, [entries]);

  const addToWaitlist = (entry: Omit<WaitlistEntry, "id" | "joinedAt" | "status">) => {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: "#" + Math.floor(100000 + Math.random() * 900000).toString(),
      status: "waiting",
      joinedAt: new Date().toISOString(),
    };
    setEntries((prev) => [...prev, newEntry]);
    return newEntry;
  };

  const seatGuest = (id: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "seated", seatedAt: new Date().toISOString() } : e)));
  };

  const cancelWaitlist = (id: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "cancelled" } : e)));
  };

  const getPosition = useCallback((id: string) => {
    return entries.filter((e) => e.status === "waiting" && new Date(e.joinedAt) < new Date(entries.find((x) => x.id === id)?.joinedAt || "")).length + 1;
  }, [entries]);

  return (
    <WaitlistContext.Provider value={{ entries, addToWaitlist, seatGuest, cancelWaitlist, getPosition }}>
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  const context = useContext(WaitlistContext);
  if (!context) throw new Error("useWaitlist must be used within WaitlistProvider");
  return context;
}
