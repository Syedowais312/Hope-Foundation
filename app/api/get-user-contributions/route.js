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
    const usersCollection = db.collection("donations"); // Your collection name with user + donations nested

    // Find the user document by email
    const user = await usersCollection.findOne({ email: email });

    if (!user) {
      // No user found with this email
      return NextResponse.json({ donations: [] });
    }

    // Extract donations array (empty if none)
    const donationsArray = user.donations || [];

    // Add user info to each donation
    const donationsWithUserInfo = donationsArray.map((donation) => ({
      ...donation,
      name: user.name,
      email: user.email,
      phone: user.number,  // Assuming phone is stored as 'number' in user doc
    }));

    return NextResponse.json({ donations: donationsWithUserInfo });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
