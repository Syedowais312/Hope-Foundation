// /app/api/send-notifications/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import SibApiV3Sdk from "sib-api-v3-sdk";

const brevoApiKey = process.env.BREVO_API_KEY;

export async function GET() {
  try {
    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY is not set in .env");
    }

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = brevoApiKey;

    const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    // Get DB users with notification preferences
    const client = await clientPromise;
    const db = client.db("hope_foundation");
    const users = await db.collection("preferences").find({}).toArray();

    const today = new Date();
    const weekday = today.getDay(); // 1 = Monday
    const date = today.getDate();   // 1 = first of month

    let sent = 0;

    for (const user of users) {
      const { email, frequency, message } = user;

      const shouldSend =
        (frequency === "weekly" && weekday === 1) || // Monday
        (frequency === "monthly" && date === 1);      // 1st of month

      if (!shouldSend) continue;

      await emailApi.sendTransacEmail({
        subject: "⏰ Donation Reminder - Hope Foundation",
        sender: { name: "Hope Foundation", email: "your-sender@email.com" },
        to: [{ email }],
        htmlContent: `
          <p>${message || "It's time to make a difference! 💖"}</p>
          <p><a href="https://yourdomain.com">Donate Now</a></p>
        `,
      });

      sent++;
    }

    return NextResponse.json({ success: true, sent });
  } catch (err) {
    console.error("Notification Error:", err.message);
    return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 });
  }
}
