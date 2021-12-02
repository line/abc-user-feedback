<p align="center">
    <img src="https://user-images.githubusercontent.com/20738369/138070075-d990fd46-971f-4eb3-87f2-2e36d8503ce0.png">
    <h1 align="center">ABC User Feedback</h1>
</p>


A standalone webapp to collect and organize user feedback. Server API and web UI are packed into single Dockerfile.

## Features

- [WIP] Upvote enabled discussion forum
- 1:1 private inquiry
- Support oauth2 login (google)

## Prerequisites

- Docker
- Docker Compose
- Mysql (recommend use your own database)

## Deploy with Docker


### Install & Running Guide

#### Step 1: Create config.yaml and mount volumes

`config.yaml`
```yaml
app:
  domain: your_feedback.domain_name.com
jwt:
  # 512-bit recommended
  # https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx 
  secret: {your_jwt_secret}
  # access token cookie name
  accessToken: USFD_TOKEN
  # refresh token cookie name
  refreshToken: USFD_RF 
smtp:
  host: smtp.host.com
  port: 587
  username: smtp_username
  password: smtp_password
oauth:
  google:
    clientId: {{google_client_id}}
    clientSecret: {{google_client_secret}}
```

#### Step 2: Create a docker-compose.yml

```yaml
version: '2'
services:
  mysql:
    image: mysql
    command: mysqld --default-authentication-plugin=mysql_native_password
    volumes:
      - ./data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: userfeedback
      MYSQL_DATABASE: userfeedback
      MYSQL_USER: userfeedback
      MYSQL_PASSWORD: userfeedback
  app:
    restart: always
    image: line/abc-user-feedback:main
    ports:
      - '80:3000'
    volumes:
      - ./config.yaml:/usr/app/config.yaml
    environment:
      DB_CONNECTION_STRING: "mysql://userfeedback@userfeedback/userfeedback"
    depends_on:
      - mysql

```

if you have your own mysql database, then remove mysql service and using only app service

```yaml
 version: '2'
 services:
   app:
     restart: always
     image: line/abc-user-feedback:main
     ports:
       - '80:3000'
     volumes:
       - ./config.yaml:/usr/app/config.yaml
     environment:
       DB_CONNECTION_STRING: "{{mysql_connection_string}}"
```

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

## Demo

WIP

## Document
WIP
