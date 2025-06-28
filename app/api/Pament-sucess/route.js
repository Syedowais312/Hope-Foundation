export async function GET(req) {
  const { razorpay_payment_link_id, razorpay_payment_link_status } = Object.fromEntries(
    new URL(req.url).searchParams
  );

  if (razorpay_payment_link_status === "paid") {
    const client = await clientPromise;
    const db = client.db("hope_foundation");

    await db.collection("users").updateOne(
      { "donations.paymentLinkId": razorpay_payment_link_id },
      {
        $set: {
          "donations.$.status": "paid",
          "donations.$.paidAt": new Date(),
        },
      }
    );
  }

  return new Response("Payment processed", { status: 200 });
}
