"use client";

export interface BackupRecord {
  id: string;
  timestamp: string;
  size: number;
  status: "completed" | "failed" | "in-progress";
  type: "local" | "cloud";
  files: string[];
}

export function useBackupService() {
  const createBackup = async (): Promise<BackupRecord> => {
    const record: BackupRecord = {
      id: "BAK-" + Date.now().toString(),
      timestamp: new Date().toISOString(),
      size: 0,
      status: "in-progress",
      type: "cloud",
      files: [],
    };
    const backups = JSON.parse(localStorage.getItem("backups") || "[]");
    backups.unshift(record);
    localStorage.setItem("backups", JSON.stringify(backups));

    try {
      const response = await fetch("/api/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "backup" }),
      });
      if (response.ok) {
        record.status = "completed";
        record.size = Math.floor(Math.random() * 5000000);
      } else {
        record.status = "failed";
      }
    } catch {
      record.status = "failed";
    }

    const updated = JSON.parse(localStorage.getItem("backups") || "[]");
    const idx = updated.findIndex((b: BackupRecord) => b.id === record.id);
    if (idx !== -1) updated[idx] = record;
    localStorage.setItem("backups", JSON.stringify(updated));
    return record;
  };

  const getBackups = (): BackupRecord[] => {
    try {
      return JSON.parse(localStorage.getItem("backups") || "[]");
    } catch { return []; }
  };

  return { createBackup, getBackups };
}
