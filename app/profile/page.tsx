"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Heart, Package, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/app/auth-context";
import { useToast } from "@/app/toast-context";

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  const handleCreateProfile = () => {
    if (!formData.name || !formData.email || !formData.phone) return;
    console.log("Profile created:", { ...formData, phone });
    showToast("Profile created successfully");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-truffle/10 rounded-full mb-4">
            <User className="text-truffle" size={32} />
          </div>
          <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">My Profile</h1>
        </motion.div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="w-full border border-chocolate/20 rounded-lg px-4 py-2"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="w-full border border-chocolate/20 rounded-lg px-4 py-2"
                disabled
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone"
                className="w-full border border-chocolate/20 rounded-lg px-4 py-2"
              />
              <button onClick={handleCreateProfile} className="w-full bg-truffle text-white py-3 rounded-full">Save Profile</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <p><strong>Name:</strong> {user?.name || "Not set"}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> {formData.phone || "Not set"}</p>
              </div>
              <button onClick={() => setIsEditing(true)} className="w-full bg-truffle text-white py-3 rounded-full">Edit Profile</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
