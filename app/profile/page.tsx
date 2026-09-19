"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Heart, Package, Plus, Trash2 } from "lucide-react";
import { useCustomer } from "@/app/customer-context";
import { useToast } from "@/app/toast-context";

export default function CustomerProfilePage() {
  const { profile, createProfile, updateProfile, addAddress, removeAddress, addFavoriteItem, removeFavoriteItem, isFavorite, loadProfile } = useCustomer();
  const { showToast } = useToast();
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    address: "",
    city: "Doha",
    isDefault: false,
  });

  const handleLoadProfile = () => {
    if (!phone.trim()) return;
    const found = loadProfile(phone.trim());
    if (!found) {
      showToast("No profile found. Please create one.");
    }
  };

  const handleCreateProfile = () => {
    if (!formData.name || !formData.email || !formData.phone) return;
    createProfile({
      ...formData,
      addresses: [],
      favoriteItems: [],
      orderHistory: [],
    });
    setIsEditing(false);
  };

  const handleAddAddress = () => {
    if (!newAddress.address) return;
    addAddress(newAddress);
    setNewAddress({ label: "Home", address: "", city: "Doha", isDefault: false });
  };

  const menuItems = [];

  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-truffle/10 rounded-full mb-4">
            <User className="text-truffle" size={32} />
          </div>
          <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">My Profile</h1>
        </motion.div>

        {!profile ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex gap-4 mb-4">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number to load profile"
                className="flex-1 border border-chocolate/20 rounded-lg px-4 py-2"
              />
              <button onClick={handleLoadProfile} className="bg-truffle text-white px-6 py-2 rounded-full">Load</button>
            </div>

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
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone"
                  className="w-full border border-chocolate/20 rounded-lg px-4 py-2"
                />
                <button onClick={handleCreateProfile} className="w-full bg-truffle text-white py-3 rounded-full">Create Profile</button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full bg-truffle text-white py-3 rounded-full">
                Create New Profile
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-playfair text-2xl font-bold text-chocolate mb-4">Profile Information</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-playfair text-xl font-bold text-chocolate mb-4">Addresses</h3>
              {profile.addresses.map((addr) => (
                <div key={addr.id} className="flex items-center justify-between p-3 bg-vanilla/40 rounded-xl mb-2">
                  <div>
                    <p className="font-semibold">{addr.label}</p>
                    <p className="text-sm text-chocolate/60">{addr.address}, {addr.city}</p>
                  </div>
                  <button onClick={() => removeAddress(addr.id)} className="text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  placeholder="Address"
                  className="flex-1 border border-chocolate/20 rounded-lg px-3 py-2"
                />
                <button onClick={handleAddAddress} className="bg-truffle text-white px-4 py-2 rounded-full">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
