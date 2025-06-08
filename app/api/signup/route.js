import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // 👈 for token

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey"; // secure this in production

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, number } = body;

    if (!name || !email || !password || !number) {
      return new Response(JSON.stringify({ message: "All fields required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hope_foundation");
    const usersCollection = db.collection("users");

    // Check if user exists
    const existingUser = await usersCollection.findOne({ email });
    const existNumber=await usersCollection.findOne({number});
    if (existingUser || existNumber) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      number,
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    // Create token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });

    // Return token and user info (excluding password)
    return new Response(
      JSON.stringify({
        message: "Signup successful",
        token,
        user: {
          name,
          email,
          number,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
