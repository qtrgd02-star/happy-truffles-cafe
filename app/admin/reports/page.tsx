"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useOrderHistory, type Order, type OrderStatus } from "@/app/order-history-context";
import { useShifts } from "@/app/shift-context";
import { useAuth } from "@/app/auth-context";
import { Package, DollarSign, Users, TrendingUp, Clock, CreditCard, Banknote, XCircle, FileText, Download } from "lucide-react";
import { exportOrdersToCsv } from "@/app/lib/export";

type ReportPeriod = "today" | "week" | "month" | "all";

export default function AdminReportsPage() {
  const { hasRole, isAuthenticated } = useAuth();
  const { orders } = useOrderHistory();
  const { shifts, getShiftSummary } = useShifts();
  const [period, setPeriod] = useState<ReportPeriod>("today");
  const [loading, setLoading] = useState(true);

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay.getTime() - startOfDay.getDay() * 86400000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (period === "today") return orderDate >= startOfDay;
      if (period === "week") return orderDate >= startOfWeek;
      if (period === "month") return orderDate >= startOfMonth;
      return true;
    });
  }, [orders, period]);

  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const completedOrders = filteredOrders.filter((o) => o.status === "completed");
    const cancelledOrders = filteredOrders.filter((o) => o.status === "cancelled");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const totalRefunded = cancelledOrders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    const cashOrders = completedOrders.filter((o) => o.paymentMethod === "cash");
    const cardOrders = completedOrders.filter((o) => o.paymentMethod === "card");
    const cashTotal = cashOrders.reduce((sum, o) => sum + o.total, 0);
    const cardTotal = cardOrders.reduce((sum, o) => sum + o.total, 0);

    const itemCounts: Record<number, { title: string; count: number; revenue: number }> = {};
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemCounts[item.id]) {
          itemCounts[item.id] = { title: item.title, count: 0, revenue: 0 };
        }
        itemCounts[item.id].count += item.quantity;
        itemCounts[item.id].revenue += item.price * item.quantity;
      });
    });
    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10);

    return {
      totalOrders,
      completedCount: completedOrders.length,
      cancelledCount: cancelledOrders.length,
      totalRevenue,
      totalRefunded,
      netRevenue: totalRevenue - totalRefunded,
      avgOrderValue,
      cashOrders: cashOrders.length,
      cardOrders: cardOrders.length,
      cashTotal,
      cardTotal,
      topItems,
    };
  }, [filteredOrders]);

  const shiftSummaries = useMemo(() => {
    return shifts.map((shift) => {
      const summary = getShiftSummary(shift.id);
      return {
        id: shift.id,
        cashier: shift.cashierName,
        startTime: shift.startTime,
        endTime: shift.endTime,
        openingCash: shift.openingCash,
        closingCash: shift.closingCash,
        expectedCash: shift.expectedCash,
        ...summary,
      };
    });
  }, [shifts, getShiftSummary]);

  useEffect(() => {
    setLoading(false);
  }, [orders, shifts]);

  if (!isAuthenticated || !hasRole("admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-4">Access Denied</h1>
          <p className="text-chocolate/60 mb-6">You need admin privileges to access reports.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-vanilla/30 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-10 bg-vanilla/30 rounded animate-pulse w-48 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="h-4 bg-vanilla/30 rounded animate-pulse w-1/2 mb-2" />
                <div className="h-8 bg-vanilla/30 rounded animate-pulse w-1/3" />
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="h-6 bg-vanilla/30 rounded animate-pulse w-1/3 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-16 bg-vanilla/20 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="h-6 bg-vanilla/30 rounded animate-pulse w-1/4 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-vanilla/20 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !hasRole("admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-4">Access Denied</h1>
          <p className="text-chocolate/60 mb-6">You need admin privileges to access reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-chocolate">Reports</h1>
            <p className="text-chocolate/60 mt-1">Sales, payments, and shift summaries</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
              className="border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={() => exportOrdersToCsv(filteredOrders)}
              className="flex items-center gap-2 bg-truffle text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-chocolate transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border p-6 border-blue-200">
            <p className="text-sm text-chocolate/60 mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-chocolate">{stats.totalOrders}</p>
            <p className="text-xs text-chocolate/50 mt-1">{stats.completedCount} completed</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-6 border-green-200">
            <p className="text-sm text-chocolate/60 mb-1">Net Revenue</p>
            <p className="text-3xl font-bold text-chocolate">QAR {stats.netRevenue.toFixed(2)}</p>
            <p className="text-xs text-chocolate/50 mt-1">{stats.totalRefunded > 0 && `- QAR ${stats.totalRefunded.toFixed(2)} refunded`}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-6 border-purple-200">
            <p className="text-sm text-chocolate/60 mb-1">Avg Order Value</p>
            <p className="text-3xl font-bold text-chocolate">QAR {stats.avgOrderValue.toFixed(2)}</p>
            <p className="text-xs text-chocolate/50 mt-1">Per completed order</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-6 border-yellow-200">
            <p className="text-sm text-chocolate/60 mb-1">Cancelled</p>
            <p className="text-3xl font-bold text-chocolate">{stats.cancelledCount}</p>
            <p className="text-xs text-chocolate/50 mt-1">Voided orders</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="font-playfair text-xl font-bold text-chocolate mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              Payment Breakdown
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-vanilla/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Banknote size={18} className="text-green-600" />
                  <span className="font-medium text-chocolate">Cash</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-chocolate">QAR {stats.cashTotal.toFixed(2)}</p>
                  <p className="text-xs text-chocolate/60">{stats.cashOrders} orders</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-vanilla/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-blue-600" />
                  <span className="font-medium text-chocolate">Card</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-chocolate">QAR {stats.cardTotal.toFixed(2)}</p>
                  <p className="text-xs text-chocolate/60">{stats.cardOrders} orders</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="font-playfair text-xl font-bold text-chocolate mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Top Selling Items
            </h2>
            {stats.topItems.length === 0 ? (
              <p className="text-chocolate/60">No sales data yet</p>
            ) : (
              <div className="space-y-2">
                {stats.topItems.map(([id, data]) => (
                  <div key={id} className="flex items-center justify-between bg-vanilla/20 rounded-lg p-3">
                    <div>
                      <p className="font-medium text-chocolate text-sm">{data.title}</p>
                      <p className="text-xs text-chocolate/60">{data.count} sold</p>
                    </div>
                    <p className="font-bold text-truffle">QAR {data.revenue.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="font-playfair text-xl font-bold text-chocolate mb-4 flex items-center gap-2">
            <FileText size={20} />
            Shift Summaries
          </h2>
          {shiftSummaries.length === 0 ? (
            <p className="text-chocolate/60">No shifts recorded yet</p>
          ) : (
            <div className="space-y-3">
              {shiftSummaries.map((shift) => (
                <div key={shift.id} className="flex items-center justify-between bg-vanilla/20 rounded-lg p-4">
                  <div>
                    <p className="font-medium text-chocolate">{shift.cashier}</p>
                    <p className="text-xs text-chocolate/60">
                      {new Date(shift.startTime).toLocaleString()} - {shift.endTime ? new Date(shift.endTime).toLocaleString() : "Active"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-chocolate">QAR {(shift.openingCash + (shift.netCash || 0)).toFixed(2)}</p>
                    <p className="text-xs text-chocolate/60">
                      {shift.closingCash !== undefined ? `Closed: QAR ${shift.closingCash.toFixed(2)}` : "Open"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
