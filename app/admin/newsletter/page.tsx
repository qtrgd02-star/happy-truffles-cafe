"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Users, Send, Trash2 } from "lucide-react";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/newsletter")
      .then((r) => r.json())
      .then(setSubscribers)
      .catch(() => setError("Failed to load subscribers."))
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send", subject, content }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to send newsletter.");
      return;
    }
    setSent(data.message || "Newsletter sent!");
    setSubject("");
    setContent("");
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-playfair text-4xl font-bold text-chocolate mb-8">Newsletter Management</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-4 flex items-center gap-2"><Mail size={24} /> Send Campaign</h2>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSend} className="space-y-4">
              <input type="text" placeholder="Subject" required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border border-chocolate/20 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
              <textarea placeholder="Email content..." required value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full border border-chocolate/20 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle resize-none" />
              <button type="submit" className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors flex items-center justify-center gap-2">
                <Send size={18} /> Send Newsletter
              </button>
              {sent && <p className="text-green-600 text-sm text-center">{sent}</p>}
            </form>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-4 flex items-center gap-2"><Users size={24} /> Subscribers ({subscribers.length})</h2>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-vanilla/20 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
              {subscribers.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between bg-vanilla/20 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-chocolate text-sm">{sub.name || "Anonymous"}</p>
                    <p className="text-xs text-chocolate/60">{sub.email}</p>
                  </div>
                  <span className="text-xs text-chocolate/50">{new Date(sub.subscribedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
