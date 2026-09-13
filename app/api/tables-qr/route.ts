import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const tablesFile = path.join(process.cwd(), "data", "tables.json");

function readTables() {
  try {
    if (!existsSync(tablesFile)) return [];
    return JSON.parse(readFileSync(tablesFile, "utf8"));
  } catch {
    return [];
  }
}

function writeTables(tables: any[]) {
  writeFileSync(tablesFile, JSON.stringify(tables, null, 2));
}

export async function GET() {
  try {
    const tables = readTables();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const tablesWithQr = tables.map((table: any) => ({
      ...table,
      qrUrl: `${baseUrl}/table-order?table=${table.id}`,
    }));
    return NextResponse.json(tablesWithQr);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tables = readTables();

    if (body.action === "create" || body.action === "update") {
      const index = tables.findIndex((t: any) => t.id === body.id);
      const tableData = {
        id: body.id,
        number: body.number || body.id,
        label: body.label || `Table ${body.id}`,
        seats: body.seats || 4,
        status: body.status || "available",
        qrCode: body.qrCode || ``,
      };

      if (index === -1) {
        tables.push(tableData);
      } else {
        tables[index] = { ...tables[index], ...tableData };
      }
      writeTables(tables);
      return NextResponse.json({ success: true, table: tableData });
    }

    if (body.action === "delete") {
      const filtered = tables.filter((t: any) => t.id !== body.id);
      writeTables(filtered);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
