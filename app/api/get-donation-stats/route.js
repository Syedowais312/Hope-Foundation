import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hope_foundation");

    const stats = await db.collection("donation_stats").findOne({ _id: "global_stats" });

    return NextResponse.json({
      totalAmount: stats?.totalAmount || 0,
      donationCount: stats?.donationCount || 0,
    });
  } catch (error) {
    console.error("Stats fetch error:", error.message);
    return NextResponse.json({ error: "Failed to fetch donation stats" }, { status: 500 });
  }
}
