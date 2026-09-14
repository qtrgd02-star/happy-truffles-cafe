"use client";

import { useState } from "react";
import { useBackupService } from "@/app/lib/backup-service";
import { motion } from "framer-motion";
import { Database, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function AdminBackupsPage() {
  const { createBackup, getBackups } = useBackupService();
  const [backups, setBackups] = useState(getBackups());
  const [loading, setLoading] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  const handleBackup = async () => {
    setLoading(true);
    const result = await createBackup();
    setBackups(getBackups());
    setLastBackup(result.timestamp);
    setLoading(false);
  };

  const handleRestore = async (backupId: string) => {
    await fetch("/api/backups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "restore", backupId }),
    });
    alert("Restore initiated for backup " + backupId);
  };

  function getStatusColor(status: string) {
    if (status === "completed") return "bg-green-100 text-green-600";
    if (status === "in-progress") return "bg-blue-100 text-blue-600";
    return "bg-red-100 text-red-600";
  }

  function getBadgeColor(status: string) {
    if (status === "completed") return "bg-green-100 text-green-800";
    if (status === "in-progress") return "bg-blue-100 text-blue-800";
    return "bg-red-100 text-red-800";
  }

  return (
    <div className="min-h-screen bg-vanilla/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-playfair text-4xl font-bold text-chocolate mb-8">Automated Backups</h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-playfair text-2xl font-bold text-chocolate mb-1">Cloud Backup</h2>
              <p className="text-chocolate/60">Automatically backup your data to the cloud</p>
            </div>
            <button onClick={handleBackup} disabled={loading} className="bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors flex items-center gap-2 disabled:opacity-50">
              <Database size={18} />
              {loading ? "Backing up..." : "Backup Now"}
            </button>
          </div>
          {lastBackup && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-green-800 text-sm">Last backup: {new Date(lastBackup).toLocaleString()}</p>
            </div>
          )}
          <h3 className="font-playfair text-xl font-bold text-chocolate mb-4">Backup History</h3>
          <div className="space-y-3">
            {backups.length === 0 ? (
              <p className="text-chocolate/60 text-center py-8">No backups yet</p>
            ) : (
              backups.map((backup: any) => (
                <div key={backup.id} className="bg-vanilla/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={"p-2 rounded-full " + getStatusColor(backup.status)}>
                      {backup.status === "completed" ? <CheckCircle size={20} /> : backup.status === "in-progress" ? <Clock size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div>
                      <p className="font-medium text-chocolate text-sm">{backup.id}</p>
                      <p className="text-xs text-chocolate/60">{new Date(backup.timestamp).toLocaleString()} | {(backup.size / 1024).toFixed(1)} KB | {backup.files?.length || 0} files</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={"px-2 py-1 rounded-full text-xs font-medium " + getBadgeColor(backup.status)}>{backup.status}</span>
                    {backup.status === "completed" && (
                      <button onClick={() => handleRestore(backup.id)} className="text-truffle text-sm font-medium hover:text-chocolate">Restore</button>
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
