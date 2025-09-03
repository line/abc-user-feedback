---
sidebar_position: 4
title: '환경 변수 구성'
description: '환경 변수 구성 대한 설명입니다.'
---

# 환경 변수 구성

이 문서에서는 ABC User Feedback의 API 서버와 웹 서버에서 사용하는 환경 변수에 대한 자세한 설명을 제공합니다. 환경 변수를 올바르게 구성하는 것은 시스템의 안정적인 운영과 보안을 위해 중요합니다.

## API 서버 환경 변수

### 필수 환경 변수

| 환경 변수    | 설명                                         | 기본값 | 예시                          |
| ------------ | -------------------------------------------- | ------ | ----------------------------- |
| `JWT_SECRET` | JSON Web Token (JWT) 서명에 사용되는 비밀 키 | _필수_ | `jwtsecretjwtsecretjwtsecret` |

### 선택적 환경 변수

| 환경 변수                    | 설명                                             | 기본값                  | 예시                                  |
| ---------------------------- | ------------------------------------------------ | ----------------------- | ------------------------------------- |
| `APP_PORT`                   | 서버가 실행되는 포트                             | `4000`                  | `4000`                                |
| `APP_ADDRESS`                | 서버가 바인딩되는 주소                           | `0.0.0.0`               | `0.0.0.0`                             |
| `MYSQL_SECONDARY_URLS`       | 보조 MySQL 연결 URL (JSON 배열 형식)             | _선택 사항_             | `["mysql://user:pass@host2:3306/db"]` |
| `AUTO_MIGRATION`             | 애플리케이션 시작 시 자동 마이그레이션 수행 여부 | `true`                  | `true`                                |
| `MASTER_API_KEY`             | 특권 작업을 위한 마스터 API 키                   | _없음_                  | `your-api-key`                        |
| `NODE_OPTIONS`               | Node.js 실행 옵션                                | _없음_                  | `--max_old_space_size=3072`           |
| `ACCESS_TOKEN_EXPIRED_TIME`  | 액세스 토큰 만료 시간                            | `10m`                   | `10m` (10분)                          |
| `REFRESH_TOKEN_EXPIRED_TIME` | 리프레시 토큰 만료 시간                          | `1h`                    | `1h` (1시간)                          |
| `ADMIN_WEB_URL`              | 관리자 웹 URL의 기본 URL                         | `http://localhost:3000` | `http://localhost:3000`               |

### 데이터베이스 구성

| 환경 변수              | 설명                                 | 기본값      | 예시                                                        |
| ---------------------- | ------------------------------------ | ----------- | ----------------------------------------------------------- |
| `MYSQL_PRIMARY_URL`    | 기본 MySQL 데이터베이스 연결 URL     | _필수_      | `mysql://userfeedback:userfeedback@mysql:3306/userfeedback` |
| `MYSQL_SECONDARY_URLS` | 보조 MySQL 연결 URL (JSON 배열 형식) | _선택 사항_ | `["mysql://user:pass@host2:3306/db"]`                       |

### SMTP 구성 (이메일 인증용)

| 환경 변수                | 설명                                   | 기본값      | 예시                  |
| ------------------------ | -------------------------------------- | ----------- | --------------------- |
| `SMTP_HOST`              | SMTP 서버 호스트                       | _선택 사항_ | `smtp.example.com`    |
| `SMTP_PORT`              | SMTP 서버 포트                         | _선택 사항_ | `587`                 |
| `SMTP_USERNAME`          | SMTP 서버 인증 사용자 이름             | _선택 사항_ | `user@example.com`    |
| `SMTP_PASSWORD`          | SMTP 서버 인증 비밀번호                | _선택 사항_ | `password`            |
| `SMTP_SENDER`            | 발신자로 사용될 이메일 주소            | _선택 사항_ | `noreply@example.com` |
| `SMTP_TLS`               | SMTP 서버 보안 옵션 활성화 여부        | `false`     | `true`                |
| `SMTP_CIPHER_SPEC`       | SMTP 암호화 알고리즘 사양              | `TLSv1.2`   | `TLSv1.2`             |
| `SMTP_OPPORTUNISTIC_TLS` | STARTTLS를 사용한 기회적 TLS 사용 여부 | `true`      | `true`                |

## OpenSearch 구성 (검색 성능 향상을 위해)

| 환경 변수             | 설명                          | 기본값                          | 예시                          |
| --------------------- | ----------------------------- | ------------------------------- | ----------------------------- |
| `OPENSEARCH_USE`      | OpenSearch 통합 활성화 플래그 | `false`                         | `true`                        |
| `OPENSEARCH_NODE`     | OpenSearch 노드 URL           | _OPENSEARCH_USE=true일 때 필수_ | `http://opensearch-node:9200` |
| `OPENSEARCH_USERNAME` | OpenSearch 사용자 이름        | _OPENSEARCH_USE=true일 때 필수_ | `admin`                       |
| `OPENSEARCH_PASSWORD` | OpenSearch 비밀번호           | _OPENSEARCH_USE=true일 때 필수_ | `admin`                       |

## 자동 피드백 삭제 구성

