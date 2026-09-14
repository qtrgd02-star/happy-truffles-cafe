"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface StaffShift {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "checked-in" | "checked-out" | "absent";
  notes?: string;
}

interface StaffScheduleContextType {
  shifts: StaffShift[];
  addShift: (shift: Omit<StaffShift, "id">) => void;
  updateShiftStatus: (id: string, status: StaffShift["status"]) => void;
  getShiftsByDate: (date: string) => StaffShift[];
}

const StaffScheduleContext = createContext<StaffScheduleContextType | undefined>(undefined);

export function StaffScheduleProvider({ children }: { children: ReactNode }) {
  const [shifts, setShifts] = useState<StaffShift[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("staffShifts");
      if (saved) setShifts(JSON.parse(saved));
    } catch (e) { console.error("Failed to load shifts", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem("staffShifts", JSON.stringify(shifts));
  }, [shifts]);

  const addShift = (shift: Omit<StaffShift, "id">) => {
    const newShift: StaffShift = { ...shift, id: "SHF-" + Math.floor(100000 + Math.random() * 900000).toString() };
    setShifts((prev) => [...prev, newShift]);
  };

  const updateShiftStatus = (id: string, status: StaffShift["status"]) => {
    setShifts((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const getShiftsByDate = (date: string) => shifts.filter((s) => s.date === date);

  return (
    <StaffScheduleContext.Provider value={{ shifts, addShift, updateShiftStatus, getShiftsByDate }}>
      {children}
    </StaffScheduleContext.Provider>
  );
}

export function useStaffSchedule() {
  const context = useContext(StaffScheduleContext);
  if (!context) throw new Error("useStaffSchedule must be used within StaffScheduleProvider");
  return context;
}
