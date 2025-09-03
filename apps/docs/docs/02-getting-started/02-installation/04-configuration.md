---
sidebar_position: 4
title: 'Environment Variable Configuration'
description: 'Description of environment variable configuration.'
---

# Environment Variable Configuration

This document provides detailed explanations of the environment variables used in ABC User Feedback's API server and web server. Proper configuration of environment variables is important for stable system operation and security.

## API Server Environment Variables

### App Environment Variables

| Environment Variable         | Description                                        | Default                 | Example                       |
| ---------------------------- | -------------------------------------------------- | ----------------------- | ----------------------------- |
| `JWT_SECRET`                 | Secret key used for JSON Web Token (JWT) signing   | _Required_              | `jwtsecretjwtsecretjwtsecret` |
| `APP_PORT`                   | Port on which the server runs                      | `4000`                  | `4000`                        |
| `APP_ADDRESS`                | Address to which the server binds                  | `0.0.0.0`               | `0.0.0.0`                     |
| `AUTO_MIGRATION`             | Perform automatic migration on application startup | `true`                  | `true`                        |
| `MASTER_API_KEY`             | Master API key for privileged operations           | _None_                  | `your-api-key`                |
| `ACCESS_TOKEN_EXPIRED_TIME`  | Access token expiration time                       | `10m`                   | `10m` (10 minutes)            |
| `REFRESH_TOKEN_EXPIRED_TIME` | Refresh token expiration time                      | `1h`                    | `1h` (1 hour)                 |
| `ADMIN_WEB_URL`              | Base URL of the admin web url                      | `http://localhost:3000` | `http://localhost:3000`       |

### Database Configuration

| Environment Variable   | Description                                         | Default    | Example                                                     |
| ---------------------- | --------------------------------------------------- | ---------- | ----------------------------------------------------------- |
| `MYSQL_PRIMARY_URL`    | Primary MySQL database connection URL               | _Required_ | `mysql://userfeedback:userfeedback@mysql:3306/userfeedback` |
| `MYSQL_SECONDARY_URLS` | Secondary MySQL connection URLs (JSON array format) | _Optional_ | `["mysql://user:pass@host2:3306/db"]`                       |

### SMTP Configuration (for Email Authentication)

| Environment Variable     | Description                             | Default    | Example               |
| ------------------------ | --------------------------------------- | ---------- | --------------------- |
| `SMTP_HOST`              | SMTP server host                        | _Required_ | `smtp.example.com`    |
| `SMTP_PORT`              | SMTP server port                        | _Required_ | `587`                 |
| `SMTP_SENDER`            | Email address used as the sender        | _Required_ | `noreply@example.com` |
| `SMTP_USERNAME`          | SMTP server authentication username     | _Optional_ | `user@example.com`    |
| `SMTP_PASSWORD`          | SMTP server authentication password     | _Optional_ | `password`            |
| `SMTP_TLS`               | Enable security options for SMTP server | `false`    | `true`                |
| `SMTP_CIPHER_SPEC`       | SMTP encryption algorithm specification | `TLSv1.2`  | `TLSv1.2`             |
| `SMTP_OPPORTUNISTIC_TLS` | Use opportunistic TLS with STARTTLS     | `true`     | `true`                |

## OpenSearch Configuration (for Search Performance Enhancement)

| Environment Variable  | Description                        | Default                             | Example                       |
| --------------------- | ---------------------------------- | ----------------------------------- | ----------------------------- |
| `OPENSEARCH_USE`      | OpenSearch integration enable flag | `false`                             | `true`                        |
| `OPENSEARCH_NODE`     | OpenSearch node URL                | _Required when OPENSEARCH_USE=true_ | `http://opensearch-node:9200` |
| `OPENSEARCH_USERNAME` | OpenSearch username                | _Required when OPENSEARCH_USE=true_ | `admin`                       |
| `OPENSEARCH_PASSWORD` | OpenSearch password                | _Required when OPENSEARCH_USE=true_ | `admin`                       |

## Automatic Feedback Deletion Configuration

