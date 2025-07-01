import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import clientPromise from "@/app/lib/mongodb";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { razorpay_payment_id, userEmail } = await req.json();

    if (!razorpay_payment_id || !userEmail) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured") {
      return NextResponse.json({ error: "Payment not successful" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hope_foundation");

    // ✅ Save actual donation
    await db.collection("donations").insertOne({
      email: userEmail,
      amount: payment.amount / 100, // in INR
      payment_id: payment.id,
      createdAt: new Date(),
    });

    // ✅ Update global donation stats
    await db.collection("donation_stats").updateOne(
      { _id: "global_stats" },
      {
        $inc: {
          totalAmount: payment.amount / 100,
          donationCount: 1,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "Donation verified and recorded" });
  } catch (error) {
    console.error("Verification error:", error.message);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
