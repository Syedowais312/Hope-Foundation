import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

const BREVO_API_KEY = process.env.BREVO_API_KEY;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hope_foundation");
    const users = await db.collection("preferences").find({}).toArray();

    const today = new Date();
    const weekday = today.getDay(); // 1 = Monday
    const date = today.getDate();   // 1st = monthly

    let sent = 0;

    for (const user of users) {
      const { email, frequency, message } = user;

      const shouldSend = 
        (frequency === "days") || // Daily
        (frequency === "weekly" && weekday === 1) || // Monday
        (frequency === "monthly" && date === 1); // First day of month

      if (!shouldSend) continue;

      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Hope Foundation", email: "syedowais312sf@gmail.com" },
          to: [{ email }],
          subject: "💌 Your Donation Reminder",
          htmlContent: `
            <p>${message || "It's time to donate and make an impact! 💖"}</p>
            <p><a href="https://yourdomain.com">Donate Now</a></p>
          `,
        }),
      });

      if (res.ok) sent++;
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error("Send Notification Error:", error.message);
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}
