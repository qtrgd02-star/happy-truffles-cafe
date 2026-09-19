"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useUser } from "@/app/user-context";

export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, "quantity">) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { getUserKey } = useUser();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const getWishlistKey = useCallback(() => getUserKey("wishlist"), [getUserKey]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(getWishlistKey());
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist from localStorage", e);
        localStorage.removeItem(getWishlistKey());
      }
    }
  }, [getWishlistKey]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(getWishlistKey(), JSON.stringify(wishlist));
  }, [wishlist, getWishlistKey]);

  const addToWishlist = (item: Omit<WishlistItem, "quantity">) => {
    setWishlist((prev) => {
      if (prev.find((w) => w.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((w) => w.id !== id));
  };

  const isInWishlist = (id: number) => wishlist.some((w) => w.id === id);

  const clearWishlist = () => setWishlist([]);

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist, wishlistCount }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}