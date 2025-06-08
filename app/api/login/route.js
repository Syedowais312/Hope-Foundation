import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    console.log("Login attempt started");
    
    // Parse request body
    const body = await req.json();
    console.log("Request body parsed:", { email: body.email, hasPassword: !!body.password });
    
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      console.log("Missing email or password");
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
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
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    console.log("Attempting database connection");
    
    // Connect to database
    const client = await clientPromise;
    const db = client.db("hope_foundation");
    
    console.log("Database connected successfully");

    // Find user by email
    console.log("Searching for user with email:", email);
    const user = await db.collection("users").findOne({ email });
    
    if (!user) {
      console.log("User not found for email:", email);
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    console.log("User found:", { email: user.email, hasPassword: !!user.password });

    // Check if user has a password field
    if (!user.password) {
      console.log("User has no password field");
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Verify password
    console.log("Comparing passwords");
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isPasswordCorrect);
    
    if (!isPasswordCorrect) {
      console.log("Password incorrect for user:", email);
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Hardcoded JWT_SECRET
    const jwtSecret = "Owais@786";

    console.log("Creating JWT token");

    // Create JWT token
    const payload = {
      email: user.email,
      name: user.name || user.email, // Fallback to email if no name
      userId: user._id.toString()
    };

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "24h",
      issuer: "hope_foundation",
      subject: user._id.toString()
    });

    console.log("JWT token created successfully");

    // Return success response
    return new Response(
      JSON.stringify({
        message: "Login successful",
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Login error details:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      console.log("JSON parsing error");
      return new Response(
        JSON.stringify({ message: "Invalid JSON format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Handle MongoDB connection errors
    if (error.name === "MongoNetworkError" || error.name === "MongoServerError") {
      console.log("MongoDB connection error");
      return new Response(
        JSON.stringify({ message: "Database connection error" }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Handle bcrypt errors
    if (error.message && error.message.includes('bcrypt')) {
      console.log("Bcrypt error");
      return new Response(
        JSON.stringify({ message: "Password verification error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      console.log("JWT error");
      return new Response(
        JSON.stringify({ message: "Token generation error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}