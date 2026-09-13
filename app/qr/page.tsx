"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Download, Share2 } from "lucide-react";
import Image from "next/image";

export default function QRCodePage() {
  const [size, setSize] = useState(300);
  const menuUrl = typeof window !== "undefined" ? `${window.location.origin}/#menu` : "";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(menuUrl)}`;

  const downloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "happy-truffles-menu-qr.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download QR code", err);
    }
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <QrCode className="text-truffle" size={32} />
            <h1 className="font-playfair text-3xl font-bold text-chocolate">Menu QR Code</h1>
          </div>
          <p className="text-chocolate/60 mb-8">
            Scan this QR code to access our menu instantly. Perfect for table tents, flyers, or sharing with friends.
          </p>
          <div className="bg-vanilla/20 rounded-2xl p-8 inline-block mb-6">
            <Image
              src={qrUrl}
              alt="Menu QR Code"
              width={size}
              height={size}
              className="mx-auto"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <label className="text-sm font-medium text-chocolate/80">Size:</label>
              <input
                type="range"
                min="200"
                max="600"
                step="50"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-48"
              />
              <span className="text-sm text-chocolate/60 w-16">{size}px</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={downloadQR}
                className="inline-flex items-center gap-2 bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
              >
                <Download size={18} />
                Download QR Code
              </button>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/qr`;
                  navigator.clipboard.writeText(url);
                  alert("QR code page URL copied to clipboard!");
                }}
                className="inline-flex items-center gap-2 border-2 border-chocolate/20 text-chocolate px-6 py-3 rounded-full font-semibold hover:bg-chocolate/5 transition-colors"
              >
                <Share2 size={18} />
                Copy Page Link
              </button>
            </div>
          </div>
          <p className="text-chocolate/40 text-xs mt-8">
            QR code links to: {menuUrl}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
