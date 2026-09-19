"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QrCode, Scan, Package, Download } from "lucide-react";
import Image from "next/image";

interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export default function BarcodeMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      setMenuItems(data);
    } catch (e) {
      console.error("Failed to fetch menu:", e);
    }
  };

  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const menuUrl = typeof window !== "undefined" ? window.location.origin + "/menu" : "";

  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-truffle/10 rounded-full mb-4">
            <QrCode className="text-truffle" size={32} />
          </div>
          <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Scan to Order</h1>
          <p className="text-chocolate/60">Scan the QR code or browse our menu below</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-chocolate mb-4">QR Code</h3>
            <div className="flex flex-col items-center">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(menuUrl)}`}
                alt="Menu QR Code"
                width={250}
                height={250}
                className="mb-4"
                unoptimized
              />
              <p className="text-sm text-chocolate/60 text-center">
                Scan this QR code to access the full menu on your phone
              </p>
              <div className="flex gap-2 mt-4">
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}`}
                  download
                  className="flex items-center gap-2 bg-truffle text-white px-4 py-2 rounded-full text-sm hover:bg-chocolate transition-colors"
                >
                  <Download size={16} />
                  Download QR
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-playfair text-xl font-bold text-chocolate mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-vanilla/40 rounded-xl">
                <div className="flex items-center gap-3">
                  <Package className="text-truffle" size={24} />
                  <div>
                    <p className="font-semibold text-chocolate">Total Items</p>
                    <p className="text-sm text-chocolate/60">On the menu</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-chocolate">{menuItems.length}</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-vanilla/40 rounded-xl">
                <div className="flex items-center gap-3">
                  <Scan className="text-matcha" size={24} />
                  <div>
                    <p className="font-semibold text-chocolate">Categories</p>
                    <p className="text-sm text-chocolate/60">Browse by type</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-chocolate">{categories.length - 1}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-playfair text-xl font-bold text-chocolate mb-4">Browse Menu</h3>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="flex-1 border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-truffle text-white"
                    : "bg-vanilla/40 text-chocolate hover:bg-vanilla/60"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-vanilla/40 rounded-2xl overflow-hidden"
              >
                <div className="aspect-square relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-chocolate mb-1">{item.title}</h4>
                  <p className="text-sm text-chocolate/60 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-truffle text-lg">QAR {item.price}</span>
                    <span className="text-xs text-chocolate/50 bg-white px-2 py-1 rounded-full">{item.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

