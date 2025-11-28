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
  level: env.app.env === "development" ? "debug" : "info",

  format: combine(timestamp(), json()),

  transports: [
    // Console logging (pretty in dev, normal in prod)
    new winston.transports.Console({
      format: env.app.env === "development" ? consoleFormat : json(),
    }),

    // MongoDB logging
    new winston.transports.MongoDB({
      level: "info",
      db: `${env.mongo.uri}/${env.mongo.db}`,
      collection: env.mongo.collection,
      tryReconnect: true,
      storeHost: true,
    }),
  ],
});
