---
id: configuration
title: Environment Variable Configuration
description: This document explains how to configure environment variables for ABC User Feedback's API and web servers.
sidebar_position: 5
---

# Environment Variable Configuration

This document explains the main environment variables used by ABC User Feedback's **API server** and **web server** and how to configure them.

---

## 1. API Server Environment Variables

### Required Environment Variables

| Environment Variable                    | Description                      | Default | Example                             |
| ---------------------------------------- | -------------------------------- | ------- | ------------------------------------ |
| `JWT_SECRET`                             | Secret key for JWT signing       | None    | `jwtsecretjwtsecretjwtsecret`        |
| `MYSQL_PRIMARY_URL`                      | MySQL connection URL              | None    | `mysql://user:pass@host:3306/db`     |
| `ACCESS_TOKEN_EXPIRED_TIME`              | Access Token validity period     | `10m`   | `10m`, `30s`, `1h`                   |
| `REFRESH_TOKEN_EXPIRED_TIME`             | Refresh Token validity period     | `1h`    | `1h`, `7d`                           |

> JWT secret should be a sufficiently complex and secure string.

⚠️ **Security Notes**:

- `JWT_SECRET` should be at least 32 characters long and complex
- Never use default values in production environments
- Do not include environment variable files (`.env`) in version control
- Manage sensitive information through environment variables or secret management systems

---

### Optional Environment Variables

| Environment Variable              | Description                            | Default                  | Example                        |
| --------------------------------- | -------------------------------------- | ------------------------ | ------------------------------ |
| `APP_PORT`                        | API server port                        | `4000`                   | `4000`                         |
| `APP_ADDRESS`                     | Binding address                        | `0.0.0.0`                | `127.0.0.1`                    |
| `ADMIN_WEB_URL`                   | Admin web URL                          | `http://localhost:3000`  | `https://admin.company.com`    |
| `MYSQL_SECONDARY_URLS`            | Secondary DB URLs (JSON array)          | None                     | `["mysql://..."]`              |
| `AUTO_MIGRATION`                  | Auto migration on app startup          | `true`                   | `false`                        |
| `MASTER_API_KEY`                  | Master permission API key (optional)    | None                     | `abc123xyz`                    |
| `NODE_OPTIONS`                    | Node execution options                 | None                     | `--max_old_space_size=4096`    |

---

### SMTP Settings (Email Authentication)

| Environment Variable                | Description                      | Example                           |
| ----------------------------------- | -------------------------------- | --------------------------------- |
| `SMTP_HOST`                         | SMTP server address               | `smtp.gmail.com`                  |
| `SMTP_PORT`                         | Port (usually 587 or 465)        | `587`                              |
| `SMTP_USERNAME`                     | Login username                    | `user@example.com`                |
| `SMTP_PASSWORD`                     | Login password or token           | `app-password`                    |
| `SMTP_SENDER`                       | Sender address                    | `noreply@company.com`             |
| `SMTP_BASE_URL`                     | Base URL for links in emails      | `https://feedback.company.com`    |
| `SMTP_TLS`                          | Whether to use TLS                | `true`                             |
| `SMTP_CIPHER_SPEC`                  | Encryption spec                   | `TLSv1.2`                         |
| `SMTP_OPPORTUNISTIC_TLS`            | Whether to support STARTTLS       | `true`                             |

📎 For detailed settings, refer to the [SMTP Integration Guide](./04-smtp-configuration.md).

---

## 2. OpenSearch Settings (Optional)

| Environment Variable             | Description                   | Example                    |
| -------------------------------- | ----------------------------- | -------------------------- |
| `OPENSEARCH_USE`                 | Whether to enable OpenSearch  | `true`                      |
| `OPENSEARCH_NODE`                | OpenSearch node URL           | `http://localhost:9200`     |
| `OPENSEARCH_USERNAME`            | Authentication ID              | `admin`                     |
| `OPENSEARCH_PASSWORD`            | Authentication password        | `admin123`                  |

> OpenSearch is used to improve search speed and AI features.

---

## 3. Automatic Feedback Deletion Settings

| Environment Variable                            | Description                           | Default / Condition           |
| ----------------------------------------------- | ------------------------------------- | ----------------------------- |
| `AUTO_FEEDBACK_DELETION_ENABLED`               | Enable old feedback deletion feature  | `false`                        |
| `AUTO_FEEDBACK_DELETION_PERIOD_DAYS`           | Deletion criteria in days             | `365` (required if enabled)   |

---

## 4. Web Server Environment Variables

### Required Environment Variables

| Environment Variable                  | Description                                | Example                    |
| ------------------------------------- | ------------------------------------------ | -------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`           | API server address for client use          | `http://localhost:4000`    |

### Optional Environment Variables

| Environment Variable | Description            | Default | Example   |
| -------------------- | ---------------------- | ------- | --------- |
| `PORT`               | Frontend port          | `3000`  | `3000`    |

---

## 5. Configuration Methods

### Docker Compose Example

```yaml
services:
  api:
    image: line/abc-user-feedback-api
    environment:
      - JWT_SECRET=changeme
      - MYSQL_PRIMARY_URL=mysql://user:pass@mysql:3306/userfeedback
      - SMTP_HOST=smtp.sendgrid.net
      - SMTP_USERNAME=apikey
      - SMTP_PASSWORD=your-sendgrid-key
```

### .env File Example

```
# apps/api/.env
JWT_SECRET=changemechangemechangeme
MYSQL_PRIMARY_URL=mysql://root:pass@localhost:3306/db
ACCESS_TOKEN_EXPIRED_TIME=10m
REFRESH_TOKEN_EXPIRED_TIME=1h
SMTP_HOST=smtp.example.com
SMTP_SENDER=noreply@example.com

# apps/web/.env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

---

## 7. Troubleshooting Guide

| Problem                      | Cause and Solution                               |
| ---------------------------- | ------------------------------------------------ |
| Environment variables not recognized | Check `.env` location or restart container       |
| DB connection failure        | Check `MYSQL_PRIMARY_URL` format or connection info |
| SMTP error                   | Recheck port/TLS settings or authentication info |
| OpenSearch error             | Check node URL or user authentication            |
| JWT token error              | Check `JWT_SECRET` length and complexity          |
| Environment variable validation failure | Check for missing required variables or type errors |
| Port conflict                | Check `APP_PORT`, `PORT` settings                |

---

## Related Documents

- [Docker Installation Guide](./docker-hub-images)
- [SMTP Integration Guide](./smtp-configuration)
- [Getting Started Guide](/en/user-guide/getting-started)

