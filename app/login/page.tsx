"use client";

import { useState } from "react";
import { useAuth } from "@/app/auth-context";
import { useToast } from "@/app/toast-context";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login, forgotPassword } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    if (isForgotPassword) {
      // Handle forgot password submission
      const result = await forgotPassword(form.email);
      setIsLoading(false);
      
      if (result.success) {
        showToast("Password reset email sent! Please check your inbox.");
        setIsForgotPassword(false);
        setForm({ email: "", password: "" });
      } else {
        setError(result.error || "Failed to send reset email. Please try again.");
      }
    } else {
      // Handle login submission
      const success = await login(form.email, form.password);
      setIsLoading(false);
      
      if (success) {
        showToast("Welcome back!");
        router.push("/admin");
      } else {
        setError("Invalid email or password");
      }
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
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-2">
            {isForgotPassword ? "Reset Password" : "Welcome Back"}
          </h1>
          <p className="text-chocolate/60">
            {isForgotPassword
              ? "Enter your email to reset your password"
              : "Sign in to your account"}
          </p>
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
          {!isForgotPassword && (
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
          )}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-truffle text-white py-3 rounded-full font-semibold hover:bg-chocolate transition-colors ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            {isLoading ? "Processing..." : isForgotPassword ? "Send Reset Link" : "Sign In"}
          </button>
          </form>
          <p className="text-center text-chocolate/60 text-sm mt-6">
            {isForgotPassword ? (
              <>
                Remember your password?{" "}
                <Link href="/" className="text-truffle hover:underline font-medium">
                  Sign In
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-truffle hover:underline font-medium">
                  Register
                </Link>{" "}
                |{" "}
                <Link href="#" className="text-truffle hover:underline font-medium" onClick={(e) => {
                  e.preventDefault();
                  setIsForgotPassword(true);
                }}>
                  Forgot password?
                </Link>
              </>
            )}
          </p>
        </motion.div>
      </div>
    );
}
