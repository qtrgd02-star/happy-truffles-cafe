import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const cartFile = path.join(dataDir, "cart.json");

if (!existsSync(dataDir)) {
  const { mkdirSync } = require("fs");
  mkdirSync(dataDir, { recursive: true });
}

export async function GET() {
  try {
    if (!existsSync(cartFile)) {
      return NextResponse.json([]);
    }
    const data = readFileSync(cartFile, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    writeFileSync(cartFile, JSON.stringify(body));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    if (existsSync(cartFile)) {
      const { unlinkSync } = require("fs");
      unlinkSync(cartFile);
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
