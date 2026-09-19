"use client";

import { motion } from "framer-motion";

export default function ReservationsLoading() {
  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-10 bg-vanilla/40 rounded w-48 mx-auto mb-8"
        />
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-2"
            >
              <div className="h-4 bg-vanilla/30 rounded w-full animate-pulse" />
              <div className="h-4 bg-vanilla/20 rounded w-3/4 animate-pulse" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
