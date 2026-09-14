import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const eventsFile = path.join(dataDir, "events.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readEvents() {
  try {
    if (!existsSync(eventsFile)) return [];
    return JSON.parse(readFileSync(eventsFile, "utf8"));
  } catch { return []; }
}

function writeEvents(data: any[]) {
  writeFileSync(eventsFile, JSON.stringify(data, null, 2));
}

export async function GET() {
  try { return NextResponse.json(readEvents()); }
  catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "sync") {
      writeEvents(body.events || []);
      return NextResponse.json({ success: true });
    }
    const events = readEvents();
    const newEvent = { ...body, id: "EVT-" + Date.now().toString(), createdAt: new Date().toISOString() };
    events.unshift(newEvent);
    writeEvents(events);
    return NextResponse.json({ success: true, event: newEvent });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
