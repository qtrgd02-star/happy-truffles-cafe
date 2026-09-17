"use client";

import { useState } from "react";
import { useCart } from "@/app/cart-context";
import { usePromos } from "@/app/promo-context";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingCart, ArrowRight, Tag, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartDrawer({ scrolled, isOpen, onClose }: { scrolled?: boolean; isOpen?: boolean; onClose?: () => void } = {}) {
  const { cart, removeFromCart, updateQuantity, updateItemNotes, clearCart, cartTotal, cartCount } = useCart();
  const { appliedPromo, getDiscount, applyPromo, removePromo } = usePromos();
  const [promoInput, setPromoInput] = useState("");
  const [itemNotes, setItemNotes] = useState<Record<number, string>>({});
  const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  
  const drawerOpen = isOpen ?? internalOpen;
  const setDrawerOpen = onClose ? (() => { onClose(); }) : setInternalOpen;

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

  const handleWhatsAppOrder = () => {
    const orderText = cart.map(item => {
      const note = item.notes ? " (Note: " + item.notes + ")" : "";
      return item.title + " x" + item.quantity + " - QAR " + (item.price * item.quantity).toFixed(2) + note;
    }).join("\n");

    const promoText = appliedPromo ? "\nPromo: " + appliedPromo.code : "";
    const message = "New Order from Happy Truffles Cafe Website:\n\n" + orderText + "\n\nSubtotal: QAR " + cartTotal.toFixed(2) + promoText + "\nTotal: QAR " + finalTotal.toFixed(2);
    window.open("https://wa.me/97412345678?text=" + encodeURIComponent(message), "_blank");
  };

  return (
    <>
      <button
        onClick={() => setDrawerOpen(true)}
        className={`relative transition-colors ${
          scrolled ? "text-chocolate/80 hover:text-truffle" : "text-white/80 hover:text-white"
        }`}
        aria-label="Open cart"
      >
        <ShoppingCart size={20} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-truffle text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {cartCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-chocolate/10">
                <h2 className="font-playfair text-2xl font-bold text-chocolate">
                  Your Cart ({cartCount})
                </h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-chocolate/60 hover:text-chocolate transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-white">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart size={64} className="text-chocolate/20 mb-4" />
                    <p className="text-chocolate/60 text-lg mb-2">Your cart is empty</p>
                    <p className="text-chocolate/40 text-sm">Add items from our menu to get started</p>
                    <Link
                      href="/#menu"
                      onClick={() => setDrawerOpen(false)}
                      className="mt-4 bg-truffle text-white px-6 py-2 rounded-full font-semibold hover:bg-chocolate transition-colors"
                    >
                      Browse Menu
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                     {cart.map((item) => (
                        <motion.div
                             key={item.id}
                             layout
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -20 }}
                             className="flex gap-4 bg-vanilla/60 rounded-2xl p-3 border border-chocolate/10"
                           >
                             <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-vanilla/40 flex-shrink-0">
                               <Image
                                 src={item.image}
                                 alt={item.title}
                                 width={80}
                                 height={80}
                                 className="object-cover"
                               />
                             </div>
                             <div className="flex-1 min-w-0">
                               <div className="flex items-start justify-between gap-2">
                                 <h3 className="font-semibold text-chocolate text-sm mb-1 truncate">
                                   {item.title}
                                 </h3>
                                 <button
                                   onClick={() => removeFromCart(item.id)}
                                   className="text-chocolate/40 hover:text-red-500 transition-colors flex-shrink-0"
                                   aria-label="Remove item"
                                 >
                                   <Trash2 size={16} />
                                 </button>
                               </div>
                               <div className="flex items-center gap-2 text-truffle font-bold mb-2">
                                 <button
                                   onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                   className="w-6 h-6 rounded-full border border-chocolate/20 flex items-center justify-center hover:bg-chocolate/5 transition-colors"
                                 >
                                   <span className="text-chocolate text-xs leading-none">-</span>
                                 </button>
                                 <span className="w-6 text-center text-sm">{item.quantity}</span>
                                 <button
                                   onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                   className="w-6 h-6 rounded-full border border-chocolate/20 flex items-center justify-center hover:bg-chocolate/5 transition-colors"
                                 >
                                   <span className="text-chocolate text-xs leading-none">+</span>
                                 </button>
                                </div>
                                {item.customizations && item.customizations.length > 0 && (
                                  <div className="space-y-1 mb-2">
                                    {item.customizations.map((c, i) => (
                                      <p key={i} className="text-xs text-chocolate/60">
                                        {c.name}: {c.values.join(", ")} {c.priceAdjustment > 0 && `(+QAR ${c.priceAdjustment})`}
                                      </p>
                                    ))}
                                  </div>
                                )}
                                <input
                                 type="text"
                                 value={itemNotes[item.id] ?? item.notes ?? ""}
                                 onChange={(e) => {
                                   const val = e.target.value;
                                   setItemNotes((prev) => ({ ...prev, [item.id]: val }));
                                   updateItemNotes(item.id, val);
                                 }}
                                 placeholder="Special instructions..."
                                 className="text-xs border border-chocolate/10 rounded px-2 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-truffle mb-1"
                               />
                               <p className="text-chocolate/60 text-xs">
                                 Subtotal: QAR {(item.price * item.quantity).toFixed(2)}
                               </p>
                             </div>
                           </motion.div>
                        ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-chocolate/10 p-6 space-y-4 bg-white">
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
                  <div className="flex justify-end">
                    <button
                      onClick={() => { clearCart(); setDrawerOpen(false); }}
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-chocolate text-lg font-bold pt-2 border-t border-chocolate/10">
                    <span>Total</span>
                    <span>QAR {finalTotal.toFixed(2)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    className="w-full bg-truffle text-white py-4 rounded-full font-semibold hover:bg-chocolate transition-colors shadow-lg shadow-truffle/20 flex items-center justify-center gap-2"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/cart"
                    className="w-full border-2 border-chocolate/20 text-chocolate py-3 rounded-full font-semibold hover:bg-chocolate/5 transition-colors flex items-center justify-center"
                    onClick={() => setDrawerOpen(false)}
                  >
                    View Full Cart
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
