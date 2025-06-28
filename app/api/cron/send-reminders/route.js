import { NextResponse } from "next/server";
import connectToDB from "./lib/mongodb";
import { Preference } from "./models/Preference";
import { sendReminderEmail } from "./lib/email/sendReminderEmail";

export async function GET() {
  try {
    await connectToDB();

    const users = await Preference.find({});
    const today = new Date();

    const weekday = today.getDay(); // 1 = Monday
    const dayOfMonth = today.getDate();

    let count = 0;

    for (const user of users) {
      const { email, frequency, message } = user;

      const shouldSend =
        (frequency === "weekly" && weekday === 1) || // send on Monday
        (frequency === "monthly" && dayOfMonth === 1); // send on 1st of month

      if (!shouldSend) continue;

      await sendReminderEmail({
        to: email,
        subject: "⏰ Donation Reminder from Hope Foundation",
        body: message || "It’s time to make a difference! 💖",
      });

      count++;
    }

    return NextResponse.json({ success: true, sent: count });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 });
  }
}
