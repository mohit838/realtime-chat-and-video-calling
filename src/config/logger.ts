import winston from "winston";
import "winston-mongodb";
import { env } from "./env.js";

const { combine, timestamp, json, colorize, printf } = winston.format;

const consoleFormat = combine(
  colorize(),
  printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

export const logger = winston.createLogger({
  level: env.APP_ENV === "development" ? "debug" : "info",

  format: combine(timestamp(), json()),

  transports: [
    // Console logging (pretty in dev, normal in prod)
    new winston.transports.Console({
      format: env.APP_ENV === "development" ? consoleFormat : json(),
    }),

    // MongoDB logging
    new winston.transports.MongoDB({
      level: "info",
      db: `${env.MONGO_URI}/${env.MONGO_DB}`,
      collection: env.MONGO_COLLECTION,
      tryReconnect: true,
      storeHost: true,
    }),
  ],
});
