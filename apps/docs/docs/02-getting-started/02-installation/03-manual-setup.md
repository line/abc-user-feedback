---
sidebar_position: 3
title: 'Manual Installation'
description: 'A manual installation guide for building and running ABC User Feedback directly from source code.'
---

# Manual Installation

This document guides you through manually installing and configuring ABC User Feedback. This method is useful when you want to build and run the application directly from source code instead of using Docker images.

## Prerequisites

Before proceeding with manual installation, you must meet the following requirements:

- [Node.js v22 or higher](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation) (package manager)
- [Git](https://git-scm.com/downloads)
- [MySQL 8.0](https://www.mysql.com/downloads/)
- SMTP server
- (Optional) [OpenSearch 2.16](https://opensearch.org/)

## Downloading Source Code

First, clone the ABC User Feedback source code from the GitHub repository:

```bash
git clone https://github.com/line/abc-user-feedback.git
cd abc-user-feedback
```

## Infrastructure Setup

ABC User Feedback requires a MySQL database and optionally OpenSearch and SMTP servers. There are several ways to set up these infrastructure components.

### Infrastructure Setup using Docker

The simplest way is to set up the required infrastructure using Docker Compose:

```bash
docker-compose -f docker/docker-compose.infra.yml up -d
```

### Using Existing Infrastructure

If you already have MySQL, OpenSearch, or SMTP servers, you can configure their connection information as environment variables later.

## Installing Dependencies

ABC User Feedback uses a monorepo structure and is managed through TurboRepo. To install dependencies for all packages:

```bash
pnpm install
```

## Environment Variable Configuration

### API Server Environment Variables

Create a `.env` file in the `apps/api` directory and configure it as follows:

```
# Required environment variables
JWT_SECRET=your-jwt-secret-key
MYSQL_PRIMARY_URL=mysql://username:password@localhost:3306/database
ACCESS_TOKEN_EXPIRED_TIME=10m
REFRESH_TOKEN_EXPIRED_TIME=1h

# Optional environment variables
APP_PORT=4000
APP_ADDRESS=0.0.0.0
AUTO_MIGRATION=true

# SMTP configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
SMTP_SENDER=noreply@example.com

# OpenSearch configuration (optional)
OPENSEARCH_USE=false
# OPENSEARCH_NODE=http://localhost:9200
# OPENSEARCH_USERNAME=admin
# OPENSEARCH_PASSWORD=admin
```

### Web Server Environment Variables

Create a `.env` file in the `apps/web` directory and configure it as follows:

```
# Required environment variables
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

For detailed information about environment variables, refer to the [Environment Variable Configuration](./04-configuration.md) documentation.

## Database Migration

Before running the API server for the first time, you need to create the database schema. If you set the `AUTO_MIGRATION=true` environment variable, migration will be executed automatically when the server starts.

To manually run migration:

```bash
cd apps/api
npm run migration:run
```

## Running in Development Mode

### Running with a Single Command

To run the API server and web server in development mode:

```bash
# From the project root directory
pnpm dev
```

This command starts both the API server and web server simultaneously. The API server runs on port 4000 by default, and the web server runs on port 3000.

### Running Individual Packages

#### Building Common Packages

Before running the web application, you need to build the shared package:

```bash
# From the project root directory
cd packages/ufb-shared
pnpm build

```

#### Building UI Packages

Before running the web application, you need to build the UI packages:

```bash
# From the project root directory
cd packages/ufb-tailwindcss
pnpm build

# From the project root directory
cd packages/ufb-react
pnpm build
```

#### Running Each Server

To run each server individually:

```bash
# Run API server only
cd apps/api
pnpm dev

# Run web server only
cd apps/web
pnpm dev
```

## Production Build

To build the application for production environment:

```bash
# From the project root directory
pnpm build
```

This command builds both the API server and web server.

## Running in Production Mode

To run the production build:

```bash
# Run API server
cd apps/api
pnpm start

# Run web server
cd apps/web
pnpm start
```

## API Type Generation

When the backend API is running, you can generate API types for the frontend:

```bash
cd apps/web
pnpm generate-api-type
```

This command generates TypeScript types using the OpenAPI specification and saves them to the `src/types/api.type.ts` file.

## Code Quality Management

### Linting

To run code linting:

```bash
pnpm lint
```

### Formatting

To run code formatting:

```bash
pnpm format
```

### Testing

To run tests:

```bash
pnpm test
```

## Dashboard Statistics Data Migration

Dashboard statistics data is generated daily at midnight from MySQL data according to the timezone set in the project. The scheduler generates data for 365 days.

To manually generate dashboard data, you can use the `/migration/statistics` API. This API allows you to generate data for more than 365 days as well.

To change a project's timezone, you must change it directly in the MySQL database (this feature is not provided in the admin web interface). After changing the timezone, you must delete all statistics data and regenerate it using the migration API.

## Swagger Documentation

When the API server is running, Swagger documentation is available at the `/docs` endpoint:

```
http://localhost:4000/docs
```

## Production Deployment Considerations

When manually deploying to a production environment, consider the following:

1. **Use a Process Manager**: Use a process manager like [PM2](https://pm2.keymetrics.io/) to run and monitor your application.

2. **Configure Reverse Proxy**: Use a reverse proxy like [Nginx](https://nginx.org/) or [Apache](https://httpd.apache.org/) to configure HTTPS and load balancing.

3. **Environment Variable Management**: Manage environment variables securely in production. It's recommended to use system environment variables instead of `.env` files.

4. **Logging and Monitoring**: Configure appropriate logging and monitoring solutions to track application status.

5. **Backup Strategy**: Implement regular backup strategies for databases and important files.

## Troubleshooting

### Common Issues

1. **Dependency installation errors**:

   - Make sure Node.js version is v22 or higher.
   - Update pnpm to the latest version.
   - Try `pnpm install --force`.

2. **Database connection errors**:

   - Make sure MySQL server is running.
   - Verify that database credentials are correct.
   - Check if the `MYSQL_PRIMARY_URL` environment variable format is correct.

3. **Build errors**:

   - Make sure UI packages are built (`pnpm build:ui`).
   - Verify that all dependencies are installed.
   - Check for TypeScript errors.

4. **Runtime errors**:
   - Make sure environment variables are set correctly.
   - Check if required ports are available.
   - Check error messages in logs.

## Next Steps

If you have successfully completed the manual installation, proceed to the [Tutorial](../03-tutorial.md) to configure the system and add users.
