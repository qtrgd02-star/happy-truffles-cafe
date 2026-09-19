"use client";

import { useState, useEffect } from "react";
import { useOrderHistory } from "@/app/order-history-context";
import { useTables } from "@/app/table-context";
import { motion } from "framer-motion";
import { Clock, ChefHat, CheckCircle2 } from "lucide-react";
import { menuItems } from "@/app/menu-data";
import Image from "next/image";

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  preparing: { label: "Preparing", color: "bg-blue-100 text-blue-800", icon: ChefHat },
  ready: { label: "Ready", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-800", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: Clock },
};

export default function OrderStatusBoard() {
  const { orders } = useOrderHistory();
  const { tables } = useTables();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeOrders = orders.filter((order) => order.orderType === "dine-in" && order.status !== "completed" && order.status !== "cancelled");
  const recentCompleted = orders.filter((order) => order.orderType === "dine-in" && order.status === "completed").slice(0, 10);

  const getTableNumber = (tableId?: string) => {
    if (!tableId) return "Takeaway";
    const table = tables.find((t) => t.id === tableId);
    return table ? `Table ${table.number}` : tableId;
  };

  return (
    <div className="min-h-screen bg-vanilla/30 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-chocolate">{showMenu ? "Digital Menu Board" : "Order Status"}</h1>
            <p className="text-chocolate/60 mt-1">Happy Truffles Cafe - {showMenu ? "Live Menu" : "Live Order Board"}</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowMenu(!showMenu)} className="bg-truffle text-white px-4 py-2 rounded-full font-medium hover:bg-chocolate transition-colors">
              {showMenu ? "Show Orders" : "Show Menu"}
            </button>
            <div className="text-right">
              <p className="text-2xl font-bold text-chocolate">{currentTime.toLocaleTimeString()}</p>
              <p className="text-sm text-chocolate/60">{currentTime.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {showMenu ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.slice(0, 12).map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="aspect-square bg-vanilla/40">
                  <Image src={item.image} alt={item.title} width={400} height={400} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-playfair text-lg font-bold text-chocolate">{item.title}</h3>
                  <p className="text-truffle font-bold text-xl mt-1">QAR {item.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${order.status === "ready" ? "border-green-400" : "border-chocolate/10"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-playfair text-2xl font-bold text-chocolate">{getTableNumber(order.tableId)}</h3>
                      <p className="text-sm text-chocolate/60">Order {order.id}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status].color}`}>
                      <StatusIcon size={16} />
                      {statusConfig[order.status].label}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-vanilla/20 rounded-lg p-3">
                        <div>
                          <p className="font-medium text-chocolate">{item.title}</p>
                          <p className="text-xs text-chocolate/60">x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-xs text-yellow-800">{order.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-chocolate/60">
                    <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                    {order.cashierName && <span>{order.cashierName}</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {activeOrders.length === 0 && !showMenu && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <CheckCircle2 className="text-green-500 mx-auto mb-4" size={64} />
            <h2 className="font-playfair text-3xl text-chocolate font-bold mb-2">All Caught Up!</h2>
            <p className="text-chocolate/60">No active orders at the moment.</p>
          </div>
        )}

        {recentCompleted.length > 0 && !showMenu && (
          <div className="mt-12">
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-6">Recently Completed</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentCompleted.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-chocolate/10 p-4 opacity-75">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-chocolate">{getTableNumber(order.tableId)}</h3>
                    <span className="text-xs text-chocolate/50">Order {order.id}</span>
                  </div>
                  <p className="text-sm text-chocolate/60">{order.items.length} items</p>
                  <p className="text-xs text-chocolate/50 mt-1">{new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
