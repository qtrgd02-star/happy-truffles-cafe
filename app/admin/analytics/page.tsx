"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Package, Users, DollarSign, Calendar } from "lucide-react";

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topItems: { title: string; count: number; revenue: number }[];
  salesByHour: { hour: string; sales: number }[];
  salesByDay: { day: string; sales: number }[];
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (!res.ok) throw new Error("Failed to load analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      console.error("Failed to fetch analytics:", e);
      setError("Failed to load analytics. Please try again.");
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (!analytics) {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <p className="text-red-600">{error}</p>
          <button onClick={fetchAnalytics} className="bg-truffle text-white px-4 py-2 rounded-full font-semibold hover:bg-chocolate transition-colors">
            Retry
          </button>
        </div>
      );
    }
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const maxHourlySale = analytics.salesByHour.length > 0 ? Math.max(...analytics.salesByHour.map((h) => h.sales)) : 0;
  const maxDailySale = analytics.salesByDay.length > 0 ? Math.max(...analytics.salesByDay.map((d) => d.sales)) : 0;

  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-chocolate">Analytics</h1>
            <p className="text-chocolate/60 mt-1">Sales and performance insights</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-chocolate/20 rounded-lg px-4 py-2"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-truffle" size={24} />
              <span className="text-xs text-chocolate/60">Total</span>
            </div>
            <p className="text-3xl font-bold text-chocolate">QAR {analytics.totalSales.toFixed(2)}</p>
            <p className="text-sm text-chocolate/60 mt-1">Total Sales</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Package className="text-matcha" size={24} />
              <span className="text-xs text-chocolate/60">Count</span>
            </div>
            <p className="text-3xl font-bold text-chocolate">{analytics.totalOrders}</p>
            <p className="text-sm text-chocolate/60 mt-1">Total Orders</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-gold" size={24} />
              <span className="text-xs text-chocolate/60">Avg</span>
            </div>
            <p className="text-3xl font-bold text-chocolate">QAR {analytics.averageOrderValue.toFixed(2)}</p>
            <p className="text-sm text-chocolate/60 mt-1">Average Order</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-rose-500" size={24} />
              <span className="text-xs text-chocolate/60">Peak</span>
            </div>
            <p className="text-3xl font-bold text-chocolate">{analytics.salesByHour.length > 0 ? analytics.salesByHour.reduce((max, h) => h.sales > max.sales ? h : max).hour : "N/A"}</p>
            <p className="text-sm text-chocolate/60 mt-1">Peak Hour</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-chocolate mb-4">Top Selling Items</h3>
            <div className="space-y-3">
              {analytics.topItems.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-truffle/10 text-truffle text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="text-chocolate">{item.title}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-chocolate">{item.count} sold</p>
                    <p className="text-xs text-chocolate/60">QAR {item.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-chocolate mb-4">Sales by Hour</h3>
            <div className="flex items-end gap-1 h-32">
              {analytics.salesByHour.map((hour, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-truffle/20 rounded-t hover:bg-truffle/40 transition-colors"
                    style={{ height: maxHourlySale > 0 ? (hour.sales / maxHourlySale) * 100 + "%" : "0%" }}
                  />
                  <span className="text-[10px] text-chocolate/60 mt-1">{hour.hour}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-playfair text-xl font-bold text-chocolate mb-4">Sales by Day</h3>
          <div className="flex items-end gap-2 h-32">
            {analytics.salesByDay.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-truffle/20 rounded-t hover:bg-truffle/40 transition-colors"
                  style={{ height: maxDailySale > 0 ? (day.sales / maxDailySale) * 100 + "%" : "0%" }}
                />
                <span className="text-xs text-chocolate/60 mt-1">{day.day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}


