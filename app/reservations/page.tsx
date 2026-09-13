"use client";

import { useState } from "react";
import { useReservations } from "@/app/reservation-context";
import { useToast } from "@/app/toast-context";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, CheckCircle, Phone, User, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function ReservationPage() {
  const { addReservation } = useReservations();
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    if (form.guests < 1) newErrors.guests = "At least 1 guest required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const id = "#" + Math.floor(100000 + Math.random() * 900000).toString();
    addReservation({
      name: form.name,
      email: form.email,
      phone: form.phone,
      date: form.date,
      time: form.time,
      guests: form.guests,
      notes: form.notes || undefined,
    });
    setReservationId(id);
    setSubmitted(true);
    showToast("Reservation confirmed!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center"
        >
          <CheckCircle className="text-truffle mx-auto" size={64} />
          <h2 className="font-playfair text-3xl text-chocolate font-bold mt-4 mb-2">Reservation Confirmed!</h2>
          <p className="text-chocolate/70 mb-2">Your reservation {reservationId} has been received.</p>
          <p className="text-chocolate/60 text-sm mb-6">
            {form.date} at {form.time} for {form.guests} guest{form.guests !== 1 ? "s" : ""}
          </p>
          <Link
            href="/#menu"
            className="inline-block bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
          >
            Browse Menu
          </Link>
        </motion.div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <Calendar className="text-truffle mx-auto mb-2" size={40} />
            <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Reserve a Table</h1>
            <p className="text-chocolate/60">Book your spot at Happy Truffles Cafe</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-2">
              <User className="text-chocolate" size={20} />
              <div className="flex-1">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle ${errors.name ? "border-red-500" : "border-chocolate/20"}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-chocolate" size={20} />
              <div className="flex-1">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle ${errors.phone ? "border-red-500" : "border-chocolate/20"}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="text-chocolate" size={20} />
              <div className="flex-1">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle ${errors.email ? "border-red-500" : "border-chocolate/20"}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-chocolate" size={20} />
                <div className="flex-1">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={today}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle ${errors.date ? "border-red-500" : "border-chocolate/20"}`}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-chocolate" size={20} />
                <div className="flex-1">
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle ${errors.time ? "border-red-500" : "border-chocolate/20"}`}
                  />
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-chocolate" size={20} />
              <div className="flex-1">
                <select
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  className="w-full border border-chocolate/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} Guest{num !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="text-chocolate" size={20} />
              <div className="flex-1">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Special requests or notes (optional)"
                  rows={3}
                  className="w-full border border-chocolate/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle resize-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors flex items-center justify-center gap-2"
            >
              <Calendar size={20} />
              Confirm Reservation
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
