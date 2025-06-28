import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { amount } = await req.json();

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 1. Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `donation_rcpt_${Date.now()}`,
      payment_capture: 1,
    });

    // 2. Connect to MongoDB and update stats
    const client = await clientPromise;
    const db = client.db("hope_foundation");
    const stats = db.collection("donation_stats");

    await stats.updateOne(
      { _id: "global_stats" }, // fixed ID
      {
        $inc: {
          totalAmount: amount,
          donationCount: 1,
        },
      },
      { upsert: true }
    );

    // 3. Return Razorpay order details
    return NextResponse.json(order);
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
  }
}
