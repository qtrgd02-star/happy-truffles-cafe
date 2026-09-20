"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "@/app/auth-context";

export interface CustomerData {
  email: string;
  name: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
}

interface CustomerContextType {
  customerData: CustomerData | null;
  setCustomerData: (data: CustomerData | null) => void;
  clearCustomerData: () => void;
  saveCustomerData: () => Promise<boolean>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [customerData, setCustomerDataState] = useState<CustomerData | null>(null);

  const setCustomerData = (data: CustomerData | null) => {
    setCustomerDataState(data);
  };

  const clearCustomerData = () => {
    setCustomerDataState(null);
  };

  const saveCustomerData = async (): Promise<boolean> => {
    if (!user?.email) return false;
    
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...customerData,
          email: user.email,
          savedAt: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        console.log("Customer data saved successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to save customer data:", error);
      return false;
    }
  };

  return (
    <CustomerContext.Provider value={{ 
      customerData, 
      setCustomerData, 
      clearCustomerData, 
      saveCustomerData 
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) throw new Error("useCustomer must be used within CustomerProvider");
  return context;
}