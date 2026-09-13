"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { sendReservationConfirmationEmail } from "@/app/email-service";
import { sendReservationConfirmationSms } from "@/app/sms-service";

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  createdAt: string;
}

interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, "id" | "createdAt">) => void;
  clearReservations: () => void;
  syncReservations: () => Promise<void>;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

const RESERVATIONS_KEY = "reservations";

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(RESERVATIONS_KEY);
    if (saved) {
      try {
        setReservations(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reservations from localStorage", e);
        localStorage.removeItem(RESERVATIONS_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
  }, [reservations]);

  const syncToApi = useCallback(async () => {
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync", reservations }),
      });
      if (!res.ok) throw new Error("Failed to sync reservations");
    } catch (e) {
      console.error("Reservation sync failed:", e);
    }
  }, [reservations]);

  const addReservation = (reservation: Omit<Reservation, "id" | "createdAt">) => {
    const newReservation: Reservation = {
      ...reservation,
      id: "#" + Math.floor(100000 + Math.random() * 900000).toString(),
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [newReservation, ...prev]);
    syncToApi();
    if (reservation.email) {
      sendReservationConfirmationEmail(newReservation);
    }
    if (reservation.phone) {
      sendReservationConfirmationSms(newReservation);
    }
  };

  const clearReservations = () => setReservations([]);

  return (
    <ReservationContext.Provider value={{ reservations, addReservation, clearReservations, syncReservations: syncToApi }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationContext);
  if (!context) throw new Error("useReservations must be used within ReservationProvider");
  return context;
}
