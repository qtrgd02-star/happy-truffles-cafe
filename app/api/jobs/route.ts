import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const jobsFile = path.join(dataDir, "jobs.json");
if (!existsSync(dataDir)) require("fs").mkdirSync(dataDir, { recursive: true });

function readApplications() {
  try {
    if (!existsSync(jobsFile)) return [];
    return JSON.parse(readFileSync(jobsFile, "utf8"));
  } catch { return []; }
}

function writeApplications(data: any[]) {
  writeFileSync(jobsFile, JSON.stringify(data, null, 2));
}

export async function GET() {
  try { return NextResponse.json(readApplications()); }
  catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "sync") {
      writeApplications(body.applications || []);
      return NextResponse.json({ success: true });
    }
    const applications = readApplications();
    const newApp = { ...body, id: "JOB-" + Date.now().toString(), appliedAt: new Date().toISOString(), status: "pending" };
    applications.push(newApp);
    writeApplications(applications);
    return NextResponse.json({ success: true, application: newApp });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
