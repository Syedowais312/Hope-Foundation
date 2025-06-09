import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in environment");
}
console.log("Mongo URI:", process.env.MONGODB_URI);
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Named export to get client and db
export async function getDatabase() {
  const client = await clientPromise;
  const db = client.db("hope_foundation"); // Database name here
  return { client, db };
}

// Default export for backward compatibility
export default clientPromise;
