"use client";
import { useState } from "react";
import { useStaffSchedule, type StaffShift } from "@/app/staff-schedule-context";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, User, Briefcase, Plus } from "lucide-react";

export default function StaffSchedulePage() {
  const { shifts, addShift, updateShiftStatus } = useStaffSchedule();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ staffName: "", role: "", startTime: "", endTime: "", notes: "" });

  const dayShifts = shifts.filter((s) => s.date === selectedDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addShift({
      staffId: "EMP-" + Math.floor(100000 + Math.random() * 900000).toString(),
      staffName: form.staffName,
      role: form.role,
      date: selectedDate,
      startTime: form.startTime,
      endTime: form.endTime,
      status: "scheduled",
      notes: form.notes || undefined,
    });
    setForm({ staffName: "", role: "", startTime: "", endTime: "", notes: "" });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Calendar className="text-truffle mx-auto mb-2" size={40} />
            <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Staff Scheduling</h1>
            <p className="text-chocolate/60">Manage staff shifts and attendance</p>
          </div>
          <div className="flex items-center justify-between mb-6">
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border border-chocolate/20 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
            <button onClick={() => setShowForm(!showForm)} className="bg-truffle text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-chocolate transition-colors flex items-center gap-1">
              <Plus size={16} /> Add Shift
            </button>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-vanilla/20 rounded-xl p-6 mb-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="text-chocolate" size={20} />
                  <input type="text" required placeholder="Staff Name" value={form.staffName} onChange={(e) => setForm({ ...form, staffName: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="text-chocolate" size={20} />
                  <input type="text" required placeholder="Role (e.g., Barista, Waiter)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-chocolate" size={20} />
                  <input type="time" required value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-chocolate" size={20} />
                  <input type="time" required value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
                </div>
              </div>
              <textarea placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle resize-none" />
              <button type="submit" className="bg-truffle text-white px-6 py-2 rounded-full font-medium hover:bg-chocolate transition-colors">Add Shift</button>
            </form>
          )}
          <div className="space-y-3">
            {dayShifts.length === 0 ? (
              <p className="text-chocolate/60 text-center py-8">No shifts scheduled for this date</p>
            ) : (
              dayShifts.map((shift) => (
                <div key={shift.id} className="bg-vanilla/20 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-chocolate">{shift.staffName} <span className="text-sm text-chocolate/60">- {shift.role}</span></p>
                    <p className="text-sm text-chocolate/60">{shift.startTime} - {shift.endTime}</p>
                    {shift.notes && <p className="text-xs text-chocolate/50 italic">{shift.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${shift.status === "scheduled" ? "bg-yellow-100 text-yellow-800" : shift.status === "checked-in" ? "bg-green-100 text-green-800" : shift.status === "checked-out" ? "bg-gray-100 text-gray-800" : "bg-red-100 text-red-800"}`}>{shift.status}</span>
                    {shift.status === "scheduled" && (
                      <button onClick={() => updateShiftStatus(shift.id, "checked-in")} className="text-xs bg-truffle text-white px-3 py-1 rounded-full hover:bg-chocolate transition-colors">Check In</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
