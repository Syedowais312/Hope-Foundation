import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req) {
  try {
    const { email, frequency, message } = await req.json();

    if (!email || !frequency) {
      return NextResponse.json(
        { error: "Email and frequency are required" },
        { status: 400 }
      );
    }

    if (!['days', 'weekly', 'monthly'].includes(frequency)) {
      return NextResponse.json(
        { error: "Frequency must be either daily, weekly or monthly" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hope_foundation");

    // Upsert the preference (update if exists, insert if not)
    const result = await db.collection("preferences").updateOne(
      { email },
      { 
        $set: { 
          email,
          frequency,
          message: message || "It's time to make a difference! 💖",
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: `Reminder set successfully! You'll receive ${frequency} notifications.`,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    });
  } catch (err) {
    console.error("❌ Error setting preference:", err.message);
    return NextResponse.json({ error: "Failed to set preference" }, { status: 500 });
  }
}
