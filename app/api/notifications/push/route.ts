import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { subscription, title, body, data } = await request.json();

    if (!subscription || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("Push notification:", { title, body, subscription: subscription.endpoint });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
