import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount, orderId, cardDetails } = await request.json();

    if (!cardDetails || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
      return NextResponse.json({ error: "Invalid card details" }, { status: 400 });
    }

    const transactionId = "txn-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);

    return NextResponse.json({
      success: true,
      transactionId,
      message: "Payment processed successfully",
    });
  } catch (e) {
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
