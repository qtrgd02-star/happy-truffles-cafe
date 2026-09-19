"use client";

import { motion } from "framer-motion";

export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-10 bg-vanilla/40 rounded w-48 mb-8"
        />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-5 bg-vanilla/40 rounded w-32 animate-pulse" />
                  <div className="h-4 bg-vanilla/30 rounded w-48 animate-pulse" />
                </div>
                <div className="h-8 bg-vanilla/40 rounded w-24 animate-pulse" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-vanilla/40 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-vanilla/30 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-vanilla/20 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
