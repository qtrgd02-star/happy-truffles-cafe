"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ToastContextType {
  message: string;
  showToast: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };
  return (
    <ToastContext.Provider value={{ message, showToast }}>
      {children}
      {message && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-chocolate text-white px-6 py-3 rounded-full shadow-lg z-50">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
