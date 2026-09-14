"use client";
import { useState } from "react";
import { useWaitlist } from "@/app/waitlist-context";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Users, Phone } from "lucide-react";

export default function WaitlistPage() {
  const { entries, addToWaitlist, seatGuest, cancelWaitlist } = useWaitlist();
  const [form, setForm] = useState({ name: "", phone: "", partySize: 2 });
  const [added, setAdded] = useState(false);
  const [addedId, setAddedId] = useState("");

  const waiting = entries.filter((e) => e.status === "waiting");
  const seated = entries.filter((e) => e.status === "seated");
  const cancelled = entries.filter((e) => e.status === "cancelled");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = addToWaitlist({ name: form.name, phone: form.phone, partySize: form.partySize });
    setAdded(true);
    setAddedId(entry.id);
    setForm({ name: "", phone: "", partySize: 2 });
  };

  if (added) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <CheckCircle className="text-truffle mx-auto" size={64} />
          <h2 className="font-playfair text-3xl text-chocolate font-bold mt-4 mb-2">You&apos;re on the Waitlist!</h2>
          <p className="text-chocolate/70">Your position: #{waiting.length}</p>
          <p className="text-chocolate/60 text-sm mt-2">ID: {addedId}</p>
          <button onClick={() => setAdded(false)} className="mt-6 bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors">Back</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Clock className="text-truffle mx-auto mb-2" size={40} />
            <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Waitlist</h1>
            <p className="text-chocolate/60">Join the queue and we&apos;ll notify you when your table is ready</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto mb-12">
            <div className="flex items-center gap-2">
              <input type="text" required placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-chocolate" size={20} />
              <input type="tel" required placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-chocolate" size={20} />
              <select value={form.partySize} onChange={(e) => setForm({ ...form, partySize: Number(e.target.value) })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => <option key={num} value={num}>{num} Guest{num > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors">Join Waitlist</button>
          </form>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-playfair text-xl font-bold text-chocolate mb-3">Waiting ({waiting.length})</h3>
              <div className="space-y-2">
                {waiting.map((entry) => (
                  <div key={entry.id} className="bg-vanilla/20 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-chocolate text-sm">{entry.name}</p>
                      <p className="text-xs text-chocolate/60">{entry.partySize} guests | {entry.phone}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => seatGuest(entry.id)} className="text-green-600 hover:text-green-700" title="Seat"><CheckCircle size={18} /></button>
                      <button onClick={() => cancelWaitlist(entry.id)} className="text-red-500 hover:text-red-600" title="Cancel"><XCircle size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-chocolate mb-3">Seated ({seated.length})</h3>
              <div className="space-y-2">
                {seated.map((entry) => (
                  <div key={entry.id} className="bg-green-50 rounded-lg p-3">
                    <p className="font-medium text-chocolate text-sm">{entry.name}</p>
                    <p className="text-xs text-chocolate/60">{entry.partySize} guests</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-chocolate mb-3">Cancelled ({cancelled.length})</h3>
              <div className="space-y-2">
                {cancelled.map((entry) => (
                  <div key={entry.id} className="bg-red-50 rounded-lg p-3">
                    <p className="font-medium text-chocolate text-sm">{entry.name}</p>
                    <p className="text-xs text-chocolate/60">Cancelled</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
