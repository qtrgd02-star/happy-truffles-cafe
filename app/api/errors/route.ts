import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const errorsFile = path.join(dataDir, "errors.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readErrors() {
  try {
    if (!existsSync(errorsFile)) return [];
    return JSON.parse(readFileSync(errorsFile, "utf8"));
  } catch { return []; }
}

function writeErrors(errors: any[]) {
  writeFileSync(errorsFile, JSON.stringify(errors, null, 2));
}

export async function GET() {
  try { return NextResponse.json(readErrors()); }
  catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const errors = readErrors();
    errors.push({ ...body, id: "ERR-" + Date.now().toString(), loggedAt: new Date().toISOString() });
    writeErrors(errors);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
