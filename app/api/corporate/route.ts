import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const file = path.join(dataDir, "corporate.json");

if (!existsSync(dataDir)) {
  const { mkdirSync } = require("fs");
  mkdirSync(dataDir, { recursive: true });
}

export async function GET() {
  try {
    if (!existsSync(file)) return NextResponse.json([]);
    const data = readFileSync(file, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const existing = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : [];
    const updated = [...existing, { ...body, id: Date.now().toString() }];
    writeFileSync(file, JSON.stringify(updated, null, 2));
    return NextResponse.json({ success: true, id: updated[updated.length - 1].id });
  } catch { return NextResponse.json({ success: false }, { status: 500 }); }
}