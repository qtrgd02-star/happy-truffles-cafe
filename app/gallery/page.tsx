"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, X, Plus, Upload, Search } from "lucide-react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  src: string;
  caption: string;
  category: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = ["all", ...Array.from(new Set(images.map((img) => img.category)))];

  useEffect(() => {
    const saved = localStorage.getItem("gallery_images");
    if (saved) {
      try {
        setImages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse gallery from localStorage", e);
      }
    } else {
      const demoImages: GalleryImage[] = [
        {
          id: "g1",
          src: "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ab9f22c5-29b3-4c4f-823c-26d8b99db369.jpg?width=600&height=600",
          caption: "Heart-Shaped Truffles",
          category: "Products",
          createdAt: new Date().toISOString(),
        },
        {
          id: "g2",
          src: "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ab9f22c5-29b3-4c4f-823c-26d8b99db369.jpg?width=600&height=600",
          caption: "Cafe Interior",
          category: "Interior",
          createdAt: new Date().toISOString(),
        },
        {
          id: "g3",
          src: "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ab9f22c5-29b3-4c4f-823c-26d8b99db369.jpg?width=600&height=600",
          caption: "Coffee Art",
          category: "Products",
          createdAt: new Date().toISOString(),
        },
        {
          id: "g4",
          src: "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ab9f22c5-29b3-4c4f-823c-26d8b99db369.jpg?width=600&height=600",
          caption: "Outdoor Seating",
          category: "Interior",
          createdAt: new Date().toISOString(),
        },
      ];
      setImages(demoImages);
    }
    setLoading(false);
  }, []);

  const filteredImages = filter === "all" ? images : images.filter((img) => img.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-vanilla/30 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-chocolate/20 border-t-truffle rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-chocolate mb-4">
            Photo Gallery
          </h1>
          <div className="w-20 h-1.5 bg-truffle rounded-full mx-auto mb-4" />
          <p className="text-chocolate/60 max-w-2xl mx-auto">
            Take a peek inside Happy Truffles Cafe. From our handcrafted truffles to our cozy interior, every corner is designed for your perfect moment.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat
                  ? "bg-truffle text-white"
                  : "bg-white text-chocolate hover:bg-truffle/10"
              }`}
            >
              {cat === "all" ? "All Photos" : cat}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.caption}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium text-sm">{image.caption}</p>
                  <p className="text-white/70 text-xs">{image.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <ImageIcon size={48} className="text-chocolate/20 mx-auto mb-4" />
            <p className="text-chocolate/60">No photos in this category yet.</p>
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl max-h-screen">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white/80 hover:text-white"
              >
                <X size={28} />
              </button>
              <Image
                src={selectedImage.src}
                alt={selectedImage.caption}
                width={1200}
                height={800}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <p className="text-white text-center mt-4 font-medium">{selectedImage.caption}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
