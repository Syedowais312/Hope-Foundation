import bcrypt from "bcryptjs";
import clientPromise from "../../lib/mongodb";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { name, email, password, number } = await req.json();

    // Validate input
    if (!name || !email || !password || !number) {
      return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await clientPromise;
    const db = client.db("hope_foundation");
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }

    // Create UPI payment URL (amount 0 initially)
    const amount = 100;
    const paymentUrl = `upi://pay?pa=hopefoundation@upi&pn=${encodeURIComponent(name)}&am=${amount}&tn=Thank%20you%20${encodeURIComponent(name)}`;

    const newUser = {
      name,
      email,
      password: hashedPassword,
      number,
      createdAt: new Date(),
      donations: [
        {
          amount,
          paymentUrl,
          createdAt: new Date(),
        },
      ],
    };

    const result = await users.insertOne(newUser);

    // Generate JWT token
    const jwtSecret = "Owais@786"; //Want to Move to .env in production
    const token = jwt.sign(
      {
        email: newUser.email,
        name: newUser.name,
        userId: result.insertedId.toString(),
      },
      jwtSecret,
      {
        expiresIn: "24h",
        issuer: "hope_foundation",
        subject: result.insertedId.toString(),
      }
    );

    return new Response(
      JSON.stringify({
        message: "Signup successful",
        token,
        user: {
          id: result.insertedId.toString(),
          name: newUser.name,
          email: newUser.email,
          number: newUser.number,
          paymentUrl,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ error: "Signup failed" }), { status: 500 });
  }
}
