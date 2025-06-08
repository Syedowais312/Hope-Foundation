import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: "All fields required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hope_foundation"); // DB name here
    const usersCollection = db.collection("users");

    // Checkongwsa if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "Signup successful" }), { status: 200 });
  } catch (error) {
    console.error("Signup Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
