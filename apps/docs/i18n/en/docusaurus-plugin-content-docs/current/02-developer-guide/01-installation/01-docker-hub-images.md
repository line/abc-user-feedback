---
id: docker-hub-images
title: Docker Hub Image Installation
description: This document explains how to quickly install the system using the official ABC User Feedback images registered on Docker Hub.
sidebar_position: 1
---

# Docker Hub Image Installation

ABC User Feedback provides official Docker images.  
This document explains how to quickly set up the system locally using Docker Compose, including **Web UI, API server, database, SMTP server**, etc.

---

## 1. Prerequisites

| Item           | Description                                                              |
| -------------- | ------------------------------------------------------------------------ |
| Docker         | 20.10 or higher                                                          |
| Docker Compose | v2 or higher recommended                                                |
| Ports Used     | `3000`, `4000`, `13306`, `5080`, `25` (must be free on local machine) |

---

## 2. Docker Image Configuration

| Service Name      | Description                               | Docker Image Name                    |
| ----------------- | ----------------------------------------- | ------------------------------------ |
| Web (Admin UI)    | Frontend web UI (Next.js)                 | `line/abc-user-feedback-web`         |
| API (Backend)     | Backend server (NestJS)                   | `line/abc-user-feedback-api`         |
| MySQL             | Database                                  | `mysql:8.0`                          |
| SMTP4Dev          | Email server for local testing            | `rnwood/smtp4dev:v3`                 |
| (Optional) OpenSearch | For search functionality and improved AI analysis accuracy | `opensearchproject/opensearch:2.16.0` |

---

## 3. `docker-compose.yml` Example

```yaml
name: abc-user-feedback
services:
  web:
    image: line/abc-user-feedback-web:latest
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
    ports:
      - 3000:3000
    depends_on:
      - api
    restart: unless-stopped

  api:
    image: line/abc-user-feedback-api:latest
    environment:
      - JWT_SECRET=jwtsecretjwtsecretjwtsecret
      - MYSQL_PRIMARY_URL=mysql://userfeedback:userfeedback@mysql:3306/userfeedback
      - SMTP_HOST=smtp4dev
      - SMTP_PORT=25
      - SMTP_SENDER=user@feedback.com
      # Uncomment below if using OpenSearch
      # - OPENSEARCH_USE=true
      # - OPENSEARCH_NODE=http://opensearch-node:9200
    ports:
      - 4000:4000
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    command:
      [
        "--default-authentication-plugin=mysql_native_password",
        "--collation-server=utf8mb4_bin",
      ]
    environment:
      MYSQL_ROOT_PASSWORD: userfeedback
      MYSQL_DATABASE: userfeedback
      MYSQL_USER: userfeedback
      MYSQL_PASSWORD: userfeedback
      TZ: UTC
    ports:
      - 13306:3306
    volumes:
      - mysql:/var/lib/mysql
    restart: unless-stopped

  smtp4dev:
    image: rnwood/smtp4dev:v3
    ports:
      - 5080:80
      - 25:25
      - 143:143
    volumes:
      - smtp4dev:/smtp4dev
    restart: unless-stopped

  # Uncomment below if you want to use OpenSearch
  # opensearch-node:
  #   image: opensearchproject/opensearch:2.16.0
  #   restart: unless-stopped
  #   environment:
  #     - cluster.name=opensearch-cluster
  #     - node.name=opensearch-node
  #     - discovery.type=single-node
  #     - bootstrap.memory_lock=true
  #     - 'OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m'
  #     - plugins.security.disabled=true
  #     - OPENSEARCH_INITIAL_ADMIN_PASSWORD=UserFeedback123!@#
  #   ulimits:
  #     memlock:
  #       soft: -1
  #       hard: -1
  #     nofile:
  #       soft: 65536
  #       hard: 65536
  #   volumes:
  #     - opensearch:/usr/share/opensearch/data
  #   ports:
  #     - 9200:9200
  #     - 9600:9600

volumes:
  mysql:
  smtp4dev:
  # opensearch:
```

---

## 4. Execution Steps

### 4.1 Download and Run Docker Images

```bash
# Run all services in the background using Docker Compose
docker compose up -d
```

### 4.2 Check Running Status

```bash
# Check if all containers are running normally
docker compose ps
```

### 4.3 Check Service Access

