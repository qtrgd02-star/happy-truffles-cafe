import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

const SETTINGS_COLLECTION = "settings";
const SETTINGS_DOC = "restaurant";

export async function GET() {
  if (!db) {
    return NextResponse.json({ error: "Firebase is not configured" }, { status: 500 });
  }
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
    const snapshot = await getDoc(settingsRef);
    if (snapshot.exists()) {
      return NextResponse.json(snapshot.data());
    }
    return NextResponse.json({
      restaurantName: "Happy Truffles Cafe",
      address: "Gold Plaza, Abu Hamour, Doha, Qatar",
      phone: "+974 3159 0002",
      email: "info@happytruffles.qa",
      openingHours: "9:00 AM - 11:30 PM",
      description: "A cozy retreat in the heart of Gold Plaza, Abu Hamour.",
    });
  } catch (error: any) {
    console.error("Failed to load settings from Firestore:", error);
    return NextResponse.json({ error: error.message || "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!db) {
    return NextResponse.json({ error: "Firebase is not configured" }, { status: 500 });
  }
  try {
    const body = await request.json();
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
    await setDoc(settingsRef, body, { merge: true });
    return NextResponse.json({ success: true, settings: body });
  } catch (error: any) {
    console.error("Failed to save settings to Firestore:", error);
    return NextResponse.json({ error: error.message || "Failed to save settings" }, { status: 500 });
  }
}
