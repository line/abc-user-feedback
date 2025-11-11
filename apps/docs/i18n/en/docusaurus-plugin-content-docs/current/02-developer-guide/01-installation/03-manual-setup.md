---
sidebar_position: 3
title: "Manual Installation"
description: "Manual installation guide for building and running ABC User Feedback directly from source code"
---

# Manual Installation

This document explains how to manually install and configure ABC User Feedback. This is useful when you want to build and run the application directly from source code.

## Prerequisites

Before proceeding with manual installation, you must meet the following requirements:

- [Node.js v22.19.0 or higher](https://nodejs.org/en/download/)
- [pnpm v10.15.0 or higher](https://pnpm.io/installation) (package manager)
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

ABC User Feedback requires a MySQL database, SMTP server, and optionally OpenSearch. There are several ways to set up these infrastructure components.

### Infrastructure Setup Using Docker

The simplest method is to set up required infrastructure with Docker Compose:

```bash
docker-compose -f docker/docker-compose.infra.yml up -d
```

### Using Existing Infrastructure

If you already have MySQL, OpenSearch, or SMTP server, you can configure connection information as environment variables later.

## Installing Dependencies

ABC User Feedback uses a monorepo structure managed through TurboRepo. To install dependencies for all packages:

```bash
pnpm install
```

## Environment Variable Configuration

### API Server Environment Variables

Create a `.env` file in the `apps/api` directory and configure as follows:

```env
# Required environment variables
JWT_SECRET=your-jwt-secret-key
MYSQL_PRIMARY_URL=mysql://username:password@localhost:3306/database
ACCESS_TOKEN_EXPIRED_TIME=10m
REFRESH_TOKEN_EXPIRED_TIME=1h

# Optional environment variables
APP_PORT=4000
APP_ADDRESS=0.0.0.0
AUTO_MIGRATION=true

# SMTP settings
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
SMTP_SENDER=noreply@example.com

# OpenSearch settings (optional)
OPENSEARCH_USE=false
# OPENSEARCH_NODE=http://localhost:9200
# OPENSEARCH_USERNAME=admin
# OPENSEARCH_PASSWORD=admin
```

### Web Server Environment Variables

Create a `.env` file in the `apps/web` directory and configure as follows:

```env
# Required environment variables
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

For detailed information on environment variables, refer to the [Environment Variable Settings](./05-configuration.md) document.

## Database Migration

Before running the API server for the first time, you need to create the database schema. If you set the `AUTO_MIGRATION=true` environment variable, migrations will run automatically when the server starts.

To run migrations manually:

```bash
cd apps/api
npm run migration:run
```

## Running in Development Mode

### Running with Single Command

To run the API server and web server in development mode:

```bash
# From project root directory
pnpm dev
```

This command starts both the API server and web server simultaneously. The API server runs on port 4000 by default, and the web server runs on port 3000.

### Running Individual Packages

#### Building Common Packages

Before running the web application, you need to build shared packages:

```bash
# From project root directory
cd packages/ufb-shared
pnpm build
```

#### Building UI Packages

Before running the web application, you need to build UI packages:

```bash
# From project root directory
cd packages/ufb-tailwindcss
pnpm build
```

#### Running Each Server Individually

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
# From project root directory
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

This command generates TypeScript types from OpenAPI specification and saves them to the `src/shared/types/api.type.ts` file.

**Note**: For this command to work properly, the API server must be running at `http://localhost:4000`.

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

## Swagger Documentation

When the API server is running, you can check Swagger documentation at the following endpoints:

- **API Documentation**: http://localhost:4000/docs
- **Admin API Documentation**: http://localhost:4000/admin-docs
- **OpenAPI JSON**: http://localhost:4000/docs-json
- **Admin OpenAPI JSON**: http://localhost:4000/admin-docs-json

## Troubleshooting

### Common Issues

1. **Dependency Installation Errors**:

   - Verify Node.js version is v22.19.0 or higher.
   - Verify pnpm version is v10.15.0 or higher.
   - Update pnpm to the latest version.
   - Try `pnpm install --force`.

2. **Database Connection Errors**:

   - Verify MySQL server is running.
   - Verify database credentials are correct.
   - Verify `MYSQL_PRIMARY_URL` environment variable format is correct.
   - If using Docker infrastructure, verify MySQL is running on port 13306 (not 3306).

3. **Build Errors**:

   - Verify UI packages are built (`pnpm build:ui`).
   - Verify all dependencies are installed.
   - Check TypeScript errors.

4. **Runtime Errors**:
   - Verify environment variables are set correctly.
   - Verify required ports are available.
   - Check error messages in logs.

