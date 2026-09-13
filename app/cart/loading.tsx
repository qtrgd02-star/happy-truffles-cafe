"use client";

import { motion } from "framer-motion";

export default function CartLoading() {
  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="p-8 border-b border-chocolate/10">
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-8 bg-vanilla/40 rounded w-48"
            />
          </div>

          <div className="p-8 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 bg-vanilla/20 rounded-2xl p-4"
              >
                <div className="w-20 h-20 rounded-xl bg-vanilla/40 animate-pulse" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 bg-vanilla/40 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-vanilla/40 rounded w-1/2 animate-pulse" />
                </div>
                <div className="w-20 h-8 bg-vanilla/40 rounded-full animate-pulse" />
              </motion.div>
            ))}
          </div>

          <div className="border-t border-chocolate/10 p-8">
            <div className="flex justify-between items-center">
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-6 bg-vanilla/40 rounded w-32"
              />
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="h-6 bg-vanilla/40 rounded w-24"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}