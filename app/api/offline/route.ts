import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "offline", message: "Service is currently unavailable offline" });
}
