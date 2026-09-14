"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { WhatsAppMessage } from "@/app/lib/types";

interface WhatsAppContextType {
  messages: WhatsAppMessage[];
  sendMessage: (to: string, text: string) => void;
  clearMessages: () => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

const AUTO_RESPONSES: Record<string, string> = {
  "menu": "Our menu includes truffles, coffee, and combos! Visit https://happytruffles.qa/menu for full menu.",
  "hours": "We are open daily 8:00 AM - 11:30 PM (1:00 AM on weekends).",
  "location": "Gold Plaza, Abu Hamour, Doha, Qatar.",
  "order": "You can order online at https://happytruffles.qa or call +974 XXXX XXXX",
  "delivery": "Delivery available across Doha. Free delivery on orders above QAR 100.",
  "default": "Thank you for contacting Happy Truffles Cafe! How can we help you today?",
};

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("whatsappMessages");
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch (e) { console.error("Failed to parse whatsapp messages", e); }
    }
  }, []);

  useEffect(() => { localStorage.setItem("whatsappMessages", JSON.stringify(messages)); }, [messages]);

  const sendMessage = useCallback((to: string, text: string) => {
    const outgoing: WhatsAppMessage = { from: to, text, timestamp: new Date().toISOString(), type: "outgoing" };
    setMessages((prev) => [...prev, outgoing]);

    const lower = text.toLowerCase();
    let response = AUTO_RESPONSES.default;
    for (const [key, value] of Object.entries(AUTO_RESPONSES)) {
      if (key !== "default" && lower.includes(key)) { response = value; break; }
    }

    setTimeout(() => {
      const incoming: WhatsAppMessage = { from: to, text: response, timestamp: new Date().toISOString(), type: "incoming" };
      setMessages((prev) => [...prev, incoming]);
    }, 1000);
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return (
    <WhatsAppContext.Provider value={{ messages, sendMessage, clearMessages }}>
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);
  if (!context) throw new Error("useWhatsApp must be used within WhatsAppProvider");
  return context;
}