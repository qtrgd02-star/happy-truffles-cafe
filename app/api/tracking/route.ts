import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const ordersFile = path.join(process.cwd(), "data", "orders.json");

function readOrders() {
  try {
    if (!existsSync(ordersFile)) return [];
    return JSON.parse(readFileSync(ordersFile, "utf8"));
  } catch {
    return [];
  }
}

function writeOrders(orders: any[]) {
  writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const phone = searchParams.get("phone");

    const orders = readOrders();
    const order = orders.find((o: any) => {
      const idMatch = orderId ? o.id === orderId : false;
      const phoneMatch = phone ? o.customer.phone === phone : false;
      return idMatch || phoneMatch;
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { orderId, status } = await request.json();
    const orders = readOrders();
    const index = orders.findIndex((o: any) => o.id === orderId);

    if (index === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    orders[index].status = status;
    orders[index].statusUpdatedAt = new Date().toISOString();
    writeOrders(orders);

    return NextResponse.json({ success: true, order: orders[index] });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