| 환경 변수                            | 설명                                                          | 기본값                                          | 예시   |
| ------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------- | ------ |
| `AUTO_FEEDBACK_DELETION_ENABLED`     | 애플리케이션 시작 시 오래된 피드백 자동 삭제 크론 활성화 여부 | `false`                                         | `true` |
| `AUTO_FEEDBACK_DELETION_PERIOD_DAYS` | 오래된 피드백 자동 삭제 기간 (일 단위)                        | _AUTO_FEEDBACK_DELETION_ENABLED=true일 때 필수_ | `365`  |

## 웹 서버 환경 변수

### 필수 환경 변수

| 환경 변수                  | 설명                                  | 기본값 | 예시                    |
| -------------------------- | ------------------------------------- | ------ | ----------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | 클라이언트 측에서 사용할 API 기본 URL | _필수_ | `http://localhost:4000` |

### 선택적 환경 변수

| 환경 변수 | 설명                    | 기본값 | 예시   |
| --------- | ----------------------- | ------ | ------ |
| `PORT`    | 웹 서버가 실행되는 포트 | `3000` | `3000` |

## 환경 변수 설정 방법

환경 변수를 설정하는 방법은 배포 방식에 따라 다릅니다:

### Docker Compose 사용 시

Docker Compose 파일에서 `environment` 섹션을 통해 환경 변수를 설정할 수 있습니다:

```yaml
services:
  api:
    image: line/abc-user-feedback-api:latest
    environment:
      - JWT_SECRET=your-jwt-secret
      - MYSQL_PRIMARY_URL=mysql://user:password@mysql:3306/db
      # 기타 환경 변수
```

### 수동 설치 시

`.env` 파일을 사용하여 환경 변수를 설정할 수 있습니다:

```
# API 서버 .env 파일 (apps/api/.env)
JWT_SECRET=your-jwt-secret
MYSQL_PRIMARY_URL=mysql://user:password@localhost:3306/db
# 기타 환경 변수

# 웹 서버 .env 파일 (apps/web/.env)
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## 환경 변수 사용 팁

### 보안 관련 팁

1. **강력한 JWT 시크릿 사용**: `JWT_SECRET`에는 무작위로 생성된 긴 문자열을 사용하세요.
2. **프로덕션 환경에서 환경 변수 보호**: 프로덕션 환경에서는 환경 변수를 안전하게 관리하세요.
3. **HTTPS 사용**: 프로덕션 환경에서는 항상 HTTPS를 통해 서비스를 제공하세요.

### 성능 관련 팁

1. **OpenSearch 활성화**: 대량의 피드백 데이터를 처리하는 경우 검색 성능을 향상시키기 위해 OpenSearch를 활성화하세요.
2. **메모리 할당 최적화**: `NODE_OPTIONS`를 사용하여 Node.js에 적절한 메모리를 할당하세요.

### 배포 관련 팁

1. **환경별 구성**: 개발, 테스트, 프로덕션 환경에 맞게 다른 환경 변수 값을 사용하세요.
2. **자동 마이그레이션 주의**: 프로덕션 환경에서는 `AUTO_MIGRATION=true` 설정을 주의해서 사용하세요. 데이터베이스 백업 후 마이그레이션을 수행하는 것이 좋습니다.

## MySQL 연결 URL 형식

`MYSQL_PRIMARY_URL` 환경 변수는 다음 형식을 따라야 합니다:

```
mysql://username:password@hostname:port/database
```

예시:

- 로컬 개발: `mysql://root:password@localhost:3306/userfeedback`
- Docker Compose: `mysql://userfeedback:userfeedback@mysql:3306/userfeedback`

## 토큰 만료 시간 형식

`ACCESS_TOKEN_EXPIRED_TIME` 및 `REFRESH_TOKEN_EXPIRED_TIME` 환경 변수는 다음 형식을 사용합니다:

- `Xs`: X초 (예: `30s`)
- `Xm`: X분 (예: `10m`)
- `Xh`: X시간 (예: `1h`)
- `Xd`: X일 (예: `7d`)

## 문제 해결

### 일반적인 환경 변수 문제

1. **환경 변수가 인식되지 않음**:

   - 환경 변수 이름이 정확한지 확인하세요.
   - 환경 변수가 올바른 위치에 설정되었는지 확인하세요.
   - Docker Compose를 사용하는 경우 컨테이너를 다시 시작하세요.

2. **데이터베이스 연결 오류**:

   - `MYSQL_PRIMARY_URL` 형식이 올바른지 확인하세요.
   - MySQL 서버가 실행 중이고 접근 가능한지 확인하세요.
   - 사용자 이름과 비밀번호가 올바른지 확인하세요.

3. **SMTP 오류**:

   - SMTP 서버 설정이 올바른지 확인하세요.
   - 필요한 경우 `SMTP_TLS` 및 `SMTP_CIPHER_SPEC` 설정을 조정하세요.

4. **OpenSearch 연결 오류**:
   - OpenSearch 서버가 실행 중인지 확인하세요.
   - `OPENSEARCH_NODE`, `OPENSEARCH_USERNAME`, `OPENSEARCH_PASSWORD` 설정이 올바른지 확인하세요.

## 다음 단계

환경 변수를 올바르게 구성한 후에는 [튜토리얼](../03-tutorial.md) 문서를 참조하여 ABC User Feedback 시스템을 초기화하고 사용자를 추가하세요.
