# ---------------------------------------
# 1. Base image
# ---------------------------------------
FROM node:22-alpine AS base

WORKDIR /app

# Install only production dependencies speeds up rebuild
COPY package*.json ./
RUN npm install --omit=dev

# ---------------------------------------
# 2. Build stage (TypeScript -> JS)
# ---------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# ---------------------------------------
# 3. Production runtime
# ---------------------------------------
FROM node:22-alpine AS prod

WORKDIR /app

# copy built JS files
COPY --from=build /app/dist ./dist

# copy node_modules (production-only)
COPY --from=base /app/node_modules ./node_modules

# copy environment files (if needed)
COPY .env ./

EXPOSE 5000

CMD ["node", "dist/server.js"]
