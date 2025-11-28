export const APP_CONSTANTS = {
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  DEFAULT_PAGE_SIZE: 20,
};

export const ROUTES = {
  AUTH: "/api/auth",
  HEALTH: "/health",
  ROOT: "/",
};

export const LOG_MESSAGES = {
  SERVER_START: "Server running at",
  MONGO_FAIL: ">> Mongo Logger connection failed:",
  HTTP_CLOSED: "## HTTP server closed.",
  MYSQL_CLOSED: "## MySQL pool closed.",
  REDIS_CLOSED: "## Redis client disconnected.",
  KAFKA_CLOSED: "## Kafka producer disconnected.",
};

export const SHUTDOWN_SIGNALS = ["SIGINT", "SIGTERM"] as const;
