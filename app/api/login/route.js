import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ message: "Invalid email format" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hope_foundation");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });

    if (!user || !user.password) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    const jwtSecret = "Owais@786"; // Put this in .env for production
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name || user.email,
        userId: user._id.toString(),
      },
      jwtSecret,
      { expiresIn: "24h", issuer: "hope_foundation", subject: user._id.toString() }
    );

    return new Response(
      JSON.stringify({
        message: "Login successful",
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email,
          number: user.number || null,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
