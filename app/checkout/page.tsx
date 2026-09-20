"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/cart-context";
import { usePromos } from "@/app/promo-context";
import { useOrderHistory, type OrderType, type PaymentStatus } from "@/app/order-history-context";
import { useLoyalty } from "@/app/loyalty-context";
import { useGiftCards } from "@/app/gift-card-context";
import { useToast } from "@/app/toast-context";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, CheckCircle, X, User, Mail, Phone, MapPin, MessageSquare, Ticket, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, updateQuantity } = useCart();
  const { appliedPromo, getDiscount, removePromo } = usePromos();
  const { addOrder } = useOrderHistory();
  const { addPoints } = useLoyalty();
  const { giftCards, applyGiftCard } = useGiftCards();
  const { showToast } = useToast();
  const router = useRouter();
  const { user, saveProfile } = useAuth();

  // Auto-fill checkout form when logged-in user loads
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        notes: prev.notes,
      }));
    }
  }, [user]);

  // Save user profile (phone + address) for next visits
    const handleSaveProfileAfterOrder = async (phone: string, address: string) => {
    if (user && (phone || address)) await saveProfile(phone, address);
  };

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; address?: string; notes?: string }>({});
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardMessage, setGiftCardMessage] = useState<{ type: "success" | "error"; text: string; balance?: number } | null>(null);
  const [appliedGiftCard, setAppliedGiftCard] = useState<{ code: string; balance: number } | null>(null);

  const discount = getDiscount(cartTotal);
  const giftCardDeduction = appliedGiftCard ? Math.min(appliedGiftCard.balance, cartTotal - discount) : 0;
  const finalTotal = cartTotal - discount - giftCardDeduction;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyGiftCard = () => {
    if (!giftCardCode.trim()) return;
    const result = applyGiftCard(giftCardCode.trim());
    if (result.success) {
      setAppliedGiftCard({ code: giftCardCode.trim().toUpperCase(), balance: result.balance });
      setGiftCardMessage({ type: "success", text: result.message, balance: result.balance });
      setGiftCardCode("");
    } else {
      setGiftCardMessage({ type: "error", text: result.message });
    }
  };

  const handleRemoveGiftCard = () => {
    setAppliedGiftCard(null);
    setGiftCardMessage(null);
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const newErrors: { name?: string; email?: string; phone?: string; address?: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d+$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Phone must contain only digits";
    }
    if (!form.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    const id = "#" + Math.floor(100000 + Math.random() * 900000).toString();
    const order: any = {
      items: cart.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: cartTotal,
      discount,
      total: finalTotal,
      customer: { ...form },
      notes: form.notes || undefined,
      orderType: "delivery" as OrderType,
      paymentStatus: "paid" as PaymentStatus,
    };
    if (appliedPromo?.code) order.promoCode = appliedPromo.code;
    if (appliedGiftCard?.code) order.giftCardCode = appliedGiftCard.code;
    if (giftCardDeduction > 0) order.giftCardDeduction = giftCardDeduction;
    const created = addOrder(order);
    const earnedPoints = Math.floor(finalTotal);
    addPoints(form.phone, finalTotal);
    setOrderId(created.id);

    let stockFailed = false;
    for (const item of cart) {
      try {
        const stockRes = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "deduct", menuItemId: item.id, quantity: item.quantity }),
        });
        if (!stockRes.ok) {
          stockFailed = true;
        }
      } catch (error) {
        console.error("Failed to deduct stock:", error);
        stockFailed = true;
      }
    }

    if (stockFailed) {
      showToast("Order placed, but stock update had issues. Please check inventory.");
    }

    setOrderPlaced(true);
    await handleSaveProfileAfterOrder(form.phone, form.address);
    removePromo();
    clearCart();
  };

  const goHome = () => {
    router.push("/#menu");
  };

  // Calculate loyalty points using the same 5% rule defined in LoyaltyContext.
  const earnedPoints = Math.floor(finalTotal * 0.05);

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center"
        >
          <CheckCircle className="text-truffle mx-auto" size={64} />
          <h2 className="font-playfair text-3xl text-chocolate font-bold mt-4 mb-2">
            Thank you for your order!
          </h2>
          <p className="text-chocolate/70 mb-2">
            Your order {orderId} has been placed successfully.
          </p>
          <p className="text-truffle font-semibold mb-6">
            You earned {earnedPoints} loyalty points!
          </p>
          <button
            onClick={goHome}
            className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="font-playfair text-4xl text-chocolate font-bold mb-6 text-center">
          Checkout
        </h1>
        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-chocolate/60 mb-4">Your cart is empty.</p>
            <Link
              href="/#menu"
              className="inline-block bg-truffle text-white px-6 py-2 rounded-full font-medium hover:bg-chocolate transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Cart Summary */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-playfair text-2xl text-chocolate font-bold">
                  Order Summary
                </h2>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>
              <div className="space-y-4">
{cart.map((item) => (
                   <div
                     key={item.id}
                     className="flex items-center gap-4 bg-vanilla/20 rounded-2xl p-3"
                   >
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-vanilla/40 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                     <div className="flex-1">
                       <p className="font-semibold text-chocolate truncate">
                         {item.title}
                       </p>
                     </div>
                     <div className="flex items-center gap-2 text-truffle font-bold">
                       <button
                         onClick={() => updateQuantity(item.id, item.quantity - 1)}
                         className="text-chocolate/40 hover:text-truffle"
                       >
                         −
                       </button>
                       <span className="w-8 text-center">{item.quantity}</span>
                       <button
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="text-chocolate/40 hover:text-truffle"
                       >
                         +
                       </button>
                     </div>
                     <p className="text-chocolate/60 text-xs mt-1">
                       Subtotal: QAR {(item.price * item.quantity).toFixed(2)}
                     </p>
                   </div>
                  ))}
                {appliedPromo && (
                  <div className="flex justify-between items-center text-green-600 text-sm">
                    <span>Discount ({appliedPromo.code})</span>
                    <span className="font-semibold">- QAR {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="font-medium text-chocolate">Total</span>
                  <span className="font-bold text-truffle text-xl">QAR {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Details Form */}
            <div>
              <h2 className="font-playfair text-2xl text-chocolate font-bold mb-4">
                Your Details
              </h2>
              <form onSubmit={placeOrder} className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="text-chocolate" size={20} />
                  <div className="flex-1">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                      className="w-full border border-chocolate/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="text-chocolate" size={20} />
                  <div className="flex-1">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      required
                      className="w-full border border-chocolate/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-chocolate" size={20} />
                  <div className="flex-1">
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      required
                      className="w-full border border-chocolate/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-chocolate" size={20} />
                  <div className="flex-1">
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Delivery Address"
                      required
                      className="w-full border border-chocolate/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="text-chocolate" size={20} />
                  <div className="flex-1">
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Special instructions or notes (optional)"
                      rows={3}
                      className="w-full border border-chocolate/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle resize-none"
                    />
                  </div>
                </div>
                <div className="border-t border-chocolate/10 pt-4">
                  <h3 className="font-semibold text-chocolate mb-2 flex items-center gap-2">
                    <Ticket className="text-truffle" size={18} />
                    Gift Card
                  </h3>
                  {!appliedGiftCard ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={giftCardCode}
                        onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                        placeholder="Enter gift card code"
                        className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle uppercase"
                      />
                      <button
                        onClick={handleApplyGiftCard}
                        className="bg-truffle text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-chocolate transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-sm font-semibold text-green-800">{appliedGiftCard.code}</p>
                        <p className="text-xs text-green-600">Balance: QAR {appliedGiftCard.balance.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={handleRemoveGiftCard}
                        className="text-green-600 hover:text-green-800"
                        aria-label="Remove gift card"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {giftCardMessage && (
                    <p className={`text-xs mt-2 ${giftCardMessage.type === "success" ? "text-green-600" : "text-red-500"}`}>
                      {giftCardMessage.text}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
                >
                  <ShoppingCart className="mr-2" size={20} />
                  Place Order
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

