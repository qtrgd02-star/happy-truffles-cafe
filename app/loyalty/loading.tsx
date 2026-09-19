"use client";

import { motion } from "framer-motion";

export default function LoyaltyLoading() {
  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-10 bg-vanilla/40 rounded w-48 mb-8"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="h-8 bg-vanilla/40 rounded w-1/2 mb-4 animate-pulse" />
              <div className="h-12 bg-vanilla/30 rounded w-3/4 animate-pulse" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
