import type { Request, Response } from "express";
import client from "prom-client";

// Collect default system metrics (heap, RSS, CPU, event loop lag)
client.collectDefaultMetrics({
  prefix: "node_app_",
  gcDurationBuckets: [0.001, 0.01, 0.1, 1],
});

// Custom counters
export const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// Histogram for latency
export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
});

// Middleware to measure metrics
export const metricsMiddleware = (req: Request, res: Response, next: any) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const duration = process.hrtime(start);
    const seconds = duration[0] + duration[1] / 1e9;

    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status: res.statusCode,
      },
      seconds
    );
  });

  next();
};

// /metrics endpoint
export const metricsHandler = async (_: Request, res: Response) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
};
