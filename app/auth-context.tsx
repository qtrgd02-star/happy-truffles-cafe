"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "customer" | "staff" | "admin";

export interface User {
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role?: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  updateAccountRole: (email: string, role: UserRole) => boolean;
  deleteAccount: (email: string) => boolean;
  getAccountsList: () => Array<{ name: string; email: string; role: UserRole }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const ensureDefaultAdmin = () => {
    const accounts = localStorage.getItem("accounts");
    const parsed = accounts ? JSON.parse(accounts) : [];
    const hasAdmin = parsed.some((a: any) => a.email === "admin@happytruffles.qa");
    if (!hasAdmin) {
      parsed.push({ name: "Admin User", email: "admin@happytruffles.qa", password: "admin123", role: "admin" });
      localStorage.setItem("accounts", JSON.stringify(parsed));
    }
  };

  const getAccounts = (): Array<{ name: string; email: string; password: string; role: UserRole }> => {
    ensureDefaultAdmin();
    const accounts = localStorage.getItem("accounts");
    return accounts ? JSON.parse(accounts) : [];
  };

  const login = (email: string, password: string): boolean => {
    const accounts = getAccounts();
    const found = accounts.find((a) => a.email === email && a.password === password);
    if (found) {
      const role = found.role || "customer";
      setUser({ email: found.email, name: found.name, role });
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string, role: UserRole = "customer"): boolean => {
    const accounts = getAccounts();
    if (accounts.some((a) => a.email === email)) {
      return false;
    }
    accounts.push({ name, email, password, role });
    localStorage.setItem("accounts", JSON.stringify(accounts));
    setUser({ email, name, role });
    return true;
  };

  const updateAccountRole = (email: string, role: UserRole): boolean => {
    const accounts = getAccounts();
    const index = accounts.findIndex((a) => a.email === email);
    if (index === -1) return false;
    accounts[index].role = role;
    localStorage.setItem("accounts", JSON.stringify(accounts));
    if (user && user.email === email) {
      setUser({ ...user, role });
    }
    return true;
  };

  const deleteAccount = (email: string): boolean => {
    const accounts = getAccounts();
    const filtered = accounts.filter((a) => a.email !== email);
    if (filtered.length === accounts.length) return false;
    localStorage.setItem("accounts", JSON.stringify(filtered));
    if (user && user.email === email) {
      setUser(null);
    }
    return true;
  };

  const getAccountsList = (): Array<{ name: string; email: string; role: UserRole }> => {
    return getAccounts().map(({ name, email, role }) => ({ name, email, role }));
  };

  const logout = () => {
    setUser(null);
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    if (user.email === "admin@happytruffles.qa") return true;
    if (user.role === "admin") return true;
    return user.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, hasRole, updateAccountRole, deleteAccount, getAccountsList }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
