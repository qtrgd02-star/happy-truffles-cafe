import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const driversFile = path.join(dataDir, "drivers.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readDrivers() {
  try {
    if (!existsSync(driversFile)) return [];
    return JSON.parse(readFileSync(driversFile, "utf8"));
  } catch { return []; }
}

function writeDrivers(data: any[]) {
  writeFileSync(driversFile, JSON.stringify(data, null, 2));
}

export async function GET() {
  try { return NextResponse.json(readDrivers()); }
  catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const drivers = readDrivers();
    const newDriver = { ...body, id: "DRV-" + Date.now().toString() };
    drivers.push(newDriver);
    writeDrivers(drivers);
    return NextResponse.json({ success: true, driver: newDriver });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
