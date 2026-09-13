import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const tablesFile = path.join(dataDir, "tables.json");

if (!existsSync(dataDir)) {
  const { mkdirSync } = require("fs");
  mkdirSync(dataDir, { recursive: true });
}

export async function GET() {
  try {
    if (!existsSync(tablesFile)) {
      return NextResponse.json([]);
    }
    const data = readFileSync(tablesFile, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tables = existsSync(tablesFile) ? JSON.parse(readFileSync(tablesFile, "utf8")) : [];
    if (body.action === "sync") {
      writeFileSync(tablesFile, JSON.stringify(body.tables));
      return NextResponse.json({ success: true });
    }
    if (body.action === "create") {
      const newTable = {
        ...body.table,
        id: Date.now().toString(),
      };
      tables.push(newTable);
      writeFileSync(tablesFile, JSON.stringify(tables));
      return NextResponse.json({ success: true, table: newTable });
    }
    return NextResponse.json({ success: false }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const tables = existsSync(tablesFile) ? JSON.parse(readFileSync(tablesFile, "utf8")) : [];
    const index = tables.findIndex((t: any) => t.id === body.id);
    if (index >= 0) {
      tables[index] = { ...tables[index], ...body.updates };
      writeFileSync(tablesFile, JSON.stringify(tables));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    let tables = existsSync(tablesFile) ? JSON.parse(readFileSync(tablesFile, "utf8")) : [];
    tables = tables.filter((t: any) => t.id !== id);
    writeFileSync(tablesFile, JSON.stringify(tables));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
