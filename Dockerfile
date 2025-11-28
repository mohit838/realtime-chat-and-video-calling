# 1. Builder Stage
FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

# 2. Production Runtime Stage
FROM node:22-alpine AS prod
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=build /app/dist ./dist

EXPOSE 1234
CMD ["node", "dist/server.js"]
