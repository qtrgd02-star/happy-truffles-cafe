"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInventory } from "@/app/inventory-context";
import { menuItems } from "@/app/menu-data";
import { Package, AlertTriangle, Plus, Minus, RefreshCw, Download } from "lucide-react";
import { exportInventoryToCsv } from "@/app/lib/export";

export default function AdminInventoryPage() {
  const { items, setStock, updateStock, refresh } = useInventory();
  const [localStock, setLocalStock] = useState<Record<number, number>>({});

  useEffect(() => {
    const stockMap: Record<number, number> = {};
    items.forEach((item) => {
      stockMap[item.menuItemId] = item.stock;
    });
    setLocalStock(stockMap);
  }, [items]);

  const getItemStock = (menuItemId: number) => {
    const inventoryItem = items.find((i) => i.menuItemId === menuItemId);
    return inventoryItem ? inventoryItem.stock : 0;
  };

  const isLowStock = (menuItemId: number) => {
    const inventoryItem = items.find((i) => i.menuItemId === menuItemId);
    if (!inventoryItem) return false;
    return inventoryItem.stock <= inventoryItem.lowStockThreshold;
  };

  const handleStockChange = async (menuItemId: number, delta: number) => {
    const currentStock = getItemStock(menuItemId);
    const newStock = Math.max(0, currentStock + delta);
    setLocalStock((prev) => ({ ...prev, [menuItemId]: newStock }));
    await setStock(menuItemId, newStock);
  };

  const lowStockItems = items.filter((item) => item.stock <= item.lowStockThreshold);

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-chocolate">Inventory</h1>
            <p className="text-chocolate/60 mt-1">Manage stock levels for menu items</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportInventoryToCsv(items)}
              className="flex items-center gap-2 border border-chocolate/20 text-chocolate px-4 py-2 rounded-lg text-sm font-medium hover:bg-chocolate/5 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button onClick={refresh} className="text-truffle hover:text-chocolate font-medium flex items-center gap-2">
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-red-600" size={24} />
              <h2 className="font-playfair text-xl font-bold text-red-800">Low Stock Alerts</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="font-medium text-chocolate">{item.title}</p>
                  <p className="text-sm text-red-600 mt-1">
                    Stock: {item.stock} {item.unit} (threshold: {item.lowStockThreshold})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-playfair text-xl font-bold text-chocolate mb-4">All Menu Items</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => {
              const stock = getItemStock(item.id);
              const low = isLowStock(item.id);
              return (
                <div key={item.id} className={`rounded-lg p-4 border ${low ? "border-red-200 bg-red-50" : "border-chocolate/10 bg-vanilla/10"}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-chocolate text-sm">{item.title}</p>
                      <p className="text-xs text-chocolate/50">{item.category}</p>
                    </div>
                    {low && (
                      <span className="flex items-center gap-1 text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                        <AlertTriangle size={12} />
                        Low
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleStockChange(item.id, -1)} className="p-1 rounded-full hover:bg-chocolate/10 text-chocolate">
                        <Minus size={16} />
                      </button>
                      <span className={`text-sm font-semibold w-8 text-center ${low ? "text-red-600" : "text-chocolate"}`}>
                        {stock}
                      </span>
                      <button onClick={() => handleStockChange(item.id, 1)} className="p-1 rounded-full hover:bg-chocolate/10 text-chocolate">
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-xs text-chocolate/50">in stock</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
