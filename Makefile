install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

run:
	bun dist/server.js

docker-up:
	docker compose up -d

docker-down:
	docker compose down -v

docker-rebuild:
	docker compose up -d --build

mysql:
	docker compose -f mysql.yml up -d

redis:
	docker compose -f redis.yml up -d

kafka:
	docker compose -f kafka.yml up -d

mongo:
	docker compose -f mongo.yml up -d