- **Web Application**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:4000](http://localhost:4000)
- **SMTP Test Page**: [http://localhost:5080](http://localhost:5080)
- **MySQL Database**: `localhost:13306` (user: `userfeedback`, password: `userfeedback`)

---

## 5. SMTP Configuration

By default, this configuration allows you to test emails through `smtp4dev`.

- **Web Interface**: [http://localhost:5080](http://localhost:5080)
- **SMTP Port**: `25`
- **IMAP Port**: `143`

### SMTP Testing Method

1. Register a user or use the user invitation feature in the web application
2. Check sent emails at [http://localhost:5080](http://localhost:5080)
3. Test email content and attachments

> **Important**: In actual production environments, you must integrate with an external SMTP server (e.g., Gmail, SendGrid, corporate SMTP, etc.).

## 6. Installation Verification

### 6.1 Web Application Access Verification

Access `http://localhost:3000` in your browser and verify:

- Tenant creation screen displays normally
- Page loading completes
- No JavaScript errors (check in browser developer tools)

### 6.2 API Server Status Check

```bash
# API server health check
curl http://localhost:4000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  }
}
```

### 6.3 Database Connection Verification

```bash
# Directly access MySQL container to check database
docker compose exec mysql mysql -u userfeedback -puserfeedback -e "SHOW DATABASES;"

# Check table creation
docker compose exec mysql mysql -u userfeedback -puserfeedback -e "USE userfeedback; SHOW TABLES;"
```

### 6.4 Log Check

```bash
# Check logs for all services
docker compose logs

# Check logs for specific service only
docker compose logs api
docker compose logs web
docker compose logs mysql
```

---

## 7. OpenSearch Usage Notes

OpenSearch is an optional component that improves search functionality and AI analysis accuracy.

### 7.1 How to Enable OpenSearch

1. Uncomment environment variables in the `api` service in `docker-compose.yml`:

```yaml
- OPENSEARCH_USE=true
- OPENSEARCH_NODE=http://opensearch-node:9200
```

2. Uncomment the `opensearch-node` service
3. Uncomment `opensearch:` in the `volumes:` section
4. Ensure ports `9200`, `9600` are not in use on local machine

### 7.2 Memory Requirements

> **Warning**: OpenSearch requires at least 2GB of memory. If memory is insufficient, the container may automatically terminate.

### 7.3 OpenSearch Status Check

```bash
# Check OpenSearch cluster status
curl http://localhost:9200/_cluster/health

# Check OpenSearch node information
curl http://localhost:9200/_nodes

# Check indices
curl http://localhost:9200/_cat/indices
```

### 7.4 Disabling OpenSearch

To not use OpenSearch, comment out the corresponding service and environment variables in `docker-compose.yml`.

---

## 8. Troubleshooting

### 8.1 Port Conflict Issue

**Symptom**: Port binding error occurs when running `docker compose up`

**Solution**:

```bash
# Check ports in use
lsof -i :3000  # Web port
lsof -i :4000  # API port
lsof -i :13306 # MySQL port
lsof -i :5080  # SMTP port

# Stop processes using those ports and restart
docker compose down
docker compose up -d
```

### 8.2 Container Startup Failure

**Symptom**: Some containers fail to start or keep restarting

**Solution**:

```bash
# Check container status
docker compose ps

# Check logs for failed container
docker compose logs [service-name]

# Stop and remove all containers
docker compose down

# Remove volumes as well (warning: data loss)
docker compose down -v

# Start again
docker compose up -d
```

### 8.3 Database Connection Error

**Symptom**: MySQL connection failure from API server

**Solution**:

```bash
# Wait until MySQL container is fully started
docker compose logs mysql

# Test direct connection to MySQL container
docker compose exec mysql mysql -u userfeedback -puserfeedback -e "SELECT 1;"

# Restart API service
docker compose restart api
```

### 8.4 Image Download Failure

**Symptom**: Cannot download Docker images

**Solution**:

```bash
# Check Docker Hub login
docker login

# Manually download images
docker pull line/abc-user-feedback-web:latest
docker pull line/abc-user-feedback-api:latest

# Check network connection
ping hub.docker.com
```

### 8.5 Memory Insufficient Issue

**Symptom**: OpenSearch container automatically terminates

**Solution**:

```bash
# Check system memory
free -h

# Check Docker memory usage
docker stats

# Disable OpenSearch (comment out in docker-compose.yml)
# Or increase memory allocation
```

---

## 9. Reference Links

- [ABC User Feedback Web - Docker Hub](https://hub.docker.com/r/line/abc-user-feedback-web)
- [ABC User Feedback API - Docker Hub](https://hub.docker.com/r/line/abc-user-feedback-api)
- [smtp4dev - Docker Hub](https://hub.docker.com/r/rnwood/smtp4dev)
- [OpenSearch - Docker Hub](https://hub.docker.com/r/opensearchproject/opensearch)

---

## Related Documents

- [Initial Setup Guide](/en/user-guide/getting-started)

