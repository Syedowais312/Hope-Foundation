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
    
    const newUser = {
      name,
      email,
      password: hashedPassword,
      number,
      createdAt: new Date(),
     
    };

    const result = await users.insertOne(newUser);

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET; //Want to Move to .env in production
    const token = jwt.sign(
      {
        email: newUser.email,
        name: newUser.name,
        userId: result.insertedId.toString(),
      },
      jwtSecret,
      {
        expiresIn: "7d",
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
         
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ error: "Signup failed" }), { status: 500 });
  }
}
