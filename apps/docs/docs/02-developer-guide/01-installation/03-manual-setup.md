---
sidebar_position: 3
title: '수동 설치'
description: '소스 코드에서 직접 ABC User Feedback을 빌드하고 실행하는 수동 설치 가이드'
---

# 수동 설치

이 문서는 ABC User Feedback을 수동으로 설치하고 구성하는 방법을 설명합니다. 소스 코드에서 직접 애플리케이션을 빌드하고 실행하고 싶을 때 유용합니다.

## 사전 요구사항

수동 설치를 진행하기 전에 다음 요구사항을 충족해야 합니다:

- [Node.js v22.19.0 이상](https://nodejs.org/en/download/)
- [pnpm v10.15.0 이상](https://pnpm.io/installation) (패키지 매니저)
- [Git](https://git-scm.com/downloads)
- [MySQL 8.0](https://www.mysql.com/downloads/)
- SMTP 서버
- (선택사항) [OpenSearch 2.16](https://opensearch.org/)

## 소스 코드 다운로드

먼저 GitHub 저장소에서 ABC User Feedback 소스 코드를 클론합니다:

```bash
git clone https://github.com/line/abc-user-feedback.git
cd abc-user-feedback
```

## 인프라 설정

ABC User Feedback은 MySQL 데이터베이스와 SMTP 서버 그리고 선택적으로 OpenSearch가 필요합니다. 이러한 인프라 구성 요소를 설정하는 방법은 여러 가지가 있습니다.

### Docker를 사용한 인프라 설정

가장 간단한 방법은 Docker Compose로 필요한 인프라를 설정하는 것입니다:

```bash
docker-compose -f docker/docker-compose.infra.yml up -d
```

### 기존 인프라 사용

이미 MySQL, OpenSearch 또는 SMTP 서버가 있다면, 나중에 환경 변수로 연결 정보를 구성할 수 있습니다.

## 의존성 설치

ABC User Feedback은 모노레포 구조를 사용하며 TurboRepo를 통해 관리됩니다. 모든 패키지의 의존성을 설치하려면:

```bash
pnpm install
```

의존성 설치 후, 모든 패키지를 빌드합니다:

```bash
pnpm build
```

## 환경 변수 설정

### API 서버 환경 변수

`apps/api` 디렉토리에 `.env` 파일을 생성하고 `.env.example`을 참조하여 구성합니다:

```env
# Required environment variables
JWT_SECRET=DEV

MYSQL_PRIMARY_URL=mysql://userfeedback:userfeedback@localhost:13306/userfeedback # required

ACCESS_TOKEN_EXPIRED_TIME=10m # default: 10m
REFRESH_TOKEN_EXPIRED_TIME=1h # default: 1h

# Optional environment variables

# APP_PORT=4000 # default: 4000
# APP_ADDRESS=0.0.0.0 # default: 0.0.0.0

# MYSQL_SECONDARY_URLS= ["mysql://userfeedback:userfeedback@localhost:13306/userfeedback"] # optional

SMTP_HOST=localhost # required
SMTP_PORT=25 # required
SMTP_SENDER=user@feedback.com # required
# SMTP_USERNAME= # optional
# SMTP_PASSWORD= # optional
# SMTP_TLS= # default: false
# SMTP_CIPHER_SPEC= # default: TLSv1.2 if SMTP_TLS=true
# SMTP_OPPORTUNISTIC_TLS= # default: true if SMTP_TLS=true

# OPENSEARCH_USE=false # default: false
# OPENSEARCH_NODE= # required if OPENSEARCH_USE=true
# OPENSEARCH_USERNAME= # optional
# OPENSEARCH_PASSWORD= # optional

# AUTO_MIGRATION=true # default: true

# MASTER_API_KEY= # default: none

# AUTO_FEEDBACK_DELETION_ENABLED=false # default: false
# AUTO_FEEDBACK_DELETION_PERIOD_DAYS=365*5
```

### Web 서버 환경 변수

`apps/web` 디렉토리에 `.env` 파일을 생성하고 `.env.example`을 참조하여 구성합니다:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

환경 변수 자세한 정보는 [환경 변수 설정](./05-configuration.md) 문서를 참조하세요.

## 데이터베이스 마이그레이션

API 서버를 처음 실행하기 전에 데이터베이스 스키마를 생성해야 합니다. `AUTO_MIGRATION=true` 환경 변수를 설정하면 서버 시작 시 마이그레이션이 자동으로 실행됩니다.

수동으로 마이그레이션을 실행하려면:

```bash
cd apps/api
npm run migration:run
```

## 개발 모드 실행

### 단일 명령어로 실행

API 서버와 웹 서버를 개발 모드로 실행하려면:

```bash
# 프로젝트 루트 디렉토리에서
pnpm dev
```

이 명령어는 API 서버와 웹 서버를 동시에 시작합니다. API 서버는 기본적으로 포트 4000에서, 웹 서버는 포트 3000에서 실행됩니다.

### 개별 패키지 실행

#### 공통 패키지 빌드

웹 애플리케이션을 실행하기 전에 공유 패키지를 빌드해야 합니다:

```bash
# 프로젝트 루트 디렉토리에서
cd packages/ufb-shared
pnpm build
```

#### UI 패키지 빌드

웹 애플리케이션을 실행하기 전에 UI 패키지들을 빌드해야 합니다:

```bash
# 프로젝트 루트 디렉토리에서
cd packages/ufb-tailwindcss
pnpm build
```

#### 각 서버 개별 실행

각 서버를 개별적으로 실행하려면:

```bash
# API 서버만 실행
cd apps/api
pnpm dev

# 웹 서버만 실행
cd apps/web
pnpm dev
```

## 프로덕션 빌드

프로덕션 환경을 위한 애플리케이션을 빌드하려면:

```bash
# 프로젝트 루트 디렉토리에서
pnpm build
```

이 명령어는 API 서버와 웹 서버를 모두 빌드합니다.

## 프로덕션 모드 실행

프로덕션 빌드를 실행하려면:

```bash
# API 서버 실행
cd apps/api
pnpm start

# 웹 서버 실행
cd apps/web
pnpm start
```

## API 타입 생성

백엔드 API가 실행 중일 때 프론트엔드용 API 타입을 생성할 수 있습니다:

```bash
cd apps/web
pnpm generate-api-type
```

이 명령어는 OpenAPI 명세로 TypeScript 타입을 생성하고 `src/shared/types/api.type.ts` 파일에 저장합니다.

**참고**: 이 명령어가 제대로 작동하려면 API 서버가 `http://localhost:4000`에서 실행 중이어야 합니다.

## 코드 품질 관리

### 린팅

코드 린팅을 실행하려면:

```bash
pnpm lint
```

### 포맷팅

코드 포맷팅을 실행하려면:

```bash
pnpm format
```

### 테스트

테스트를 실행하려면:

```bash
pnpm test
```

## Swagger 문서

API 서버가 실행 중일 때 다음 엔드포인트에서 Swagger 문서를 확인할 수 있습니다:

- **API 문서**: http://localhost:4000/docs
- **관리자 API 문서**: http://localhost:4000/admin-docs
- **OpenAPI JSON**: http://localhost:4000/docs-json
- **관리자 OpenAPI JSON**: http://localhost:4000/admin-docs-json

## 문제 해결

### 일반적인 문제

1. **의존성 설치 오류**:
   - Node.js 버전이 v22.19.0 이상인지 확인하세요.
   - pnpm 버전이 v10.15.0 이상인지 확인하세요.
   - pnpm을 최신 버전으로 업데이트하세요.
   - `pnpm install --force`를 시도해보세요.

2. **데이터베이스 연결 오류**:
   - MySQL 서버가 실행 중인지 확인하세요.
   - 데이터베이스 자격 증명이 올바른지 확인하세요.
   - `MYSQL_PRIMARY_URL` 환경 변수 형식이 올바른지 확인하세요.
   - Docker 인프라를 사용하는 경우 MySQL이 포트 13306(3306이 아님)에서 실행되는지 확인하세요.

3. **빌드 오류**:
   - UI 패키지가 빌드되었는지 확인하세요 (`pnpm build:ui`).
   - 모든 의존성이 설치되었는지 확인하세요.
   - TypeScript 오류를 확인하세요.

4. **런타임 오류**:
   - 환경 변수가 올바르게 설정되었는지 확인하세요.
   - 필요한 포트가 사용 가능한지 확인하세요.
   - 로그의 오류 메시지를 확인하세요.
