---
sidebar_position: 3
title: '수동 설치'
description: '소스 코드에서 직접 ABC User Feedback을 빌드하고 실행하는 수동 설치 가이드입니다.'
---

# 수동 설치

이 문서에서는 ABC User Feedback을 수동으로 설치하고 구성하는 방법을 안내합니다. 이 방법은 Docker 이미지를 사용하는 대신 소스 코드에서 직접 애플리케이션을 빌드하고 실행하려는 경우에 유용합니다.

## 사전 요구사항

수동 설치를 진행하기 전에 다음 요구사항을 충족해야 합니다:

- [Node.js v22 이상](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation) (패키지 관리자)
- [Git](https://git-scm.com/downloads)
- [MySQL 8.0](https://www.mysql.com/downloads/)
- SMTP 서버
- (선택 사항) [OpenSearch 2.16](https://opensearch.org/)

## 소스 코드 다운로드

먼저 ABC User Feedback 소스 코드를 GitHub 저장소에서 복제합니다:

```bash
git clone https://github.com/line/abc-user-feedback.git
cd abc-user-feedback
```

## 인프라 설정

ABC User Feedback은 MySQL 데이터베이스와 선택적으로 OpenSearch 및 SMTP 서버를 필요로 합니다. 이러한 인프라 구성 요소를 설정하는 방법은 여러 가지가 있습니다.

### Docker를 사용한 인프라 설정

가장 간단한 방법은 Docker Compose를 사용하여 필요한 인프라를 설정하는 것입니다:

```bash
# AMD64 아키텍처(대부분의 x86 기반 시스템)
docker-compose -f docker/docker-compose.infra-amd64.yml up -d

# ARM64 아키텍처(Apple Silicon, 일부 서버)
docker-compose -f docker/docker-compose.infra-arm64.yml up -d
```

### 기존 인프라 사용

이미 MySQL, OpenSearch 또는 SMTP 서버가 있는 경우, 해당 서버의 연결 정보를 나중에 환경 변수로 구성할 수 있습니다.

## 종속성 설치

ABC User Feedback은 모노레포 구조를 사용하며, TurboRepo를 통해 관리됩니다. 모든 패키지의 종속성을 설치하려면:

```bash
pnpm install
```

## 환경 변수 구성

### API 서버 환경 변수

`apps/api` 디렉토리에 `.env` 파일을 생성하고 다음과 같이 구성합니다:

```
# 필수 환경 변수
JWT_SECRET=your-jwt-secret-key
MYSQL_PRIMARY_URL=mysql://username:password@localhost:3306/database
BASE_URL=http://localhost:4000
ACCESS_TOKEN_EXPIRED_TIME=10m
REFRESH_TOKEN_EXPIRED_TIME=1h

# 선택적 환경 변수
APP_PORT=4000
APP_ADDRESS=0.0.0.0
AUTO_MIGRATION=true

# SMTP 설정
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
SMTP_SENDER=noreply@example.com
SMTP_BASE_URL=http://localhost:3000

# OpenSearch 설정 (선택 사항)
OPENSEARCH_USE=false
# OPENSEARCH_NODE=http://localhost:9200
# OPENSEARCH_USERNAME=admin
# OPENSEARCH_PASSWORD=admin
```

### 웹 서버 환경 변수

`apps/web` 디렉토리에 `.env` 파일을 생성하고 다음과 같이 구성합니다:

```
# 필수 환경 변수
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

환경 변수에 대한 자세한 설명은 [환경 변수 구성](./04-configuration.md) 문서를 참조하세요.

## 데이터베이스 마이그레이션

API 서버를 처음 실행하기 전에 데이터베이스 스키마를 생성해야 합니다. `AUTO_MIGRATION=true` 환경 변수를 설정한 경우 서버 시작 시 자동으로 마이그레이션이 실행됩니다.

수동으로 마이그레이션을 실행하려면:

```bash
cd apps/api
npm run migration:run
```

## 개발 모드 실행

### 단일 명령어로 실행

개발 모드에서 API 서버와 웹 서버를 실행하려면:

```bash
# 프로젝트 루트 디렉토리에서
pnpm dev
```

이 명령은 API 서버와 웹 서버를 동시에 시작합니다. API 서버는 기본적으로 포트 4000에서, 웹 서버는 포트 3000에서 실행됩니다.

### 개별 패키지 실행

#### 공통 패키지 빌드

웹 애플리케이션을 실행하기 전에 shared 패키지를 빌드해야 합니다:

```bash
# 프로젝트 루트 디렉토리에서
cd packages/ufb-shared
pnpm build

```

#### UI 패키지 빌드

웹 애플리케이션을 실행하기 전에 UI 패키지를 빌드해야 합니다:

```bash
# 프로젝트 루트 디렉토리에서
cd packages/ufb-tailwindcss
pnpm build

# 프로젝트 루트 디렉토리에서
cd packages/ufb-react
pnpm build
```

#### 각 서버 실행

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

프로덕션 환경을 위해 애플리케이션을 빌드하려면:

```bash
# 프로젝트 루트 디렉토리에서
pnpm build
```

이 명령은 API 서버와 웹 서버 모두를 빌드합니다.

## 프로덕션 모드에서 실행

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

백엔드 API가 실행 중일 때 프론트엔드에서 API 타입을 생성할 수 있습니다:

```bash
cd apps/web
pnpm generate-api-type
```

이 명령은 OpenAPI 사양을 사용하여 TypeScript 타입을 생성하고 `src/types/api.type.ts` 파일에 저장합니다.

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

## 대시보드 통계 데이터 마이그레이션

대시보드 통계 데이터는 매일 자정에 프로젝트에 설정된 시간대에 따라 MySQL 데이터에서 생성됩니다. 스케줄러는 365일 동안의 데이터를 생성합니다.

수동으로 대시보드 데이터를 생성하려면 `/migration/statistics` API를 사용할 수 있습니다. 이 API를 사용하면 365일 이상의 데이터도 생성할 수 있습니다.

프로젝트의 시간대를 변경하려면 MySQL 데이터베이스에서 직접 변경해야 합니다(관리자 웹에서는 이 기능을 제공하지 않음). 시간대를 변경한 후에는 모든 통계 데이터를 삭제하고 마이그레이션 API를 사용하여 다시 생성해야 합니다.

## Swagger 문서

API 서버가 실행 중일 때 Swagger 문서는 `/docs` 엔드포인트에서 확인할 수 있습니다:

```
http://localhost:4000/docs
```

## 프로덕션 배포 고려사항

프로덕션 환경에 수동으로 배포할 때는 다음 사항을 고려하세요:

1. **프로세스 관리자 사용**: [PM2](https://pm2.keymetrics.io/)와 같은 프로세스 관리자를 사용하여 애플리케이션을 실행하고 모니터링하세요.

2. **리버스 프록시 설정**: [Nginx](https://nginx.org/) 또는 [Apache](https://httpd.apache.org/)와 같은 리버스 프록시를 사용하여 HTTPS 및 로드 밸런싱을 구성하세요.

3. **환경 변수 관리**: 프로덕션 환경에서는 환경 변수를 안전하게 관리하세요. `.env` 파일 대신 시스템 환경 변수를 사용하는 것이 좋습니다.

4. **로깅 및 모니터링**: 적절한 로깅 및 모니터링 솔루션을 구성하여 애플리케이션 상태를 추적하세요.

5. **백업 전략**: 데이터베이스 및 중요 파일에 대한 정기적인 백업 전략을 구현하세요.

### PM2 구성 예시

다음은 PM2를 사용하여 API 서버와 웹 서버를 실행하는 예시입니다:

```bash
# API 서버 실행
cd apps/api
pm2 start dist/main.js --name abc-user-feedback-api

# 웹 서버 실행
cd apps/web
pm2 start npm --name abc-user-feedback-web -- start
```

PM2 구성 파일(`ecosystem.config.js`)을 생성하여 더 자세한 설정을 할 수도 있습니다:

```javascript
module.exports = {
  apps: [
    {
      name: 'abc-user-feedback-api',
      cwd: './apps/api',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        // 여기에 다른 환경 변수 추가
      },
    },
    {
      name: 'abc-user-feedback-web',
      cwd: './apps/web',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        // 여기에 다른 환경 변수 추가
      },
    },
  ],
};
```

## 문제 해결

### 일반적인 문제

1. **종속성 설치 오류**:

   - Node.js 버전이 v22 이상인지 확인하세요.
   - pnpm을 최신 버전으로 업데이트하세요.
   - `pnpm install --force`를 시도하세요.

2. **데이터베이스 연결 오류**:

   - MySQL 서버가 실행 중인지 확인하세요.
   - 데이터베이스 자격 증명이 올바른지 확인하세요.
   - `MYSQL_PRIMARY_URL` 환경 변수 형식이 올바른지 확인하세요.

3. **빌드 오류**:

   - UI 패키지가 빌드되었는지 확인하세요(`pnpm build:ui`).
   - 모든 종속성이 설치되었는지 확인하세요.
   - TypeScript 오류를 확인하세요.

4. **실행 오류**:
   - 환경 변수가 올바르게 설정되었는지 확인하세요.
   - 필요한 포트가 사용 가능한지 확인하세요.
   - 로그 메시지에서 오류를 확인하세요.

## 다음 단계

수동 설치를 성공적으로 완료했다면, 다음 단계로 [초기 설정](../03-tutorial.md)을 진행하여 시스템을 구성하고 사용자를 추가하세요.
