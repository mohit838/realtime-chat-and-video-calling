import { env } from "./env.js";

// ==============================
// Application Constants
// ==============================
export const APP_CONSTANTS = {
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PASSWORD_MIN_LENGTH: 6,
  SERVICE_NAME: "realtime-chat-service",
  ENV: env.APP_ENV || "development",
};

// ==============================
// Route Constants
// ==============================
export const ROUTES = {
  AUTH: "/api/auth",
  HEALTH: "/health",
  ROOT: "/",
  METRICS: "/metrics",
};

// ==============================
// Security / Tokens
// ==============================
export const TOKEN_CONSTANTS = {
  ACCESS_TOKEN_EXPIRES_IN: "15m",
  REFRESH_TOKEN_EXPIRES_IN: "30d",
  SALT_ROUNDS: 10,
};

// ==============================
// CORS / RATE LIMIT / HEADERS
// ==============================
export const SECURITY_CONSTANTS = {
  CORS_WHITELIST: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://your-production-domain.com",
  ],
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 min
  RATE_LIMIT_MAX: 100,
  ALLOWED_HEADERS: ["Content-Type", "Authorization"],
};

// ==============================
// Logging Constants
// ==============================
export const LOG_MESSAGES = {
  SERVER_START: "Server running at",
  HTTP_CLOSED: "## HTTP server closed.",
  MYSQL_CLOSED: "## MySQL connection pool closed.",
  REDIS_CLOSED: "## Redis client disconnected.",
  KAFKA_CLOSED: "## Kafka producer disconnected.",
  MONGO_FAIL: ">> Mongo Logger connection failed:",
  SHUTDOWN: ">> Graceful shutdown started...",
  SHUTDOWN_COMPLETE: ">> Graceful shutdown complete.",
};

// ==============================
// Shutdown Signals
// ==============================
export const SHUTDOWN_SIGNALS = ["SIGINT", "SIGTERM"] as const;

// ==============================
// Kafka Topics
// ==============================
export const KAFKA_TOPICS = {
  USER_REGISTERED: "user.registered",
  USER_LOGGED_IN: "user.loggedIn",
  CHAT_MESSAGE_SENT: "chat.message",
};

// ==============================
// Redis Keys
// ==============================
export const REDIS_KEYS = {
  REFRESH_TOKEN_PREFIX: "refresh-token:",
  USER_SESSION_PREFIX: "session:",
  RATE_LIMIT_PREFIX: "rate-limit:",
};

// ==============================
// Health Check Payload
// ==============================
export const HEALTH_RESPONSE = {
  status: "ok",
  uptime: () => process.uptime(),
  timestamp: () => new Date().toISOString(),
};

// ==============================
// Monitoring Constants
// ==============================
export const MONITORING = {
  SERVICE_LABEL: "node_app",
  METRICS_ENDPOINT: "/metrics",
};
