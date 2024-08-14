# UserFeedback CLI

UserFeedback CLI that helps to run web frontend and server easily.

[ABC User Feedback](https://github.com/line/abc-user-feedback) is a standalone web application that manages Voice of Customer (VoC) data. It allows you to gather and sort feedback from your customers.

## Running without dependency

You can run this cli with [npx](https://docs.npmjs.com/cli/v8/commands/npx), so you don't have to install additional dependency or clone repository.

There are `npx` commands that setting infrastructure, running servers, and stop servers.

## Initialization

Following command sets up infrastructures(MySQL, SMTP, OpenSearch)

```sh
npx ufb-cli init
```

## Start Servers

Following command starts api/web servers

```sh
npx ufb-cli start
```

## Stop Servers

Following command stops api/web servers

```sh
npx ufb-cli stop
```
