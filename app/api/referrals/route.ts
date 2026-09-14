import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const referralsFile = path.join(dataDir, "referrals.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readReferrals() {
  try {
    if (!existsSync(referralsFile)) return [];
    return JSON.parse(readFileSync(referralsFile, "utf8"));
  } catch { return []; }
}

function writeReferrals(data: any[]) {
  writeFileSync(referralsFile, JSON.stringify(data, null, 2));
}

export async function GET() {
  try { return NextResponse.json(readReferrals()); }
  catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "sync") {
      writeReferrals(body.referrals || []);
      return NextResponse.json({ success: true });
    }
    const referrals = readReferrals();
    const newReferral = { ...body, id: Date.now().toString(), createdAt: new Date().toISOString(), status: "pending" };
    referrals.push(newReferral);
    writeReferrals(referrals);
    return NextResponse.json({ success: true, referral: newReferral });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
