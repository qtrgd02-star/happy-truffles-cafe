"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SeasonalItem {
  id: number;
  title: string;
  price: number;
  image: string;
  season: "spring" | "summer" | "autumn" | "winter" | "ramadan" | "eid" | "all";
  description: string;
  available: boolean;
  countdownTo?: string;
}

interface SeasonalMenuContextType {
  seasonalItems: SeasonalItem[];
  currentSeason: string;
  setCurrentSeason: (season: string) => void;
  toggleAvailability: (id: number) => void;
  getItemsBySeason: (season: string) => SeasonalItem[];
  getCountdown: (itemId: number) => { days: number; hours: number; minutes: number; seconds: number } | null;
}

const SeasonalMenuContext = createContext<SeasonalMenuContextType | undefined>(undefined);

export function SeasonalMenuProvider({ children }: { children: ReactNode }) {
  const [seasonalItems, setSeasonalItems] = useState<SeasonalItem[]>([]);
  const [currentSeason, setCurrentSeason] = useState("all");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("seasonalMenu");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSeasonalItems(parsed.items || []);
        setCurrentSeason(parsed.currentSeason || "all");
      }
    } catch (e) { console.error("Failed to load seasonal menu", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem("seasonalMenu", JSON.stringify({ items: seasonalItems, currentSeason }));
  }, [seasonalItems, currentSeason]);

  const toggleAvailability = (id: number) => {
    setSeasonalItems((prev) => prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item)));
  };

  const getItemsBySeason = (season: string) => seasonalItems.filter((item) => item.season === season || item.season === "all");

  const getCountdown = (itemId: number) => {
    const item = seasonalItems.find((i) => i.id === itemId);
    if (!item?.countdownTo) return null;
    const target = new Date(item.countdownTo).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  return (
    <SeasonalMenuContext.Provider value={{ seasonalItems, currentSeason, setCurrentSeason, toggleAvailability, getItemsBySeason, getCountdown }}>
      {children}
    </SeasonalMenuContext.Provider>
  );
}

export function useSeasonalMenu() {
  const context = useContext(SeasonalMenuContext);
  if (!context) throw new Error("useSeasonalMenu must be used within SeasonalMenuProvider");
  return context;
}
