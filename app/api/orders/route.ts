import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { db } from "@/app/lib/firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";

const dataDir = path.join(process.cwd(), "data");
const ordersFile = path.join(dataDir, "orders.json");

if (!existsSync(dataDir)) {
  const { mkdirSync } = require("fs");
  mkdirSync(dataDir, { recursive: true });
}

function readLocalOrders() {
  try {
    if (!existsSync(ordersFile)) {
      return [];
    }
    return JSON.parse(readFileSync(ordersFile, "utf8"));
  } catch {
    return [];
  }
}

function writeLocalOrders(orders: any[]) {
  writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "orders"));
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (orders.length > 0) {
      return NextResponse.json(orders);
    }
    return NextResponse.json(readLocalOrders());
  } catch {
    return NextResponse.json(readLocalOrders());
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "sync") {
      writeLocalOrders(body.orders || []);
      return NextResponse.json({ success: true });
    }

    if (body.action === "update-status") {
      try {
        const orderRef = doc(db, "orders", body.id);
        await updateDoc(orderRef, { status: body.status });
      } catch {
        const orders = readLocalOrders();
        const index = orders.findIndex((o: any) => o.id === body.id);
        if (index !== -1) {
          orders[index].status = body.status;
          writeLocalOrders(orders);
        }
      }
      return NextResponse.json({ success: true });
    }

    const orderData = {
      ...body,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      return NextResponse.json({ success: true, order: { ...orderData, id: docRef.id } });
    } catch {
      const orders = readLocalOrders();
      const newOrder = {
        ...orderData,
        id: Date.now().toString(),
      };
      orders.unshift(newOrder);
      writeLocalOrders(orders);
      return NextResponse.json({ success: true, order: newOrder });
    }
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
