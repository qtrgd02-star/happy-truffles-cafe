import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const newsletterFile = path.join(dataDir, "newsletter.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readNewsletter() {
  try {
    if (!existsSync(newsletterFile)) return [];
    return JSON.parse(readFileSync(newsletterFile, "utf8"));
  } catch { return []; }
}

function writeNewsletter(data: any[]) {
  writeFileSync(newsletterFile, JSON.stringify(data, null, 2));
}

export async function GET() {
  try { return NextResponse.json(readNewsletter()); }
  catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "subscribe") {
      const subscribers = readNewsletter();
      if (subscribers.find((s: any) => s.email === body.email)) {
        return NextResponse.json({ success: false, message: "Already subscribed" }, { status: 400 });
      }
      subscribers.push({ email: body.email, name: body.name, subscribedAt: new Date().toISOString(), active: true });
      writeNewsletter(subscribers);
      return NextResponse.json({ success: true, message: "Subscribed successfully!" });
    }
    if (body.action === "send") {
      const subscribers = readNewsletter().filter((s: any) => s.active);
      return NextResponse.json({ success: true, sentTo: subscribers.length, message: `Campaign sent to ${subscribers.length} subscribers` });
    }
    if (body.action === "sync") {
      writeNewsletter(body.subscribers || []);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
