import { MongoClient } from "mongodb";
import { logError, logInfo } from "../utils/log.js";
import { env } from "./env.js";

export async function setupMongoTTL(): Promise<void> {
  try {
    const client = new MongoClient(env.MONGO_URI);
    await client.connect();

    const db = client.db(env.MONGO_DB);
    const collection = db.collection(env.MONGO_COLLECTION);

    await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: env.MONGO_TTL });

    logInfo("Mongo TTL index created", {
      collection: env.MONGO_COLLECTION,
      ttl: env.MONGO_TTL,
    });
  } catch (err) {
    logError("Mongo TTL setup failed", { error: err });
  }
}
