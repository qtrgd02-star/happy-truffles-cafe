import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const reservationsFile = path.join(dataDir, "reservations.json");

if (!existsSync(dataDir)) {
  const { mkdirSync } = require("fs");
  mkdirSync(dataDir, { recursive: true });
}

function readReservations() {
  try {
    if (!existsSync(reservationsFile)) return [];
    return JSON.parse(readFileSync(reservationsFile, "utf8"));
  } catch {
    return [];
  }
}

function writeReservations(reservations: any[]) {
  writeFileSync(reservationsFile, JSON.stringify(reservations, null, 2));
}

export async function GET(request: Request) {
    try {
      const reservations = readReservations();
      return NextResponse.json(reservations);
    } catch {
      return NextResponse.json([]);
    }
  }

  export async function DELETE(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");

      if (!id) {
        return NextResponse.json({ error: "Reservation ID required" }, { status: 400 });
      }

      const reservations = readReservations();
      const index = reservations.findIndex((r: any) => r.id === id);

      if (index === -1) {
        return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
      }

      reservations[index].status = "cancelled";
      reservations[index].cancelledAt = new Date().toISOString();
      writeReservations(reservations);

      return NextResponse.json({ success: true, reservation: reservations[index] });
    } catch {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
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


