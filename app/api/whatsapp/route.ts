import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", provider: "WhatsApp Business API" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, messageId: `msg_${Date.now()}`, to: body.to });
  } catch { return NextResponse.json({ success: false }, { status: 500 }); }
}