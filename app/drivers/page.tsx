"use client";
import { useState } from "react";
import { useDrivers } from "@/app/driver-context";
import { motion } from "framer-motion";
import { Truck, UserPlus, MapPin, CheckCircle, Clock } from "lucide-react";

export default function DriversPage() {
  const { drivers, assignments, addDriver, assignDriver, updateAssignmentStatus, getAvailableDrivers } = useDrivers();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: "", phone: "", vehicle: "", plateNumber: "" });
  const [assignOrderId, setAssignOrderId] = useState("");

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    addDriver({ ...newDriver, status: "available" });
    setNewDriver({ name: "", phone: "", vehicle: "", plateNumber: "" });
    setShowAddForm(false);
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignOrderId) return;
    const available = getAvailableDrivers();
    if (available.length === 0) return;
    assignDriver(assignOrderId, available[0].id);
    setAssignOrderId("");
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <Truck className="text-truffle mx-auto mb-2" size={40} />
              <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Delivery Drivers</h1>
              <p className="text-chocolate/60">Manage drivers and assign deliveries</p>
            </div>
            <button onClick={() => setShowAddForm(!showAddForm)} className="bg-truffle text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-chocolate transition-colors flex items-center gap-1">
              <UserPlus size={16} /> Add Driver
            </button>
          </div>
          {showAddForm && (
            <form onSubmit={handleAddDriver} className="bg-vanilla/20 rounded-xl p-6 mb-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Driver Name" required value={newDriver.name} onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })} className="border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
                <input type="tel" placeholder="Phone" required value={newDriver.phone} onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })} className="border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
                <input type="text" placeholder="Vehicle" required value={newDriver.vehicle} onChange={(e) => setNewDriver({ ...newDriver, vehicle: e.target.value })} className="border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
                <input type="text" placeholder="Plate Number" required value={newDriver.plateNumber} onChange={(e) => setNewDriver({ ...newDriver, plateNumber: e.target.value })} className="border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle" />
              </div>
              <button type="submit" className="bg-truffle text-white px-6 py-2 rounded-full font-medium hover:bg-chocolate transition-colors">Add Driver</button>
            </form>
          )}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-playfair text-xl font-bold text-chocolate mb-4">Drivers ({drivers.length})</h3>
              <div className="space-y-3">
                {drivers.map((driver) => (
                  <div key={driver.id} className="bg-vanilla/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-chocolate">{driver.name}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${driver.status === "available" ? "bg-green-100 text-green-800" : driver.status === "on-delivery" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>{driver.status}</span>
                    </div>
                    <p className="text-xs text-chocolate/60">{driver.phone} | {driver.vehicle} | {driver.plateNumber}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-chocolate mb-4">Active Assignments ({assignments.length})</h3>
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-vanilla/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-chocolate">Order {assignment.orderId}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${assignment.status === "assigned" ? "bg-yellow-100 text-yellow-800" : assignment.status === "picked-up" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{assignment.status}</span>
                    </div>
                    <p className="text-xs text-chocolate/60">Driver: {assignment.driverName}</p>
                    <div className="flex gap-2 mt-2">
                      {assignment.status === "assigned" && (
                        <button onClick={() => updateAssignmentStatus(assignment.id, "picked-up")} className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors">Picked Up</button>
                      )}
                      {assignment.status === "picked-up" && (
                        <button onClick={() => updateAssignmentStatus(assignment.id, "delivered")} className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors">Delivered</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
