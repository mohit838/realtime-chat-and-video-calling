import mongoose from "mongoose";
import { env } from "./env.js";

let connection: typeof mongoose | null = null;

export const connectMongoLogger = async () => {
  if (connection) return connection;

  connection = await mongoose.connect(env.MONGO_URI, {
    dbName: env.MONGO_DB,
  });

  console.debug("## Mongo Logger connected");
  return connection;
};
