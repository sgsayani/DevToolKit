import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "devkit";

export const NOT_CONFIGURED_MESSAGE =
  "Code Share needs a MONGODB_URI environment variable. Add one to your .env.local file (see .env.example) and restart the server.";

export function isMongoConfigured(): boolean {
  return !!process.env.MONGODB_URI;
}

// Cache the client across Next.js dev-mode hot reloads (each reload would
// otherwise re-run this module and open a fresh connection) — the standard
// pattern for using the MongoDB driver from a Next.js app.
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

function getClientPromise(): Promise<MongoClient> {
  if (!uri) throw new Error("MONGODB_URI is not set.");
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }
  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}
