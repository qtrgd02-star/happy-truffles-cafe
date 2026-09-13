"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Store, Clock, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

interface Settings {
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  description: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    restaurantName: "Happy Truffles Cafe",
    address: "Gold Plaza, Abu Hamour, Doha, Qatar",
    phone: "+974 3159 0002",
    email: "info@happytruffles.qa",
    openingHours: "9:00 AM - 11:30 PM",
    description: "A cozy retreat in the heart of Gold Plaza, Abu Hamour.",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-chocolate/60">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-chocolate/5 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-playfair text-3xl font-bold text-chocolate">Settings</h1>
            <p className="text-chocolate/60 mt-1">Manage restaurant information</p>
          </div>
        </div>
        <button onClick={handleSave} className="bg-truffle text-white px-4 py-2 rounded-lg font-medium hover:bg-chocolate transition-colors flex items-center gap-2">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          Settings saved successfully!
        </motion.div>
      )}

      <div className="grid gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-chocolate mb-4 flex items-center gap-2">
            <Store size={18} />
            Restaurant Information
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-chocolate mb-1">Restaurant Name</label>
              <input value={settings.restaurantName} onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-chocolate" />
            </div>
            <div>
              <label className="block text-sm font-medium text-chocolate mb-1">Description</label>
              <textarea value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })} rows={3} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-chocolate" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-chocolate mb-4 flex items-center gap-2">
            <MapPin size={18} />
            Contact Information
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-chocolate mb-1">Address</label>
              <input value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-chocolate" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1">Phone</label>
                <input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-chocolate" />
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1">Email</label>
                <input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-chocolate" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-chocolate mb-4 flex items-center gap-2">
            <Clock size={18} />
            Opening Hours
          </h2>
          <div>
            <label className="block text-sm font-medium text-chocolate mb-1">Hours</label>
            <input value={settings.openingHours} onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })} className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-chocolate" />
          </div>
        </div>
      </div>
    </div>
  );
}
