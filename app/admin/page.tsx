"use client";

import { useState } from "react";
import { useOrderHistory, type OrderStatus } from "@/app/order-history-context";
import { useReservations } from "@/app/reservation-context";
import { useTables, type Table } from "@/app/table-context";
import { useAuth } from "@/app/auth-context";
import { useReviews } from "@/app/reviews-context";
import { sendNotification, requestNotificationPermissionAsync } from "@/app/notifications";
import { sendOrderStatusUpdateEmail } from "@/app/email-service";
import { sendOrderStatusUpdateSms } from "@/app/sms-service";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Calendar,
  Users,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  ChefHat,
  XCircle,
  Plus,
  Minus,
  Menu as MenuIcon,
  Settings,
  X,
  MessageSquare,
  Star,
} from "lucide-react";
import Link from "next/link";

type Tab = "orders" | "reservations" | "tables" | "menu" | "settings" | "analytics" | "reviews";

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Package }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  preparing: { label: "Preparing", color: "bg-blue-100 text-blue-800", icon: ChefHat },
  ready: { label: "Ready", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-800", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
};

function StatCard({ title, value, subtext, color }: { title: string; value: string | number; subtext?: string; color: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-6 ${color}`}>
      <p className="text-sm text-chocolate/60 mb-1">{title}</p>
      <p className="text-3xl font-bold text-chocolate">{value}</p>
      {subtext && <p className="text-xs text-chocolate/50 mt-1">{subtext}</p>}
    </div>
  );
}

export default function AdminPage() {
  const { hasRole, isAuthenticated } = useAuth();
  const { orders, updateOrderStatus, clearHistory } = useOrderHistory();
  const { reservations, clearReservations } = useReservations();
  const { tables, addTable, updateTable, removeTable, clearTables } = useTables();
  const { reviews, approveReview, rejectReview, deleteReview, refreshReviews } = useReviews();
  const [tab, setTab] = useState<Tab>("orders");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    const order = orders.find((o) => o.id === id);
    if (order) {
      await requestNotificationPermissionAsync();
      sendNotification(
        `Order ${id} Updated`,
        `Status: ${status}`,
        "/favicon.ico"
      );
      if (order.customer.email) {
        sendOrderStatusUpdateEmail(order, status);
      }
      if (order.customer.phone) {
        sendOrderStatusUpdateSms(order, status);
      }
    }
  };

  const [newTableNumber, setNewTableNumber] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState(4);

  if (!isAuthenticated || !hasRole("admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-4">Access Denied</h1>
          <p className="text-chocolate/60 mb-6">You need admin privileges to access this page.</p>
          <Link href="/login" className="inline-block bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const selected = selectedOrder ? orders.find((o) => o.id === selectedOrder) : null;

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="font-playfair text-4xl font-bold text-chocolate mb-8 text-center">Admin Dashboard</h1>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setTab("orders")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              tab === "orders" ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5"
            }`}
          >
            <Package size={18} className="inline mr-2" />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setTab("reservations")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              tab === "reservations" ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5"
            }`}
          >
            <Calendar size={18} className="inline mr-2" />
            Reservations ({reservations.length})
          </button>
          <button
            onClick={() => setTab("tables")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              tab === "tables" ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5"
            }`}
          >
            <Users size={18} className="inline mr-2" />
            Tables ({tables.length})
          </button>
          <button
            onClick={() => setTab("menu")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              tab === "menu" ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5"
            }`}
          >
            <MenuIcon size={18} className="inline mr-2" />
            Menu
          </button>
          <button
            onClick={() => setTab("settings")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              tab === "settings" ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5"
            }`}
          >
            <Settings size={18} className="inline mr-2" />
            Settings
          </button>
          <button
            onClick={() => setTab("analytics")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              tab === "analytics" ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5"
            }`}
          >
            <Package size={18} className="inline mr-2" />
            Analytics
          </button>
          <button
            onClick={() => {
              setTab("reviews");
              refreshReviews();
            }}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              tab === "reviews" ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5"
            }`}
          >
            <MessageSquare size={18} className="inline mr-2" />
            Reviews
          </button>
        </div>

        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <Package size={48} className="text-chocolate/20 mx-auto mb-4" />
                <p className="text-chocolate/60">No orders yet</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end">
                  <button
                    onClick={clearHistory}
                    className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Clear All Orders
                  </button>
                </div>
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-playfair text-xl font-bold text-chocolate">Order {order.id}</h3>
                          <p className="text-chocolate/60 text-sm">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-truffle text-xl">QAR {order.total.toFixed(2)}</p>
                          <p className="text-chocolate/60 text-sm">{order.customer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const StatusIcon = statusConfig[order.status].icon;
                            return (
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                                <StatusIcon size={12} />
                                {statusConfig[order.status].label}
                              </span>
                            );
                          })()}
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="text-xs border border-chocolate/20 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-truffle"
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setRefundOrderId(order.id);
                              setRefundAmount(order.total.toString());
                              setRefundReason("");
                            }}
                            className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            Void
                          </button>
                          <button
                            onClick={() => setSelectedOrder(order.id)}
                            className="text-truffle hover:underline text-sm font-medium flex items-center gap-1"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === "reservations" && (
          <div className="space-y-4">
            {reservations.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <Calendar size={48} className="text-chocolate/20 mx-auto mb-4" />
                <p className="text-chocolate/60">No reservations yet</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end">
                  <button
                    onClick={clearReservations}
                    className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Clear All Reservations
                  </button>
                </div>
                <div className="grid gap-4">
                  {reservations.map((res) => (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-playfair text-xl font-bold text-chocolate">Reservation {res.id}</h3>
                          <p className="text-chocolate/60 text-sm">
                            {res.date} at {res.time} for {res.guests} guest{res.guests !== 1 ? "s" : ""}
                          </p>
                          <p className="text-chocolate/80 text-sm mt-1">{res.name} | {res.phone} | {res.email}</p>
                          {res.notes && <p className="text-chocolate/60 text-sm mt-1 italic">Note: {res.notes}</p>}
                        </div>
                        <p className="text-chocolate/60 text-sm">
                          {new Date(res.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === "tables" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-2xl font-bold text-chocolate">Tables</h2>
              <button
                onClick={clearTables}
                className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
              >
                <Trash2 size={16} />
                Clear All Tables
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-chocolate mb-4">Add New Table</h3>
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="number"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  placeholder="Table Number"
                  className="border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle w-32"
                />
                <select
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                  className="border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} seats
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (!newTableNumber) return;
                    addTable({ number: Number(newTableNumber), capacity: newTableCapacity, status: "available" });
                    setNewTableNumber("");
                  }}
                  className="bg-truffle text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-chocolate transition-colors flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Table
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tables.map((table) => (
                <motion.div
                  key={table.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-white rounded-2xl shadow-sm border p-4 ${
                    table.status === "available" ? "border-green-200" :
                    table.status === "occupied" ? "border-red-200" :
                    "border-yellow-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-playfair text-lg font-bold text-chocolate">Table {table.number}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      table.status === "available" ? "bg-green-100 text-green-800" :
                      table.status === "occupied" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {table.status}
                    </span>
                  </div>
                  <p className="text-chocolate/60 text-sm mb-3">Capacity: {table.capacity} guests</p>
                  <div className="flex gap-2">
                    <select
                      value={table.status}
                      onChange={(e) => updateTable(table.id, { status: e.target.value as Table["status"] })}
                      className="flex-1 border border-chocolate/20 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-truffle"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="reserved">Reserved</option>
                    </select>
                    <button
                      onClick={() => removeTable(table.id)}
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "menu" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <MenuIcon size={48} className="text-chocolate/20 mx-auto mb-4" />
              <p className="text-chocolate/60 mb-4">Menu management has moved to a dedicated page.</p>
              <Link href="/admin/menu" className="inline-block bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors">
                Go to Menu Management
              </Link>
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <Settings size={48} className="text-chocolate/20 mx-auto mb-4" />
              <p className="text-chocolate/60 mb-4">Settings management has moved to a dedicated page.</p>
              <Link href="/admin/settings" className="inline-block bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors">
                Go to Settings
              </Link>
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Orders"
                value={orders.length}
                subtext={`${orders.filter((o) => o.status === "completed").length} completed`}
                color="border-blue-200"
              />
              <StatCard
                title="Total Revenue"
                value={`QAR ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`}
                subtext={`Avg: QAR ${orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(2) : "0.00"}`}
                color="border-green-200"
              />
              <StatCard
                title="Total Customers"
                value={new Set(orders.map((o) => o.customer.email)).size}
                subtext="Unique emails"
                color="border-purple-200"
              />
              <StatCard
                title="Avg Order Value"
                value={`QAR ${orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(2) : "0.00"}`}
                subtext="Per order"
                color="border-yellow-200"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="font-playfair text-xl font-bold text-chocolate mb-4">Order Status Breakdown</h2>
              <div className="grid grid-cols-5 gap-4">
                {(["pending", "preparing", "ready", "completed", "cancelled"] as OrderStatus[]).map((status) => {
                  const count = orders.filter((o) => o.status === status).length;
                  const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                  return (
                    <div key={status} className="text-center">
                      <div className="text-2xl font-bold text-chocolate">{count}</div>
                      <div className="text-xs text-chocolate/60 capitalize">{status}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${
                            status === "pending" ? "bg-yellow-400" :
                            status === "preparing" ? "bg-blue-400" :
                            status === "ready" ? "bg-green-400" :
                            status === "completed" ? "bg-gray-400" :
                            "bg-red-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="font-playfair text-xl font-bold text-chocolate mb-4">Top Selling Items</h2>
              {(() => {
                const itemCounts: Record<number, { title: string; count: number; revenue: number }> = {};
                orders.forEach((order) => {
                  order.items.forEach((item) => {
                    if (!itemCounts[item.id]) {
                      itemCounts[item.id] = { title: item.title, count: 0, revenue: 0 };
                    }
                    itemCounts[item.id].count += item.quantity;
                    itemCounts[item.id].revenue += item.price * item.quantity;
                  });
                });
                const sorted = Object.entries(itemCounts)
                  .sort((a, b) => b[1].count - a[1].count)
                  .slice(0, 5);
                if (sorted.length === 0) {
                  return <p className="text-chocolate/60">No sales data yet</p>;
                }
                return (
                  <div className="space-y-3">
                    {sorted.map(([id, data]) => (
                      <div key={id} className="flex items-center justify-between bg-vanilla/20 rounded-lg p-3">
                        <div>
                          <p className="font-medium text-chocolate">{data.title}</p>
                          <p className="text-xs text-chocolate/60">{data.count} sold</p>
                        </div>
                        <p className="font-bold text-truffle">QAR {data.revenue.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="font-playfair text-xl font-bold text-chocolate mb-4">Recent Orders</h2>
              <div className="space-y-2">
                {orders.slice(0, 10).map((order) => (
                  <div key={order.id} className="flex items-center justify-between bg-vanilla/20 rounded-lg p-3">
                    <div>
                      <p className="font-medium text-chocolate text-sm">Order {order.id}</p>
                      <p className="text-xs text-chocolate/60">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="font-bold text-truffle text-sm">QAR {order.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-2xl font-bold text-chocolate">Client Reviews</h2>
              <div className="flex items-center gap-2">
                <select
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value as typeof reviewFilter)}
                  className="border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                >
                  <option value="all">All Reviews</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={refreshReviews}
                  className="text-sm text-truffle hover:text-chocolate font-medium"
                >
                  Refresh
                </button>
              </div>
            </div>
            {reviews.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <MessageSquare size={48} className="text-chocolate/20 mx-auto mb-4" />
                <p className="text-chocolate/60">No reviews yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {reviews
                  .filter((r) => reviewFilter === "all" || r.status === reviewFilter)
                  .map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-chocolate">{review.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              review.status === "approved" ? "bg-green-100 text-green-800" :
                              review.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {review.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <p className="text-chocolate/80 text-sm mb-2">{review.text}</p>
                          <p className="text-chocolate/50 text-xs">
                            {new Date(review.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {review.status !== "approved" && (
                            <button
                              onClick={() => approveReview(review.id)}
                              className="text-green-600 hover:text-green-700 p-2"
                              title="Approve"
                            >
                              <CheckCircle2 size={20} />
                            </button>
                          )}
                          {review.status !== "rejected" && (
                            <button
                              onClick={() => rejectReview(review.id)}
                              className="text-yellow-600 hover:text-yellow-700 p-2"
                              title="Reject"
                            >
                              <Clock size={20} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteReview(review.id)}
                            className="text-red-500 hover:text-red-600 p-2"
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        )}

        <AnimatePresence>
          {selected && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-playfair text-2xl font-bold text-chocolate">Order {selected.id}</h2>
                  <button onClick={() => setSelectedOrder(null)} className="text-chocolate/60 hover:text-chocolate">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-chocolate/60">Customer</p>
                    <p className="font-semibold text-chocolate">{selected.customer.name}</p>
                    <p className="text-sm text-chocolate/70">{selected.customer.email} | {selected.customer.phone}</p>
                    <p className="text-sm text-chocolate/70">{selected.customer.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-chocolate/60 mb-2">Items</p>
                    <div className="space-y-2">
                      {selected.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-vanilla/20 rounded-lg p-2">
                          <div>
                            <p className="font-medium text-chocolate text-sm">{item.title}</p>
                            <p className="text-xs text-chocolate/60">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-truffle text-sm">QAR {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-chocolate/10 pt-3 space-y-1 text-sm">
                    <div className="flex justify-between text-chocolate/70">
                      <span>Subtotal</span>
                      <span>QAR {selected.subtotal.toFixed(2)}</span>
                    </div>
                    {selected.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount {selected.promoCode && `(${selected.promoCode})`}</span>
                        <span>- QAR {selected.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-chocolate font-bold text-base pt-1">
                      <span>Total</span>
                      <span>QAR {selected.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {refundOrderId && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setRefundOrderId(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-playfair text-2xl font-bold text-chocolate">Void / Refund Order</h2>
                  <button onClick={() => setRefundOrderId(null)} className="text-chocolate/60 hover:text-chocolate">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-chocolate mb-1">Refund Amount (QAR)</label>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-chocolate mb-1">Reason</label>
                    <textarea
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      placeholder="Reason for void/refund..."
                      rows={3}
                      className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setRefundOrderId(null)} className="flex-1 bg-chocolate/10 text-chocolate py-2 rounded-lg font-medium hover:bg-chocolate/20 transition-colors">
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (refundOrderId && refundReason) {
                          updateOrderStatus(refundOrderId, "cancelled");
                          setRefundOrderId(null);
                          setRefundReason("");
                          setRefundAmount("");
                        }
                      }}
                      disabled={!refundReason}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      Confirm Void
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
