"use client";
import { useState } from "react";
import { useCatering } from "@/app/catering-context";
import { motion } from "framer-motion";
import { Users, Calendar, Mail, Phone, CheckCircle } from "lucide-react";

export default function CateringPage() {
  const { orders, submitCateringOrder } = useCatering();
  const [form, setForm] = useState({ customerName: "", email: "", phone: "", eventDate: "", eventType: "", guestCount: 2, items: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = submitCateringOrder({
      customerName: form.customerName,
      customerEmail: form.email,
      customerPhone: form.phone,
      eventDate: form.eventDate,
      eventType: form.eventType,
      guestCount: form.guestCount,
      items: form.items.split(",").map((item) => ({ title: item.trim(), quantity: 1, price: 0 })),
      total: 0,
      notes: form.notes || undefined,
    });
    setOrderId(order.id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <CheckCircle className="text-truffle mx-auto" size={64} />
          <h2 className="font-playfair text-3xl text-chocolate font-bold mt-4 mb-2">Catering Inquiry Sent!</h2>
          <p className="text-chocolate/70 mb-2">We&apos;ll contact you within 24 hours with a custom quote.</p>
          <p className="text-chocolate/60 text-sm">Reference: {orderId}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Users className="text-truffle mx-auto mb-2" size={40} />
            <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Catering Orders</h1>
            <p className="text-chocolate/60">Let us cater your next event</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="text-chocolate" size={20} />
                <input type="text" required placeholder="Your Name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-chocolate" size={20} />
                <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-chocolate" size={20} />
                <input type="tel" required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-chocolate" size={20} />
                <input type="date" required value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
              </div>
            </div>
            <input type="text" required placeholder="Event Type (e.g., Birthday, Corporate)" value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="w-full border border-chocolate/20 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            <div className="flex items-center gap-2">
              <Users className="text-chocolate" size={20} />
              <select value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => <option key={num} value={num}>{num} Guest{num > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <textarea placeholder="Items needed (comma separated, e.g., Truffle Box, Coffee Station, Pastries)" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} rows={3} className="w-full border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle resize-none" />
            <textarea placeholder="Special requests or notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle resize-none" />
            <button type="submit" className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors flex items-center justify-center gap-2">
              <Users size={20} /> Request Catering Quote
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
