import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const loyaltyFile = path.join(dataDir, "loyalty.json");

if (!existsSync(dataDir)) {
  const { mkdirSync } = require("fs");
  mkdirSync(dataDir, { recursive: true });
}

export async function GET() {
  try {
    if (!existsSync(loyaltyFile)) {
      return NextResponse.json({ points: 0 });
    }
    const data = readFileSync(loyaltyFile, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json({ points: 0 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = existsSync(loyaltyFile) ? JSON.parse(readFileSync(loyaltyFile, "utf8")) : { points: 0 };
    if (body.action === "add") {
      data.points = (data.points || 0) + (body.points || 0);
    } else if (body.action === "redeem") {
      data.points = Math.max(0, (data.points || 0) - (body.points || 0));
    } else if (body.action === "set") {
      data.points = body.points || 0;
    }
    writeFileSync(loyaltyFile, JSON.stringify(data));
    return NextResponse.json({ success: true, points: data.points });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
