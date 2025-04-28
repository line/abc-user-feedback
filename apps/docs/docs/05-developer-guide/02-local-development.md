---
sidebar_position: 2
title: '로컬 개발 환경 설정'
description: '�� 대한 설명입니다.'
---

# 로컬 개발 환경 설정

이 문서에서는 ABC User Feedback의 로컬 개발 환경을 설정하는 방법을 안내합니다. 코드 수정, 기능 개발 또는 버그 수정을 위해 로컬에서 개발하려는 개발자를 대상으로 합니다.

## 개발 환경 요구사항

로컬 개발 환경을 설정하기 전에 다음 요구사항을 충족하는지 확인하세요:

- [Node.js v22 이상](https://nodejs.org/en/download/)
- [pnpm v8 이상](https://pnpm.io/installation)
- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/desktop/)
- 코드 편집기 (추천: [Visual Studio Code](https://code.visualstudio.com/))

## 저장소 복제

먼저 ABC User Feedback 저장소를 로컬 시스템에 복제합니다:

```bash
git clone https://github.com/line/abc-user-feedback.git
cd abc-user-feedback
```

## 모노레포 구조 이해하기

ABC User Feedback은 [TurboRepo](https://turbo.build/)를 사용한 모노레포 구조로 구성되어 있습니다. 이 구조는 여러 앱과 패키지를 하나의 저장소에서 관리할 수 있게 해줍니다.

주요 디렉토리 구조는 다음과 같습니다:

```
abc-user-feedback/
├── apps/
│   ├── api/        # NestJS 기반 백엔드 API 서버
│   └── web/        # Next.js 기반 프론트엔드 웹 애플리케이션
├── packages/
│   ├── ui/         # 공유 UI 컴포넌트
│   └── ... (기타 공유 패키지)
├── docker/         # Docker 관련 파일
├── package.json    # 루트 패키지 설정
└── turbo.json      # TurboRepo 설정
```

## 종속성 설치

모노레포의 모든 패키지에 대한 종속성을 설치합니다:

```bash
pnpm install
```

## 인프라 설정

개발에 필요한 인프라(MySQL, OpenSearch, SMTP 서버 등)를 Docker를 통해 설정합니다:

```bash
# AMD64 아키텍처(대부분의 x86 기반 시스템)
docker-compose -f docker/docker-compose.infra-amd64.yml up -d

# ARM64 아키텍처(Apple Silicon, 일부 서버)
docker-compose -f docker/docker-compose.infra-arm64.yml up -d
```

이 명령은 다음 서비스를 시작합니다:

- MySQL (포트: 13306)
- OpenSearch (포트: 9200, 9600)
- smtp4dev (포트: 5080, 25, 143)

## 환경 변수 구성

### API 서버 환경 변수

`apps/api` 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```
# 필수 환경 변수
JWT_SECRET=development_jwt_secret_key
MYSQL_PRIMARY_URL=mysql://userfeedback:userfeedback@localhost:13306/userfeedback
BASE_URL=http://localhost:4000
ACCESS_TOKEN_EXPIRED_TIME=10m
REFESH_TOKEN_EXPIRED_TIME=1h

# 선택적 환경 변수
APP_PORT=4000
APP_ADDRESS=0.0.0.0
AUTO_MIGRATION=true

# SMTP 설정
SMTP_HOST=localhost
SMTP_PORT=25
SMTP_SENDER=noreply@example.com
SMTP_BASE_URL=http://localhost:3000

# OpenSearch 설정 (선택 사항)
OPENSEARCH_USE=true
OPENSEARCH_NODE=http://localhost:9200
OPENSEARCH_USERNAME=admin
OPENSEARCH_PASSWORD=admin
```

### 웹 서버 환경 변수

`apps/web` 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_MAX_DAYS=90
```

## 데이터베이스 마이그레이션

API 서버를 처음 실행하기 전에 데이터베이스 스키마를 생성해야 합니다:

```bash
cd apps/api
npm run migration:run
```

## UI 패키지 빌드

웹 애플리케이션을 실행하기 전에 공유 UI 패키지를 빌드해야 합니다:

```bash
# 프로젝트 루트 디렉토리에서
pnpm build:ui

# 또는
pnpm turbo run @ufb/ui#build
```

## 개발 서버 실행

이제 개발 서버를 실행할 수 있습니다. 프로젝트 루트 디렉토리에서 다음 명령을 실행합니다:

```bash
pnpm dev
```

이 명령은 API 서버와 웹 서버를 동시에 시작합니다:

- API 서버: http://localhost:4000
- 웹 서버: http://localhost:3000

각 서버를 개별적으로 실행하려면:

```bash
# API 서버만 실행
cd apps/api
pnpm dev

# 웹 서버만 실행
cd apps/web
pnpm dev
```

## API 타입 생성

백엔드 API가 실행 중일 때 프론트엔드에서 API 타입을 생성할 수 있습니다:

```bash
cd apps/web
pnpm generate-api-type
```

이 명령은 OpenAPI 사양을 사용하여 TypeScript 타입을 생성하고 `src/types/api.type.ts` 파일에 저장합니다.

## 개발 워크플로우

### 코드 변경 및 테스트

1. 코드를 변경합니다.
2. 변경 사항은 개발 서버에서 자동으로 핫 리로드됩니다.
3. 브라우저에서 변경 사항을 확인합니다.

### 코드 품질 관리

#### 린팅

코드 린팅을 실행하려면:

```bash
# 프로젝트 루트 디렉토리에서
pnpm lint

# 또는 특정 앱에 대해서만
cd apps/api
pnpm lint

cd apps/web
pnpm lint
```

#### 포맷팅

코드 포맷팅을 실행하려면:

```bash
# 웹 앱에서
cd apps/web
pnpm format
```

#### 테스트

테스트를 실행하려면:

```bash
# API 서버 테스트
cd apps/api
pnpm test

# API 서버 E2E 테스트
cd apps/api
pnpm test:e2e
```

### 데이터베이스 마이그레이션 생성

스키마 변경이 필요한 경우 새 마이그레이션 파일을 생성할 수 있습니다:

```bash
cd apps/api
npm run migration:generate --name=your_migration_name
```

생성된 마이그레이션 파일은 `apps/api/src/configs/modules/typeorm-config/migrations` 디렉토리에 저장됩니다.

## 빌드 및 프로덕션 테스트

프로덕션 빌드를 생성하고 테스트하려면:

```bash
# 프로젝트 루트 디렉토리에서
pnpm build

# API 서버 실행
cd apps/api
node dist/main.js

# 웹 서버 실행
cd apps/web
npm run start
```

## Docker 이미지 빌드

로컬에서 Docker 이미지를 빌드하려면:

```bash
# 프로젝트 루트 디렉토리에서
docker compose -f docker-compose.yml build
```

빌드된 이미지를 실행하려면:

```bash
docker compose -f docker-compose.yml up -d
```

## Swagger 문서

API 서버가 실행 중일 때 Swagger 문서는 다음 URL에서 확인할 수 있습니다:

```
http://localhost:4000/docs
```

이 문서는 API 엔드포인트, 요청/응답 형식, 인증 방법 등에 대한 자세한 정보를 제공합니다.

## 대시보드 통계 데이터 마이그레이션

대시보드 통계 데이터는 매일 자정에 프로젝트에 설정된 시간대에 따라 MySQL 데이터에서 생성됩니다. 개발 환경에서 통계 데이터를 수동으로 생성하려면 `/migration/statistics` API를 사용할 수 있습니다.

## 디버깅

### API 서버 디버깅

Visual Studio Code에서 API 서버를 디버깅하려면 `.vscode/launch.json` 파일에 다음 구성을 추가합니다:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/apps/api/src/main.ts",
      "preLaunchTask": "tsc: build - apps/api/tsconfig.json",
      "outFiles": ["${workspaceFolder}/apps/api/dist/**/*.js"],
      "cwd": "${workspaceFolder}/apps/api",
      "envFile": "${workspaceFolder}/apps/api/.env"
    }
  ]
}
```

### 웹 서버 디버깅

Next.js 웹 서버를 디버깅하려면:

1. 다음 명령으로 디버그 모드에서 웹 서버를 시작합니다:

   ```bash
   cd apps/web
   NODE_OPTIONS='--inspect' pnpm dev
   ```

2. Chrome DevTools 또는 VS Code 디버거를 사용하여 연결합니다.

## 일반적인 개발 작업

### 새 API 엔드포인트 추가

1. `apps/api/src/domains` 디렉토리에서 적절한 도메인 모듈을 찾거나 새로 생성합니다.
2. 컨트롤러, 서비스, DTO 등 필요한 파일을 추가합니다.
3. 모듈 파일에 새 컴포넌트를 등록합니다.

### 새 웹 페이지 추가

1. `apps/web/src/pages` 디렉토리에 새 페이지 파일을 추가합니다.
2. 필요한 컴포넌트, 훅, API 호출 등을 구현합니다.

### 새 UI 컴포넌트 추가

1. `packages/ui/src/components` 디렉토리에 새 컴포넌트 파일을 추가합니다.
2. 컴포넌트를 구현하고 `index.ts` 파일에서 내보냅니다.
3. UI 패키지를 다시 빌드합니다: `pnpm build:ui`

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

### 로그 확인

개발 중 문제가 발생하면 로그를 확인하여 원인을 파악할 수 있습니다:

- API 서버 로그: 터미널 또는 `apps/api/logs` 디렉토리
- 웹 서버 로그: 터미널 또는 브라우저 콘솔

## 추가 리소스

- [NestJS 문서](https://docs.nestjs.com/)
- [Next.js 문서](https://nextjs.org/docs)
- [TurboRepo 문서](https://turbo.build/repo/docs)
- [TypeORM 문서](https://typeorm.io/)

## 다음 단계

로컬 개발 환경 설정이 완료되었다면 다음 단계로 진행할 수 있습니다:

- [코드 기여 가이드](./03-contribution-guide.md): 코드 기여 방법 및 PR 제출 가이드
- [확장 개발](./04-extensions.md): ABC User Feedback 확장 기능 개발 방법

문제가 발생하거나 추가 지원이 필요한 경우 [GitHub Issues](https://github.com/line/abc-user-feedback/issues)에 문의하세요.
