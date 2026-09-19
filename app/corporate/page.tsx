"use client";

import { useState } from "react";
import { useCorporate } from "@/app/corporate-context";
import { motion } from "framer-motion";
import { Building2, Mail, Phone, MapPin, FileText } from "lucide-react";

export default function CorporatePage() {
  const { accounts, addAccount, placeBulkOrder } = useCorporate();
  const [form, setForm] = useState({ companyName: "", contactName: "", email: "", phone: "", address: "", taxNumber: "" });
  const [bulkOrder, setBulkOrder] = useState({ accountId: "", items: "", total: "" });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount({ ...form, creditLimit: 5000, balance: 0 });
    setForm({ companyName: "", contactName: "", email: "", phone: "", address: "", taxNumber: "" });
    setMessage({ type: "success", text: "Corporate account created!" });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleBulkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const result = placeBulkOrder(bulkOrder.accountId, [], Number(bulkOrder.total));
    setBulkOrder({ accountId: "", items: "", total: "" });
    if (result.success) {
      setMessage({ type: "success", text: "Bulk order placed!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to place bulk order" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-chocolate mb-4">Corporate Accounts</h1>
          <p className="text-chocolate/70 text-lg">Bulk orders for offices and events with invoicing.</p>
          {message && (
            <div className={`mt-4 px-4 py-3 rounded-lg ${message.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
              {message.text}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-6 flex items-center gap-2">
              <Building2 className="text-truffle" size={24} />
              Create Account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
              <input required className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Contact Name" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
              <input required type="email" className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input required className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input required className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <input className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Tax Number (optional)" value={form.taxNumber} onChange={(e) => setForm({ ...form, taxNumber: e.target.value })} />
              <button type="submit" className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors">Create Account</button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-6 flex items-center gap-2">
              <FileText className="text-truffle" size={24} />
              Place Bulk Order
            </h2>
            <form onSubmit={handleBulkOrder} className="space-y-4">
              <select required className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle" value={bulkOrder.accountId} onChange={(e) => setBulkOrder({ ...bulkOrder, accountId: e.target.value })}>
                <option value="">Select Account</option>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.companyName}</option>)}
              </select>
              <textarea required className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Items (one per line)" value={bulkOrder.items} onChange={(e) => setBulkOrder({ ...bulkOrder, items: e.target.value })} rows={4} />
              <input required type="number" className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Total QAR" value={bulkOrder.total} onChange={(e) => setBulkOrder({ ...bulkOrder, total: e.target.value })} />
              <button type="submit" className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors">Place Bulk Order</button>
            </form>

            {accounts.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-chocolate mb-3">Accounts</h3>
                <div className="space-y-2">
                  {accounts.map((a) => (
                    <div key={a.id} className="bg-vanilla/30 rounded-xl p-3">
                      <p className="font-medium text-chocolate">{a.companyName}</p>
                      <p className="text-xs text-chocolate/60">{a.contactName} | {a.email} | Balance: QAR {a.balance.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}