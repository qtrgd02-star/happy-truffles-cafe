"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Edit3, Trash2, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationError, setValidationError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "Truffles & Bites", image: "/menu/menu-001.jpg" });

  const loadMenu = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/menu", { cache: "no-store" });
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid menu data");
      }
      setItems(data);
    } catch (error: any) {
      console.error("Failed to load menu:", error);
      setError(error.message || "Failed to load menu");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleSave = async () => {
    setValidationError("");
    if (!form.title.trim() || !form.price) {
      setValidationError("Title and price are required");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const method = isAddingNew ? "POST" : "PUT";
      const url = isAddingNew ? "/api/admin/menu" : `/api/admin/menu?id=${editingId}`;
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save");
      }
      
      setSuccess(isAddingNew ? "Item added successfully!" : "Item updated successfully!");
      setForm({ title: "", description: "", price: "", category: "Truffles & Bites", image: "/menu/menu-001.jpg" });
      setEditingId(null);
      setIsAddingNew(false);
      await loadMenu();
    } catch (error: any) {
      console.error("Failed to save:", error);
      setError(error.message || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to delete");
      }
      setSuccess("Item deleted successfully!");
      await loadMenu();
    } catch (error: any) {
      console.error("Failed to delete:", error);
      setError(error.message || "Failed to delete item");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-chocolate/5 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-playfair text-3xl font-bold text-chocolate">Menu Management</h1>
            <p className="text-chocolate/60 mt-1">Add, edit, or remove menu items</p>
          </div>
        </div>
        <button
          onClick={() => { setIsAddingNew(true); setEditingId(null); setForm({ title: "", description: "", price: "", category: "Truffles & Bites", image: "/menu/menu-001.jpg" }); setError(""); setSuccess(""); }}
          className="bg-truffle text-white px-4 py-2 rounded-lg font-medium hover:bg-chocolate transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      <div className="space-y-6">
      {(isAddingNew || editingId !== null) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-semibold text-chocolate mb-4">{isAddingNew ? "New Item" : "Edit Item"}</h2>
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {validationError}
              </div>
            )}
            <div className="grid gap-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full border border-chocolate/20 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full border border-chocolate/20 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1">Price (QAR)</label>
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" className="w-full border border-chocolate/20 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-chocolate/20 rounded-lg px-4 py-2">
                  <option>Truffles & Bites</option>
                  <option>Coffee</option>
                  <option>Drinks</option>
                  <option>Sandwich</option>
                  <option>Single Box Gifts</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving} className="bg-truffle text-white px-4 py-2 rounded-lg font-medium hover:bg-chocolate transition-colors flex items-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => { setEditingId(null); setIsAddingNew(false); setForm({ title: "", description: "", price: "", category: "Truffles & Bites", image: "/menu/menu-001.jpg" }); setError(""); setSuccess(""); }} className="border border-chocolate/20 px-4 py-2 rounded-lg font-medium hover:bg-chocolate/5">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-vanilla/30">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-chocolate">Title</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-chocolate">Category</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-chocolate">Price</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-chocolate">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-chocolate/10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-4 bg-vanilla/30 rounded animate-pulse w-3/4" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-vanilla/30 rounded animate-pulse w-1/2" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-vanilla/30 rounded animate-pulse w-1/4" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-vanilla/30 rounded animate-pulse w-16 ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-vanilla/30">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-chocolate">Title</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-chocolate">Category</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-chocolate">Price</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-chocolate">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-chocolate/10">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-vanilla/10">
                    <td className="px-6 py-4 text-sm text-chocolate">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-chocolate/70">{item.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-truffle">QAR {item.price}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setEditingId(item.id); setIsAddingNew(false); setForm({ title: item.title, description: item.description, price: String(item.price), category: item.category, image: item.image }); setError(""); setSuccess(""); }} className="text-truffle hover:text-chocolate p-1">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 p-1 ml-2">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <div className="p-8 text-center text-chocolate/60">
                No menu items found. Add your first item above.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
