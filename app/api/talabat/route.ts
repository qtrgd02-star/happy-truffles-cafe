import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { SyncResult } from "@/app/lib/types";

const dataDir = path.join(process.cwd(), "data");
const file = path.join(dataDir, "talabat-orders.json");

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
    const result: SyncResult = { success: true, imported: 0, errors: [] };

    if (body.action === "import" && Array.isArray(body.orders)) {
      const newOrders = body.orders.map((order: any) => ({ ...order, source: "talabat", importedAt: new Date().toISOString() }));
      const updated = [...existing, ...newOrders];
      writeFileSync(file, JSON.stringify(updated, null, 2));
      result.imported = newOrders.length;
      return NextResponse.json(result);
    }

    if (body.action === "sync") {
      writeFileSync(file, JSON.stringify(body.orders || [], null, 2));
      result.imported = (body.orders || []).length;
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ success: false, errors: [String(e)] }, { status: 500 });
  }
}