import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("[SMS Notification]", payload);
    return NextResponse.json({ success: true, message: "SMS queued for delivery" });
  } catch (error) {
    console.error("SMS notification error:", error);
    return NextResponse.json({ success: false, error: "Failed to process SMS" }, { status: 500 });
  }
}
