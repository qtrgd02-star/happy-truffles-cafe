"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface PaymentMethod {
  id: string;
  type: "card" | "cash" | "wallet";
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface PaymentState {
  selectedMethod: "card" | "cash" | "wallet";
  cardDetails: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  };
  paymentMethods: PaymentMethod[];
  isProcessing: boolean;
}

interface PaymentContextType extends PaymentState {
  setSelectedMethod: (method: "card" | "cash" | "wallet") => void;
  setCardDetails: (details: Partial<PaymentState["cardDetails"]>) => void;
  processPayment: (amount: number, orderId: string) => Promise<{ success: boolean; transactionId?: string }>;
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [selectedMethod, setSelectedMethod] = useState<"card" | "cash" | "wallet">("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async (amount: number, orderId: string) => {
    setIsProcessing(true);

    try {
      if (selectedMethod === "card") {
        const res = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            orderId,
            cardDetails,
          }),
        });

        const data = await res.json();
        if (data.success) {
          return { success: true, transactionId: data.transactionId };
        } else {
          return { success: false };
        }
      } else if (selectedMethod === "cash") {
        return { success: true, transactionId: "cash-" + orderId };
      } else if (selectedMethod === "wallet") {
        return { success: true, transactionId: "wallet-" + orderId };
      }

      return { success: false };
    } catch (e) {
      return { success: false };
    } finally {
      setIsProcessing(false);
    }
  };

  const addPaymentMethod = (method: Omit<PaymentMethod, "id">) => {
    const newMethod = { ...method, id: "pm-" + Date.now() };
    setPaymentMethods([...paymentMethods, newMethod]);
  };

  return (
    <PaymentContext.Provider
      value={{
        selectedMethod,
        cardDetails,
        paymentMethods,
        isProcessing,
        setSelectedMethod,
        setCardDetails: (details) => setCardDetails({ ...cardDetails, ...details }),
        processPayment,
        addPaymentMethod,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within PaymentProvider");
  }
  return context;
}
