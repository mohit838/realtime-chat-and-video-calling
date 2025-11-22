import helmet from "helmet";

export const securityHeaders = helmet({
  contentSecurityPolicy: false, // disable CSP for dev; optional
});
