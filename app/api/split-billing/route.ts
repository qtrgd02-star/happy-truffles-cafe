import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const splitBillsFile = path.join(dataDir, "split-bills.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readSplitBills() {
  try {
    if (!existsSync(splitBillsFile)) return [];
    return JSON.parse(readFileSync(splitBillsFile, "utf8"));
  } catch { return []; }
}

function writeSplitBills(bills: any[]) {
  writeFileSync(splitBillsFile, JSON.stringify(bills, null, 2));
}

export async function GET() {
  try { return NextResponse.json(readSplitBills()); }
  catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "sync") {
      writeSplitBills(body.bills || []);
      return NextResponse.json({ success: true });
    }
    const bills = readSplitBills();
    const newBill = { ...body, id: Date.now().toString(), createdAt: new Date().toISOString(), status: "pending" };
    bills.unshift(newBill);
    writeSplitBills(bills);
    return NextResponse.json({ success: true, bill: newBill });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
