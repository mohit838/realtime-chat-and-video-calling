# 🚀 Realtime Chat App & Video Calling

_A modern, scalable realtime communication platform._

## 📌 Overview

This project implements a **hybrid realtime architecture** combining REST APIs and WebSocket-based communication. Users can chat, send voice messages, share media, and make 1:1 or group video calls using WebRTC.

The system follows clean architecture, domain-driven modularity, strong security, and production-ready logging with monitoring and role-based access control.

---

## ✨ Features

### 🗨️ **Realtime Chat**

- Redis Pub/Sub-based realtime delivery
- Persistent message history (MySQL)
- Seen/unseen receipts
- Typing indicators
- Room-based messaging
- Role-based access control

### 🎙 **Voice Messages**

- Streaming upload
- Stored in MinIO
- Secure signed URLs for access

### 🎥 **WebRTC Video Calling**

- 1-to-1 Video & Audio
- Group video calling (Mesh → SFU Ready)
- STUN & TURN support
- Socket.IO Signaling Server

### 🔐 **Authentication & Security**

- JWT Access Tokens
- Refresh Token rotation (Redis)
- RoleGuard (admin, moderator, user)
- Helmet, rate limiting, CORS
- Request ID tracing
- Zod validation

### 🔍 **Observability & Logging**

- Winston-based logging
- Centralized MongoDB log storage
- TTL index auto-cleans logs after 10 days
- Request-level logging

---

## 🛠️ **Tech Stack**

### Backend

- **Node.js + Express + TypeScript**
- **MySQL** (migration system included)
- **Redis Pub/Sub**
- **Socket.IO**
- **WebRTC**
- **MinIO**
- **Kafka (future-ready integration)**
- **Zod**
- **Winston**
- **MongoDB (for logs)**

### Dev Tools

- Docker
- ESLint
- Prettier
- ts-node
- pm2 (production)
- Swagger UI

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

```bash
git clone <repo-url>
cd realtime-chat
npm install
```

Copy example environment:

```bash
cp env/env.example.yml env/env.yml
```

Edit credentials for:

- MySQL
- Redis
- MinIO
- JWT

---

## ▶️ Running the App

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

---

## 🔧 Database Migrations

### Run all migrations

```bash
npm run migrate up
```

### Rollback last batch

```bash
npm run migrate rollback
```

---

## 🔥 Realtime Architecture (Hybrid Model)

### 🧱 Core Concept

- REST = persistence
- WebSocket = realtime

### Flow Diagram

```
Client → REST → MySQL (store message)
Client ← WS ← Redis Pub/Sub ← Server
```

### WebRTC Signaling

```
offer → answer → ICE candidates → STUN/TURN → P2P stream
```

---

## 🔐 Security Highlights

- Helmet security headers
- Rate limiting per IP
- Zod input validation
- Encrypted passwords (bcrypt)
- Refresh token rotation
- RoleGuard for admin/mod/user
- JWT Blacklist (Redis-based logout)
- Mongo audit logs with TTL deletion

---

## 📘 API Documentation

Swagger UI available at:

```
/docs
```

Supports:

- Modular YAML
- BearerAuth
- Components & Schemas
- Full auth module
- Future chat routes

---

## 💾 Media Storage

MinIO is used for:

- voice messages
- images
- attachments

Signed URLs ensure secure temporary access.

---

## 📊 Logging & Monitoring

Winston + MongoDB:

- requestId for tracing
- error logs with metadata
- auth logs (login/register)
- TTL automatically deletes logs after 10 days

---

## 🧪 Testing

```
npm test
npm run test:unit
npm run test:integration
```

Uses:

- Vitest
- Supertest
- Test containers (optional)

---

# ❓ Daily Interview Questions

_(Updated every day — for continuous learning)_

### **Day 1 — Backend & Realtime Basics**

| Question                              | One-line Answer                                                  |
| ------------------------------------- | ---------------------------------------------------------------- |
| What is hybrid chat architecture?     | REST for storing messages, WS for realtime delivery.             |
| Why Redis Pub/Sub?                    | Ultra-fast broadcasting between instances.                       |
| Why not store chat messages in Redis? | Redis is not durable.                                            |
| Why JWT needs refresh tokens?         | Access tokens must stay short-lived for security.                |
| Why use STUN/TURN in WebRTC?          | STUN discovers public IP; TURN relays media if direct P2P fails. |
| Why Zod in controllers?               | Prevent invalid input from reaching services.                    |
| Why rate limiting?                    | Protects API from brute-force attacks.                           |
| What is requestId in logs?            | Tracks one request across logs.                                  |
| Why MongoDB TTL logs?                 | Auto-clean old logs without manual scripts.                      |
| Why MinIO vs MySQL?                   | MinIO is optimized for large binary objects.                     |

> _Add a new Day section every day._

---

## 🧭 Roadmap

- [ ] Realtime chat events
- [ ] Message seen/delivered
- [ ] Voice messaging
- [ ] File uploads
- [ ] WebRTC signaling
- [ ] 1-to-1 video calling
- [ ] Group calling (mesh)
- [ ] SFU server (media soup / livekit)
- [ ] Kafka message archiving
- [ ] Chat moderation pipeline

---

## 👨‍💻 Author

**Mohit**
A backend engineer passionate about scalable systems, realtime communication, and clean architecture.

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub.
