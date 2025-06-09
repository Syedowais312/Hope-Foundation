// app/api/create-payment/route.js
import clientPromise from "../../lib/mongodb";

export async function POST(req) {
  try {
    const { name, number, email, amount } = await req.json();

    const paymentUrl = `upi://pay?pa=hopefoundation@upi&pn=${encodeURIComponent(name)}&am=${amount}&tn=Thank%20you%20${encodeURIComponent(name)}`;

    const client = await clientPromise;
    const db = client.db("hope_foundation");
    const users = db.collection("users");

    const result = await users.updateOne(
      { email },
      {
        $push: {
          donations: {
            amount,
            paymentUrl,
            createdAt: new Date(),
          },
        },
      }
    );

    return new Response(JSON.stringify({ paymentUrl }), { status: 200 });
  } catch (error) {
    console.error("Donation Error:", error);
    return new Response(JSON.stringify({ error: "Failed to donate" }), { status: 500 });
  }
}
