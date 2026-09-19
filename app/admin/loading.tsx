"use client";

import { motion } from "framer-motion";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-10 bg-vanilla/40 rounded w-48 mb-8"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border p-6"
            >
              <div className="h-6 bg-vanilla/40 rounded w-1/2 mb-4 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 bg-vanilla/30 rounded w-full animate-pulse" />
                <div className="h-4 bg-vanilla/20 rounded w-2/3 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
