"use client";

import { motion } from "framer-motion";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-vanilla/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative bg-vanilla/40 aspect-square md:aspect-auto">
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-full h-full"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col gap-4">
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-8 bg-vanilla/40 rounded w-3/4"
              />
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                className="h-6 bg-vanilla/40 rounded w-1/2"
              />
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="h-4 bg-vanilla/40 rounded w-full"
              />
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                className="h-4 bg-vanilla/40 rounded w-full"
              />
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="h-32 bg-vanilla/40 rounded w-full mt-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}