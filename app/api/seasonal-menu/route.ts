import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const seasonalFile = path.join(dataDir, "seasonal-menu.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readSeasonalMenu() {
  try {
    if (!existsSync(seasonalFile)) return [];
    return JSON.parse(readFileSync(seasonalFile, "utf8"));
  } catch { return []; }
}

function writeSeasonalMenu(data: any[]) {
  writeFileSync(seasonalFile, JSON.stringify(data, null, 2));
}

export async function GET() {
  try { return NextResponse.json(readSeasonalMenu()); }
  catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "sync") {
      writeSeasonalMenu(body.items || []);
      return NextResponse.json({ success: true });
    }
    const items = readSeasonalMenu();
    const newItem = { ...body, id: Date.now(), available: true };
    items.push(newItem);
    writeSeasonalMenu(items);
    return NextResponse.json({ success: true, item: newItem });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
