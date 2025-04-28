---
sidebar_position: 1
title: 'Docker Hub 이미지 사용'
description: '�� 대한 설명입니다.'
---

# Docker Hub 이미지 사용

ABC User Feedback은 손쉬운 배포를 위해 Docker Hub에 공식 이미지를 제공합니다. 이 문서에서는 Docker Hub 이미지를 사용하여 ABC User Feedback을 설치하고 실행하는 방법을 안내합니다.

## 제공되는 Docker 이미지

ABC User Feedback은 두 가지 주요 컴포넌트에 대한 Docker 이미지를 제공합니다:

1. **웹 관리자 프론트엔드**: Next.js 기반의 웹 인터페이스
2. **API 백엔드**: NestJS 기반의 API 서버

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

## 사전 요구사항

Docker 이미지를 실행하기 전에 다음 요구사항을 충족해야 합니다:

1. MySQL 데이터베이스가 실행 중이어야 합니다.
2. (선택 사항) OpenSearch가 실행 중이어야 합니다.
3. (선택 사항) SMTP 서버가 구성되어 있어야 합니다.

[시스템 요구사항](../01-system-requirements.md) 문서에서 자세한 정보를 확인할 수 있습니다.

## Docker Compose를 사용한 설치

가장 쉬운 설치 방법은 Docker Compose를 사용하는 것입니다. 아래 예시는 인프라와 애플리케이션 서비스를 모두 포함한 전체 설정입니다.

### 1. 인프라 설정 (docker-compose.infra.yml)

먼저 필요한 인프라 서비스를 설정합니다:

```yaml
version: '3'

services:
  mysql:
    hostname: mysql
    image: mysql:8.0.39
    platform: linux/amd64
    restart: always
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
    healthcheck:
      test:
        [
          'CMD',
          'mysqladmin',
          'ping',
          '-h',
          'localhost',
          '-u',
          'root',
          '-p$$MYSQL_ROOT_PASSWORD',
        ]
      interval: 10s
      timeout: 5s
      retries: 5

  # 이메일 검증을 위한 SMTP 서버 (선택 사항)
  smtp4dev:
    image: rnwood/smtp4dev:v3
    restart: always
    ports:
      - 5080:80
      - 25:25
      - 143:143
    volumes:
      - smtp4dev:/smtp4dev

  # 피드백 검색 성능 향상을 위한 OpenSearch (선택 사항)
  opensearch-node:
    image: opensearchproject/opensearch:2.16.0
    restart: always
    environment:
      - cluster.name=opensearch-cluster
      - node.name=opensearch-node
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - 'OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m'
      - plugins.security.disabled=true
      - OPENSEARCH_INITIAL_ADMIN_PASSWORD=UserFeedback123!@#
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
    volumes:
      - opensearch:/usr/share/opensearch/data
    ports:
      - 9200:9200
      - 9600:9600
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:9200/_cluster/health']
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  mysql:
  smtp4dev:
  opensearch:
```

### 2. 애플리케이션 설정 (docker-compose.yml)

그런 다음 ABC User Feedback 애플리케이션 서비스를 설정합니다:

```yaml
version: '3'

services:
  web:
    hostname: web
    image: line/abc-user-feedback-web:latest
    restart: always
    ports:
      - 3000:3000
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
      - NEXT_PUBLIC_MAX_DAYS=90
    depends_on:
      - api

  api:
    hostname: api
    image: line/abc-user-feedback-api:latest
    restart: always
    ports:
      - 4000:4000
    environment:
      - JWT_SECRET=jwtsecretjwtsecretjwtsecret
      - MYSQL_PRIMARY_URL=mysql://userfeedback:userfeedback@mysql:3306/userfeedback
      - BASE_URL=http://api:4000
      - ACCESS_TOKEN_EXPIRED_TIME=10m
      - REFESH_TOKEN_EXPIRED_TIME=1h
      - APP_PORT=4000
      - APP_ADDRESS=0.0.0.0
      - AUTO_MIGRATION=true
      - NODE_OPTIONS="--max_old_space_size=3072"
      - SMTP_HOST=smtp4dev
      - SMTP_PORT=25
      - SMTP_SENDER=user@feedback.com
      - SMTP_BASE_URL=http://localhost:3000
    depends_on:
      mysql:
        condition: service_healthy
```

환경 변수에 대한 자세한 설명은 [환경 변수 구성](./04-configuration.md) 문서를 참조하세요.

### 3. 설치 및 실행 단계

1. 위의 두 Docker Compose 파일을 로컬 디렉토리에 저장합니다.
2. 먼저 인프라 서비스를 시작합니다:

```bash
docker-compose -f docker-compose.infra.yml up -d
```

3. 인프라 서비스가 정상적으로 시작된 후, 애플리케이션 서비스를 시작합니다:

```bash
docker-compose -f docker-compose.yml up -d
```

4. 모든 서비스가 시작되면 웹 브라우저에서 `http://localhost:3000`으로 접속하여 ABC User Feedback 웹 인터페이스에 액세스할 수 있습니다.

## 단일 Docker Compose 파일 사용

인프라와 애플리케이션을 단일 Docker Compose 파일로 통합하여 사용할 수도 있습니다:

