import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const waitlistFile = path.join(dataDir, "waitlist.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readWaitlist() {
  try {
    if (!existsSync(waitlistFile)) return [];
    return JSON.parse(readFileSync(waitlistFile, "utf8"));
  } catch { return []; }
}

function writeWaitlist(entries: any[]) {
  writeFileSync(waitlistFile, JSON.stringify(entries, null, 2));
}

export async function GET() {
  try { return NextResponse.json(readWaitlist()); }
  catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "sync") {
      writeWaitlist(body.entries || []);
      return NextResponse.json({ success: true });
    }
    const entries = readWaitlist();
    const newEntry = { ...body, id: Date.now().toString(), joinedAt: new Date().toISOString(), status: "waiting" };
    entries.push(newEntry);
    writeWaitlist(entries);
    return NextResponse.json({ success: true, entry: newEntry });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
