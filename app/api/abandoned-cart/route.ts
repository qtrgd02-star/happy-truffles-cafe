import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const abandonedCartsFile = path.join(dataDir, "abandoned-carts.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readAbandonedCarts() {
  try {
    if (!existsSync(abandonedCartsFile)) return [];
    return JSON.parse(readFileSync(abandonedCartsFile, "utf8"));
  } catch { return []; }
}

function writeAbandonedCarts(carts: any[]) {
  writeFileSync(abandonedCartsFile, JSON.stringify(carts, null, 2));
}

export async function GET() {
  try {
    const carts = readAbandonedCarts();
    return NextResponse.json(carts.filter((c: any) => !c.recovered));
  } catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "save") {
      const carts = readAbandonedCarts();
      carts.push(body.cart);
      writeAbandonedCarts(carts);
      return NextResponse.json({ success: true });
    }
    if (body.action === "mark-recovered") {
      const carts = readAbandonedCarts();
      const updated = carts.map((c: any) => (c.id === body.id ? { ...c, recovered: true } : c));
      writeAbandonedCarts(updated);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
