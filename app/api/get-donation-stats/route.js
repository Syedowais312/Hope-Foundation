import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hope_foundation");
    const stats = db.collection("donation_stats");

    const data = await stats.findOne({ _id: "global_stats" });

    return NextResponse.json({
      totalAmount: data?.totalAmount || 0,
      donationCount: data?.donationCount || 0,
    });
  } catch (error) {
    console.error("Fetch Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch donation stats" }, { status: 500 });
  }
}
