"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase/config";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "staff" | "admin" | "manager";
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface StaffContextType {
  staff: StaffMember[];
  addStaff: (member: Omit<StaffMember, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateStaff: (id: string, updates: Partial<StaffMember>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  refresh: () => void;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export function StaffProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    if (!db) {
      const saved = localStorage.getItem("staff");
      if (saved) {
        try {
          setStaff(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse staff from localStorage", e);
        }
      }
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, "staff"),
      (snapshot) => {
        const staffData = snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() } as StaffMember));
        setStaff(staffData);
        localStorage.setItem("staff", JSON.stringify(staffData));
      },
      (error) => {
        console.error("Firestore staff listener failed:", error);
        const saved = localStorage.getItem("staff");
        if (saved) {
          try {
            setStaff(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to parse staff from localStorage", e);
          }
        }
      }
    );
    return () => unsubscribe();
  }, []);

  const addStaff = useCallback(async (member: Omit<StaffMember, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newMember: Omit<StaffMember, "id"> = {
      ...member,
      createdAt: now,
      updatedAt: now,
    };
    if (db) {
      const docRef = await addDoc(collection(db, "staff"), { ...newMember, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      setStaff((prev) => {
        const updated = [...prev, { ...newMember, id: docRef.id }];
        localStorage.setItem("staff", JSON.stringify(updated));
        return updated;
      });
    } else {
      const memberWithId = { ...newMember, id: Date.now().toString() } as StaffMember;
      setStaff((prev) => {
        const updated = [...prev, memberWithId];
        localStorage.setItem("staff", JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  const updateStaff = useCallback(async (id: string, updates: Partial<StaffMember>) => {
    const updatedAt = new Date().toISOString();
    if (db) {
      await updateDoc(doc(db, "staff", id), { ...updates, updatedAt: serverTimestamp() });
      setStaff((prev) => {
        const updated = prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt } : s));
        localStorage.setItem("staff", JSON.stringify(updated));
        return updated;
      });
    } else {
      setStaff((prev) => {
        const updated = prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt } : s));
        localStorage.setItem("staff", JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  const deleteStaff = useCallback(async (id: string) => {
    if (db) {
      await deleteDoc(doc(db, "staff", id));
    }
    setStaff((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      localStorage.setItem("staff", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const refresh = useCallback(() => {
    const saved = localStorage.getItem("staff");
    if (saved) {
      try {
        setStaff(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse staff from localStorage", e);
      }
    }
  }, []);

  return (
    <StaffContext.Provider value={{ staff, addStaff, updateStaff, deleteStaff, refresh }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (!context) throw new Error("useStaff must be used within StaffProvider");
  return context;
}
