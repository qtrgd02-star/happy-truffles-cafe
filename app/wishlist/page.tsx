"use client";

import { useWishlist } from "@/app/wishlist-context";
import { motion } from "framer-motion";
import { X, Heart, ArrowRight, ShoppingCart, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart-context";
import { useToast } from "@/app/toast-context";
import Image from "next/image";
import { useState } from "react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>({});

  const updateQuantity = (itemId: number, delta: number) => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta),
    }));
  };

  const handleAddToCart = (item: (typeof wishlist)[0]) => {
    const qty = itemQuantities[item.id] || 1;
    for (let i = 0; i < qty; i++) {
      addToCart({ id: item.id, title: item.title, price: item.price, image: item.image });
    }
    showToast(`Added ${qty} x ${item.title} to cart`);
    setItemQuantities((prev) => ({ ...prev, [item.id]: 1 }));
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <Heart size={64} className="text-chocolate/20 mx-auto mb-4" />
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-2">Your wishlist is empty</h2>
            <p className="text-chocolate/60 mb-6">Save items you love for later</p>
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
                Your Wishlist ({wishlistCount})
              </h1>
              <button
                onClick={clearWishlist}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="p-8 space-y-4">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-4 bg-vanilla/20 rounded-2xl p-4"
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
                  <p className="text-truffle font-bold text-xl">
                    QAR {item.price}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full border border-chocolate/20 flex items-center justify-center hover:bg-chocolate/5 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold text-chocolate text-sm">
                      {itemQuantities[item.id] || 1}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full border border-chocolate/20 flex items-center justify-center hover:bg-chocolate/5 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-truffle text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-chocolate transition-colors flex items-center gap-1"
                    >
                      <ShoppingCart size={14} />
                      Add
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-chocolate/40 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <X size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-chocolate/10 p-8">
            <Link
              href="/checkout"
              className="w-full bg-truffle text-white py-4 rounded-full font-semibold hover:bg-chocolate transition-colors shadow-lg shadow-truffle/20 flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}