"use client";
import { motion } from "framer-motion";
import VirtualTour from "@/app/components/virtual-tour";

export default function VirtualTourPage() {
  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Virtual Tour</h1>
          <p className="text-chocolate/60">Take a peek inside Happy Truffles Cafe</p>
        </motion.div>
        <VirtualTour />
      </div>
    </div>
  );
}
