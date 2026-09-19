"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Image as ImageIcon, FileText, Upload, X } from "lucide-react";
import NextImage from "next/image";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  status: "draft" | "published";
  image?: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Updates",
    image: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setForm((prev) => ({ ...prev, image: result }));
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.excerpt.trim()) return;

    const newPost: BlogPost = {
      id: editingPost ? editingPost.id : `blog_${Date.now()}`,
      title: form.title,
      excerpt: form.excerpt,
      category: form.category,
      publishedAt: editingPost ? editingPost.publishedAt : new Date().toISOString(),
      status: "published",
      image: form.image || undefined,
    };

    const updatedPosts = editingPost
      ? posts.map((p) => (p.id === editingPost.id ? newPost : p))
      : [newPost, ...posts];

    setPosts(updatedPosts);
    localStorage.setItem("blog_posts", JSON.stringify(updatedPosts));

    setForm({ title: "", excerpt: "", content: "", category: "Updates", image: "" });
    setPreview(null);
    setIsCreating(false);
    setEditingPost(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    const updatedPosts = posts.filter((p) => p.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem("blog_posts", JSON.stringify(updatedPosts));
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: "",
      category: post.category,
      image: post.image || "",
    });
    setPreview(post.image || null);
    setIsCreating(true);
  };

  const resetForm = () => {
    setForm({ title: "", excerpt: "", content: "", category: "Updates", image: "" });
    setPreview(null);
    setIsCreating(false);
    setEditingPost(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-chocolate">Blog & Announcements</h1>
            <p className="text-chocolate/60 mt-1">Manage your blog posts and announcements</p>
          </div>
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingPost(null);
              setForm({ title: "", excerpt: "", content: "", category: "Updates", image: "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ab9f22c5-29b3-4c4f-823c-26d8b99db369.jpg?width=600&height=400" });
            }}
            className="bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            New Post
          </button>
        </div>

        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8"
          >
            <h2 className="font-semibold text-chocolate mb-4">{editingPost ? "Edit Post" : "New Post"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1">Upload Cover Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-chocolate/20 rounded-lg px-4 py-6 text-center hover:border-truffle transition-colors"
                >
                  <Upload className="mx-auto text-chocolate/40 mb-2" size={24} />
                  <p className="text-sm text-chocolate/60">Click to upload cover image</p>
                </button>
                {preview && (
                  <div className="mt-4 relative inline-block w-48 h-32">
                    <NextImage src={preview} alt="Preview" fill className="object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setForm((prev) => ({ ...prev, image: "" }));
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={3}
                  className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle resize-none"
                  placeholder="Short description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
                >
                  <option value="Updates">Updates</option>
                  <option value="Events">Events</option>
                  <option value="Menu">Menu</option>
                  <option value="Tips">Tips</option>
                  <option value="News">News</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="bg-truffle text-white px-6 py-2 rounded-full font-semibold hover:bg-chocolate transition-colors">
                  {editingPost ? "Update" : "Publish"}
                </button>
                <button
                  onClick={resetForm}
                  className="border border-chocolate/20 text-chocolate px-6 py-2 rounded-full font-semibold hover:bg-chocolate/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="text-chocolate/20 mx-auto mb-4" />
              <p className="text-chocolate/60">No blog posts yet. Create your first post above.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {posts.map((post) => (
                <div key={post.id} className="p-6 flex items-center justify-between hover:bg-vanilla/10">
                  <div>
                    <h3 className="font-semibold text-chocolate">{post.title}</h3>
                    <p className="text-sm text-chocolate/60 mt-1">{post.excerpt}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-chocolate/50">
                      <span className="bg-truffle/10 text-truffle px-2 py-1 rounded-full">{post.category}</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(post)}
                      className="p-2 text-chocolate/60 hover:text-truffle transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-chocolate/60 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
