"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import Image from "next/image";

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  link: string;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstagramPosts();
  }, []);

  const fetchInstagramPosts = async () => {
    try {
      const res = await fetch("/api/instagram");
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error("Failed to fetch Instagram posts:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12">Loading Instagram feed...</div>;
  }

  return (
    <div className="py-12 px-4 bg-vanilla/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-playfair text-4xl font-bold text-chocolate mb-2">Follow Us on Instagram</h2>
          <p className="text-chocolate/60">@happytrufflescafe</p>
          <a
            href="https://www.instagram.com/happytrufflescafe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            <Instagram size={18} />
            Follow Us
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {posts.map((post, index) => (
              <motion.a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-vanilla/40"
              >
                <Image
                  src={post.imageUrl}
                  alt={post.caption}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <p className="text-sm line-clamp-3">{post.caption}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Instagram size={16} />
                    <span className="text-xs">{post.likes}</span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
