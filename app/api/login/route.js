import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    console.log("Login attempt started");

    // Parse request body
    const body = await req.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      console.log("Missing email or password");
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
      return new Response(
        JSON.stringify({ message: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db("hope_foundation");
    const usersCollection = db.collection("users");

    // Find user
    const user = await usersCollection.findOne({ email });

    if (!user || !user.password) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate token
    const jwtSecret = "Owais@786"; // store in .env in production
    const payload = {
      email: user.email,
      name: user.name || user.email,
      userId: user._id.toString(),
    };

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "24h",
      issuer: "hope_foundation",
      subject: user._id.toString(),
    });

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
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Login error:", error);

    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
