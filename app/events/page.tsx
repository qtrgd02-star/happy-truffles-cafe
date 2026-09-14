"use client";
import { useState } from "react";
import { useToast } from "@/app/toast-context";
import { motion } from "framer-motion";
import { Calendar, Users, Mail, Phone, CheckCircle } from "lucide-react";

export default function EventsPage() {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", eventType: "", date: "", guestCount: 2, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitted(true);
    showToast("Event inquiry sent!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <CheckCircle className="text-truffle mx-auto" size={64} />
          <h2 className="font-playfair text-3xl text-chocolate font-bold mt-4 mb-2">Event Inquiry Sent!</h2>
          <p className="text-chocolate/70">We&apos;ll get back to you within 24 hours.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Calendar className="text-truffle mx-auto mb-2" size={40} />
            <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Book an Event</h1>
            <p className="text-chocolate/60">Host your special occasion at Happy Truffles Cafe</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="text-chocolate" size={20} />
                <input type="text" required placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
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
                <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
              </div>
            </div>
            <input type="text" required placeholder="Event Type (e.g., Birthday, Anniversary)" value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="w-full border border-chocolate/20 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            <div className="flex items-center gap-2">
              <Users className="text-chocolate" size={20} />
              <select value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => <option key={num} value={num}>{num} Guest{num > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <textarea placeholder="Tell us about your event..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="w-full border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle resize-none" />
            <button type="submit" className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors flex items-center justify-center gap-2">
              <Calendar size={20} /> Book Event
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
