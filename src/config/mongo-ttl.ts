import { MongoClient } from "mongodb";
import { logError, logInfo } from "../utils/log";
import { env } from "./env";

export async function setupMongoTTL(): Promise<void> {
  try {
    const client = new MongoClient(env.mongo.uri);
    await client.connect();

    const db = client.db(env.mongo.db);
    const collection = db.collection(env.mongo.collection);

    await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: env.mongo.ttlSeconds });

    logInfo("Mongo TTL index created", {
      collection: env.mongo.collection,
      ttl: env.mongo.ttlSeconds,
    });
  } catch (err) {
    logError("Mongo TTL setup failed", { error: err });
  }
}
