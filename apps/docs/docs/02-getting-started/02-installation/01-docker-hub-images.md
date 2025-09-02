---
sidebar_position: 1
title: 'Docker Hub Images'
description: 'Guide on how to install and run ABC User Feedback using Docker Hub images.'
---

# Docker Hub Images

ABC User Feedback provides official images on Docker Hub for easy deployment. This document guides you through installing and running ABC User Feedback using Docker Hub images.

## Available Docker Images

ABC User Feedback provides Docker images for two main components:

1. **Web Admin Frontend**: Next.js-based web interface [[Image](https://hub.docker.com/r/line/abc-user-feedback-web)]
2. **API Backend**: NestJS-based API server [[Image](https://hub.docker.com/r/line/abc-user-feedback-api)]

Each image is published to Docker Hub for every release, providing both the latest stable version and specific version tags.

## Image Download

You can download ABC User Feedback images from Docker Hub using the following commands:

### Web Admin Frontend

```bash
docker pull line/abc-user-feedback-web
```

To download a specific version, specify the tag:

```bash
docker pull line/abc-user-feedback-web:1.0.0
```

### API Backend

```bash
docker pull line/abc-user-feedback-api
```

To download a specific version, specify the tag:

```bash
docker pull line/abc-user-feedback-api:1.0.0
```

## Installation using Docker Compose

Create a docker-compose.yml file:

```yaml
services:
  web:
    container_name: ufb-web
    image: line/abc-user-feedback-web:latest
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
    ports:
      - 3000:3000
    depends_on:
      - api
    restart: unless-stopped

  api:
    container_name: ufb-api
    image: line/abc-user-feedback-api:latest
    environment:
      - JWT_SECRET=jwtsecretjwtsecretjwtsecret
      - MYSQL_PRIMARY_URL=mysql://userfeedback:userfeedback@mysql:3306/userfeedback
      - BASE_URL=0.0.0.0
      - SMTP_HOST=smtp4dev
      - SMTP_PORT=25
      - SMTP_SENDER=user@feedback.com
      - SMTP_BASE_URL=http://localhost:3000
    ports:
      - 4000:4000
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    container_name: ufb-db
    image: mysql:8.0
    command:
      [
        '--default-authentication-plugin=mysql_native_password',
        '--collation-server=utf8mb4_bin',
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
    container_name: ufb-smtp
    image: rnwood/smtp4dev:v3
    ports:
      - 5080:80
      - 25:25
      - 143:143
    volumes:
      - smtp4dev:/smtp4dev
    restart: unless-stopped

volumes:
  mysql:
  smtp4dev:
```

You can start all services at once using this integrated file:

```bash
docker compose up -d
```

For detailed information about environment variables, refer to the [Environment Variable Configuration](./04-configuration.md) documentation.

## Initial Setup

After the containers are running, perform the following steps to complete the initial setup:

1. Access `http://localhost:3000` (or the URL you configured) in your web browser.
2. Create an initial administrator account. (If using smtp4dev, you can receive emails at `http://localhost:5080`.)
3. After logging in, configure projects, channels, tags, etc.

For detailed initial setup instructions, refer to the [Initial Setup](../03-tutorial.md) documentation.

## Next Steps

If you have successfully installed ABC User Feedback using Docker Hub images, proceed to the [Tutorial](../03-tutorial.md) to configure the system and add users.
