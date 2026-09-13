import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "menuItems"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(items);
  } catch (error: any) {
    console.error("Failed to load menu from Firestore:", error);
    return NextResponse.json({ error: error.message || "Failed to load menu" }, { status: 500 });
  }
}
