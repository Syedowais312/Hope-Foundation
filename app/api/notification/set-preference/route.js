import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/mongodb";

export async function POST(req) {
  try {
    const { db } = await getDatabase();

    const body = await req.json();
    const { email, frequency, message } = body;

    await db.collection("preferences").insertOne({
      email,
      frequency,
      message,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Reminder set successfully!" });
  } catch (err) {
    console.error("❌ Error setting preference:", err);
    return NextResponse.json({ error: "Failed to set reminder" }, { status: 500 });
  }
}
