"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface ScheduledOrder {
  id: string;
  items: any[];
  total: number;
  customer: { name: string; email: string; phone: string; address: string };
  scheduledFor: string;
  status: "scheduled" | "preparing" | "ready" | "completed" | "cancelled";
  createdAt: string;
}

interface OrderScheduleContextType {
  scheduledOrders: ScheduledOrder[];
  scheduleOrder: (order: Omit<ScheduledOrder, "id" | "createdAt" | "status">) => ScheduledOrder;
  updateScheduledStatus: (id: string, status: ScheduledOrder["status"]) => void;
}

const OrderScheduleContext = createContext<OrderScheduleContextType | undefined>(undefined);

export function OrderScheduleProvider({ children }: { children: ReactNode }) {
  const [scheduledOrders, setScheduledOrders] = useState<ScheduledOrder[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("scheduledOrders");
      if (saved) setScheduledOrders(JSON.parse(saved));
    } catch (e) { console.error("Failed to load scheduled orders", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem("scheduledOrders", JSON.stringify(scheduledOrders));
  }, [scheduledOrders]);

  const scheduleOrder = (order: Omit<ScheduledOrder, "id" | "createdAt" | "status">) => {
    const newOrder: ScheduledOrder = {
      ...order,
      id: "#" + Math.floor(100000 + Math.random() * 900000).toString(),
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };
    setScheduledOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateScheduledStatus = (id: string, status: ScheduledOrder["status"]) => {
    setScheduledOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <OrderScheduleContext.Provider value={{ scheduledOrders, scheduleOrder, updateScheduledStatus }}>
      {children}
    </OrderScheduleContext.Provider>
  );
}

export function useOrderSchedule() {
  const context = useContext(OrderScheduleContext);
  if (!context) throw new Error("useOrderSchedule must be used within OrderScheduleProvider");
  return context;
}
