"use client";
import { useState } from "react";
import { useCart } from "@/app/cart-context";
import { useOrderSchedule, type ScheduledOrder } from "@/app/order-schedule-context";
import { useLoyalty } from "@/app/loyalty-context";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, ShoppingCart, User, Mail, Phone } from "lucide-react";

export default function OrderSchedulingPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { scheduleOrder } = useOrderSchedule();
  const { addPoints } = useLoyalty();
  const [scheduled, setScheduled] = useState(false);
  const [scheduledOrder, setScheduledOrder] = useState<ScheduledOrder | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", date: "", time: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const order = scheduleOrder({
      items: cart.map((item) => ({ ...item })),
      total: cartTotal,
      customer: { ...form },
      scheduledFor: `${form.date}T${form.time}`,
    });
    setScheduledOrder(order);
    setScheduled(true);
    addPoints(form.phone, cartTotal);
    clearCart();
  };

  if (scheduled && scheduledOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <CheckCircle className="text-truffle mx-auto" size={64} />
          <h2 className="font-playfair text-3xl text-chocolate font-bold mt-4 mb-2">Order Scheduled!</h2>
          <p className="text-chocolate/70 mb-2">Your order has been scheduled for {scheduledOrder.scheduledFor}.</p>
          <p className="text-chocolate/60 text-sm">Order ID: {scheduledOrder.id}</p>
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
            <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Schedule an Order</h1>
            <p className="text-chocolate/60">Order ahead and pick up at your preferred time</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-vanilla/20 rounded-lg p-3">
                <div>
                  <p className="font-medium text-chocolate">{item.title}</p>
                  <p className="text-sm text-chocolate/60">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-truffle">QAR {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t pt-4">
              <p className="text-xl font-bold text-chocolate text-right">Total: QAR {cartTotal.toFixed(2)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-chocolate" size={20} />
                <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-chocolate" size={20} />
                <input type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="text-chocolate" size={20} />
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-chocolate" size={20} />
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-chocolate" size={20} />
              <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            </div>
            <button type="submit" className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors flex items-center justify-center gap-2">
              <Calendar size={20} />
              Schedule Order
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
