import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("[Email Notification]", payload);
    return NextResponse.json({ success: true, message: "Email queued for delivery" });
  } catch (error) {
    console.error("Email notification error:", error);
    return NextResponse.json({ success: false, error: "Failed to process email" }, { status: 500 });
  }
}