| Environment Variable                 | Description                                                        | Default                                             | Example |
| ------------------------------------ | ------------------------------------------------------------------ | --------------------------------------------------- | ------- |
| `AUTO_FEEDBACK_DELETION_ENABLED`     | Enable automatic old feedback deletion cron on application startup | `false`                                             | `true`  |
| `AUTO_FEEDBACK_DELETION_PERIOD_DAYS` | Automatic old feedback deletion period (days)                      | _Required when AUTO_FEEDBACK_DELETION_ENABLED=true_ | `365`   |

## Web Environment Variables

### Required Environment Variables

| Environment Variable       | Description                                | Default                 | Example                 |
| -------------------------- | ------------------------------------------ | ----------------------- | ----------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | API base URL to be used on the client side | `http://localhost:4000` | `http://localhost:4000` |

## How to Set Environment Variables

The method for setting environment variables varies depending on the deployment method:

### When Using Docker Compose

You can set environment variables through the `environment` section in the Docker Compose file:

```yaml
services:
  api:
    image: line/abc-user-feedback-api:latest
    environment:
      - JWT_SECRET=your-jwt-secret
      - MYSQL_PRIMARY_URL=mysql://user:password@mysql:3306/db
      # Other environment variables
```

### When Installing Manually

You can set environment variables using `.env` files:

```
# API server .env file (apps/api/.env)
JWT_SECRET=your-jwt-secret
MYSQL_PRIMARY_URL=mysql://user:password@localhost:3306/db
# Other environment variables

# Web server .env file (apps/web/.env)
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Environment Variable Usage Tips

### Security Tips

1. **Use Strong JWT Secret**: Use a randomly generated long string for `JWT_SECRET`.
2. **Protect Environment Variables in Production**: Manage environment variables securely in production environments.
3. **Use HTTPS**: Always serve your service over HTTPS in production environments.

### Performance Tips

1. **Enable OpenSearch**: Enable OpenSearch to improve search performance when handling large amounts of feedback data.
2. **Optimize Memory Allocation**: Use `NODE_OPTIONS` to allocate appropriate memory to Node.js.

### Deployment Tips

1. **Environment-specific Configuration**: Use different environment variable values for development, testing, and production environments.
2. **Use Auto Migration Carefully**: Be careful when using `AUTO_MIGRATION=true` setting in production environments. It's recommended to perform migration after backing up the database.

## MySQL Connection URL Format

The `MYSQL_PRIMARY_URL` environment variable must follow this format:

```
mysql://username:password@hostname:port/database
```

Examples:

- Local development: `mysql://root:password@localhost:3306/userfeedback`
- Docker Compose: `mysql://userfeedback:userfeedback@mysql:3306/userfeedback`

## Token Expiration Time Format

The `ACCESS_TOKEN_EXPIRED_TIME` and `REFRESH_TOKEN_EXPIRED_TIME` environment variables use the following format:

- `Xs`: X seconds (e.g., `30s`)
- `Xm`: X minutes (e.g., `10m`)
- `Xh`: X hours (e.g., `1h`)
- `Xd`: X days (e.g., `7d`)

## Troubleshooting

### Common Environment Variable Issues

1. **Environment variables not recognized**:

   - Check if the environment variable names are correct.
   - Verify that environment variables are set in the correct location.
   - If using Docker Compose, restart the containers.

2. **Database connection errors**:

   - Check if the `MYSQL_PRIMARY_URL` format is correct.
   - Verify that the MySQL server is running and accessible.
   - Check if the username and password are correct.

3. **SMTP errors**:

   - Check if the SMTP server settings are correct.
   - Adjust `SMTP_TLS` and `SMTP_CIPHER_SPEC` settings if necessary.

4. **OpenSearch connection errors**:
   - Check if the OpenSearch server is running.
   - Verify that `OPENSEARCH_NODE`, `OPENSEARCH_USERNAME`, and `OPENSEARCH_PASSWORD` settings are correct.

## Next Steps

After properly configuring environment variables, refer to the [Tutorial](../03-tutorial.md) document to initialize the ABC User Feedback system and add users.
