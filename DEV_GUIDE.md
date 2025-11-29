# Dev Guide

## Project tree

- `Linux / macOS`

```bash
  tree -I "node_modules|dist|.git|.vscode|logs|tmp|coverage" > project-tree.txt
```

- `Windows PowerShell`

```bash
tree /F /A | findstr /V "node_modules dist .git .vscode logs tmp coverage" > project-tree.txt
```

## Monitoring App

| Service           | URL                                            |
| ----------------- | ---------------------------------------------- |
| **Grafana**       | [http://localhost:3001](http://localhost:3001) |
| **Prometheus**    | [http://localhost:9090](http://localhost:9090) |
| **Loki**          | [http://localhost:3100](http://localhost:3100) |
| **Promtail logs** | automatic                                      |
| **cAdvisor**      | [http://localhost:8080](http://localhost:8080) |
| **Node Exporter** | [http://localhost:9100](http://localhost:9100) |

## Production Deployment Guide (Auth Service)

| Service            | Host Port |
| ------------------ | --------- |
| Auth API           | **1971**  |
| MySQL              | 1972      |
| Redis              | 1973      |
| MongoDB            | 1974      |
| Redpanda Kafka     | 1975      |
| Redpanda Admin API | 1976      |
| Prometheus         | **1977**  |
| Loki               | **1978**  |
| Grafana            | **1979**  |
| Node Exporter      | 1980      |
| cAdvisor           | 1981      |

---

## 🏗️ Build Production Image

If you're building locally:

```bash
docker compose -f docker-compose.prod.yml build
```

---

## Run in Production

```bash
docker compose -f docker-compose.prod.yml up -d
```

Check logs:

```bash
docker logs -f auth_service
```

---

## Deploy From Docker Hub

If the image is already pushed:

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

---

# Test Your Services

## Auth API (Production Port Mapping)

```bash
http://localhost:1971/api/auth/register
http://localhost:1971/api/auth/login
http://localhost:1971/api/auth/refresh
http://localhost:1971/api/auth/logout
http://localhost:1971/api/auth/me
http://localhost:1971/docs   (Swagger)
http://localhost:1971/metrics
```

## Monitoring Stack

### Grafana

```bash
http://localhost:1979
User: admin
Pass: admin123
```

### Prometheus

```bash
http://localhost:1977
```

### Loki

```bash
http://localhost:1978
```

### Node Exporter

```bash
http://localhost:1980
```

### cAdvisor

```bash
http://localhost:1981
```
