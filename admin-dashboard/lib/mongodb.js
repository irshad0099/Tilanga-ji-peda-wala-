import { MongoClient } from "mongodb";

// The same MongoDB Atlas database the shop site uses (MONGODB_URI /
// MONGODB_DB), so orders show up here the moment a customer places them.

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "tilanga_ji";

let clientPromise = null;
if (uri) {
  if (process.env.NODE_ENV === "development") {
    // Reuse the connection across dev hot-reloads.
    global._tjAdminMongo ??= new MongoClient(uri).connect();
    clientPromise = global._tjAdminMongo;
  } else {
    clientPromise = new MongoClient(uri).connect();
  }
}

export function isDbConfigured() {
  return Boolean(uri);
}

export async function getDb() {
  if (!clientPromise) throw new Error("MONGODB_URI is not set — the database isn't configured.");
  const client = await clientPromise;
  return client.db(dbName);
}
