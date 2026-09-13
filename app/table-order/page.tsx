"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useCart } from "@/app/cart-context";
import { useToast } from "@/app/toast-context";
import { useOrderHistory } from "@/app/order-history-context";
import { useTables } from "@/app/table-context";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus, CheckCircle2, Utensils } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { menuItems } from "@/app/menu-data";

function TableOrderContent() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("table");
  const { addToCart, cart, updateQuantity, clearCart, cartTotal } = useCart();
  const { showToast } = useToast();
  const { addOrder } = useOrderHistory();
  const { tables, updateTable } = useTables();
  const [ordered, setOrdered] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>({});

  const table = tables.find((t) => t.id === tableId);
  const categories = useMemo(() => ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))], []);
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      return matchesCategory;
    });
  }, [activeCategory]);

  const handleAdd = (item: typeof menuItems[0]) => {
    const qty = itemQuantities[item.id] || 1;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
      });
    }
    showToast(`${item.title} x${qty} added to cart`);
    setItemQuantities((prev) => ({ ...prev, [item.id]: 1 }));
  };

  const updateItemQuantity = (itemId: number, delta: number) => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta),
    }));
  };

  useEffect(() => {
    if (tableId && !table) {
      showToast("Invalid table. Please scan a valid QR code.");
    }
  }, [tableId, table, showToast]);

  const handleOrder = async () => {
    if (cart.length === 0) return;
    const order = addOrder({
      items: cart.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: cartTotal,
      discount: 0,
      total: cartTotal,
      customer: {
        name: customerName || "Guest",
        email: "guest@table",
        phone: customerPhone || "N/A",
        address: table ? `Table ${table.number}` : "Takeaway",
      },
      notes: orderNotes || undefined,
      orderType: table ? "dine-in" : "takeaway",
      tableId: tableId || undefined,
      paymentStatus: "pending",
    });

    if (tableId && table) {
      updateTable(tableId, { status: "occupied", orderId: order.id });
    }

    for (const item of cart) {
      try {
        await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "deduct", menuItemId: item.id, quantity: item.quantity }),
        });
      } catch (error) {
        console.error("Failed to deduct stock:", error);
      }
    }

    clearCart();
    setCustomerName("");
    setCustomerPhone("");
    setOrderNotes("");
    setOrdered(true);
  };

  if (ordered) {
    return (
      <div className="min-h-screen bg-vanilla/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center"
        >
          <CheckCircle2 className="text-green-500 mx-auto" size={64} />
          <h2 className="font-playfair text-3xl text-chocolate font-bold mt-4 mb-2">Order Placed!</h2>
          <p className="text-chocolate/70 mb-2">Your order has been sent to the kitchen.</p>
          {table && (
            <p className="text-chocolate/60 text-sm mb-6">Table {table.number} is now reserved for you.</p>
          )}
          <button
            onClick={() => setOrdered(false)}
            className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
          >
            Order More
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanilla/30">
      <div className="bg-truffle text-white py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-2xl font-bold">Table Ordering</h1>
            <p className="text-white/80 text-sm">
              {table ? `Table ${table.number} (${table.capacity} seats)` : "Scan the QR code at your table to order"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} />
            <span className="bg-white text-truffle text-xs font-bold px-2 py-1 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-chocolate/10 p-6 mb-8">
          <h2 className="font-playfair text-xl font-bold text-chocolate mb-4 flex items-center gap-2">
            <Utensils size={20} />
            Your Details
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-chocolate/60 mb-1">Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-chocolate/60 mb-1">Phone</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-chocolate/60 mb-1">Order Notes (Optional)</label>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="Any special requests..."
              rows={2}
              className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle resize-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5 border border-chocolate/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-chocolate/10"
            >
              <div className="aspect-square bg-vanilla/40 relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
                <div className="p-4">
                  <h3 className="font-semibold text-chocolate text-sm mb-1 line-clamp-2">{item.title}</h3>
                  <p className="text-chocolate/60 text-xs mb-2 line-clamp-1">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-truffle">QAR {item.price}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItemQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full border border-chocolate/20 flex items-center justify-center hover:bg-chocolate/5 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold text-chocolate text-sm">
                        {itemQuantities[item.id] || 1}
                      </span>
                      <button
                        onClick={() => updateItemQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full border border-chocolate/20 flex items-center justify-center hover:bg-chocolate/5 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => handleAdd(item)}
                        className="bg-truffle text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-chocolate transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
            </motion.div>
          ))}
        </div>

        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h2 className="font-playfair text-xl font-bold text-chocolate mb-4">Your Order</h2>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-vanilla/40">
                      <Image src={item.image} alt={item.title} width={48} height={48} className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-chocolate text-sm">{item.title}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-full hover:bg-chocolate/10 text-chocolate">
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-semibold text-chocolate">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-full hover:bg-chocolate/10 text-chocolate">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-truffle">QAR {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-chocolate/10 pt-4">
              <div>
                <p className="text-sm text-chocolate/60">Total</p>
                <p className="text-2xl font-bold text-chocolate">QAR {cartTotal.toFixed(2)}</p>
              </div>
              <button
                onClick={handleOrder}
                className="bg-truffle text-white px-8 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors flex items-center gap-2"
              >
                <ShoppingCart size={20} />
                Place Order
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function TableOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-vanilla/30 flex items-center justify-center"><p className="text-chocolate/60">Loading...</p></div>}>
      <TableOrderContent />
    </Suspense>
  );
}
