"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { MenuItem } from "./menu-data";

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
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentlyViewed");
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recently viewed from localStorage", e);
        localStorage.removeItem("recentlyViewed");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

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
