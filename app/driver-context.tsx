"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plateNumber: string;
  status: "available" | "on-delivery" | "off-duty";
  currentOrderId?: string;
  location?: { lat: number; lng: number };
}

export interface DriverAssignment {
  id: string;
  orderId: string;
  driverId: string;
  driverName: string;
  status: "assigned" | "picked-up" | "delivered";
  assignedAt: string;
  deliveredAt?: string;
}

interface DriverContextType {
  drivers: Driver[];
  assignments: DriverAssignment[];
  addDriver: (driver: Omit<Driver, "id">) => void;
  assignDriver: (orderId: string, driverId: string) => void;
  updateAssignmentStatus: (id: string, status: DriverAssignment["status"]) => void;
  getAvailableDrivers: () => Driver[];
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export function DriverProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [assignments, setAssignments] = useState<DriverAssignment[]>([]);

  useEffect(() => {
    try {
      const savedDrivers = localStorage.getItem("drivers");
      const savedAssignments = localStorage.getItem("driverAssignments");
      if (savedDrivers) setDrivers(JSON.parse(savedDrivers));
      if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
    } catch (e) { console.error("Failed to load drivers", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem("drivers", JSON.stringify(drivers));
    localStorage.setItem("driverAssignments", JSON.stringify(assignments));
  }, [drivers, assignments]);

  const addDriver = (driver: Omit<Driver, "id">) => {
    const newDriver: Driver = { ...driver, id: "DRV-" + Math.floor(100000 + Math.random() * 900000).toString() };
    setDrivers((prev) => [...prev, newDriver]);
  };

  const assignDriver = (orderId: string, driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;
    setDrivers((prev) => prev.map((d) => (d.id === driverId ? { ...d, status: "on-delivery", currentOrderId: orderId } : d)));
    setAssignments((prev) => [...prev, {
      id: "ASN-" + Math.floor(100000 + Math.random() * 900000).toString(),
      orderId,
      driverId,
      driverName: driver.name,
      status: "assigned",
      assignedAt: new Date().toISOString(),
    }]);
  };

  const updateAssignmentStatus = (id: string, status: DriverAssignment["status"]) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, status, deliveredAt: status === "delivered" ? new Date().toISOString() : undefined } : a)));
  };

  const getAvailableDrivers = () => drivers.filter((d) => d.status === "available");

  return (
    <DriverContext.Provider value={{ drivers, assignments, addDriver, assignDriver, updateAssignmentStatus, getAvailableDrivers }}>
      {children}
    </DriverContext.Provider>
  );
}

export function useDrivers() {
  const context = useContext(DriverContext);
  if (!context) throw new Error("useDrivers must be used within DriverProvider");
  return context;
}
