"use client";

import { useState } from "react";
import { useOrderHistory, type OrderStatus } from "@/app/order-history-context";
import { useCart } from "@/app/cart-context";
import { useToast } from "@/app/toast-context";
import { useLoyalty } from "@/app/loyalty-context";
import { motion } from "framer-motion";
import { Package, Trash2, ChevronRight, ShoppingBag, RefreshCw, Star, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrdersPage() {
  const { orders, updateOrderStatus, clearHistory } = useOrderHistory();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { points } = useLoyalty();
  const [reorderMessage, setReorderMessage] = useState<string | null>(null);

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach((item) => {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
      });
    });
    showToast("Items added to cart");
    setReorderMessage(`Reorder from ${order.id} added to cart`);
    setTimeout(() => setReorderMessage(null), 3000);
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      updateOrderStatus(orderId, "cancelled");
      showToast("Order cancelled");
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <Package size={64} className="text-chocolate/20 mx-auto mb-4" />
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-2">No orders yet</h2>
            <p className="text-chocolate/60 mb-6">Your order history will appear here after your first purchase.</p>
            <div className="flex items-center justify-center gap-2 mb-6 text-truffle">
              <Star size={20} />
              <span className="font-bold text-lg">{points} Loyalty Points</span>
            </div>
            <Link
              href="/#menu"
              className="inline-block bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-chocolate">Order History</h1>
            <div className="flex items-center gap-2 mt-2 text-truffle">
              <Star size={20} />
              <span className="font-bold">{points} Loyalty Points</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const headers = ["Order ID", "Date", "Customer", "Email", "Phone", "Items", "Subtotal", "Discount", "Total", "Status", "Notes"];
                const rows = orders.map((o) => [
                  o.id,
                  new Date(o.createdAt).toLocaleString(),
                  o.customer.name,
                  o.customer.email,
                  o.customer.phone,
                  o.items.map((i) => `${i.title} x${i.quantity}`).join("; "),
                  o.subtotal.toFixed(2),
                  o.discount.toFixed(2),
                  o.total.toFixed(2),
                  o.status,
                  o.notes || "",
                ]);
                const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `order-history-${new Date().toISOString().split("T")[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-truffle hover:text-chocolate text-sm font-medium flex items-center gap-1"
            >
              <Package size={16} />
              Export CSV
            </button>
            <button
              onClick={clearHistory}
              className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
            >
              <Trash2 size={16} />
              Clear History
            </button>
          </div>
        </div>
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="p-6 border-b border-chocolate/10 flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-xl font-bold text-chocolate">Order {order.id}</h2>
                  <p className="text-chocolate/60 text-sm mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-1 ${
                    order.status === "completed" ? "bg-green-100 text-green-800" :
                    order.status === "cancelled" ? "bg-red-100 text-red-800" :
                    order.status === "preparing" ? "bg-blue-100 text-blue-800" :
                    order.status === "ready" ? "bg-purple-100 text-purple-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="font-bold text-truffle text-xl">QAR {order.total.toFixed(2)}</p>
                  <p className="text-chocolate/60 text-sm">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="p-6 flex justify-end gap-2">
                <button
                  onClick={() => handleReorder(order)}
                  className="inline-flex items-center gap-2 bg-truffle text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-chocolate transition-colors"
                >
                  <RefreshCw size={16} />
                  Reorder
                </button>
                {order.status === "pending" && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>
                )}
              </div>
              <div className="p-6 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-vanilla/40 flex-shrink-0">
                      <Image src={item.image} alt={item.title} width={48} height={48} className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-chocolate text-sm truncate">{item.title}</p>
                      <p className="text-chocolate/60 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-chocolate font-semibold text-sm">QAR {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  ))}
                {order.notes && (
                  <div className="bg-vanilla/30 rounded-lg p-3 mt-3">
                    <p className="text-xs text-chocolate/60 font-medium mb-1">Special Instructions</p>
                    <p className="text-sm text-chocolate/80 italic">{order.notes}</p>
                  </div>
                )}
                <div className="border-t border-chocolate/10 pt-3 mt-3 space-y-1 text-sm">
                  <div className="flex justify-between text-chocolate/70">
                    <span>Subtotal</span>
                    <span>QAR {order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount {order.promoCode && `(${order.promoCode})`}</span>
                      <span>- QAR {order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-chocolate font-bold text-base pt-1">
                    <span>Total</span>
                    <span>QAR {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/#menu"
            className="inline-flex items-center gap-2 bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
