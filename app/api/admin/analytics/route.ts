import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7d";

    const orders = readOrders();
    const now = new Date();
    const days = range === "30d" ? 30 : range === "90d" ? 90 : 7;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const filteredOrders = orders.filter((o: any) => new Date(o.createdAt) >= cutoff);

    const totalSales = filteredOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    const itemCounts: Record<string, { count: number; revenue: number }> = {};
    filteredOrders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        if (!itemCounts[item.title]) {
          itemCounts[item.title] = { count: 0, revenue: 0 };
        }
        itemCounts[item.title].count += item.quantity;
        itemCounts[item.title].revenue += item.price * item.quantity;
      });
    });

    const topItems = Object.entries(itemCounts)
      .map(([title, data]) => ({ title, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const salesByHour: Record<string, number> = {};
    const salesByDay: Record<string, number> = {};

    filteredOrders.forEach((order: any) => {
      const date = new Date(order.createdAt);
      const hour = date.getHours() + ":00";
      const day = date.toLocaleDateString("en-US", { weekday: "short" });

      salesByHour[hour] = (salesByHour[hour] || 0) + (order.total || 0);
      salesByDay[day] = (salesByDay[day] || 0) + (order.total || 0);
    });

    return NextResponse.json({
      totalSales,
      totalOrders,
      averageOrderValue,
      topItems,
      salesByHour: Object.entries(salesByHour).map(([hour, sales]) => ({ hour, sales })),
      salesByDay: Object.entries(salesByDay).map(([day, sales]) => ({ day, sales })),
    });
  } catch {
    return NextResponse.json({
      totalSales: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      topItems: [],
      salesByHour: [],
      salesByDay: [],
    });
  }
}
