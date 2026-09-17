"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  getUserKey: (baseKey: string) => string;
  getCurrentUserEmail: () => string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const getCurrentUserEmail = () => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const userData = JSON.parse(saved);
        return userData?.email || null;
      }
    } catch {
      return null;
    }
    return null;
  };

  const getUserKey = (baseKey: string) => {
    const email = getCurrentUserEmail();
    if (email) {
      return `${baseKey}_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }
    return baseKey;
  };

  return (
    <UserContext.Provider value={{ getUserKey, getCurrentUserEmail }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}
