// MongoDB Atlas connection — server-only (route handlers). Never import this
// from a "use client" component or a client-invoked lib.
//
// Set MONGODB_URI (and optionally MONGODB_DB) in .env.local for local dev
// and in the Vercel project's Environment Variables for production. See
// README.md "Set up MongoDB Atlas" for the step-by-step.

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "tilanga_ji";

let clientPromise = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // Reuse the connection across Next.js dev hot-reloads.
    if (!global._tilangaMongoClientPromise) {
      global._tilangaMongoClientPromise = new MongoClient(uri).connect();
    }
    clientPromise = global._tilangaMongoClientPromise;
  } else {
    clientPromise = new MongoClient(uri).connect();
  }
}

export function isDbConfigured() {
  return Boolean(uri);
}

export async function getDb() {
  if (!clientPromise) {
    throw new Error("MONGODB_URI is not set — the database is not configured yet.");
  }
  const client = await clientPromise;
  return client.db(dbName);
}
