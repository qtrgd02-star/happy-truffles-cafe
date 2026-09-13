"use client";

import { useState } from "react";
import { useGiftCards } from "@/app/gift-card-context";
import { useToast } from "@/app/toast-context";
import { motion } from "framer-motion";
import { Gift, Plus, Ticket, CheckCircle2, XCircle } from "lucide-react";

export default function GiftCardsPage() {
  const { giftCards, createGiftCard, applyGiftCard } = useGiftCards();
  const { showToast } = useToast();
  const [amount, setAmount] = useState("");
  const [redeemCode, setRedeemCode] = useState("");
  const [redeemResult, setRedeemResult] = useState<{ success: boolean; message: string; balance: number } | null>(null);

  const handleCreate = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      showToast("Please enter a valid amount");
      return;
    }
    const code = createGiftCard(value);
    showToast(`Gift card created: ${code}`);
    setAmount("");
  };

  const handleRedeem = () => {
    if (!redeemCode.trim()) {
      showToast("Please enter a gift card code");
      return;
    }
    const result = applyGiftCard(redeemCode.trim());
    setRedeemResult({ success: result.success, message: result.message, balance: result.balance });
    if (result.success) {
      showToast(result.message);
    } else {
      showToast(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="text-truffle" size={32} />
            <h1 className="font-playfair text-3xl font-bold text-chocolate">Gift Cards</h1>
          </div>
          <p className="text-chocolate/60 mb-8">
            Create or redeem gift cards for Happy Truffles Cafe
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-vanilla/20 rounded-2xl p-6">
              <h2 className="font-playfair text-xl font-bold text-chocolate mb-4 flex items-center justify-center gap-2">
                <Plus size={20} />
                Create Gift Card
              </h2>
              <div className="space-y-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount (QAR)"
                  min="1"
                  className="w-full border border-chocolate/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
                />
                <button
                  onClick={handleCreate}
                  className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
                >
                  Create Gift Card
                </button>
              </div>
            </div>

            <div className="bg-vanilla/20 rounded-2xl p-6">
              <h2 className="font-playfair text-xl font-bold text-chocolate mb-4 flex items-center justify-center gap-2">
                <Ticket size={20} />
                Redeem Gift Card
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                  placeholder="Enter gift card code"
                  className="w-full border border-chocolate/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle uppercase"
                />
                <button
                  onClick={handleRedeem}
                  className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
                >
                  Check Balance
                </button>
                {redeemResult && (
                  <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
                    redeemResult.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}>
                    {redeemResult.success ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    <span className="text-sm font-medium">{redeemResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {giftCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-6">Your Gift Cards</h2>
            <div className="grid gap-4">
              {giftCards.map((card) => (
                <div key={card.code} className="flex items-center justify-between bg-vanilla/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-truffle/10 p-2 rounded-lg">
                      <Ticket className="text-truffle" size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-mono font-bold text-chocolate">{card.code}</p>
                      <p className="text-xs text-chocolate/60">
                        Created: {new Date(card.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-truffle text-lg">QAR {card.balance.toFixed(2)}</p>
                    <p className="text-xs text-chocolate/60">Balance</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
