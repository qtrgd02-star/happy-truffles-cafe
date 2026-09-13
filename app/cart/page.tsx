"use client";

import { useState } from "react";
import { useCart } from "@/app/cart-context";
import { usePromos } from "@/app/promo-context";
import { motion } from "framer-motion";
import { X, Trash2, ArrowRight, ShoppingCart, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, updateItemNotes, clearCart, cartTotal, cartCount } = useCart();
  const { appliedPromo, getDiscount, applyPromo, removePromo } = usePromos();
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [itemNotes, setItemNotes] = useState<Record<number, string>>({});

  const discount = getDiscount(cartTotal);
  const finalTotal = cartTotal - discount;

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const result = applyPromo(promoInput.trim(), cartTotal);
    setPromoMessage({ type: result.success ? "success" : "error", text: result.message });
    if (result.success) {
      setPromoInput("");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <ShoppingCart size={64} className="text-chocolate/20 mx-auto mb-4" />
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-2">Your cart is empty</h2>
            <p className="text-chocolate/60 mb-6">Add items from our menu to get started</p>
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
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="p-8 border-b border-chocolate/10">
            <div className="flex items-center justify-between">
              <h1 className="font-playfair text-4xl font-bold text-chocolate">
                Your Cart ({cartCount})
              </h1>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="p-8 space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                 className="flex items-center gap-4 bg-vanilla/60 rounded-2xl p-4 border border-chocolate/10"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-vanilla/40 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-chocolate text-lg mb-1 truncate">
                    {item.title}
                  </h3>
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
                  <input
                    type="text"
                    value={itemNotes[item.id] ?? item.notes ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setItemNotes((prev) => ({ ...prev, [item.id]: val }));
                      updateItemNotes(item.id, val);
                    }}
                    placeholder="Special instructions..."
                    className="text-xs border border-chocolate/10 rounded px-2 py-1 mt-2 w-full focus:outline-none focus:ring-1 focus:ring-truffle"
                  />
                  <p className="text-chocolate/60 text-sm mt-1">
                    QAR {item.price} each
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-truffle text-xl">
                    QAR {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-chocolate/40 hover:text-red-500 transition-colors mt-2"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-chocolate/10 p-8 space-y-4">
            {!appliedPromo ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-chocolate/80 flex items-center gap-1">
                  <Tag size={14} />
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 border border-chocolate/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle uppercase"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-truffle text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-chocolate transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-xs ${promoMessage.type === "success" ? "text-green-600" : "text-red-500"}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-green-800">{appliedPromo.code}</p>
                  <p className="text-xs text-green-600">{appliedPromo.description}</p>
                </div>
                <button
                  onClick={removePromo}
                  className="text-green-600 hover:text-green-800"
                  aria-label="Remove promo"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-chocolate">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">QAR {cartTotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-green-600 text-sm">
                <span>Discount</span>
                <span className="font-semibold">- QAR {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-chocolate/60 text-sm">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex items-center justify-between text-chocolate text-2xl font-bold pt-4 border-t border-chocolate/10">
              <span>Total</span>
              <span>QAR {finalTotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-4 pt-4">
              <Link
                href="/#menu"
                className="flex-1 border-2 border-chocolate/20 text-chocolate py-4 rounded-full font-semibold hover:bg-chocolate/5 transition-colors text-center"
              >
                Continue Shopping
              </Link>
              <Link
                href="/checkout"
                className="flex-1 bg-truffle text-white py-4 rounded-full font-semibold hover:bg-chocolate transition-colors shadow-lg shadow-truffle/20 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}