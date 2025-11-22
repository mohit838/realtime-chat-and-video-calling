export interface LoggerMeta {
  requestId?: string;
  userId?: number;
  path?: string;
  method?: string;
  statusCode?: number;
  error?: unknown;
  extra?: Record<string, unknown>;
  [key: string]: unknown;
}
