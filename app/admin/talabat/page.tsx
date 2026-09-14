"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, RefreshCw, Trash2, ExternalLink } from "lucide-react";

interface TalabatOrder {
  id: string;
  customer: { name: string; phone: string; address: string };
  items: { title: string; price: number; quantity: number }[];
  total: number;
  status: string;
  source: string;
  importedAt: string;
}

export default function TalabatAdminPage() {
  const [orders, setOrders] = useState<TalabatOrder[]>([]);
  const [importing, setImporting] = useState(false);
  const [syncText, setSyncText] = useState("");

  useEffect(() => {
    fetch("/api/talabat").then((r) => r.json()).then(setOrders).catch(console.error);
  }, []);

  const handleImport = async () => {
    setImporting(true);
    try {
      const res = await fetch("/api/talabat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "import", orders: [{ id: `tal_${Date.now()}`, customer: { name: "Demo Customer", phone: "+97400000000", address: "Doha" }, items: [{ title: "6pcs Mini Heart Truffles", price: 28, quantity: 1 }], total: 28, status: "pending", source: "talabat", importedAt: new Date().toISOString() }] }),
      });
      const data = await res.json();
      if (data.success) {
        fetch("/api/talabat").then((r) => r.json()).then(setOrders);
        alert(`Imported ${data.imported} orders`);
      }
    } catch (e) { console.error(e); }
    setImporting(false);
  };

  const handleSync = async () => {
    try {
      await fetch("/api/talabat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync", orders }),
      });
      alert("Synced successfully");
    } catch (e) { console.error(e); }
  };

  const handleClear = async () => {
    await fetch("/api/talabat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sync", orders: [] }),
    });
    setOrders([]);
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-chocolate">Talabat / Zomato Sync</h1>
            <p className="text-chocolate/60 mt-1">Import external delivery orders</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleImport} disabled={importing} className="bg-truffle text-white px-4 py-2 rounded-full font-medium hover:bg-chocolate transition-colors flex items-center gap-2">
              <Download size={18} />
              {importing ? "Importing..." : "Import Demo"}
            </button>
            <button onClick={handleSync} className="bg-white text-chocolate border border-chocolate/20 px-4 py-2 rounded-full font-medium hover:bg-chocolate/5 transition-colors flex items-center gap-2">
              <RefreshCw size={18} />
              Sync
            </button>
            <button onClick={handleClear} className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-full font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
              <Trash2 size={18} />
              Clear
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-vanilla/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chocolate/60 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chocolate/60 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chocolate/60 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chocolate/60 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chocolate/60 uppercase tracking-wider">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-vanilla/10">
                    <td className="px-6 py-4 text-sm font-medium text-chocolate">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-chocolate/80">{order.customer.name} | {order.customer.phone}</td>
                    <td className="px-6 py-4 text-sm font-medium text-truffle">QAR {order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-chocolate/80">{order.status}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <ExternalLink size={12} />
                        {order.source}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-chocolate/60">
                      No external orders imported yet. Click Import Demo to test.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}