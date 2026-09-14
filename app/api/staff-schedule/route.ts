import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const staffShiftsFile = path.join(dataDir, "staff-shifts.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readStaffShifts() {
  try {
    if (!existsSync(staffShiftsFile)) return [];
    return JSON.parse(readFileSync(staffShiftsFile, "utf8"));
  } catch { return []; }
}

function writeStaffShifts(shifts: any[]) {
  writeFileSync(staffShiftsFile, JSON.stringify(shifts, null, 2));
}

export async function GET() {
  try { return NextResponse.json(readStaffShifts()); }
  catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "sync") {
      writeStaffShifts(body.shifts || []);
      return NextResponse.json({ success: true });
    }
    const shifts = readStaffShifts();
    const newShift = { ...body, id: "SHF-" + Date.now().toString() };
    shifts.push(newShift);
    writeStaffShifts(shifts);
    return NextResponse.json({ success: true, shift: newShift });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
