import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { db } from "@/app/lib/firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, orderBy, query as firestoreQuery } from "firebase/firestore";

const dataDir = path.join(process.cwd(), "data");
const inventoryFile = path.join(dataDir, "inventory.json");

if (!existsSync(dataDir)) {
  const { mkdirSync } = require("fs");
  mkdirSync(dataDir, { recursive: true });
}

function readLocalInventory() {
  try {
    if (!existsSync(inventoryFile)) {
      return [];
    }
    return JSON.parse(readFileSync(inventoryFile, "utf8"));
  } catch {
    return [];
  }
}

function writeLocalInventory(items: any[]) {
  writeFileSync(inventoryFile, JSON.stringify(items, null, 2));
}

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "inventory"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (items.length > 0) {
      return NextResponse.json(items);
    }
    return NextResponse.json(readLocalInventory());
  } catch {
    return NextResponse.json(readLocalInventory());
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "update-stock") {
      const items = readLocalInventory();
      const index = items.findIndex((i: any) => i.menuItemId === body.menuItemId);
      if (index !== -1) {
        items[index].stock = body.stock;
        items[index].updatedAt = new Date().toISOString();
        writeLocalInventory(items);
      }
      return NextResponse.json({ success: true });
    }

    if (body.action === "deduct") {
      const items = readLocalInventory();
      const index = items.findIndex((i: any) => i.menuItemId === body.menuItemId);
      if (index !== -1) {
        items[index].stock = Math.max(0, items[index].stock - body.quantity);
        items[index].updatedAt = new Date().toISOString();
        writeLocalInventory(items);
      }
      return NextResponse.json({ success: true });
    }

    if (db) {
      await addDoc(collection(db, "inventory"), { ...body, updatedAt: new Date().toISOString() });
    } else {
      const items = readLocalInventory();
      const newItem = { id: Date.now().toString(), ...body, updatedAt: new Date().toISOString() };
      items.push(newItem);
      writeLocalInventory(items);
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
