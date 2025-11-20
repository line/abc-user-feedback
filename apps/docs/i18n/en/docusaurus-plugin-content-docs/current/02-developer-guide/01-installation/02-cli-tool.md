---
sidebar_position: 2
title: "CLI Tool Usage"
description: "This document explains how to quickly and easily install and manage the system using the ABC User Feedback CLI tool."
---

# CLI Tool Usage

The ABC User Feedback CLI (`auf-cli`) is a command-line tool that simplifies system installation, execution, and management. As long as Node.js and Docker are installed, you can run it immediately via `npx` without installing additional dependencies or cloning the repository.

## Main Features

- Automatic setup of required infrastructure (MySQL, SMTP, OpenSearch)
- Simplified environment variable configuration
- Automatic start/stop of API and web servers
- Volume data cleanup
- Dynamic Docker Compose file generation

## Docker Images Used

- `line/abc-user-feedback-web:latest` - Web frontend
- `line/abc-user-feedback-api:latest` - API backend
- `mysql:8.0` - Database
- `rnwood/smtp4dev:v3` - SMTP test server
- `opensearchproject/opensearch:2.16.0` - Search engine (optional)

## Prerequisites

Before using the CLI tool, you must meet the following requirements:

- [Node.js v22 or higher](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/desktop/)

## Basic Commands

### Initialization

To set up the infrastructure required for ABC User Feedback, run the following command:

```bash
npx auf-cli init
```

This command performs the following tasks:

1. Creates `config.toml` file for environment variable configuration
2. Sets up required infrastructure according to architecture (ARM/AMD)

After initialization is complete, a `config.toml` file is created in the current directory. You can edit this file as needed to adjust environment variables.

### Starting Server

To start the API and web servers, run the following command:

```bash
npx auf-cli start
```

This command performs the following tasks:

1. Reads environment variables from `config.toml` file
2. Generates Docker Compose file and starts services
3. Starts API and web server containers and required infrastructure (MySQL, SMTP, OpenSearch)

After the server starts successfully, you can access the ABC User Feedback web interface at `http://localhost:3000` (or configured URL) in your web browser. The CLI displays the following URLs:

- Web interface URL
- API URL
- MySQL connection string
- OpenSearch URL (if enabled)
- SMTP web interface (when using smtp4dev)

### Stopping Server

To stop the API and web servers, run the following command:

```bash
npx auf-cli stop
```

This command stops running API and web server containers and infrastructure containers. All data stored in volumes is preserved.

### Volume Cleanup

To clean up Docker volumes created during startup, run the following command:

```bash
npx auf-cli clean
```

This command stops all containers and deletes Docker volumes for MySQL, SMTP, OpenSearch, etc.

**Warning**: This operation deletes all data, so back up if needed.

You can also clean up unused Docker images using the `--images` option:

```bash
npx auf-cli clean --images
```

## Configuration File (config.toml)

Running the `init` command creates a `config.toml` file in the current directory. This file is used to configure environment variables for ABC User Feedback.

The following is an example of a `config.toml` file:

```toml
[web]
port = 3000
# api_base_url = "http://localhost:4000"

[api]
port = 4000
jwt_secret = "jwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecret"

# master_api_key = "MASTER_KEY"
# access_token_expired_time = "10m"
# refresh_token_expired_time = "1h"

# [api.auto_feedback_deletion]
# enabled = true
# period_days = 365

# [api.smtp]
# host = "smtp4dev" # SMTP_HOST
# port = 25 # SMTP_PORT
# sender = "user@feedback.com"
# username=
# password=
# tls=
# cipher_spec=
# opportunitic_tls=

# [api.opensearch]
# enabled = true

[mysql]
port = 13306
```

You can edit this file as needed to adjust environment variables. For detailed information on environment variables, refer to the [Environment Variable Settings](./05-configuration.md) document.

## Advanced Usage

### Changing Ports

By default, the web server uses port 3000 and the API server uses port 4000. To change these, modify the following settings in the `config.toml` file:

```toml
[web]
port = 8000  # Change web server port
api_base_url = "http://localhost:8080"  # API URL must also be changed

[api]
port = 8080  # Change API server port

[mysql]
port = 13307  # Change MySQL port if needed
```

### Enabling OpenSearch

To enable OpenSearch for advanced search features:

```toml
[api.opensearch]
enabled = true
```

**Notes**:

- OpenSearch requires at least 2GB of available memory
- OpenSearch container is available at `http://localhost:9200`
- Check OpenSearch status: `http://localhost:9200/_cluster/health`

### SMTP Settings

For development environments, the default `smtp4dev` settings are recommended:

```toml
[api.smtp]
host = "smtp4dev"
port = 25
sender = "dev@feedback.local"
```

The smtp4dev web interface is available at `http://localhost:5080` to check sent emails.

## Troubleshooting

### Common Issues

1. **Docker-related errors**:

   - Check if Docker is running: `docker --version`
   - Check Docker permissions: `docker ps`
   - Verify Docker Desktop is properly installed and running

2. **Port conflicts**:

   - Check port usage: `lsof -i :PORT` (macOS/Linux) or `netstat -ano | findstr :PORT` (Windows)
   - Change port settings in `config.toml`
   - Common conflicting ports: 3000, 4000, 13306, 9200, 5080

3. **Service startup failure**:

   - Check container logs: `docker compose logs SERVICE_NAME`
   - Verify Docker images are available: `docker images`
   - Check sufficient system resources (memory, disk space)

4. **Database connection issues**:
   - Check MySQL container status: `docker compose ps mysql`
   - Check MySQL logs: `docker compose logs mysql`
   - Test connection: `docker compose exec mysql mysql -u userfeedback -p`

### Debugging Tips

1. **Check container logs**:

   ```bash
   # All container logs
   docker compose logs

   # Specific service logs
   docker compose logs api
   docker compose logs web
   docker compose logs mysql
   ```

2. **Check service status**:

   ```bash
   # Check API status
   curl http://localhost:4000/api/health

   # Check OpenSearch status (if enabled)
   curl http://localhost:9200/_cluster/health
   ```

3. **Direct database access**:
   ```bash
   # Connect to MySQL
   docker compose exec mysql mysql -u userfeedback -p userfeedback
   ```

## Limitations

The CLI tool is designed for development and testing environments. For production deployment, consider the following:

1. **Security Considerations**:

   - Use environment variables instead of configuration files for sensitive data
   - Implement proper secret management
   - Use production-grade JWT secrets
   - Enable HTTPS/TLS encryption

2. **Scalability and Availability**:

   - Use orchestration tools like Kubernetes or Docker Swarm
   - Implement load balancing and auto-scaling
   - Set up proper monitoring and alerts
   - Use managed database services (RDS, Cloud SQL, etc.)

3. **Data Management**:
   - Implement automated backup strategies
   - Use persistent volumes with proper backups
   - Consider data retention policies
   - Monitor disk usage and performance

## Next Steps

For detailed API and web server configuration options, refer to the [Environment Variable Settings](./05-configuration.md) document.

