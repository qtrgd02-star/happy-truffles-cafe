import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const giftCardsFile = path.join(dataDir, "gift-cards.json");

if (!existsSync(dataDir)) {
  const { mkdirSync } = require("fs");
  mkdirSync(dataDir, { recursive: true });
}

export async function GET() {
  try {
    if (!existsSync(giftCardsFile)) {
      return NextResponse.json([]);
    }
    const data = readFileSync(giftCardsFile, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const giftCards = existsSync(giftCardsFile) ? JSON.parse(readFileSync(giftCardsFile, "utf8")) : [];
    if (body.action === "create") {
      const newCard = {
        code: "HT-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        balance: body.amount || 0,
        createdAt: new Date().toISOString(),
      };
      giftCards.push(newCard);
      writeFileSync(giftCardsFile, JSON.stringify(giftCards));
      return NextResponse.json({ success: true, card: newCard });
    }
    return NextResponse.json({ success: false }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
