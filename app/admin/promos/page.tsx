"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePromos, type PromoCode } from "@/app/promo-context";
import { Plus, Trash2, Edit, X, Check } from "lucide-react";

export default function AdminPromosPage() {
  const { promos, addPromo, updatePromo, deletePromo } = usePromos();
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed" | "item",
    value: 0,
    itemId: "",
    minOrderAmount: "",
    maxUses: "",
    validFrom: "",
    validUntil: "",
    active: true,
  });

  const handleSubmit = async () => {
    if (!formData.code || !formData.value) return;

    const promoData = {
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value.toString()),
      itemId: formData.itemId ? parseInt(formData.itemId) : undefined,
      minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
      validFrom: formData.validFrom || new Date().toISOString(),
      validUntil: formData.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      active: formData.active,
    };

    setSaving(true);
    setMessage(null);
    try {
      if (editingPromo) {
        await updatePromo(editingPromo.id, promoData);
      } else {
        await addPromo(promoData);
      }
      setMessage({ type: "success", text: editingPromo ? "Promo updated successfully" : "Promo created successfully" });
      setShowModal(false);
      setEditingPromo(null);
      setFormData({
        code: "",
        type: "percentage",
        value: 0,
        itemId: "",
        minOrderAmount: "",
        maxUses: "",
        validFrom: "",
        validUntil: "",
        active: true,
      });
    } catch (e) {
      setMessage({ type: "error", text: "Failed to save promo. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (promo: PromoCode) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      type: promo.type,
      value: promo.value,
      itemId: promo.itemId?.toString() || "",
      minOrderAmount: promo.minOrderAmount?.toString() || "",
      maxUses: promo.maxUses?.toString() || "",
      validFrom: promo.validFrom.split("T")[0],
      validUntil: promo.validUntil.split("T")[0],
      active: promo.active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this promo code?")) {
      await deletePromo(id);
    }
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-chocolate">Promo Codes</h1>
            <p className="text-chocolate/60 mt-1">Create and manage discount codes</p>
          </div>
          <button
            onClick={() => {
              setEditingPromo(null);
              setFormData({
                code: "",
                type: "percentage",
                value: 0,
                itemId: "",
                minOrderAmount: "",
                maxUses: "",
                validFrom: "",
                validUntil: "",
                active: true,
              });
              setShowModal(true);
            }}
            className="bg-truffle text-white px-4 py-2 rounded-lg font-medium hover:bg-chocolate transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add Promo
          </button>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-lg mb-6 ${message.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {promos.length === 0 ? (
            <p className="text-chocolate/60 text-center py-8">No promo codes yet. Create your first one!</p>
          ) : (
            <div className="space-y-4">
              {promos.map((promo) => (
                <div key={promo.id} className="flex items-center justify-between bg-vanilla/20 rounded-lg p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-chocolate">{promo.code}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${promo.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {promo.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-chocolate/60">
                      {promo.type === "percentage" && `${promo.value}% off`}
                      {promo.type === "fixed" && `QAR ${promo.value} off`}
                      {promo.type === "item" && `${promo.value}% off item`}
                      {promo.minOrderAmount && ` • Min: QAR ${promo.minOrderAmount}`}
                      {promo.maxUses && ` • Max uses: ${promo.maxUses}`}
                    </p>
                    <p className="text-xs text-chocolate/50 mt-1">
                      Valid: {new Date(promo.validFrom).toLocaleDateString()} - {new Date(promo.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(promo)} className="text-truffle hover:text-chocolate p-2">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(promo.id)} className="text-red-500 hover:text-red-600 p-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-2xl font-bold text-chocolate">{editingPromo ? "Edit Promo" : "Add Promo Code"}</h2>
                <button onClick={() => setShowModal(false)} className="text-chocolate/60 hover:text-chocolate">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Promo Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER24"
                    className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "percentage" | "fixed" | "item" })}
                    className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (QAR)</option>
                    <option value="item">Item-specific (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">
                    {formData.type === "percentage" ? "Percentage Value" : formData.type === "fixed" ? "Fixed Amount (QAR)" : "Item Discount (%)"}
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                    placeholder="10"
                    className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                  />
                </div>
                {formData.type === "item" && (
                  <div>
                    <label className="block text-sm font-medium text-chocolate mb-1">Item ID</label>
                    <input
                      type="number"
                      value={formData.itemId}
                      onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                      placeholder="1"
                      className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Minimum Order Amount (QAR)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="0"
                    className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    placeholder="Unlimited"
                    className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-chocolate mb-1">Valid From</label>
                    <input
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-chocolate mb-1">Valid Until</label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-truffle rounded focus:ring-truffle"
                  />
                  <label htmlFor="active" className="text-sm text-chocolate">Active</label>
                </div>
                <button onClick={handleSubmit} disabled={saving} className="w-full bg-truffle text-white py-3 rounded-lg font-semibold hover:bg-chocolate transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Check size={18} />
                  {saving ? "Saving..." : editingPromo ? "Update" : "Create"} Promo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