```yaml
version: '3'

services:
  # 인프라 서비스
  mysql:
    hostname: mysql
    image: mysql:8.0.39
    platform: linux/amd64
    restart: always
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
    healthcheck:
      test:
        [
          'CMD',
          'mysqladmin',
          'ping',
          '-h',
          'localhost',
          '-u',
          'root',
          '-p$$MYSQL_ROOT_PASSWORD',
        ]
      interval: 10s
      timeout: 5s
      retries: 5

  smtp4dev:
    image: rnwood/smtp4dev:v3
    restart: always
    ports:
      - 5080:80
      - 25:25
      - 143:143
    volumes:
      - smtp4dev:/smtp4dev

  opensearch-node:
    image: opensearchproject/opensearch:2.16.0
    restart: always
    environment:
      - cluster.name=opensearch-cluster
      - node.name=opensearch-node
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - 'OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m'
      - plugins.security.disabled=true
      - OPENSEARCH_INITIAL_ADMIN_PASSWORD=UserFeedback123!@#
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
    volumes:
      - opensearch:/usr/share/opensearch/data
    ports:
      - 9200:9200
      - 9600:9600
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:9200/_cluster/health']
      interval: 30s
      timeout: 10s
      retries: 3

  # 애플리케이션 서비스
  web:
    hostname: web
    image: line/abc-user-feedback-web:latest
    restart: always
    ports:
      - 3000:3000
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
      - NEXT_PUBLIC_MAX_DAYS=90
    depends_on:
      - api

  api:
    hostname: api
    image: line/abc-user-feedback-api:latest
    restart: always
    ports:
      - 4000:4000
    environment:
      - JWT_SECRET=jwtsecretjwtsecretjwtsecret
      - MYSQL_PRIMARY_URL=mysql://userfeedback:userfeedback@mysql:3306/userfeedback
      - BASE_URL=http://api:4000
      - ACCESS_TOKEN_EXPIRED_TIME=10m
      - REFESH_TOKEN_EXPIRED_TIME=1h
      - APP_PORT=4000
      - APP_ADDRESS=0.0.0.0
      - AUTO_MIGRATION=true
      - NODE_OPTIONS="--max_old_space_size=3072"
      - SMTP_HOST=smtp4dev
      - SMTP_PORT=25
      - SMTP_SENDER=user@feedback.com
      - SMTP_BASE_URL=http://localhost:3000
    depends_on:
      mysql:
        condition: service_healthy

volumes:
  mysql:
  smtp4dev:
  opensearch:
```

이 통합 파일을 사용하여 모든 서비스를 한 번에 시작할 수 있습니다:

```bash
docker-compose up -d
```

## 초기 설정

컨테이너가 실행된 후 다음 단계를 수행하여 초기 설정을 완료하세요:

1. 웹 브라우저에서 `http://localhost:3000`(또는 구성한 URL)에 접속합니다.
2. 초기 관리자 계정을 생성합니다.
3. 로그인 후 프로젝트, 채널, 태그 등을 구성합니다.

자세한 초기 설정 방법은 [초기 설정](../03-initial-setup.md) 문서를 참조하세요.

## 업그레이드

새 버전의 ABC User Feedback으로 업그레이드하려면:

1. 최신 이미지를 가져옵니다:

```bash
docker pull line/abc-user-feedback-api:latest
docker pull line/abc-user-feedback-web:latest
```

2. 컨테이너를 중지하고 재시작합니다:

```bash
docker-compose down
docker-compose up -d
```

특정 버전으로 업그레이드하려면 `latest` 대신 원하는 버전 태그를 사용하세요.

## 프로덕션 배포 고려사항

프로덕션 환경에 배포할 때는 다음 사항을 고려하세요:

1. **보안**:

   - 강력한 비밀번호와 JWT 시크릿을 사용하세요.
   - HTTPS를 통해 서비스를 제공하세요.
   - 필요한 포트만 외부에 노출하세요.

2. **백업**:

   - MySQL 데이터베이스를 정기적으로 백업하세요.
   - 중요한 구성 파일을 백업하세요.

3. **모니터링**:

   - 컨테이너 상태와 리소스 사용량을 모니터링하세요.
   - 로그를 중앙 집중식으로 수집하고 분석하세요.

4. **고가용성**:
   - 중요한 프로덕션 환경에서는 여러 인스턴스를 실행하고 로드 밸런서를 사용하세요.

## 문제 해결

### 일반적인 문제

1. **API 연결 오류**:

   - API 서버가 실행 중인지 확인하세요.
   - 웹 프론트엔드의 `NEXT_PUBLIC_API_BASE_URL` 환경 변수가 올바르게 설정되었는지 확인하세요.

2. **데이터베이스 연결 오류**:

   - MySQL 서버가 실행 중인지 확인하세요.
   - 데이터베이스 자격 증명이 올바른지 확인하세요.
   - `MYSQL_PRIMARY_URL` 환경 변수 형식이 올바른지 확인하세요.

3. **이메일 기능 작동 안 함**:
   - SMTP 서버 설정이 올바른지 확인하세요.
   - SMTP 서버에 연결할 수 있는지 테스트하세요.

자세한 문제 해결 정보는 [문제 해결](../..//06-operations-guide/04-troubleshooting.md) 문서를 참조하세요.

## 다음 단계

Docker Hub 이미지를 사용하여 ABC User Feedback을 성공적으로 설치했다면, 다음 단계로 [초기 설정](../03-initial-setup.md)을 진행하여 시스템을 구성하고 사용자를 추가하세요.
