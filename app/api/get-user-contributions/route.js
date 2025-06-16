import clientPromise from "../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email query parameter is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("hope_foundation");
    const usersCollection = db.collection("users"); // Changed to 'users' collection

    // Find the user document by email (case insensitive)
    const user = await usersCollection.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!user) {
      return NextResponse.json({ donations: [] });
    }

    // Return donations array (empty if none exists)
    return NextResponse.json({ 
      donations: user.donations || [] 
    });
    
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}