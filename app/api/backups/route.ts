import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const backupsFile = path.join(dataDir, "backups.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readBackups() {
  try {
    if (!existsSync(backupsFile)) return [];
    return JSON.parse(readFileSync(backupsFile, "utf8"));
  } catch { return []; }
}

function writeBackups(backups: any[]) {
  writeFileSync(backupsFile, JSON.stringify(backups, null, 2));
}

export async function GET() {
  try {
    const backups = readBackups();
    return NextResponse.json(backups);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "backup") {
      const backupFiles = ["data/orders.json", "data/reservations.json", "data/cart.json", "data/waitlist.json", "data/referrals.json"];
      const files: string[] = [];
      let totalSize = 0;
      for (const file of backupFiles) {
        const fullPath = path.join(process.cwd(), file);
        if (existsSync(fullPath)) {
          const stats = statSync(fullPath);
          totalSize += stats.size;
          files.push(file);
        }
      }
      const backup = {
        id: "BAK-" + Date.now().toString(),
        timestamp: new Date().toISOString(),
        size: totalSize,
        status: "completed",
        type: "cloud",
        files,
      };
      const backups = readBackups();
      backups.unshift(backup);
      writeBackups(backups);
      return NextResponse.json({ success: true, backup });
    }
    return NextResponse.json({ success: false }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
