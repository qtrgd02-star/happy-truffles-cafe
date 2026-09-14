"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface GiftCard {
  code: string;
  balance: number;
  createdAt: string;
  recipientEmail?: string;
  recipientPhone?: string;
  message?: string;
  mailed: boolean;
}

interface GiftCardContextType {
  giftCards: GiftCard[];
  createGiftCard: (amount: number) => string;
  redeemGiftCard: (code: string) => number;
  applyGiftCard: (code: string) => { success: boolean; balance: number; message: string };
  getGiftCardBalance: (code: string) => number;
  mailGiftCard: (code: string, email: string, phone: string, message?: string) => void;
}

const GiftCardContext = createContext<GiftCardContextType | undefined>(undefined);

export function GiftCardProvider({ children }: { children: ReactNode }) {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("giftCards");
    if (saved) {
      try {
        setGiftCards(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse gift cards from localStorage", e);
        localStorage.removeItem("giftCards");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("giftCards", JSON.stringify(giftCards));
  }, [giftCards]);

  const createGiftCard = (amount: number): string => {
    const code = "HT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newCard: GiftCard = {
      code,
      balance: amount,
      createdAt: new Date().toISOString(),
      mailed: false,
    };
    setGiftCards((prev) => [...prev, newCard]);
    return code;
  };

  const mailGiftCard = (code: string, email: string, phone: string, message?: string) => {
    setGiftCards((prev) =>
      prev.map((card) =>
        card.code === code
          ? { ...card, recipientEmail: email, recipientPhone: phone, message, mailed: true }
          : card
      )
    );
  };

  const redeemGiftCard = (code: string): number => {
    const card = giftCards.find((c) => c.code === code.toUpperCase());
    if (!card) return -1;
    return card.balance;
  };

  const applyGiftCard = (code: string): { success: boolean; balance: number; message: string } => {
    const card = giftCards.find((c) => c.code === code.toUpperCase());
    if (!card) {
      return { success: false, balance: 0, message: "Invalid gift card code" };
    }
    return { success: true, balance: card.balance, message: `Gift card applied. Balance: QAR ${card.balance.toFixed(2)}` };
  };

  const getGiftCardBalance = (code: string): number => {
    const card = giftCards.find((c) => c.code === code.toUpperCase());
    return card ? card.balance : 0;
  };

  return (
    <GiftCardContext.Provider value={{ giftCards, createGiftCard, redeemGiftCard, applyGiftCard, getGiftCardBalance, mailGiftCard }}>
      {children}
    </GiftCardContext.Provider>
  );
}

export function useGiftCards() {
  const context = useContext(GiftCardContext);
  if (!context) throw new Error("useGiftCards must be used within GiftCardProvider");
  return context;
}
