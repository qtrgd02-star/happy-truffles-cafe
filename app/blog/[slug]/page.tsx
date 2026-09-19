"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, Facebook, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

const demoPosts: BlogPost[] = [
  {
    id: "b1",
    slug: "new-valentines-special",
    title: "Valentine's Day Special: Heart-Shaped Truffles Are Back!",
    excerpt: "This Valentine's Day, surprise your loved ones with our limited-edition heart-shaped truffles, available in a beautiful gift box.",
    content: "This Valentine's Day, surprise your loved ones with our limited-edition heart-shaped truffles, available in a beautiful gift box. Each truffle is handcrafted with premium Belgian chocolate and filled with a silky smooth ganache. Perfect for gifting or sharing with someone special.\n\nWe're also offering a special 10% discount on all Valentine's Day orders placed before February 12th. Use code VALENTINE10 at checkout.",
    image: "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ab9f22c5-29b3-4c4f-823c-26d8b99db369.jpg?width=1200&height=600",
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
    content: "We're excited to announce the launch of our new premium matcha latte, sourced directly from the finest tea gardens in Uji, Japan. Our matcha is stone-ground to perfection, delivering a rich, umami flavor that's both energizing and soothing.\n\nAvailable hot or iced, with your choice of oat, almond, or regular milk. Come try it today!",
    image: "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ab9f22c5-29b3-4c4f-823c-26d8b99db369.jpg?width=1200&height=600",
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
    content: "Join us for our annual summer festival on July 15th! We've got live music from local artists, a special summer menu featuring refreshing drinks and light bites, and exciting giveaways throughout the day.\n\nEntry is free, and the first 50 guests get a complimentary truffle on us. See you there!",
    image: "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ab9f22c5-29b3-4c4f-823c-26d8b99db369.jpg?width=1200&height=600",
    category: "Events",
    author: "Happy Truffles Team",
    publishedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    readTime: "4 min read",
  },
];

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const slug = params.slug as string;
    const saved = localStorage.getItem("blog_posts");
    let allPosts: BlogPost[] = [];
    if (saved) {
      try {
        allPosts = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse blog posts from localStorage", e);
      }
    }
    if (allPosts.length === 0) {
      allPosts = demoPosts;
    }
    const found = allPosts.find((p) => p.slug === slug);
    if (found) {
      setPost(found);
      setRelatedPosts(allPosts.filter((p) => p.slug !== slug && p.category === found.category).slice(0, 2));
    }
    setLoading(false);
  }, [params.slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (e) {
        console.error("Share failed:", e);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-vanilla/30 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-chocolate/20 border-t-truffle rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-vanilla/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-4xl font-bold text-chocolate mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-truffle hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = post.content.split("\n\n");

  return (
    <div className="min-h-screen bg-vanilla/30">
      <article className="max-w-3xl mx-auto">
        <header className="relative h-[50vh] min-h-[400px]">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-3xl mx-auto">
              <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
                <ArrowLeft size={16} />
                Back to Blog
              </Link>
              <span className="bg-truffle text-white text-xs font-medium px-3 py-1 rounded-full">
                {post.category}
              </span>
              <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white mt-4 mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <span className="font-medium">{post.author}</span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white shadow-xl">
          <div className="flex items-center justify-between px-8 py-4 border-b border-chocolate/10">
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-chocolate/60 hover:text-truffle transition-colors text-sm"
              >
                <Share2 size={18} />
                Share
              </button>
              <button
                onClick={toggleBookmark}
                className={`flex items-center gap-2 transition-colors text-sm ${
                  bookmarked ? "text-truffle" : "text-chocolate/60 hover:text-truffle"
                }`}
              >
                <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
                {bookmarked ? "Saved" : "Save"}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-chocolate/60 hover:text-truffle transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-chocolate/60 hover:text-truffle transition-colors"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div className="px-8 md:px-12 py-12">
            <div className="prose prose-chocolate prose-lg max-w-none">
              {paragraphs.map((paragraph, i) => (
                <p key={i} className="text-chocolate/80 leading-relaxed mb-6 text-base md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 py-16">
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`} className="group">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative aspect-video">
                      <Image src={related.image} alt={related.title} fill className="object-cover" />
                    </div>
                    <div className="p-6">
                      <span className="text-truffle text-xs font-medium">{related.category}</span>
                      <h3 className="font-playfair text-lg font-bold text-chocolate mt-2 group-hover:text-truffle transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-chocolate/60 text-sm mt-2 line-clamp-2">{related.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 pb-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
          >
            <ArrowLeft size={18} />
            Back to All Articles
          </Link>
        </div>
      </article>
    </div>
  );
}
