# ABC User Feedback CLI

The ABC User Feedback CLI helps you easily run web frontends and servers.

[ABC User Feedback](https://github.com/line/abc-user-feedback) is a standalone web application that manages Voice of Customer (VoC) data, allowing you to gather and organize feedback from your customers.

## Prerequisites

- [Node.js v20 or above](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/desktop/)

## Running without dependency

You can run this cli with [npx](https://docs.npmjs.com/cli/v8/commands/npx), so there's no need to install additional dependencies or clone the repository. Regardless of your operating system or environment, you can run servers with just the prerequisites mentioned above.

There are `npx` commands for setting up the infrastructure, starting servers, and stopping servers.

## Initialization

The following command sets up the infrastructure(MySQL, SMTP, OpenSearch) based on your architecture(ARM/AMD).
It also creates a `config.toml` file where you can configure environment variables to start the servers.

```sh
npx auf-cli init
```

## Start Servers

Based on `config.toml` file created during the initialization phase, this command generates a Docker Compose file. Using this Docker Compose file, the following command starts the API and web servers.

```sh
npx auf-cli start
```

## Stop Servers

The following command stops the API and web servers.

```sh
npx auf-cli stop
```
