"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QrCode, Plus, Trash2, Download, Printer } from "lucide-react";

interface Table {
  id: string;
  number: string;
  label: string;
  seats: number;
  status: string;
  qrUrl: string;
}

export default function TablesQRPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: "", number: "", label: "", seats: 4 });

  const fetchTables = async () => {
    try {
      const res = await fetch("/api/tables-qr");
      const data = await res.json();
      setTables(data);
    } catch (e) {
      console.error("Failed to fetch tables:", e);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleCreate = async () => {
    if (!formData.number || !formData.label) return;
    await fetch("/api/tables-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", ...formData }),
    });
    setShowModal(false);
    setFormData({ id: "", number: "", label: "", seats: 4 });
    fetchTables();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/tables-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    fetchTables();
  };

  const printQR = (table: Table) => {
    const win = window.open("");
    if (!win) return;
    win.document.write(`<html><head><title>QR - ${table.label}</title></head><body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:sans-serif;"><div style="text-align:center;"><h2>${table.label}</h2><img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(table.qrUrl)}" /><p>Scan to order</p></div></body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-chocolate">Table QR Codes</h1>
            <p className="text-chocolate/60 mt-1">Generate and manage QR codes for tables</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-truffle text-white px-4 py-2 rounded-full font-semibold hover:bg-chocolate transition-colors flex items-center gap-2">
            <Plus size={18} />
            Add Table
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tables.map((table) => (
            <motion.div key={table.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-playfair text-xl font-bold text-chocolate">{table.label}</h3>
                  <p className="text-sm text-chocolate/60">Seats: {table.seats}</p>
                </div>
                <button onClick={() => handleDelete(table.id)} className="text-chocolate/40 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(table.qrUrl)}`} alt={`QR for ${table.label}`} className="mx-auto mb-4" />
              <div className="flex gap-2">
                <button onClick={() => printQR(table)} className="flex-1 bg-truffle/10 text-truffle py-2 rounded-lg text-sm font-semibold hover:bg-truffle/20 transition-colors flex items-center justify-center gap-1">
                  <Printer size={14} />
                  Print
                </button>
                <a href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(table.qrUrl)}`} download className="flex-1 bg-chocolate/10 text-chocolate py-2 rounded-lg text-sm font-semibold hover:bg-chocolate/20 transition-colors flex items-center justify-center gap-1">
                  <Download size={14} />
                  Download
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="font-playfair text-2xl font-bold text-chocolate mb-4">Add Table</h2>
              <div className="space-y-4">
                <input type="text" value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value, id: e.target.value })} placeholder="Table Number" className="w-full border border-chocolate/20 rounded-lg px-4 py-2" />
                <input type="text" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} placeholder="Label (e.g., Table 1)" className="w-full border border-chocolate/20 rounded-lg px-4 py-2" />
                <input type="number" value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 4 })} placeholder="Seats" className="w-full border border-chocolate/20 rounded-lg px-4 py-2" />
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 border border-chocolate/20 py-2 rounded-full">Cancel</button>
                <button onClick={handleCreate} className="flex-1 bg-truffle text-white py-2 rounded-full">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
