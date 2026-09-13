import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { db } from "@/app/lib/firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, orderBy, query as firestoreQuery } from "firebase/firestore";

const dataDir = path.join(process.cwd(), "data");
const staffFile = path.join(dataDir, "staff.json");

if (!existsSync(dataDir)) {
  const { mkdirSync } = require("fs");
  mkdirSync(dataDir, { recursive: true });
}

function readLocalStaff() {
  try {
    if (!existsSync(staffFile)) {
      return [];
    }
    return JSON.parse(readFileSync(staffFile, "utf8"));
  } catch {
    return [];
  }
}

function writeLocalStaff(items: any[]) {
  writeFileSync(staffFile, JSON.stringify(items, null, 2));
}

export async function GET() {
  try {
    const snapshot = await getDocs(firestoreQuery(collection(db, "staff"), orderBy("createdAt", "desc")));
    const staff = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (staff.length > 0) {
      return NextResponse.json(staff);
    }
    return NextResponse.json(readLocalStaff());
  } catch {
    return NextResponse.json(readLocalStaff());
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "update") {
      const items = readLocalStaff();
      const index = items.findIndex((i: any) => i.id === body.id);
      if (index !== -1) {
        items[index] = { ...items[index], ...body.updates, updatedAt: new Date().toISOString() };
        writeLocalStaff(items);
      }
      return NextResponse.json({ success: true });
    }

    if (body.action === "delete") {
      const items = readLocalStaff();
      const filtered = items.filter((i: any) => i.id !== body.id);
      writeLocalStaff(filtered);
      return NextResponse.json({ success: true });
    }

    if (db) {
      await addDoc(collection(db, "staff"), { ...body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    } else {
      const items = readLocalStaff();
      const newItem = { id: Date.now().toString(), ...body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      items.push(newItem);
      writeLocalStaff(items);
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
