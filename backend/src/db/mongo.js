import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function connectToDb() {
  try {
    await client.connect();
    db = client.db(); // uses the DB name from the URI
    console.log("Connected to MongoDB:", db.databaseName);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDb() first.");
  }
  return db;
}
