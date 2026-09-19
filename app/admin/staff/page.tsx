"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStaff, type StaffMember } from "@/app/staff-context";
import { useAuth } from "@/app/auth-context";
import { Users, Plus, Trash2, Edit, X, Check, Shield, User as UserIcon, Download } from "lucide-react";
import { exportStaffToCsv } from "@/app/lib/export";

export default function AdminStaffPage() {
  const { hasRole, isAuthenticated } = useAuth();
  const { staff, addStaff, updateStaff, deleteStaff, refresh } = useStaff();
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff" as "staff" | "admin" | "manager",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!isAuthenticated || !hasRole("admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-4">Access Denied</h1>
          <p className="text-chocolate/60 mb-6">You need admin privileges to access staff management.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setFormError("");
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Name and email are required");
      return;
    }

    if (editingStaff) {
      await updateStaff(editingStaff.id, formData);
    } else {
      await addStaff(formData);
    }

    setShowModal(false);
    setEditingStaff(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "staff",
      status: "active",
    });
  };

  const handleEdit = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      status: member.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      await deleteStaff(id);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><Shield size={12} /> Admin</span>;
      case "manager":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Shield size={12} /> Manager</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><UserIcon size={12} /> Staff</span>;
    }
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-chocolate">Staff Management</h1>
            <p className="text-chocolate/60 mt-1">Manage staff accounts, roles, and permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportStaffToCsv(staff)}
              className="flex items-center gap-2 border border-chocolate/20 text-chocolate px-4 py-2 rounded-lg text-sm font-medium hover:bg-chocolate/5 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={() => {
                setEditingStaff(null);
                setFormData({ name: "", email: "", phone: "", role: "staff", status: "active" });
                setShowModal(true);
              }}
              className="bg-truffle text-white px-4 py-2 rounded-lg font-medium hover:bg-chocolate transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Staff
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {staff.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <Users size={48} className="text-chocolate/20 mx-auto mb-4" />
              <p className="text-chocolate/60">No staff members yet</p>
            </div>
          ) : (
            staff.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-truffle/10 flex items-center justify-center">
                      <UserIcon className="text-truffle" size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-playfair text-lg font-bold text-chocolate">{member.name}</h3>
                        {getRoleBadge(member.role)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {member.status}
                        </span>
                      </div>
                      <p className="text-chocolate/60 text-sm">{member.email} | {member.phone}</p>
                      <p className="text-chocolate/50 text-xs mt-1">
                        Added {new Date(member.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-truffle hover:text-chocolate p-2"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-red-500 hover:text-red-600 p-2"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-2xl font-bold text-chocolate">
                  {editingStaff ? "Edit Staff Member" : "Add Staff Member"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-chocolate/60 hover:text-chocolate">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {formError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as "staff" | "admin" | "manager" })}
                    className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                    className="w-full border border-chocolate/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowModal(false)} className="flex-1 bg-chocolate/10 text-chocolate py-2 rounded-lg font-medium hover:bg-chocolate/20 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.email}
                    className="flex-1 bg-truffle text-white py-2 rounded-lg font-medium hover:bg-chocolate transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    <Check size={16} />
                    {editingStaff ? "Save Changes" : "Add Staff"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
