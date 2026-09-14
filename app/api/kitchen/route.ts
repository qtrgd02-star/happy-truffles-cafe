import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function GET() {
  try {
    if (db) {
      const snapshot = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
      const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json(orders);
    }
  } catch (e) { /* fallback */ }
  return NextResponse.json([]);
}
