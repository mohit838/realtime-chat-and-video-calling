import mongoose from "mongoose";
import { env } from "./env";

let connection: typeof mongoose | null = null;

export const connectMongoLogger = async () => {
  if (connection) return connection;

  connection = await mongoose.connect(env.mongo.uri, {
    dbName: env.mongo.db,
  });

  console.debug("## Mongo Logger connected");
  return connection;
};
