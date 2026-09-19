"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { MenuItem } from "./menu-data";
import { useUser } from "@/app/user-context";

export interface RecentlyViewedItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface RecentlyViewedContextType {
  recentlyViewed: RecentlyViewedItem[];
  addToRecentlyViewed: (item: Pick<MenuItem, "id" | "title" | "price" | "image">) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_RECENTLY_VIEWED = 8;

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const { getUserKey } = useUser();
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);

  const getRecentlyViewedKey = useCallback(() => getUserKey("recentlyViewed"), [getUserKey]);

  useEffect(() => {
    const saved = localStorage.getItem(getRecentlyViewedKey());
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recently viewed from localStorage", e);
        localStorage.removeItem(getRecentlyViewedKey());
      }
    }
  }, [getRecentlyViewedKey]);

  useEffect(() => {
    localStorage.setItem(getRecentlyViewedKey(), JSON.stringify(recentlyViewed));
  }, [recentlyViewed, getRecentlyViewedKey]);

  const addToRecentlyViewed = (item: Pick<MenuItem, "id" | "title" | "price" | "image">) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((r) => r.id !== item.id);
      const updated = [item, ...filtered];
      return updated.slice(0, MAX_RECENTLY_VIEWED);
    });
  };

  const clearRecentlyViewed = () => setRecentlyViewed([]);

  return (
    <RecentlyViewedContext.Provider
      value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return context;
}
