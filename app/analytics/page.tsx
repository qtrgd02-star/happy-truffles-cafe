"use client";
import { useState, useEffect } from "react";
import { useOrderHistory } from "@/app/order-history-context";
import { useReservations } from "@/app/reservation-context";
import { useReviews } from "@/app/reviews-context";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Calendar, ShoppingBag } from "lucide-react";

export default function AnalyticsPage() {
  const { orders } = useOrderHistory();
  const { reservations } = useReservations();
  const { reviews } = useReviews();
  const [pageViews, setPageViews] = useState(0);

  useEffect(() => {
    const count = parseInt(localStorage.getItem("pageViews") || "0", 10);
    setPageViews(count);
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const uniqueCustomers = new Set(orders.map((o) => o.customer.email)).size;
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-playfair text-4xl font-bold text-chocolate mb-8 text-center">Analytics Dashboard</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border p-6 border-blue-200">
              <p className="text-sm text-chocolate/60 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-chocolate">QAR {totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-chocolate/50 mt-1">{orders.length} orders</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border p-6 border-green-200">
              <p className="text-sm text-chocolate/60 mb-1">Avg Order Value</p>
              <p className="text-3xl font-bold text-chocolate">QAR {avgOrderValue.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border p-6 border-purple-200">
              <p className="text-sm text-chocolate/60 mb-1">Unique Customers</p>
              <p className="text-3xl font-bold text-chocolate">{uniqueCustomers}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border p-6 border-yellow-200">
              <p className="text-sm text-chocolate/60 mb-1">Avg Rating</p>
              <p className="text-3xl font-bold text-chocolate">{avgRating.toFixed(1)} / 5</p>
              <p className="text-xs text-chocolate/50 mt-1">{reviews.length} reviews</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-4 flex items-center gap-2"><BarChart3 size={24} /> Traffic Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-vanilla/20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-chocolate">{pageViews}</p>
                <p className="text-sm text-chocolate/60">Page Views</p>
              </div>
              <div className="bg-vanilla/20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-chocolate">{reservations.length}</p>
                <p className="text-sm text-chocolate/60">Reservations</p>
              </div>
              <div className="bg-vanilla/20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-chocolate">{orders.length}</p>
                <p className="text-sm text-chocolate/60">Orders</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
