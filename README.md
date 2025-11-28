# **Realtime Chat & Video Calling Platform**

_A modern, scalable realtime communication system built for chat, voice, and video._

---

## 🚀 Overview

This project implements a **hybrid realtime architecture** combining:

- **REST APIs** (for persistence and business logic)
- **WebSocket signaling** (for realtime chat & WebRTC calls)
- **Redis Pub/Sub** (cross-instance broadcasting)
- **MySQL** (persistent storage)
- **MongoDB** (centralized audit logs)
- **Kafka / Redpanda** (future distributed events)

It follows clean, modular architecture with strong security, observability, and production-ready conventions.

---

## ✨ Features

### 🗨️ Realtime Chat

- Redis Pub/Sub-based realtime messaging
- Persistent chat history in MySQL
- Seen/Delivered receipts
- Typing indicators
- Room-based messaging
- Role-based access control

### 🎙 Voice Messages

- Streaming upload
- Stored in MinIO
- Secure signed URL delivery

### 🎥 WebRTC Video Calling

- 1:1 audio/video calls
- Group calls (mesh model; SFU-ready)
- STUN/TURN support
- Socket.IO signaling layer

### 🔐 Authentication & Security

- JWT (Access + Refresh rotation)
- Redis-based token invalidation
- RoleGuard middleware
- Zod validation
- Helmet, CORS, Rate limiting
- Request ID tracing

### 🔍 Observability & Logging

- Winston logger
- Centralized MongoDB logs
- Automatic TTL cleanup after 10 days
- Per-request contextual metadata

---

## 🛠 Tech Stack

### Backend

- Node.js + Express + TypeScript
- MySQL (with migrations)
- Redis Pub/Sub
- WebRTC + Socket.IO
- Kafka/Redpanda (future ready)
- Zod for validation
- MongoDB for logs
- MinIO for media

### Dev Tools

- Docker, Docker Compose
- ESLint + Prettier
- Vitest + Supertest
- Swagger UI
- PM2 (optional production runtime)

---

## 📁 Folder Structure

```
src/
├── app.ts
├── server.ts
├── config/
│   ├── cors.ts
│   ├── helmet.ts
│   ├── rateLimiter.ts
│   ├── redis.ts
│   ├── kafka.ts
│   ├── db.ts
│   ├── logger.ts
│   ├── mongo-logger.ts
│   ├── shutdown.ts
│   └── env.ts
├── middlewares/
│   ├── request-logger.ts
│   └── role-guard.ts
├── modules/
│   └── auth/
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       ├── auth.middleware.ts
│       ├── auth.utils.ts
│       ├── refresh.service.ts
│       └── auth.routes.ts
├── realtime/
│   ├── socket.ts
│   ├── chat.gateway.ts
│   └── presence.gateway.ts
├── migrations/
├── utils/
└── types/
```

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone <repo-url>
cd realtime-chat
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Copy environment file

```bash
cp config/env.example.yml config/env.yml
```

### 4. Update credentials

Modify:

- MySQL
- Redis
- MongoDB
- MinIO
- JWT secrets

---

## ▶️ Running the App

### Development Mode

```bash
pnpm dev
```

### Build the project

```bash
pnpm build
```

### Production Start

```bash
pnpm start
```

---

## 🔧 Database Migrations

### Run migrations

```bash
pnpm migrate up
```

### Rollback

```bash
pnpm migrate rollback
```

---

# 🐳 Docker Setup

Each dependency is provided as a **one-click Docker service**.

### Start API

```bash
docker compose up -d
```

### Start MySQL

```bash
docker compose -f mysql.yml up -d
```

### Start Redis

```bash
docker compose -f redis.yml up -d
```

### Start Kafka (Redpanda)

```bash
docker compose -f kafka.yml up -d
```

### Start MongoDB

```bash
docker compose -f mongo.yml up -d
```

No installation required on host machine.

---

# 🔥 Realtime Architecture (Hybrid Model)

### Core Concept

- **REST** -> storing messages
- **WebSocket** -> realtime delivery
- **Redis Pub/Sub** -> multi-instance broadcasting

```
Client -> REST -> MySQL (store message)
Client <- WS <- Redis Pub/Sub <- Server
```

### WebRTC Signaling

```
offer -> answer -> ICE candidates -> STUN/TURN -> P2P media stream
```

---

# 🔐 Security Overview

- Helmet security headers
- CORS restrictions
- Strong Zod validation
- Rate limiting per IP
- Encrypted passwords (bcrypt)
- Refresh token rotation
- JWT blacklist (Redis)
- RoleGuard for admin/user/moderator
- Winston logging with requestId tracking
- MongoDB TTL logs (auto-delete after 10 days)

---

# 📘 API Documentation (Swagger)

After running the server:

```
http://localhost:<port>/docs
```

Includes:

- Modular schemas
- BearerAuth security
- Auth routes
- Future chat and call endpoints

---

# 💾 Media Storage (MinIO)

MinIO is used for:

- voice notes
- image uploads
- file attachments

Signed URLs provide temporary secure access.

---

# 📊 Logging & Monitoring

### Features:

- requestId tracing
- structured logs
- error logging with metadata
- user activity logs
- TTL deletion after 10 days

Stored in MongoDB.

---

# 🧪 Testing

```
pnpm test
pnpm test:unit
pnpm test:integration
```

Includes:

- Vitest
- Supertest
- Mocked Redis
- Mocked Kafka (future)

---

# ❓ Daily Interview Questions

_A new section is added daily for continuous learning._

### Day 1 — Backend & Realtime Basics

| Question                          | Answer                                         |
| --------------------------------- | ---------------------------------------------- |
| What is hybrid chat architecture? | REST for persistence, WS for realtime events   |
| Why Redis Pub/Sub?                | For instant multi-instance broadcasting        |
| Why not store chats in Redis?     | Redis is not durable                           |
| Why JWT refresh tokens?           | Short-lived access + long-lived secure refresh |
| Why STUN/TURN?                    | STUN discovers IP, TURN relays if P2P fails    |
| Why Zod?                          | Prevent invalid input reaching services        |
| Why rate limiting?                | Protect API from brute-force                   |
| What is requestId?                | A unique ID tracing a full request flow        |
| Why MongoDB TTL logs?             | Auto-clean older logs                          |
| Why MinIO?                        | MySQL is not for binary objects                |

(More days are added automatically.)

---

# 🧭 Roadmap

- [ ] Chat events (send, delivered, seen)
- [ ] Reactions & emoji support
- [ ] Typing events
- [ ] Voice messaging
- [ ] File uploads
- [ ] WebRTC signaling
- [ ] 1:1 calling
- [ ] Group mesh calling
- [ ] SFU upgrade (mediasoup/livekit)
- [ ] Kafka-based message archiving
- [ ] Moderation pipeline

---

# 👨‍💻 Author

**Mohit**
Backend engineer passionate about scalable systems & realtime communication.

---

# ⭐ Support

If you found this useful, leave a ⭐ on GitHub!
