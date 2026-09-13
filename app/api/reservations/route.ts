import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const reservationsFile = path.join(dataDir, "reservations.json");

if (!existsSync(dataDir)) {
  const { mkdirSync } = require("fs");
  mkdirSync(dataDir, { recursive: true });
}

export async function GET() {
  try {
    if (!existsSync(reservationsFile)) {
      return NextResponse.json([]);
    }
    const data = readFileSync(reservationsFile, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "sync") {
      writeFileSync(reservationsFile, JSON.stringify(body.reservations));
      return NextResponse.json({ success: true });
    }
    const reservations = existsSync(reservationsFile) ? JSON.parse(readFileSync(reservationsFile, "utf8")) : [];
    const newReservation = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    reservations.unshift(newReservation);
    writeFileSync(reservationsFile, JSON.stringify(reservations));
    return NextResponse.json({ success: true, reservation: newReservation });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
