import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const refundsFile = path.join(dataDir, "refunds.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readRefunds() {
  try {
    if (!existsSync(refundsFile)) return [];
    return JSON.parse(readFileSync(refundsFile, "utf8"));
  } catch { return []; }
}

function writeRefunds(refunds: any[]) {
  writeFileSync(refundsFile, JSON.stringify(refunds, null, 2));
}

export async function GET() {
  try { return NextResponse.json(readRefunds()); }
  catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const refunds = readRefunds();
    const refund = {
      id: "REF-" + Date.now().toString(),
      orderId: body.orderId,
      amount: body.amount,
      reason: body.reason,
      status: body.status || "pending",
      processedBy: body.processedBy || "admin",
      createdAt: new Date().toISOString(),
      processedAt: body.status === "approved" || body.status === "rejected" ? new Date().toISOString() : undefined,
    };
    refunds.push(refund);
    writeRefunds(refunds);
    return NextResponse.json({ success: true, refund });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const refunds = readRefunds();
    const index = refunds.findIndex((r: any) => r.id === body.id);
    if (index === -1) return NextResponse.json({ error: "Refund not found" }, { status: 404 });
    refunds[index] = { ...refunds[index], ...body, processedAt: new Date().toISOString() };
    writeRefunds(refunds);
    return NextResponse.json({ success: true, refund: refunds[index] });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
