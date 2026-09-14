import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const scheduledOrdersFile = path.join(dataDir, "scheduled-orders.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readScheduledOrders() {
  try {
    if (!existsSync(scheduledOrdersFile)) return [];
    return JSON.parse(readFileSync(scheduledOrdersFile, "utf8"));
  } catch { return []; }
}

function writeScheduledOrders(orders: any[]) {
  writeFileSync(scheduledOrdersFile, JSON.stringify(orders, null, 2));
}

export async function GET() {
  try {
    return NextResponse.json(readScheduledOrders());
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "sync") {
      writeScheduledOrders(body.orders || []);
      return NextResponse.json({ success: true });
    }
    const orders = readScheduledOrders();
    const newOrder = { ...body, id: Date.now().toString(), createdAt: new Date().toISOString(), status: "scheduled" };
    orders.unshift(newOrder);
    writeScheduledOrders(orders);
    return NextResponse.json({ success: true, order: newOrder });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
