---
id: configuration
title: 환경 변수 구성
description: ABC User Feedback의 API 및 웹 서버 환경 변수 구성 방법을 설명합니다.
sidebar_position: 5
---

# 환경 변수 구성

이 문서에서는 ABC User Feedback의 **API 서버** 및 **웹 서버**에서 사용하는 주요 환경 변수와 설정 방법을 설명합니다.

---

## 1. API 서버 환경 변수

### 필수 환경 변수

| 환경 변수                    | 설명                      | 기본값 | 예시                             |
| ---------------------------- | ------------------------- | ------ | -------------------------------- |
| `JWT_SECRET`                 | JWT 서명을 위한 시크릿 키 | 없음   | `jwtsecretjwtsecretjwtsecret`    |
| `MYSQL_PRIMARY_URL`          | MySQL 연결 URL            | 없음   | `mysql://user:pass@host:3306/db` |
| `ACCESS_TOKEN_EXPIRED_TIME`  | Access Token 유효 시간    | `10m`  | `10m`, `30s`, `1h`               |
| `REFRESH_TOKEN_EXPIRED_TIME` | Refresh Token 유효 시간   | `1h`   | `1h`, `7d`                       |

> JWT 시크릿은 충분히 복잡하고 안전한 문자열을 사용해야 합니다.

⚠️ **보안 주의사항**:

- `JWT_SECRET`은 최소 32자 이상의 복잡한 문자열을 사용하세요
- 프로덕션 환경에서는 절대 기본값을 사용하지 마세요
- 환경 변수 파일(`.env`)은 버전 관리에 포함하지 마세요
- 민감한 정보는 환경 변수나 시크릿 관리 시스템을 통해 관리하세요

---

### 선택 환경 변수

| 환경 변수              | 설명                            | 기본값                  | 예시                        |
| ---------------------- | ------------------------------- | ----------------------- | --------------------------- |
| `APP_PORT`             | API 서버 포트                   | `4000`                  | `4000`                      |
| `APP_ADDRESS`          | 바인딩 주소                     | `0.0.0.0`               | `127.0.0.1`                 |
| `ADMIN_WEB_URL`        | 관리자 웹 URL                   | `http://localhost:3000` | `https://admin.company.com` |
| `MYSQL_SECONDARY_URLS` | 보조 DB URL (JSON 배열)         | 없음                    | `["mysql://..."]`           |
| `AUTO_MIGRATION`       | 앱 시작 시 DB 자동 마이그레이션 | `true`                  | `false`                     |
| `MASTER_API_KEY`       | 마스터 권한 API 키 (선택)       | 없음                    | `abc123xyz`                 |
| `NODE_OPTIONS`         | Node 실행 옵션                  | 없음                    | `--max_old_space_size=4096` |

---

### SMTP 설정 (이메일 인증)

| 환경 변수                | 설명                      | 예시                           |
| ------------------------ | ------------------------- | ------------------------------ |
| `SMTP_HOST`              | SMTP 서버 주소            | `smtp.gmail.com`               |
| `SMTP_PORT`              | 포트 (보통 587 또는 465)  | `587`                          |
| `SMTP_USERNAME`          | 로그인 사용자             | `user@example.com`             |
| `SMTP_PASSWORD`          | 로그인 비밀번호 또는 토큰 | `app-password`                 |
| `SMTP_SENDER`            | 발신자 주소               | `noreply@company.com`          |
| `SMTP_BASE_URL`          | 메일 내 링크용 기본 URL   | `https://feedback.company.com` |
| `SMTP_TLS`               | TLS 사용 여부             | `true`                         |
| `SMTP_CIPHER_SPEC`       | 암호화 스펙               | `TLSv1.2`                      |
| `SMTP_OPPORTUNISTIC_TLS` | STARTTLS 지원 여부        | `true`                         |

📎 자세한 설정은 [SMTP 연동 가이드](./04-smtp-configuration.md)를 참고하세요.

---

## 2. OpenSearch 설정 (선택)

| 환경 변수             | 설명                   | 예시                    |
| --------------------- | ---------------------- | ----------------------- |
| `OPENSEARCH_USE`      | OpenSearch 활성화 여부 | `true`                  |
| `OPENSEARCH_NODE`     | OpenSearch 노드 URL    | `http://localhost:9200` |
| `OPENSEARCH_USERNAME` | 인증 ID                | `admin`                 |
| `OPENSEARCH_PASSWORD` | 인증 비밀번호          | `admin123`              |

> OpenSearch는 검색 속도 향상 및 AI 기능 개선에 사용됩니다.

---

## 3. 자동 피드백 삭제 설정

| 환경 변수                            | 설명                           | 기본값 / 조건           |
| ------------------------------------ | ------------------------------ | ----------------------- |
| `AUTO_FEEDBACK_DELETION_ENABLED`     | 오래된 피드백 삭제 기능 활성화 | `false`                 |
| `AUTO_FEEDBACK_DELETION_PERIOD_DAYS` | 삭제 기준 일수                 | `365` (필수 if enabled) |

---

## 4. 웹 서버 환경 변수

### 필수 환경 변수

| 환경 변수                  | 설명                                | 예시                    |
| -------------------------- | ----------------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | 클라이언트에서 사용할 API 서버 주소 | `http://localhost:4000` |

### 선택 환경 변수

| 환경 변수 | 설명            | 기본값 | 예시   |
| --------- | --------------- | ------ | ------ |
| `PORT`    | 프론트엔드 포트 | `3000` | `3000` |

---

## 5. 설정 방법

### Docker Compose 예시

```yaml
services:
  api:
    image: line/abc-user-feedback-api
    environment:
      - JWT_SECRET=changeme
      - MYSQL_PRIMARY_URL=mysql://user:pass@mysql:3306/userfeedback
      - SMTP_HOST=smtp.sendgrid.net
      - SMTP_USERNAME=apikey
      - SMTP_PASSWORD=your-sendgrid-key
```

### .env 파일 예시

```
# apps/api/.env
JWT_SECRET=changemechangemechangeme
MYSQL_PRIMARY_URL=mysql://root:pass@localhost:3306/db
ACCESS_TOKEN_EXPIRED_TIME=10m
REFRESH_TOKEN_EXPIRED_TIME=1h
SMTP_HOST=smtp.example.com
SMTP_SENDER=noreply@example.com

# apps/web/.env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

---

## 7. 문제 해결 가이드

| 문제                      | 원인 및 해결책                               |
| ------------------------- | -------------------------------------------- |
| 환경 변수가 인식되지 않음 | `.env` 위치 확인 또는 컨테이너 재시작        |
| DB 연결 실패              | `MYSQL_PRIMARY_URL` 형식 또는 연결 정보 확인 |
| SMTP 오류                 | 포트/TLS 설정 또는 인증 정보 재확인          |
| OpenSearch 오류           | 노드 URL 또는 사용자 인증 확인               |
| JWT 토큰 오류             | `JWT_SECRET` 길이 및 복잡성 확인             |
| 환경 변수 검증 실패       | 필수 환경 변수 누락 또는 타입 오류 확인      |
| 포트 충돌                 | `APP_PORT`, `PORT` 설정 확인                 |

---

## 관련 문서

- [Docker 설치 가이드](./docker-hub-images)
- [SMTP 연동 가이드](./smtp-configuration)
- [초기 셋팅 가이드](/user-guide/getting-started)
