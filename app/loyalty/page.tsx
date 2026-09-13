"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Phone, Gift, Star } from "lucide-react";
import { useLoyalty } from "@/app/loyalty-context";

export default function LoyaltyPage() {
  const { getAccount } = useLoyalty();
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState<any>(null);

  const checkLoyalty = () => {
    if (!phone.trim()) return;
    const acc = getAccount(phone.trim());
    setAccount(acc || null);
  };

  const pointsValue = account ? (account.points * 0.1).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-truffle/10 rounded-full mb-4">
            <Trophy className="text-truffle" size={32} />
          </div>
          <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Loyalty Program</h1>
          <p className="text-chocolate/60">Earn 1 point for every QAR spent. Redeem points for discounts!</p>
        </motion.div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="flex-1 border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
            />
            <button
              onClick={checkLoyalty}
              className="bg-truffle text-white px-6 py-2 rounded-full font-semibold hover:bg-chocolate transition-colors"
            >
              Check
            </button>
          </div>
        </div>

        {account && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-truffle/20 to-matcha/20 rounded-full mb-4">
                <Star className="text-truffle" size={40} />
              </div>
              <h2 className="font-playfair text-3xl font-bold text-chocolate mb-1">
                {account.points} Points
              </h2>
              <p className="text-chocolate/60">Worth QAR {pointsValue}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-vanilla/40 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-chocolate">{account.totalOrders}</p>
                <p className="text-sm text-chocolate/60">Total Orders</p>
              </div>
              <div className="bg-vanilla/40 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-chocolate">QAR {account.totalSpent.toFixed(2)}</p>
                <p className="text-sm text-chocolate/60">Total Spent</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Gift className="text-green-600 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-green-800 mb-1">How to redeem?</p>
                  <p className="text-sm text-green-700">
                    Use your points at checkout. 1 point = QAR 0.10 discount. Tell the cashier your phone number to apply points.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!account && phone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center"
          >
            <Phone className="text-yellow-600 mx-auto mb-2" size={24} />
            <p className="text-yellow-800">No loyalty account found for this number.</p>
            <p className="text-sm text-yellow-600">Place an order to start earning points!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
