"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import Image from "next/image";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = ["all", "Updates", "Events", "Menu", "Tips", "News"];

  useEffect(() => {
    const saved = localStorage.getItem("blog_posts");
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse blog posts from localStorage", e);
      }
    } else {
      const demoPosts: BlogPost[] = [
        {
          id: "b1",
          slug: "new-valentines-special",
          title: "Valentine's Day Special: Heart-Shaped Truffles Are Back!",
          excerpt: "This Valentine's Day, surprise your loved ones with our limited-edition heart-shaped truffles, available in a beautiful gift box.",
          content: "This Valentine's Day, surprise your loved ones with our limited-edition heart-shaped truffles...",
          image: "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ab9f22c5-29b3-4c4f-823c-26d8b99db369.jpg?width=600&height=400",
          category: "Menu",
          author: "Happy Truffles Team",
          publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          readTime: "3 min read",
        },
        {
          id: "b2",
          slug: "new-matcha-latte-launch",
          title: "Introducing Our New Premium Matcha Latte",
          excerpt: "We're excited to announce the launch of our new premium matcha latte, sourced directly from Japan.",
          content: "We're excited to announce the launch of our new premium matcha latte...",
          image: "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ab9f22c5-29b3-4c4f-823c-26d8b99db369.jpg?width=600&height=400",
          category: "Menu",
          author: "Happy Truffles Team",
          publishedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
          readTime: "2 min read",
        },
        {
          id: "b3",
          slug: "summer-festival-event",
          title: "Summer Festival: Live Music & Special Menu",
          excerpt: "Join us for our annual summer festival with live music, special menu items, and exciting giveaways.",
          content: "Join us for our annual summer festival...",
          image: "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ab9f22c5-29b3-4c4f-823c-26d8b99db369.jpg?width=600&height=400",
          category: "Events",
          author: "Happy Truffles Team",
          publishedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
          readTime: "4 min read",
        },
      ];
      setPosts(demoPosts);
    }
    setLoading(false);
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-vanilla/30 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-chocolate/20 border-t-truffle rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-chocolate mb-4">
            Blog & Announcements
          </h1>
          <div className="w-20 h-1.5 bg-truffle rounded-full mx-auto mb-4" />
          <p className="text-chocolate/60 max-w-2xl mx-auto">
            Stay updated with our latest news, menu additions, events, and special offers.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-chocolate/20 bg-white focus:outline-none focus:ring-2 focus:ring-truffle"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-truffle text-white"
                    : "bg-white text-chocolate hover:bg-truffle/10"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-chocolate/60">No articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-video">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-truffle text-white text-xs font-medium px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-playfair text-xl font-bold text-chocolate mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-chocolate/60 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-chocolate/50">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {post.readTime}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-truffle font-medium">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
