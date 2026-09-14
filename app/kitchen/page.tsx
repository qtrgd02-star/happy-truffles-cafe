"use client";
import { useState, useEffect } from "react";
import { useOrderHistory, type OrderStatus } from "@/app/order-history-context";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Clock, CheckCircle, XCircle } from "lucide-react";

export default function KitchenPage() {
  const { orders, updateOrderStatus } = useOrderHistory();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setLastRefresh(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = filter === "all" ? orders.filter((o) => o.status !== "cancelled" && o.status !== "completed") : orders.filter((o) => o.status === filter);

  const statusOrder: OrderStatus[] = ["pending", "preparing", "ready", "completed", "cancelled"];

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold mb-1">Kitchen Display</h1>
            <p className="text-slate-400 text-sm">Last updated: {lastRefresh.toLocaleTimeString()}</p>
          </div>
          <div className="flex gap-2">
            {(["all", "pending", "preparing", "ready"] as const).map((status) => (
              <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === status ? "bg-truffle text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`bg-slate-800 rounded-2xl p-6 border-l-4 ${order.status === "pending" ? "border-yellow-400" : order.status === "preparing" ? "border-blue-400" : order.status === "ready" ? "border-green-400" : "border-slate-600"}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-playfair text-xl font-bold">Order {order.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "pending" ? "bg-yellow-100 text-yellow-800" : order.status === "preparing" ? "bg-blue-100 text-blue-800" : order.status === "ready" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{order.status}</span>
                </div>
                <p className="text-slate-400 text-sm mb-4">{order.customer.name} | {order.orderType}</p>
                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{item.title}</p>
                        {item.notes && <p className="text-xs text-yellow-400 mt-1">Note: {item.notes}</p>}
                        {item.modifiers?.specialInstructions && <p className="text-xs text-blue-400 mt-1">{item.modifiers.specialInstructions}</p>}
                      </div>
                      <span className="text-truffle font-bold">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {order.status !== "completed" && order.status !== "cancelled" && (
                    <>
                      {order.status === "pending" && (
                        <button onClick={() => updateOrderStatus(order.id, "preparing")} className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"><ChefHat size={16} /> Start Preparing</button>
                      )}
                      {order.status === "preparing" && (
                        <button onClick={() => updateOrderStatus(order.id, "ready")} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1"><CheckCircle size={16} /> Mark Ready</button>
                      )}
                      {order.status === "ready" && (
                        <button onClick={() => updateOrderStatus(order.id, "completed")} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1"><CheckCircle size={16} /> Complete</button>
                      )}
                    </>
                  )}
                  {order.status !== "cancelled" && order.status !== "completed" && (
                    <button onClick={() => updateOrderStatus(order.id, "cancelled")} className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"><XCircle size={16} /></button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-20">
            <ChefHat size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No orders in the kitchen</p>
          </div>
        )}
      </div>
    </div>
  );
}
