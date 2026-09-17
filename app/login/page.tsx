"use client";

import { useState } from "react";
import { useAuth } from "@/app/auth-context";
import { useToast } from "@/app/toast-context";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(form.email, form.password);
    if (success) {
      showToast("Welcome back!");
      router.push("/admin");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full mx-4"
      >
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-2">Welcome Back</h1>
          <p className="text-chocolate/60">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-2">
            <Mail className="text-chocolate" size={20} />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
            />
          </div>
          <div className="flex items-center gap-2">
            <Lock className="text-chocolate" size={20} />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-chocolate/60 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-truffle hover:underline font-medium">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
