"use client";
import { useState } from "react";
import { useSplitBilling, type SplitPayment } from "@/app/split-billing-context";
import { motion } from "framer-motion";
import { Users, CheckCircle, Plus, Minus } from "lucide-react";

export default function SplitBillingPage() {
  const { splitBills, createSplitBill, completeSplit } = useSplitBilling();
  const [orderId, setOrderId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [splitNames, setSplitNames] = useState<string[]>(["", ""]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !totalAmount) return;
    createSplitBill({
      orderId,
      totalAmount: parseFloat(totalAmount),
      splits: splitNames.filter((n) => n.trim()).map((name) => ({ id: Math.random().toString(), name, amount: 0, method: "card" })),
    });
    setOrderId("");
    setTotalAmount("");
    setSplitNames(["", ""]);
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Users className="text-truffle mx-auto mb-2" size={40} />
            <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Split Billing</h1>
            <p className="text-chocolate/60">Split the bill among multiple people</p>
          </div>
          <form onSubmit={handleCreate} className="space-y-5">
            <input type="text" placeholder="Order ID" required value={orderId} onChange={(e) => setOrderId(e.target.value)} className="w-full border border-chocolate/20 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            <input type="number" placeholder="Total Amount (QAR)" required value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} className="w-full border border-chocolate/20 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            <div>
              <label className="block text-sm font-medium text-chocolate mb-2">People Splitting</label>
              {splitNames.map((name, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input type="text" placeholder="Name" value={name} onChange={(e) => {
                    const updated = [...splitNames];
                    updated[idx] = e.target.value;
                    setSplitNames(updated);
                  }} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
                </div>
              ))}
              <button type="button" onClick={() => setSplitNames([...splitNames, ""])} className="text-truffle text-sm font-medium flex items-center gap-1">
                <Plus size={16} /> Add Person
              </button>
            </div>
            <button type="submit" className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors">Create Split Bill</button>
          </form>
          <div className="mt-8 space-y-4">
            <h2 className="font-playfair text-2xl font-bold text-chocolate">Recent Split Bills</h2>
            {splitBills.length === 0 ? (
              <p className="text-chocolate/60 text-center py-8">No split bills yet</p>
            ) : (
              splitBills.map((bill) => (
                <div key={bill.id} className="bg-vanilla/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-chocolate">Order {bill.orderId}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bill.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{bill.status}</span>
                  </div>
                  <p className="text-chocolate/60 text-sm">Total: QAR {bill.totalAmount.toFixed(2)} | Splits: {bill.splits.length}</p>
                  {bill.status !== "completed" && (
                    <button onClick={() => completeSplit(bill.id)} className="mt-2 text-sm text-truffle font-medium flex items-center gap-1">
                      <CheckCircle size={16} /> Mark as Paid
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
