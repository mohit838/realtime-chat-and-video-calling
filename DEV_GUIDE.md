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
