// app/api/create-payment/route.js

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, email } = body;

    // Simulate a unique UPI QR link using the user's name
    const paymentUrl = `upi://pay?pa=hopefoundation@upi&pn=${encodeURIComponent(name)}&tn=Thanks%20${encodeURIComponent(name)}%20for%20donating!`;

    return new Response(JSON.stringify({ paymentUrl }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to generate QR" }), {
      status: 500,
    });
  }
}
