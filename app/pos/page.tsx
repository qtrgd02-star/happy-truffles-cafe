"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderHistory, type OrderItem, type OrderType, type PaymentMethod, type PaymentStatus } from "@/app/order-history-context";
import { useTables } from "@/app/table-context";
import { useAuth } from "@/app/auth-context";
import { useShifts } from "@/app/shift-context";
import { useReservations, type Reservation } from "@/app/reservation-context";
import { useInventory } from "@/app/inventory-context";
import { sendOrderConfirmationEmail } from "@/app/email-service";
import { sendOrderConfirmationSms } from "@/app/sms-service";
import { menuItems } from "@/app/menu-data";
import { Plus, Minus, Trash2, ShoppingCart, Table as TableIcon, User, Phone, Mail, MapPin, FileText, CreditCard, Banknote, CheckCircle2, X, Search, Clock, Calendar, Users as UsersIcon, WifiOff, Wifi, RefreshCw } from "lucide-react";

const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))];

export default function POSPage() {
  const { hasRole, isAuthenticated } = useAuth();
  const { addOrder, updateOrderStatus } = useOrderHistory();
  const { tables, updateTable } = useTables();
  const { activeShift, startShift, endShift } = useShifts();
  const { reservations, addReservation, clearReservations } = useReservations();
  const { updateStock } = useInventory();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountReceived, setAmountReceived] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [printOrder, setPrintOrder] = useState<any>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [openingCash, setOpeningCash] = useState("");
  const [closingCash, setClosingCash] = useState("");
  const [modifierItem, setModifierItem] = useState<typeof menuItems[0] | null>(null);
  const [itemSize, setItemSize] = useState("");
  const [itemExtras, setItemExtras] = useState<string[]>([]);
  const [itemInstructions, setItemInstructions] = useState("");
  const [showKitchenTicket, setShowKitchenTicket] = useState(false);
  const [posView, setPosView] = useState<"menu" | "tables" | "reservations">("menu");
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInGuests, setWalkInGuests] = useState("2");
  const [reservationName, setReservationName] = useState("");
  const [reservationPhone, setReservationPhone] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [reservationGuests, setReservationGuests] = useState("2");
  const [reservationNotes, setReservationNotes] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced">("idle");

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const savedQueue = localStorage.getItem("offlineOrderQueue");
    if (savedQueue) {
      try {
        setOfflineQueue(JSON.parse(savedQueue));
      } catch (e) {
        console.error("Failed to parse offline queue", e);
      }
    }
  }, []);

  const syncOfflineOrders = useCallback(async () => {
    if (offlineQueue.length === 0 || !isOnline) return;
    setSyncStatus("syncing");
    const queue = [...offlineQueue];
    for (const order of queue) {
      try {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });
      } catch (e) {
        console.error("Failed to sync offline order:", e);
      }
    }
    setOfflineQueue([]);
    localStorage.removeItem("offlineOrderQueue");
    setSyncStatus("synced");
    setTimeout(() => setSyncStatus("idle"), 2000);
  }, [offlineQueue, isOnline]);

  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      syncOfflineOrders();
    }
  }, [isOnline, offlineQueue.length, syncOfflineOrders]);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const tax = useMemo(() => cartTotal * 0.0, [cartTotal]);
  const grandTotal = useMemo(() => cartTotal + tax, [cartTotal, tax]);
  const changeDue = useMemo(() => {
    if (paymentMethod !== "cash") return 0;
    const received = parseFloat(amountReceived) || 0;
    return Math.max(0, received - grandTotal);
  }, [amountReceived, grandTotal, paymentMethod]);

  const availableTables = tables.filter((t) => t.status === "available");
  const occupiedTables = tables.filter((t) => t.status === "occupied");
  const reservedTables = tables.filter((t) => t.status === "reserved");
  const activeReservations = reservations.filter((r) => {
    const reservationDate = new Date(r.date + "T" + r.time);
    const now = new Date();
    return reservationDate > now && reservationDate <= new Date(now.getTime() + 2 * 60 * 60 * 1000);
  });

  const addToCart = (item: typeof menuItems[0], modifiers?: { size?: string; extras?: string[]; specialInstructions?: string }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.modifiers?.size === modifiers?.size && i.modifiers?.specialInstructions === modifiers?.specialInstructions);
      if (existing) {
        return prev.map((i) => (i.id === item.id && i.modifiers?.size === modifiers?.size && i.modifiers?.specialInstructions === modifiers?.specialInstructions ? { ...i, quantity: i.quantity + 1 } : i));
      }
      const newItem: OrderItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: 1,
        image: item.image,
        modifiers: modifiers?.size || modifiers?.specialInstructions ? modifiers : undefined,
      };
      return [...prev, newItem];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)).filter((i) => i.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setOrderNotes("");
    setAmountReceived("");
  };

  const deductStock = async (items: OrderItem[]) => {
    for (const item of items) {
      try {
        await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "deduct", menuItemId: item.id, quantity: item.quantity }),
        });
      } catch (error) {
        console.error("Failed to deduct stock via API:", error);
      }
      try {
        await updateStock(item.id, item.quantity);
      } catch (error) {
        console.error("Failed to update local inventory state:", error);
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    if (orderType === "dine-in" && !selectedTableId) {
      alert("Please select a table for dine-in orders.");
      return;
    }

    const orderPayload = {
      items: cart,
      subtotal: cartTotal,
      discount: 0,
      total: grandTotal,
      customer: {
        name: customerName || "Walk-in",
        email: customerEmail || "walkin@local",
        phone: customerPhone || "N/A",
        address: customerAddress || (orderType === "delivery" ? "N/A" : "Dine-in"),
      },
      notes: orderNotes || undefined,
      orderType,
      tableId: orderType === "dine-in" ? selectedTableId : undefined,
      paymentMethod: paymentMethod as PaymentMethod,
      paymentStatus: "paid" as PaymentStatus,
      amountPaid: paymentMethod === "cash" ? parseFloat(amountReceived) || grandTotal : grandTotal,
      changeDue: paymentMethod === "cash" ? changeDue : 0,
      cashierName: isAuthenticated ? (hasRole("admin") ? "Admin" : "Staff") : "POS",
    };

    if (!isOnline) {
      const queueItem = { ...orderPayload, offline: true, queuedAt: new Date().toISOString() };
      const newQueue = [...offlineQueue, queueItem];
      setOfflineQueue(newQueue);
      localStorage.setItem("offlineOrderQueue", JSON.stringify(newQueue));
      const offlineOrder = { ...orderPayload, id: "#OFFLINE" + Date.now() } as any;
      setLastOrder(offlineOrder);
      setShowReceipt(true);
      setShowSuccess(true);
      clearCart();
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    const order = addOrder(orderPayload);

    if (orderType === "dine-in" && selectedTableId) {
      updateTable(selectedTableId, { status: "occupied", orderId: order.id });
    }

    deductStock(cart);

    if (customerEmail && customerEmail !== "walkin@local") {
      sendOrderConfirmationEmail(order);
    }
    if (customerPhone && customerPhone !== "N/A") {
      sendOrderConfirmationSms(order);
    }

    setLastOrder(order);
    setShowReceipt(true);
    setShowSuccess(true);
    clearCart();
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddReservation = () => {
    if (!reservationName || !reservationPhone || !reservationDate || !reservationTime) {
      alert("Please fill in all required reservation fields.");
      return;
    }

    addReservation({
      name: reservationName,
      email: "",
      phone: reservationPhone,
      date: reservationDate,
      time: reservationTime,
      guests: parseInt(reservationGuests) || 2,
      notes: reservationNotes || undefined,
    });

    setReservationName("");
    setReservationPhone("");
    setReservationDate("");
    setReservationTime("");
    setReservationGuests("2");
    setReservationNotes("");
    alert("Reservation added successfully!");
  };

  const handleWalkIn = () => {
    if (!walkInName || !walkInPhone) {
      alert("Please enter walk-in details.");
      return;
    }
    setCustomerName(walkInName);
    setCustomerPhone(walkInPhone);
    setOrderType("dine-in");
    setPosView("menu");
    alert(`Walk-in added for ${walkInGuests} guests. Please select a table.`);
  };

  if (!isAuthenticated || (!hasRole("staff") && !hasRole("admin"))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-4">Access Denied</h1>
          <p className="text-chocolate/60 mb-6">You need staff or admin privileges to access the POS.</p>
          <a href="/login" className="inline-block bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanilla/30">
      {showSuccess && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle2 size={20} />
          Order placed successfully!
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-playfair text-3xl font-bold text-chocolate">POS Terminal</h1>
              <p className="text-chocolate/60 text-sm mt-1">Take orders, manage tables, and handle reservations.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                {isOnline ? "Online" : "Offline"}
              </div>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-chocolate/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-truffle w-64"
                />
              </div>
            </div>
          </div>

          {activeShift ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span className="font-medium">Shift Active - {activeShift.cashierName}</span>
              </div>
              <button onClick={() => setShowShiftModal(true)} className="text-sm font-medium text-green-700 hover:text-green-800">
                End Shift
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span className="font-medium">No active shift</span>
              </div>
              <button onClick={() => setShowShiftModal(true)} className="text-sm font-medium text-yellow-700 hover:text-yellow-800">
                Start Shift
              </button>
            </div>
          )}

          {!isOnline && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WifiOff size={18} />
                <span className="font-medium">You are offline. Orders will be queued and synced when connection is restored.</span>
              </div>
              {offlineQueue.length > 0 && (
                <span className="text-xs font-medium bg-red-100 px-2 py-1 rounded-full">
                  {offlineQueue.length} queued
                </span>
              )}
            </div>
          )}

          {syncStatus === "syncing" && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="animate-spin" />
                <span className="font-medium">Syncing offline orders...</span>
              </div>
            </div>
          )}

          {syncStatus === "synced" && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span className="font-medium">Offline orders synced successfully!</span>
              </div>
            </div>
          )}

          {isOnline && offlineQueue.length > 0 && syncStatus === "idle" && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw size={18} />
                <span className="font-medium">You have {offlineQueue.length} offline orders ready to sync.</span>
              </div>
              <button onClick={syncOfflineOrders} className="text-sm font-medium text-yellow-700 hover:text-yellow-800 flex items-center gap-1">
                <RefreshCw size={14} />
                Sync Now
              </button>
            </div>
          )}

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setPosView("menu")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${posView === "menu" ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5 border border-chocolate/10"}`}
            >
              Menu
            </button>
            <button
              onClick={() => setPosView("tables")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${posView === "tables" ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5 border border-chocolate/10"}`}
            >
              Tables
            </button>
            <button
              onClick={() => setPosView("reservations")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${posView === "reservations" ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5 border border-chocolate/10"}`}
            >
              Reservations
            </button>
          </div>

          {posView === "menu" && (
            <>
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

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setModifierItem(item);
                      setItemSize("");
                      setItemExtras([]);
                      setItemInstructions("");
                    }}
                    className="bg-white rounded-xl shadow-sm border border-chocolate/10 p-3 text-left hover:shadow-md transition-all flex flex-col gap-2"
                  >
                    <div className="aspect-square bg-vanilla/30 rounded-lg flex items-center justify-center overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-chocolate text-sm line-clamp-2">{item.title}</p>
                      <p className="text-xs text-chocolate/50 line-clamp-1">{item.category}</p>
                    </div>
                    <p className="font-bold text-truffle">QAR {item.price.toFixed(2)}</p>
                  </motion.button>
                ))}
              </div>
            </>
          )}

          {posView === "tables" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="font-playfair text-xl font-bold text-chocolate mb-4">Walk-In</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-chocolate/60 mb-1">Name</label>
                    <input type="text" value={walkInName} onChange={(e) => setWalkInName(e.target.value)} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Customer name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-chocolate/60 mb-1">Phone</label>
                    <input type="tel" value={walkInPhone} onChange={(e) => setWalkInPhone(e.target.value)} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Phone number" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-chocolate/60 mb-1">Guests</label>
                    <select value={walkInGuests} onChange={(e) => setWalkInGuests(e.target.value)} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                        <option key={num} value={num}>
                          {num} guest{num !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button onClick={handleWalkIn} className="mt-4 bg-truffle text-white px-4 py-2 rounded-lg font-medium hover:bg-chocolate transition-colors">
                  Add Walk-In
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-chocolate mb-3">Available ({availableTables.length})</h3>
                  <div className="space-y-2">
                    {availableTables.map((table) => (
                      <div key={table.id} onClick={() => { setSelectedTableId(table.id); setOrderType("dine-in"); setPosView("menu"); }} className="bg-white rounded-lg p-4 border border-green-200 cursor-pointer hover:shadow-md transition-all">
                        <p className="font-semibold text-chocolate">Table {table.number}</p>
                        <p className="text-xs text-chocolate/60">{table.capacity} seats</p>
                      </div>
                    ))}
                    {availableTables.length === 0 && <p className="text-sm text-chocolate/60">No available tables</p>}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-chocolate mb-3">Occupied ({occupiedTables.length})</h3>
                  <div className="space-y-2">
                    {occupiedTables.map((table) => (
                      <div key={table.id} className="bg-white rounded-lg p-4 border border-red-200">
                        <p className="font-semibold text-chocolate">Table {table.number}</p>
                        <p className="text-xs text-chocolate/60">{table.capacity} seats</p>
                      </div>
                    ))}
                    {occupiedTables.length === 0 && <p className="text-sm text-chocolate/60">No occupied tables</p>}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-chocolate mb-3">Reserved ({reservedTables.length})</h3>
                  <div className="space-y-2">
                    {reservedTables.map((table) => (
                      <div key={table.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                        <p className="font-semibold text-chocolate">Table {table.number}</p>
                        <p className="text-xs text-chocolate/60">{table.capacity} seats</p>
                      </div>
                    ))}
                    {reservedTables.length === 0 && <p className="text-sm text-chocolate/60">No reserved tables</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {posView === "reservations" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="font-playfair text-xl font-bold text-chocolate mb-4">New Reservation</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-chocolate/60 mb-1">Name</label>
                    <input type="text" value={reservationName} onChange={(e) => setReservationName(e.target.value)} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Customer name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-chocolate/60 mb-1">Phone</label>
                    <input type="tel" value={reservationPhone} onChange={(e) => setReservationPhone(e.target.value)} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Phone number" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-chocolate/60 mb-1">Date</label>
                    <input type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-chocolate/60 mb-1">Time</label>
                    <input type="time" value={reservationTime} onChange={(e) => setReservationTime(e.target.value)} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-chocolate/60 mb-1">Guests</label>
                    <select value={reservationGuests} onChange={(e) => setReservationGuests(e.target.value)} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                        <option key={num} value={num}>
                          {num} guest{num !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-chocolate/60 mb-1">Notes</label>
                    <input type="text" value={reservationNotes} onChange={(e) => setReservationNotes(e.target.value)} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Special requests" />
                  </div>
                </div>
                <button onClick={handleAddReservation} className="mt-4 bg-truffle text-white px-4 py-2 rounded-lg font-medium hover:bg-chocolate transition-colors">
                  Add Reservation
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="font-playfair text-xl font-bold text-chocolate mb-4">Upcoming Reservations</h2>
                {activeReservations.length === 0 ? (
                  <p className="text-chocolate/60">No upcoming reservations.</p>
                ) : (
                  <div className="space-y-3">
                    {activeReservations.map((reservation) => (
                      <div key={reservation.id} className="flex items-center justify-between bg-vanilla/20 rounded-lg p-4">
                        <div>
                          <p className="font-medium text-chocolate">{reservation.name}</p>
                          <p className="text-sm text-chocolate/60">
                            {new Date(reservation.date).toLocaleDateString()} at {reservation.time} • {reservation.guests} guest{reservation.guests !== 1 ? "s" : ""}
                          </p>
                          <p className="text-xs text-chocolate/50">{reservation.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {posView === "menu" && (
            <>
              <AnimatePresence>
                {modifierItem && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-2xl shadow-xl border border-chocolate/10 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-playfair text-xl font-bold text-chocolate">Customize {modifierItem.title}</h3>
                      <button onClick={() => setModifierItem(null)} className="text-chocolate/60 hover:text-chocolate">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-chocolate mb-2">Size</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["Small", "Medium", "Large"].map((size) => (
                            <button key={size} onClick={() => setItemSize(size)} className={`py-2 rounded-lg text-sm font-medium transition-colors ${itemSize === size ? "bg-truffle text-white" : "bg-vanilla/20 text-chocolate hover:bg-chocolate/5 border border-chocolate/10"}`}>
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-chocolate mb-2">Extras</label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Extra Shot", "Whipped Cream", "Oat Milk", "Almond Milk", "Less Sugar", "No Ice"].map((extra) => (
                            <button key={extra} onClick={() => setItemExtras((prev) => prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra])} className={`py-2 rounded-lg text-sm font-medium transition-colors ${itemExtras.includes(extra) ? "bg-truffle text-white" : "bg-vanilla/20 text-chocolate hover:bg-chocolate/5 border border-chocolate/10"}`}>
                              {extra}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-chocolate mb-2">Special Instructions</label>
                      <textarea value={itemInstructions} onChange={(e) => setItemInstructions(e.target.value)} placeholder="Any special requests..." rows={2} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle resize-none" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => setModifierItem(null)} className="flex-1 bg-chocolate/10 text-chocolate py-2 rounded-lg font-medium hover:bg-chocolate/20 transition-colors">
                        Cancel
                      </button>
                      <button onClick={() => { addToCart(modifierItem, { size: itemSize || undefined, extras: itemExtras.length > 0 ? itemExtras : undefined, specialInstructions: itemInstructions || undefined }); setModifierItem(null); }} className="flex-1 bg-truffle text-white py-2 rounded-lg font-medium hover:bg-chocolate transition-colors">
                        Add to Order
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        <div className="w-full lg:w-[420px] bg-white border-t lg:border-t-0 lg:border-l border-chocolate/10 p-4 lg:p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-playfair text-xl font-bold text-chocolate flex items-center gap-2">
              <ShoppingCart size={20} />
              Current Order
            </h2>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-red-500 hover:text-red-600 text-sm font-medium">
                Clear
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-vanilla/20 rounded-lg p-3">
              <label className="block text-xs font-medium text-chocolate/60 mb-2">Order Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(["dine-in", "takeaway", "delivery"] as OrderType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      orderType === type ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5 border border-chocolate/10"
                    }`}
                  >
                    {type.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {orderType === "dine-in" && (
              <div className="bg-vanilla/20 rounded-lg p-3">
                <label className="block text-xs font-medium text-chocolate/60 mb-2">Select Table</label>
                <div className="relative">
                  <TableIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40" />
                  <select
                    value={selectedTableId}
                    onChange={(e) => setSelectedTableId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-chocolate/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                  >
                    <option value="">Select a table...</option>
                    {availableTables.map((table) => (
                      <option key={table.id} value={table.id}>
                        Table {table.number} (Capacity: {table.capacity})
                      </option>
                    ))}
                  </select>
                </div>
                {availableTables.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">No available tables. All tables are occupied or reserved.</p>
                )}
              </div>
            )}

            <div className="bg-vanilla/20 rounded-lg p-3 space-y-3">
              <label className="block text-xs font-medium text-chocolate/60">Customer Information</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40" />
                <input type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-chocolate/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
              </div>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40" />
                <input type="tel" placeholder="Phone Number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-chocolate/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
              </div>
              {(orderType === "delivery") && (
                <>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40" />
                    <input type="email" placeholder="Email Address" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-chocolate/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
                  </div>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40" />
                    <input type="text" placeholder="Delivery Address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-chocolate/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
                  </div>
                </>
              )}
            </div>

            <div className="bg-vanilla/20 rounded-lg p-3">
              <label className="block text-xs font-medium text-chocolate/60 mb-2">Order Notes (Optional)</label>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-3 text-chocolate/40" />
                <textarea placeholder="Any special instructions..." value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} rows={2} className="w-full pl-10 pr-4 py-2 border border-chocolate/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-truffle resize-none" />
              </div>
            </div>

            <div className="bg-vanilla/20 rounded-lg p-3">
              <label className="block text-xs font-medium text-chocolate/60 mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    paymentMethod === "cash" ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5 border border-chocolate/10"
                  }`}
                >
                  <Banknote size={16} />
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    paymentMethod === "card" ? "bg-truffle text-white" : "bg-white text-chocolate hover:bg-chocolate/5 border border-chocolate/10"
                  }`}
                >
                  <CreditCard size={16} />
                  Card
                </button>
              </div>
              {paymentMethod === "cash" && (
                <div className="mt-3 space-y-2">
                  <div className="relative">
                    <Banknote size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40" />
                    <input
                      type="number"
                      placeholder="Amount Received (QAR)"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-chocolate/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                    />
                  </div>
                  {parseFloat(amountReceived) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-chocolate/60">Change Due:</span>
                      <span className="font-bold text-green-600">QAR {changeDue.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-chocolate/10 pt-4 space-y-2">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart size={40} className="text-chocolate/20 mx-auto mb-2" />
                  <p className="text-chocolate/40 text-sm">Cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    <AnimatePresence>
                      {cart.map((item) => (
                        <motion.div key={item.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center justify-between bg-vanilla/10 rounded-lg p-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-chocolate truncate">{item.title}</p>
                            <p className="text-xs text-chocolate/60">QAR {item.price.toFixed(2)} each</p>
                            {(item.modifiers?.size || item.modifiers?.extras?.length || item.modifiers?.specialInstructions) && (
                              <div className="text-xs text-chocolate/50 mt-1">
                                {item.modifiers.size && <span>{item.modifiers.size}</span>}
                                {item.modifiers.size && item.modifiers.extras?.length && <span> • </span>}
                                {item.modifiers.extras?.map((extra) => (
                                  <span key={extra} className="mr-1">{extra}</span>
                                ))}
                                {item.modifiers.specialInstructions && <div className="italic mt-1">&ldquo;{item.modifiers.specialInstructions}&rdquo;</div>}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-full hover:bg-chocolate/10 text-chocolate">
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold text-chocolate w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-full hover:bg-chocolate/10 text-chocolate">
                              <Plus size={14} />
                            </button>
                            <button onClick={() => removeFromCart(item.id)} className="p-1 rounded-full hover:bg-red-50 text-red-500 ml-1">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-chocolate/10">
                    <div className="flex justify-between text-sm text-chocolate/70">
                      <span>Subtotal</span>
                      <span>QAR {cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-chocolate/70">
                      <span>Tax</span>
                      <span>QAR {tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-chocolate pt-2 border-t border-chocolate/10">
                      <span>Total</span>
                      <span>QAR {grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={cart.length === 0 || (orderType === "dine-in" && !selectedTableId)}
                    className="w-full bg-truffle text-white py-3 rounded-lg font-semibold hover:bg-chocolate transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                  >
                    <CheckCircle2 size={18} />
                    Place Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReceipt && lastOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReceipt(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-2xl font-bold text-chocolate">Order Receipt</h2>
                <button onClick={() => setShowReceipt(false)} className="text-chocolate/60 hover:text-chocolate">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-chocolate/60">Order ID</span>
                  <span className="font-mono font-bold text-chocolate">{lastOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-chocolate/60">Date</span>
                  <span className="text-chocolate">{new Date(lastOrder.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-chocolate/60">Type</span>
                  <span className="text-chocolate capitalize">{lastOrder.orderType?.replace("-", " ")}</span>
                </div>
                {lastOrder.tableId && (
                  <div className="flex justify-between">
                    <span className="text-chocolate/60">Table</span>
                    <span className="text-chocolate">Table {tables.find((t) => t.id === lastOrder.tableId)?.number || lastOrder.tableId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-chocolate/60">Payment</span>
                  <span className="text-chocolate capitalize">{lastOrder.paymentMethod || "N/A"}</span>
                </div>
                <div className="border-t border-chocolate/10 pt-3 space-y-2">
                  {lastOrder.items?.map((item: OrderItem) => (
                    <div key={item.id}>
                      <div className="flex justify-between">
                        <span className="text-chocolate/80">
                          {item.title} x{item.quantity}
                        </span>
                        <span className="text-chocolate">QAR {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      {(item.modifiers?.size || item.modifiers?.extras?.length || item.modifiers?.specialInstructions) && (
                        <div className="text-xs text-chocolate/50 mt-1 pl-1">
                          {item.modifiers.size && <div>Size: {item.modifiers.size}</div>}
                          {item.modifiers.extras?.length && <div>Extras: {item.modifiers.extras.join(", ")}</div>}
                          {item.modifiers.specialInstructions && <div className="italic">Note: {item.modifiers.specialInstructions}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="border-t border-chocolate/10 pt-3 space-y-1">
                  <div className="flex justify-between text-chocolate/70">
                    <span>Subtotal</span>
                    <span>QAR {lastOrder.subtotal?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-chocolate/70">
                    <span>Discount</span>
                    <span>QAR {lastOrder.discount?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between font-bold text-chocolate text-base pt-1 border-t border-chocolate/10">
                    <span>Total</span>
                    <span>QAR {lastOrder.total?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
                {lastOrder.amountPaid && (
                  <div className="flex justify-between text-sm text-chocolate/70">
                    <span>Amount Paid</span>
                    <span>QAR {lastOrder.amountPaid.toFixed(2)}</span>
                  </div>
                )}
                {lastOrder.changeDue && lastOrder.changeDue > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Change</span>
                    <span>QAR {lastOrder.changeDue.toFixed(2)}</span>
                  </div>
                )}
                {lastOrder.cashierName && (
                  <div className="flex justify-between text-sm text-chocolate/60">
                    <span>Cashier</span>
                    <span>{lastOrder.cashierName}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setShowReceipt(false)} className="flex-1 bg-chocolate/10 text-chocolate py-3 rounded-lg font-semibold hover:bg-chocolate/20 transition-colors">
                  Close
                </button>
                <button onClick={() => { setPrintOrder(lastOrder); setTimeout(() => { window.print(); setPrintOrder(null); }, 100); }} className="flex-1 bg-truffle text-white py-3 rounded-lg font-semibold hover:bg-chocolate transition-colors">
                  Print Receipt
                </button>
                <button onClick={() => setShowKitchenTicket(true)} className="flex-1 bg-chocolate text-white py-3 rounded-lg font-semibold hover:bg-chocolate/80 transition-colors">
                  Kitchen Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {printOrder && (
        <div className="print-receipt">
          <div className="text-center font-bold text-lg mb-2">Happy Truffles Cafe</div>
          <div className="text-center text-xs mb-2">Gold Plaza, Abu Hamour, Doha, Qatar</div>
          <div className="text-center text-xs mb-2">Tel: +974 3159 0002</div>
          <div className="border-t border-dashed border-black my-2" />
          <div className="flex justify-between text-xs">
            <span>Order:</span>
            <span className="font-bold">{printOrder.id}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Date:</span>
            <span>{new Date(printOrder.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Type:</span>
            <span className="capitalize">{(printOrder.orderType || "").replace("-", " ")}</span>
          </div>
          {printOrder.tableId && (
            <div className="flex justify-between text-xs">
              <span>Table:</span>
              <span>Table {tables.find((t) => t.id === printOrder.tableId)?.number || printOrder.tableId}</span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span>Payment:</span>
            <span className="capitalize">{printOrder.paymentMethod || "N/A"}</span>
          </div>
          <div className="border-t border-dashed border-black my-2" />
          {printOrder.items?.map((item: OrderItem) => (
            <div key={item.id} className="mb-2">
              <div className="flex justify-between text-xs">
                <span className="flex-1 pr-2">{item.title} x{item.quantity}</span>
                <span>QAR {(item.price * item.quantity).toFixed(2)}</span>
              </div>
              {(item.modifiers?.size || item.modifiers?.extras?.length || item.modifiers?.specialInstructions) && (
                <div className="text-xs text-gray-600 mt-1 pl-1">
                  {item.modifiers.size && <div>Size: {item.modifiers.size}</div>}
                  {item.modifiers.extras?.length && <div>Extras: {item.modifiers.extras.join(", ")}</div>}
                  {item.modifiers.specialInstructions && <div className="italic">Note: {item.modifiers.specialInstructions}</div>}
                </div>
              )}
            </div>
          ))}
          <div className="border-t border-dashed border-black my-2" />
          <div className="flex justify-between text-xs">
            <span>Subtotal</span>
            <span>QAR {(printOrder.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Discount</span>
            <span>QAR {(printOrder.discount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span>Total</span>
            <span>QAR {(printOrder.total || 0).toFixed(2)}</span>
          </div>
          {printOrder.amountPaid && (
            <div className="flex justify-between text-xs">
              <span>Paid</span>
              <span>QAR {printOrder.amountPaid.toFixed(2)}</span>
            </div>
          )}
          {printOrder.changeDue && printOrder.changeDue > 0 && (
            <div className="flex justify-between text-xs">
              <span>Change</span>
              <span>QAR {printOrder.changeDue.toFixed(2)}</span>
            </div>
          )}
          {printOrder.cashierName && (
            <div className="flex justify-between text-xs">
              <span>Cashier</span>
              <span>{printOrder.cashierName}</span>
            </div>
          )}
          <div className="border-t border-dashed border-black my-2" />
          <div className="text-center text-xs">Thank you for visiting!</div>
        </div>
      )}

      <AnimatePresence>
        {showKitchenTicket && lastOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowKitchenTicket(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-2xl font-bold text-chocolate">Kitchen Ticket</h2>
                <button onClick={() => setShowKitchenTicket(false)} className="text-chocolate/60 hover:text-chocolate">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-chocolate/60">Order ID</span>
                  <span className="font-mono font-bold text-chocolate">{lastOrder.id}</span>
                </div>
                {lastOrder.tableId && (
                  <div className="flex justify-between">
                    <span className="text-chocolate/60">Table</span>
                    <span className="text-chocolate font-bold">Table {tables.find((t) => t.id === lastOrder.tableId)?.number || lastOrder.tableId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-chocolate/60">Time</span>
                  <span className="text-chocolate">{new Date(lastOrder.createdAt).toLocaleTimeString()}</span>
                </div>
                {lastOrder.cashierName && (
                  <div className="flex justify-between">
                    <span className="text-chocolate/60">Cashier</span>
                    <span className="text-chocolate">{lastOrder.cashierName}</span>
                  </div>
                )}
                <div className="border-t border-chocolate/10 pt-3">
                  {lastOrder.items?.map((item: OrderItem) => (
                    <div key={item.id} className="mb-3 pb-3 border-b border-chocolate/5 last:border-0">
                      <div className="flex justify-between font-medium text-chocolate">
                        <span>{item.title}</span>
                        <span>x{item.quantity}</span>
                      </div>
                      {(item.modifiers?.size || item.modifiers?.extras?.length || item.modifiers?.specialInstructions) && (
                        <div className="text-xs text-chocolate/60 mt-1">
                          {item.modifiers.size && <div>Size: {item.modifiers.size}</div>}
                          {item.modifiers.extras?.length && <div>Extras: {item.modifiers.extras.join(", ")}</div>}
                          {item.modifiers.specialInstructions && <div className="italic font-medium text-red-600">NOTE: {item.modifiers.specialInstructions}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {lastOrder.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-yellow-800">Order Notes:</p>
                    <p className="text-sm text-yellow-700">{lastOrder.notes}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setShowKitchenTicket(false)} className="flex-1 bg-chocolate/10 text-chocolate py-3 rounded-lg font-semibold hover:bg-chocolate/20 transition-colors">
                  Close
                </button>
                <button onClick={() => window.print()} className="flex-1 bg-truffle text-white py-3 rounded-lg font-semibold hover:bg-chocolate transition-colors">
                  Print Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShiftModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowShiftModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-2xl font-bold text-chocolate">{activeShift ? "End Shift" : "Start Shift"}</h2>
                <button onClick={() => setShowShiftModal(false)} className="text-chocolate/60 hover:text-chocolate">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                {activeShift ? (
                  <>
                    <div className="bg-vanilla/20 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-chocolate/60">Cashier</span>
                        <span className="font-medium text-chocolate">{activeShift.cashierName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-chocolate/60">Started</span>
                        <span className="text-chocolate">{new Date(activeShift.startTime).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-chocolate/60">Opening Cash</span>
                        <span className="text-chocolate">QAR {activeShift.openingCash.toFixed(2)}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-chocolate mb-1">Closing Cash (QAR)</label>
                      <input type="number" value={closingCash} onChange={(e) => setClosingCash(e.target.value)} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Enter closing cash amount" />
                    </div>
                    <button onClick={() => { if (closingCash) { endShift(parseFloat(closingCash)); setClosingCash(""); setShowShiftModal(false); } }} disabled={!closingCash} className="w-full bg-truffle text-white py-3 rounded-lg font-semibold hover:bg-chocolate transition-colors disabled:opacity-50">
                      End Shift
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-chocolate mb-1">Cashier Name</label>
                      <input type="text" defaultValue={isAuthenticated ? (hasRole("admin") ? "Admin" : "Staff") : ""} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Enter your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-chocolate mb-1">Opening Cash (QAR)</label>
                      <input type="number" value={openingCash} onChange={(e) => setOpeningCash(e.target.value)} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" placeholder="Enter opening cash amount" />
                    </div>
                    <button onClick={() => { if (openingCash) { startShift("Cashier", parseFloat(openingCash)); setOpeningCash(""); setShowShiftModal(false); } }} disabled={!openingCash} className="w-full bg-truffle text-white py-3 rounded-lg font-semibold hover:bg-chocolate transition-colors disabled:opacity-50">
                      Start Shift
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
