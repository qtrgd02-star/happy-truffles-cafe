import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const cateringFile = path.join(dataDir, "catering.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readCateringOrders() {
  try {
    if (!existsSync(cateringFile)) return [];
    return JSON.parse(readFileSync(cateringFile, "utf8"));
  } catch { return []; }
}

function writeCateringOrders(orders: any[]) {
  writeFileSync(cateringFile, JSON.stringify(orders, null, 2));
}

export async function GET() {
  try { return NextResponse.json(readCateringOrders()); }
  catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "sync") {
      writeCateringOrders(body.orders || []);
      return NextResponse.json({ success: true });
    }
    const orders = readCateringOrders();
    const newOrder = { ...body, id: "CAT-" + Date.now().toString(), status: "quote", createdAt: new Date().toISOString() };
    orders.unshift(newOrder);
    writeCateringOrders(orders);
    return NextResponse.json({ success: true, order: newOrder });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
