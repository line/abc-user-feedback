---
sidebar_position: 2
title: 'Using CLI Tool'
description: 'Guide on how to install, run, and manage ABC User Feedback using the CLI tool.'
---

# Using CLI Tool

The ABC User Feedback CLI (`auf-cli`) is a command-line interface tool designed to simplify the installation, execution, and management of ABC User Feedback. This document guides you through setting up ABC User Feedback quickly and easily using the CLI tool.

## Introduction to CLI Tool

`auf-cli` provides the following key features:

- Automatic setup of required infrastructure (MySQL, SMTP, OpenSearch)
- Simplified environment variable configuration
- Automated start/stop of API and web servers
- Volume data cleanup

The biggest advantage of this tool is that it can be executed directly through `npx` without installing additional dependencies or cloning repositories, as long as Node.js and Docker are installed.

## Prerequisites

Before using the CLI tool, you must meet the following requirements:

- [Node.js v22 or higher](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/desktop/)

## Basic Commands

### Initialization

Run the following command to set up the infrastructure required for ABC User Feedback:

```bash
npx auf-cli init
```

This command performs the following tasks:

1. Detects the system architecture (ARM/AMD) and selects the appropriate Docker images.
2. Sets up necessary infrastructure containers such as MySQL, SMTP, and OpenSearch.
3. Creates a `config.toml` file for environment variable configuration.

Once initialization is complete, a `config.toml` file will be created. You can edit this file to adjust environment variables as needed.

### Starting the Server

Run the following command to start the API and web servers:

```bash
npx auf-cli start
```

This command performs the following tasks:

1. Reads environment variables from the `config.toml` file.
2. Generates a Docker Compose file.
3. Starts the API and web server containers.

Once the server starts successfully, you can access the ABC User Feedback web interface by navigating to `http://localhost:3000` (or the configured URL) in your web browser.

### Stopping the Server

Run the following command to stop the API and web servers:

```bash
npx auf-cli stop
```

This command stops the running API and web server containers. Infrastructure containers (MySQL, SMTP, OpenSearch) will continue to run.

### Volume Cleanup

Run the following command to clean up Docker volumes created during initialization:

```bash
npx auf-cli clean
```

This command deletes Docker volumes for MySQL, SMTP, OpenSearch, etc. **Warning**: This operation will delete all data, so make sure to back up your data beforehand if backup is needed.

## Configuration File (config.toml)

When you run the `init` command, a `config.toml` file is created in the current directory. This file is used to configure environment variables for ABC User Feedback.

Here's an example of the `config.toml` file:

```toml
[api]
JWT_SECRET = "jwtsecretjwtsecretjwtsecret"
MYSQL_PRIMARY_URL = "mysql://userfeedback:userfeedback@mysql:3306/userfeedback"
ACCESS_TOKEN_EXPIRED_TIME = "10m"
REFRESH_TOKEN_EXPIRED_TIME = "1h"
APP_PORT = 4000
APP_ADDRESS = "0.0.0.0"
AUTO_MIGRATION = true
NODE_OPTIONS = "--max_old_space_size=3072"
SMTP_HOST = "smtp4dev"
SMTP_PORT = 25
SMTP_SENDER = "user@feedback.com"

# OpenSearch configuration (optional)
# OPENSEARCH_USE = true
# OPENSEARCH_NODE = "http://opensearch-node:9200"
# OPENSEARCH_USERNAME = "admin"
# OPENSEARCH_PASSWORD = "UserFeedback123!@#"

[web]
NEXT_PUBLIC_API_BASE_URL = "http://localhost:4000"
```

You can edit this file as needed to adjust environment variables. For detailed information about environment variables, refer to the [Environment Variable Configuration](./04-configuration.md) documentation.

## Advanced Usage

### Changing Ports

By default, the web server uses port 3000 and the API server uses port 4000. To change these, modify the following settings in the `config.toml` file:

```toml
[api]
APP_PORT = 8080  # Change API server port

[web]
PORT = 8000  # Change web server port
NEXT_PUBLIC_API_BASE_URL = "http://localhost:8080"  # API URL must also be changed
```

### Custom Docker Compose File

The CLI tool internally generates and uses a Docker Compose file. To view the generated Docker Compose file, check the `docker-compose.yml` file in the current directory after running the `start` command.

You can directly modify this file to apply additional configurations, but be aware that changes may be overwritten when you run the `auf-cli start` command again.

## Troubleshooting

### Common Issues

1. **Docker-related errors**:

   - Make sure Docker is running.
   - Verify that you have permissions to execute Docker commands.

2. **Port conflicts**:

   - Check if ports 3000, 4000, 13306, 9200, etc., are being used by other applications.
   - Change port settings in the `config.toml` file.

3. **Out of memory**:
   - Increase the memory allocated to Docker.
   - OpenSearch requires a minimum of 2GB of memory.

## Limitations

The CLI tool is suitable for use in development and testing environments. For production environments, consider the following:

1. Set up and manage environment variables directly for enhanced security.
2. Use orchestration tools like Kubernetes or Docker Swarm for high availability and scalability.
3. Implement data persistence and backup strategies.

## Next Steps

If you have successfully installed ABC User Feedback using the CLI tool, proceed to the [Tutorial](../03-tutorial.md) to configure the system and add users.

For detailed API and web server configuration options, refer to the [Environment Variable Configuration](./04-configuration.md) documentation.
