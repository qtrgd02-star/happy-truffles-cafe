"use client";

import { motion } from "framer-motion";

export default function ReferralsLoading() {
  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-10 bg-vanilla/40 rounded w-48 mb-8"
        />
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-vanilla/40 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-vanilla/30 rounded w-1/2 animate-pulse" />
                <div className="h-3 bg-vanilla/20 rounded w-1/3 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
