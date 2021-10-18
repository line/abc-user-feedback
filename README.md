# ABC User Feedback

A standalone webapp to collect and organize user feedback. Server API and web UI are packed into single Dockerfile.

## Demo

WIP

## Document
WIP

## Features

- [WIP] Upvote enabled discussion forum
- 1:1 private inquiry
- Support oauth2 login (google)

## Deploy with Docker

### Prerequisites

- Docker
- Docker Compose
- Mysql (recommend use your own database)

### Install & Running Guide

WIP

#### Step 3: Running from docker compose

```bash
docker-compose pull
docker-compose up -d
```

#### Step 4: Check the app is work well

```bash
docker-compose logs app
```

then you can find message like
<br />
```bash
app_1 | Application is running on: http://[::1]:3000
```
