"use client";
import { useState } from "react";
import { useToast } from "@/app/toast-context";
import { motion } from "framer-motion";
import { User, Mail, Phone, FileText, CheckCircle } from "lucide-react";

export default function JobsPage() {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", position: "", experience: "", coverLetter: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitted(true);
    showToast("Application submitted!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <CheckCircle className="text-truffle mx-auto" size={64} />
          <h2 className="font-playfair text-3xl text-chocolate font-bold mt-4 mb-2">Application Submitted!</h2>
          <p className="text-chocolate/70">We&apos;ll review your application and get back to you soon.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <FileText className="text-truffle mx-auto mb-2" size={40} />
            <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Join Our Team</h1>
            <p className="text-chocolate/60">We&apos;d love to hear from you</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-2">
              <User className="text-chocolate" size={20} />
              <input type="text" required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-chocolate" size={20} />
              <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-chocolate" size={20} />
              <input type="tel" required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            </div>
            <input type="text" required placeholder="Position (e.g., Barista, Waiter, Manager)" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full border border-chocolate/20 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            <input type="text" placeholder="Years of Experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="w-full border border-chocolate/20 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            <textarea placeholder="Cover letter / Why you'd like to join us..." value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} rows={5} className="w-full border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle resize-none" />
            <button type="submit" className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors flex items-center justify-center gap-2">
              <FileText size={20} /> Submit Application
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
