import { sendWithBrevo } from "../../lib/email/sendWithBrevo";
import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const testEmail = searchParams.get("email") || "syedowais312sf@gmail.com";

  try {
    // Test MongoDB connection
    const client = await clientPromise;
    const db = client.db("hope_foundation");
    const prefsCount = await db.collection("preferences").countDocuments();
    const testUser = await db.collection("preferences").findOne({ email: testEmail });

    // Test email sending
    await sendWithBrevo({
      to: testEmail,
      subject: "✅ Hope Foundation - Notification Test",
      html: `
        <h2>Notification System Test</h2>
        <p>This is a test email confirming that the notification system is working properly.</p>
        <p>Your notification preferences:</p>
        <ul>
          <li>Email: ${testEmail}</li>
          <li>Frequency: ${testUser?.frequency || "Not set"}</li>
          <li>Custom Message: ${testUser?.message || "Not set"}</li>
        </ul>
      `,
    });

    return NextResponse.json({
      success: true,
      systemStatus: {
        dbConnection: "Connected",
        activePreferences: prefsCount,
        userPreferences: testUser || null,
        emailSent: true,
        testedEmail: testEmail
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
