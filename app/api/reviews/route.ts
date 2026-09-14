import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const reviewsFile = path.join(dataDir, "reviews.json");

if (!existsSync(dataDir)) {
  const { mkdirSync } = require("fs");
  mkdirSync(dataDir, { recursive: true });
}

function readReviews() {
  try {
    if (!existsSync(reviewsFile)) {
      return [];
    }
    const data = readFileSync(reviewsFile, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeReviews(reviews: any[]) {
  writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    let reviews = readReviews();
    if (status) {
      reviews = reviews.filter((r: any) => r.status === status);
    }
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "sync") {
      writeReviews(body.reviews || []);
      return NextResponse.json({ success: true });
    }

    if (body.action === "approve") {
      const reviews = readReviews();
      const index = reviews.findIndex((r: any) => r.id === body.id);
      if (index !== -1) {
        reviews[index].status = "approved";
        writeReviews(reviews);
      }
      return NextResponse.json({ success: true });
    }

    if (body.action === "reject") {
      const reviews = readReviews();
      const index = reviews.findIndex((r: any) => r.id === body.id);
      if (index !== -1) {
        reviews[index].status = "rejected";
        writeReviews(reviews);
      }
      return NextResponse.json({ success: true });
    }

    if (body.action === "delete") {
      const reviews = readReviews();
      const filtered = reviews.filter((r: any) => r.id !== body.id);
      writeReviews(filtered);
      return NextResponse.json({ success: true });
    }

    if (body.action === "add") {
      const reviews = readReviews();
      const newReview = {
        id: body.id || `review_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        name: body.name || "Anonymous",
        text: body.text,
        rating: body.rating || 5,
        status: "pending",
        createdAt: body.createdAt || new Date().toISOString(),
        photo: body.photo,
      };
      reviews.push(newReview);
      writeReviews(reviews);
      return NextResponse.json({ success: true, review: newReview });
    }

    return NextResponse.json({ success: false }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
