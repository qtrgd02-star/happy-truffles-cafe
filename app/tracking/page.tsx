"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Package, ChefHat, Bike, CheckCircle, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const statusSteps = [
  { key: "pending", label: "Order Received", icon: Package },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "ready", label: "Ready", icon: Package },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Bike },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function TrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trackOrder = async () => {
    if (!orderId && !phone) return;
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (orderId) params.set("orderId", orderId);
      if (phone) params.set("phone", phone);

      const res = await fetch(`/api/tracking?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Order not found");
        setOrder(null);
      } else {
        setOrder(data);
      }
    } catch {
      setError("Failed to track order");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    const index = statusSteps.findIndex((s) => s.key === status);
    return index === -1 ? 0 : index;
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Track Your Order</h1>
          <p className="text-chocolate/60">Enter your order ID or phone number to check status</p>
        </motion.div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Order ID (e.g., #123456)"
              className="flex-1 border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="flex-1 border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
            />
          </div>
          <button
            onClick={trackOrder}
            disabled={loading}
            className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Search size={18} />
            {loading ? "Tracking..." : "Track Order"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </div>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-chocolate">{order.id}</h2>
                <p className="text-chocolate/60 text-sm">{order.customer.name} | {order.customer.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-truffle text-lg">QAR {order.total.toFixed(2)}</p>
                <p className="text-xs text-chocolate/50 capitalize">{order.status.replace(/_/g, " ")}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              {statusSteps.map((step, index) => {
                const currentIndex = getStatusIndex(order.status);
                const isActive = index <= currentIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? "bg-truffle text-white" : "bg-chocolate/10 text-chocolate/40"}`}>
                      <Icon size={20} />
                    </div>
                    <p className={`text-xs mt-2 text-center ${isActive ? "text-chocolate font-medium" : "text-chocolate/40"}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-chocolate/10 pt-4">
              <h3 className="font-semibold text-chocolate mb-2">Order Items</h3>
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm mb-1">
                  <span>{item.title} x{item.quantity}</span>
                  <span className="text-chocolate/60">QAR {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {order.customer.address && (
              <div className="border-t border-chocolate/10 pt-4 mt-4">
                <div className="flex items-start gap-2 text-sm text-chocolate/70">
                  <MapPin size={16} className="mt-0.5" />
                  <span>{order.customer.address}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <div className="text-center mt-8">
          <Link href="/" className="text-truffle hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
