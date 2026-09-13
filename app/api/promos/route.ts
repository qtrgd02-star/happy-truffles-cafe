import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { db } from "@/app/lib/firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";

const dataDir = path.join(process.cwd(), "data");
const promosFile = path.join(dataDir, "promos.json");

if (!existsSync(dataDir)) {
  const { mkdirSync } = require("fs");
  mkdirSync(dataDir, { recursive: true });
}

function readLocalPromos() {
  try {
    if (!existsSync(promosFile)) {
      return [];
    }
    return JSON.parse(readFileSync(promosFile, "utf8"));
  } catch {
    return [];
  }
}

function writeLocalPromos(promos: any[]) {
  writeFileSync(promosFile, JSON.stringify(promos, null, 2));
}

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "promos"));
    const promos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (promos.length > 0) {
      return NextResponse.json(promos);
    }
    return NextResponse.json(readLocalPromos());
  } catch {
    return NextResponse.json(readLocalPromos());
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "delete") {
      if (db && body.id) {
        try {
          await deleteDoc(doc(db, "promos", body.id));
        } catch {
          const promos = readLocalPromos();
          const filtered = promos.filter((p: any) => p.id !== body.id);
          writeLocalPromos(filtered);
        }
      } else {
        const promos = readLocalPromos();
        const filtered = promos.filter((p: any) => p.id !== body.id);
        writeLocalPromos(filtered);
      }
      return NextResponse.json({ success: true });
    }

    if (body.action === "update" && body.id) {
      const { id, ...updates } = body;
      if (db) {
        try {
          await updateDoc(doc(db, "promos", id), updates);
        } catch {
          const promos = readLocalPromos();
          const index = promos.findIndex((p: any) => p.id === id);
          if (index !== -1) {
            promos[index] = { ...promos[index], ...updates };
            writeLocalPromos(promos);
          }
        }
      } else {
        const promos = readLocalPromos();
        const index = promos.findIndex((p: any) => p.id === id);
        if (index !== -1) {
          promos[index] = { ...promos[index], ...updates };
          writeLocalPromos(promos);
        }
      }
      return NextResponse.json({ success: true });
    }

    if (body.action === "increment-use") {
      const promos = readLocalPromos();
      const index = promos.findIndex((p: any) => p.code.toLowerCase() === body.code.toLowerCase());
      if (index !== -1) {
        promos[index].usedCount = (promos[index].usedCount || 0) + 1;
        writeLocalPromos(promos);
      }
      return NextResponse.json({ success: true });
    }

    const promoData = { ...body, createdAt: new Date().toISOString(), usedCount: 0 };

    if (db) {
      try {
        await addDoc(collection(db, "promos"), promoData);
      } catch {
        const promos = readLocalPromos();
        promos.push({ id: Date.now().toString(), ...promoData });
        writeLocalPromos(promos);
      }
    } else {
      const promos = readLocalPromos();
      promos.push({ id: Date.now().toString(), ...promoData });
      writeLocalPromos(promos);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
