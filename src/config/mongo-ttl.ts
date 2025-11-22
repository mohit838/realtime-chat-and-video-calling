import { MongoClient } from "mongodb";
import { env } from "./env";

export async function setupMongoTTL() {
  const client = new MongoClient(env.mongo.uri);
  await client.connect();

  const db = client.db(env.mongo.db);
  const collection = db.collection(env.mongo.collection);

  await collection.createIndex({ timestamp: 1 }, { expireAfterSeconds: 86400 * 10 });

  await client.close();
}
