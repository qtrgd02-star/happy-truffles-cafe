"use client";

import { motion } from "framer-motion";

export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-10 bg-vanilla/40 rounded w-48 mb-8"
        />
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border p-6"
            >
              <div className="h-4 bg-vanilla/30 rounded w-1/2 mb-2 animate-pulse" />
              <div className="h-8 bg-vanilla/40 rounded w-1/3 animate-pulse" />
            </motion.div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="h-6 bg-vanilla/40 rounded w-1/3 mb-4 animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-vanilla/20 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
