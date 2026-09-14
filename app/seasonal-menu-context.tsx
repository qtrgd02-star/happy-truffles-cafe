"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SeasonalItem {
  id: number;
  title: string;
  price: number;
  image: string;
  season: "spring" | "summer" | "autumn" | "winter" | "all";
  description: string;
  available: boolean;
}

interface SeasonalMenuContextType {
  seasonalItems: SeasonalItem[];
  currentSeason: string;
  setCurrentSeason: (season: string) => void;
  toggleAvailability: (id: number) => void;
  getItemsBySeason: (season: string) => SeasonalItem[];
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

  return (
    <SeasonalMenuContext.Provider value={{ seasonalItems, currentSeason, setCurrentSeason, toggleAvailability, getItemsBySeason }}>
      {children}
    </SeasonalMenuContext.Provider>
  );
}

export function useSeasonalMenu() {
  const context = useContext(SeasonalMenuContext);
  if (!context) throw new Error("useSeasonalMenu must be used within SeasonalMenuProvider");
  return context;
}
