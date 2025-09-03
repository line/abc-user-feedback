---
sidebar_position: 1
title: 'Docker Hub 이미지'
description: 'Docker Hub 이미지를 사용하여 ABC User Feedback을 설치하고 실행하는 방법을 안내합니다.'
---

# Docker Hub 이미지

ABC User Feedback은 손쉬운 배포를 위해 Docker Hub에 공식 이미지를 제공합니다. 이 문서에서는 Docker Hub 이미지를 사용하여 ABC User Feedback을 설치하고 실행하는 방법을 안내합니다.

## 제공되는 Docker 이미지

ABC User Feedback은 두 가지 주요 컴포넌트에 대한 Docker 이미지를 제공합니다:

1. **웹 관리자 프론트엔드**: Next.js 기반의 웹 인터페이스 [[이미지](https://hub.docker.com/r/line/abc-user-feedback-web)]
2. **API 백엔드**: NestJS 기반의 API 서버 [[이미지](https://hub.docker.com/r/line/abc-user-feedback-api)]

각 이미지는 모든 릴리스에서 Docker Hub에 게시되며, 최신 안정 버전과 특정 버전 태그를 모두 제공합니다.

## 이미지 다운로드

다음 명령을 사용하여 Docker Hub에서 ABC User Feedback 이미지를 다운로드할 수 있습니다:

### 웹 관리자 프론트엔드

```bash
docker pull line/abc-user-feedback-web
```

특정 버전을 다운로드하려면 태그를 지정하세요:

```bash
docker pull line/abc-user-feedback-web:1.0.0
```

### API 백엔드

```bash
docker pull line/abc-user-feedback-api
```

특정 버전을 다운로드하려면 태그를 지정하세요:

```bash
docker pull line/abc-user-feedback-api:1.0.0
```

## Docker Compose를 사용한 설치

docker-compose.yml 파일 생성

```yaml
name: 'abc-user-feedback',

services:
  web:
    image: line/abc-user-feedback-web:latest
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
    ports:
      - 3000:3000
    depends_on:
      - api
    restart: unless-stopped

  api:
    image: line/abc-user-feedback-api:latest
    environment:
      - JWT_SECRET=jwtsecretjwtsecretjwtsecret
      - MYSQL_PRIMARY_URL=mysql://userfeedback:userfeedback@mysql:3306/userfeedback
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

이 통합 파일을 사용하여 모든 서비스를 한 번에 시작할 수 있습니다:

```bash
docker compose up -d
```

환경 변수에 대한 자세한 설명은 [환경 변수 구성](./04-configuration.md) 문서를 참조하세요.

## 초기 설정

컨테이너가 실행된 후 다음 단계를 수행하여 초기 설정을 완료하세요:

1. 웹 브라우저에서 `http://localhost:3000`(또는 구성한 URL)에 접속합니다.
2. 초기 관리자 계정을 생성합니다. (smtp4dev를 사용할 경우 `http://localhost:5080` 에서 메일을 받을 수 있습니다.)
3. 로그인 후 프로젝트, 채널, 태그 등을 구성합니다.

자세한 초기 설정 방법은 [초기 설정](../03-tutorial.md) 문서를 참조하세요.

## 다음 단계

Docker Hub 이미지를 사용하여 ABC User Feedback을 성공적으로 설치했다면, 다음 단계로 [튜토리얼](../03-tutorial.md)을 진행하여 시스템을 구성하고 사용자를 추가하세요.
