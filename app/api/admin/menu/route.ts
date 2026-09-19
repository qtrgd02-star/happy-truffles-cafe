import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase/config";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

const MENU_DATA_PATH = path.join(process.cwd(), "app", "menu-data.ts");

function readMenuData() {
  const content = fs.readFileSync(MENU_DATA_PATH, "utf8");
  const itemRegex = /\{\s*id:\s*(\d+),[\s\S]*?title:\s*"([^"]+)",[\s\S]*?description:\s*"([^"]+)",[\s\S]*?price:\s*(\d+(?:\.\d+)?),[\s\S]*?category:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)",/g;
  const matches = Array.from(content.matchAll(itemRegex));
  return matches.map((m) => ({
    id: parseInt(m[1]),
    title: m[2],
    description: m[3],
    price: parseFloat(m[4]),
    category: m[5],
    image: m[6],
  }));
}

function writeMenuData(items: any[]) {
  const header = `import type { LucideIcon } from "lucide-react";
import { Cookie, Coffee, GlassWater, UtensilsCrossed, Heart, Star } from "lucide-react";

export interface MenuItem {
  category: string;
  id: number;
  title: string;
  description: string;
  price: number;
  highlight: boolean;
  icon: LucideIcon;
  image: string;
  sizes?: { name: string; price: number }[];
}

export const menuItems: MenuItem[] = [
`;
  const footer = `];
`;

  const body = items
    .map(
      (item) => `  {
    id: ${item.id},
    title: "${item.title.replace(/"/g, '\\"')}",
    description: "${item.description.replace(/"/g, '\\"')}",
    price: ${item.price},
    highlight: ${item.highlight ?? false},
    icon: Cookie,
    category: "${item.category}",
    image: "${item.image}",
  },`
    )
    .join("\n");

  fs.writeFileSync(MENU_DATA_PATH, header + body + "\n" + footer, "utf8");
}

export async function GET() {
  if (!db) {
    return NextResponse.json({ error: "Firebase is not configured" }, { status: 500 });
  }
  try {
    const snapshot = await getDocs(collection(db, "menuItems"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(items);
  } catch (error: any) {
    console.error("Failed to load menu from Firestore:", error);
    return NextResponse.json({ error: error.message || "Failed to load menu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!db) {
    return NextResponse.json({ error: "Firebase is not configured" }, { status: 500 });
  }
  try {
    const body = await request.json();
    const newItem = {
      title: body.title,
      description: body.description,
      price: parseFloat(body.price || 0),
      category: body.category || "Truffles & Bites",
      image: body.image || "/menu/menu-001.jpg",
      highlight: false,
      createdAt: new Date(),
    };
    const docRef = await addDoc(collection(db, "menuItems"), newItem);
    
    // Also update the static menu-data.ts file
    const items = readMenuData();
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    const staticItem = {
      id: maxId + 1,
      ...newItem,
    };
    items.push(staticItem);
    writeMenuData(items);
    
    return NextResponse.json({ id: docRef.id, ...newItem });
  } catch (error: any) {
    console.error("Failed to create menu item:", error);
    return NextResponse.json({ error: error.message || "Failed to create item" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!db) {
    return NextResponse.json({ error: "Firebase is not configured" }, { status: 500 });
  }
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }
    const itemRef = doc(db, "menuItems", body.id);
    await updateDoc(itemRef, {
      title: body.title,
      description: body.description,
      price: parseFloat(body.price || 0),
      category: body.category,
      image: body.image,
    });
    
    // Also update the static menu-data.ts file
    const items = readMenuData();
    const index = items.findIndex((item) => item.id === parseInt(body.id) || item.id === body.id);
    if (index !== -1) {
      items[index] = { ...items[index], ...body, price: parseFloat(body.price || items[index].price) };
      writeMenuData(items);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update menu item:", error);
    return NextResponse.json({ error: error.message || "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!db) {
    return NextResponse.json({ error: "Firebase is not configured" }, { status: 500 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }
    await deleteDoc(doc(db, "menuItems", id));
    
    // Also update the static menu-data.ts file
    const items = readMenuData();
    const filtered = items.filter((item) => item.id !== parseInt(id));
    writeMenuData(filtered);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete menu item:", error);
    return NextResponse.json({ error: error.message || "Failed to delete item" }, { status: 500 });
  }
}
