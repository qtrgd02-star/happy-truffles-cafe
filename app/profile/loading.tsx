"use client";

import { motion } from "framer-motion";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-16 w-16 bg-vanilla/40 rounded-full mx-auto mb-8"
        />
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="h-6 bg-vanilla/40 rounded w-1/3 mb-4 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 bg-vanilla/30 rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-vanilla/30 rounded w-2/3 animate-pulse" />
                <div className="h-4 bg-vanilla/30 rounded w-1/3 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
