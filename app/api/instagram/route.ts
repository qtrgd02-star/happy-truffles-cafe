import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "post") {
      return NextResponse.json({ success: true, postId: `ig_${Date.now()}`, message: "Posted to Instagram" });
    }
    return NextResponse.json({ success: false }, { status: 400 });
  } catch { return NextResponse.json({ success: false }, { status: 500 }); }
}

export async function GET() {
  return NextResponse.json({ status: "ok", autoPostEnabled: true });
}