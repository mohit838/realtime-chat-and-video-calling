# ====================================================
# 1. Base deps (install everything with pnpm)
# ====================================================
FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


# ====================================================
# 2. Build stage (TypeScript -> JS)
# ====================================================
FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build


# ====================================================
# 3. Production stage (runtime = Bun)
# ====================================================
FROM oven/bun:1.1.0 AS prod

WORKDIR /app

# Copy compiled output
COPY --from=build /app/dist ./dist

# Copy production dependencies
COPY --from=base /app/node_modules ./node_modules

# Copy config files
COPY config/env.yml ./config/env.yml

EXPOSE 5000

# Bun only RUNS the built JS bundle
CMD ["bun", "dist/server.js"]
