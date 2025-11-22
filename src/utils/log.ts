import { logger } from "../config/logger";
import type { LoggerMeta } from "../types/logger";

export function logInfo(message: string, meta?: LoggerMeta) {
  logger.info(message, meta);
}

export function logError(message: string, meta?: LoggerMeta) {
  logger.error(message, meta);
}

export function logWarn(message: string, meta?: LoggerMeta) {
  logger.warn(message, meta);
}

export function logDebug(message: string, meta?: LoggerMeta) {
  logger.debug(message, meta);
}
