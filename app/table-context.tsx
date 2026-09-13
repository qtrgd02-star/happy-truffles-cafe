"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  orderId?: string;
  reservationId?: string;
}

interface TableContextType {
  tables: Table[];
  addTable: (table: Omit<Table, "id">) => void;
  updateTable: (id: string, updates: Partial<Omit<Table, "id">>) => void;
  removeTable: (id: string) => void;
  clearTables: () => void;
  syncTables: () => Promise<void>;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

const TABLES_KEY = "tables";

export function TableProvider({ children }: { children: ReactNode }) {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(TABLES_KEY);
    if (saved) {
      try {
        setTables(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tables from localStorage", e);
        localStorage.removeItem(TABLES_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(TABLES_KEY, JSON.stringify(tables));
  }, [tables]);

  const syncToApi = useCallback(async () => {
    try {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync", tables }),
      });
      if (!res.ok) throw new Error("Failed to sync tables");
    } catch (e) {
      console.error("Table sync failed:", e);
    }
  }, [tables]);

  const addTable = (table: Omit<Table, "id">) => {
    const newTable: Table = {
      ...table,
      id: Date.now().toString(),
    };
    setTables((prev) => [...prev, newTable]);
    syncToApi();
  };

  const updateTable = (id: string, updates: Partial<Omit<Table, "id">>) => {
    setTables((prev) =>
      prev.map((table) => (table.id === id ? { ...table, ...updates } : table))
    );
    syncToApi();
  };

  const removeTable = (id: string) => {
    setTables((prev) => prev.filter((table) => table.id !== id));
    syncToApi();
  };

  const clearTables = () => setTables([]);

  return (
    <TableContext.Provider value={{ tables, addTable, updateTable, removeTable, clearTables, syncTables: syncToApi }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTables() {
  const context = useContext(TableContext);
  if (!context) throw new Error("useTables must be used within TableProvider");
  return context;
}
