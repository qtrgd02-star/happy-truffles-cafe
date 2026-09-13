"use client";

import { useOrderHistory, type OrderStatus } from "@/app/order-history-context";
import { useAuth } from "@/app/auth-context";
import { sendNotification, requestNotificationPermissionAsync } from "@/app/notifications";
import { motion } from "framer-motion";
import { Clock, ChefHat, CheckCircle2, Package, Lock } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Package }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  preparing: { label: "Preparing", color: "bg-blue-100 text-blue-800", icon: ChefHat },
  ready: { label: "Ready", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-800", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: Package },
};

export default function KitchenDisplayPage() {
  const { orders, updateOrderStatus } = useOrderHistory();
  const { hasRole, isAuthenticated } = useAuth();
  const activeOrders = orders.filter((o) => o.status === "pending" || o.status === "preparing");

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    const order = orders.find((o) => o.id === id);
    if (order) {
      await requestNotificationPermissionAsync();
      sendNotification(
        `Order ${id} Updated`,
        `Status: ${status}`,
        "/favicon.ico"
      );
    }
  };

  if (!isAuthenticated || (!hasRole("admin") && !hasRole("staff"))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-sm p-12 max-w-md text-center">
          <Lock size={64} className="text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need staff or admin privileges to access the kitchen display.</p>
          <Link href="/login" className="inline-block bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Kitchen Display</h1>
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
              <span className="font-bold">{orders.filter((o) => o.status === "pending").length}</span> Pending
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              <span className="font-bold">{orders.filter((o) => o.status === "preparing").length}</span> Preparing
            </div>
          </div>
        </div>

        {activeOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Package size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl">No active orders</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 ${
                    order.status === "pending" ? "border-yellow-400" : "border-blue-400"
                  }`}
                >
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Order {order.id}</h2>
                        <p className="text-gray-600 text-sm mt-1">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status].color}`}>
                        <StatusIcon size={16} />
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer</h3>
                      <p className="text-lg font-medium text-gray-800">{order.customer.name}</p>
                      <p className="text-gray-600">{order.customer.phone}</p>
                      {order.customer.address && (
                        <p className="text-gray-500 text-sm mt-1">{order.customer.address}</p>
                      )}
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <span className="bg-truffle text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                                {item.quantity}
                              </span>
                              <span className="font-medium text-gray-800">{item.title}</span>
                            </div>
                            {item.notes && (
                              <p className="text-xs text-gray-500 italic ml-2">Note: {item.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {order.notes && (
                      <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <h3 className="text-sm font-semibold text-yellow-800 mb-1">Special Instructions</h3>
                        <p className="text-yellow-700 text-sm">{order.notes}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "preparing")}
                          className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <ChefHat size={18} />
                          Start Preparing
                        </button>
                      )}
                      {order.status === "preparing" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "ready")}
                          className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={18} />
                          Mark Ready
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
