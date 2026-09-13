"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <div className="bg-white rounded-3xl shadow-xl p-12">
          <h1 className="font-playfair text-8xl font-bold text-truffle mb-4">404</h1>
          <h2 className="font-playfair text-2xl font-bold text-chocolate mb-4">
            Page Not Found
          </h2>
          <p className="text-chocolate/60 mb-8">
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
            >
              <Home size={18} />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 border-2 border-chocolate/20 text-chocolate px-6 py-3 rounded-full font-semibold hover:bg-chocolate/5 transition-colors"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}