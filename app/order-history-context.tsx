"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, orderBy, query as firestoreQuery, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase/config";
import { useShifts } from "@/app/shift-context";

export interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  notes?: string;
  modifiers?: {
    size?: string;
    extras?: string[];
    specialInstructions?: string;
  };
}

export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";

export type OrderType = "dine-in" | "takeaway" | "delivery";

export type PaymentMethod = "cash" | "card";

export type PaymentStatus = "pending" | "paid";

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
  giftCardCode?: string;
  giftCardDeduction?: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  orderType: OrderType;
  tableId?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  amountPaid?: number;
  changeDue?: number;
  cashierName?: string;
}

interface OrderHistoryContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  clearHistory: () => void;
  syncOrders: () => Promise<void>;
}

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(undefined);

const ORDER_HISTORY_KEY = "orderHistory";

export function OrderHistoryProvider({ children }: { children: ReactNode }) {
  const { activeShift, addTransaction } = useShifts();
  const [orders, setOrders] = useState<Order[]>([]);
  const [useFirestore, setUseFirestore] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(ORDER_HISTORY_KEY);
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse order history from localStorage", e);
        localStorage.removeItem(ORDER_HISTORY_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!db) return;
    const q = firestoreQuery(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreOrders = snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() } as Order));
        setOrders(firestoreOrders);
        setUseFirestore(true);
      },
      (error) => {
        console.error("Firestore orders listener failed:", error);
        setUseFirestore(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!useFirestore) {
      localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders));
    }
  }, [orders, useFirestore]);

  const syncToApi = useCallback(async () => {
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync", orders }),
      });
    } catch (e) {
      console.error("Order sync failed:", e);
    }
  }, [orders]);

  const addOrder = (order: Omit<Order, "id" | "createdAt" | "status">): Order => {
    const newOrder: Order = {
      ...order,
      id: "#" + Math.floor(100000 + Math.random() * 900000).toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
      orderType: order.orderType || "takeaway",
      paymentStatus: order.paymentStatus || "pending",
    };

    if (db) {
      const firestoreOrder = Object.fromEntries(
        Object.entries({ ...newOrder, createdAt: serverTimestamp() }).filter(([, v]) => v !== undefined)
      );
      addDoc(collection(db, "orders"), firestoreOrder).then(() => {
        if (activeShift && newOrder.paymentStatus === "paid") {
          addTransaction({
            type: "sale",
            amount: newOrder.total,
            orderId: newOrder.id,
            note: `Order ${newOrder.id} - ${newOrder.customer.name}`,
          });
        }
      }).catch((error) => {
        console.error("Failed to add order to Firestore:", error);
        setOrders((prev) => [newOrder, ...prev]);
      });
    } else {
      setOrders((prev) => [newOrder, ...prev]);
    }

    syncToApi();
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    if (db) {
      updateDoc(doc(db, "orders", id), { status }).catch((error) => {
        console.error("Failed to update order status in Firestore:", error);
        setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
      });
    } else {
      setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
    }
    syncToApi();
  };

  const clearHistory = () => setOrders([]);

  return (
    <OrderHistoryContext.Provider value={{ orders, addOrder, updateOrderStatus, clearHistory, syncOrders: syncToApi }}>
      {children}
    </OrderHistoryContext.Provider>
  );
}

export function useOrderHistory() {
  const context = useContext(OrderHistoryContext);
  if (!context) throw new Error("useOrderHistory must be used within OrderHistoryProvider");
  return context;
}
