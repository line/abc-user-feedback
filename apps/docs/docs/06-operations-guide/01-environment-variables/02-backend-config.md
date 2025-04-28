---
sidebar_position: 2
title: '백엔드 설정'
description: '�� 대한 설명입니다.'
---

# API 서버 환경 변수

## 필수 환경 변수

| 환경 변수                   | 설명                                        | 기본값 | 예시                                                        |
| --------------------------- | ------------------------------------------- | ------ | ----------------------------------------------------------- |
| `JWT_SECRET`                | JSON Web Token(JWT) 서명에 사용되는 비밀 키 | _필수_ | `jwtsecretjwtsecretjwtsecret`                               |
| `MYSQL_PRIMARY_URL`         | 주 MySQL 데이터베이스 연결 URL              | _필수_ | `mysql://userfeedback:userfeedback@mysql:3306/userfeedback` |
| `BASE_URL`                  | 애플리케이션의 기본 URL                     | _필수_ | `http://api:4000`                                           |
| `ACCESS_TOKEN_EXPIRED_TIME` | 액세스 토큰 만료 시간                       | `10m`  | `10m` (10분)                                                |
| `REFESH_TOKEN_EXPIRED_TIME` | 리프레시 토큰 만료 시간                     | `1h`   | `1h` (1시간)                                                |

## 선택적 환경 변수

| 환경 변수              | 설명                                        | 기본값    | 예시                                  |
| ---------------------- | ------------------------------------------- | --------- | ------------------------------------- |
| `APP_PORT`             | 서버가 실행되는 포트                        | `4000`    | `4000`                                |
| `APP_ADDRESS`          | 서버가 바인딩하는 주소                      | `0.0.0.0` | `0.0.0.0`                             |
| `MYSQL_SECONDARY_URLS` | 보조 MySQL 연결 URL(JSON 배열 형식)         | _선택_    | `["mysql://user:pass@host2:3306/db"]` |
| `AUTO_MIGRATION`       | 애플리케이션 시작 시 자동 마이그레이션 수행 | `true`    | `true`                                |
| `MASTER_API_KEY`       | 특권 작업을 위한 마스터 API 키              | _없음_    | `your-api-key`                        |
| `NODE_OPTIONS`         | Node.js 실행 옵션                           | _없음_    | `--max_old_space_size=3072`           |

## SMTP 설정 (이메일 인증용)

| 환경 변수                | 설명                                          | 기본값    | 예시                    |
| ------------------------ | --------------------------------------------- | --------- | ----------------------- |
| `SMTP_HOST`              | SMTP 서버 호스트                              | _선택_    | `smtp.example.com`      |
| `SMTP_PORT`              | SMTP 서버 포트                                | _선택_    | `587`                   |
| `SMTP_USERNAME`          | SMTP 서버 인증 사용자 이름                    | _선택_    | `user@example.com`      |
| `SMTP_PASSWORD`          | SMTP 서버 인증 비밀번호                       | _선택_    | `password`              |
| `SMTP_SENDER`            | 이메일 발신자로 사용되는 이메일 주소          | _선택_    | `noreply@example.com`   |
| `SMTP_BASE_URL`          | 이메일에서 애플리케이션으로 연결하는 기본 URL | _선택_    | `http://localhost:3000` |
| `SMTP_TLS`               | SMTP 서버에 보안 옵션 사용 설정               | `false`   | `true`                  |
| `SMTP_CIPHER_SPEC`       | SMTP 암호화 알고리즘 사양                     | `TLSv1.2` | `TLSv1.2`               |
| `SMTP_OPPORTUNISTIC_TLS` | STARTTLS를 사용한 기회적 TLS 사용             | `true`    | `true`                  |

## OpenSearch 설정 (검색 성능 향상용)

| 환경 변수             | 설명                          | 기본값                        | 예시                          |
| --------------------- | ----------------------------- | ----------------------------- | ----------------------------- |
| `OPENSEARCH_USE`      | OpenSearch 통합 활성화 플래그 | `false`                       | `true`                        |
| `OPENSEARCH_NODE`     | OpenSearch 노드 URL           | _OPENSEARCH_USE=true 시 필수_ | `http://opensearch-node:9200` |
| `OPENSEARCH_USERNAME` | OpenSearch 사용자 이름        | _OPENSEARCH_USE=true 시 필수_ | `admin`                       |
| `OPENSEARCH_PASSWORD` | OpenSearch 비밀번호           | _OPENSEARCH_USE=true 시 필수_ | `admin`                       |

## 자동 피드백 삭제 설정

| 환경 변수                            | 설명                                                     | 기본값                                       | 예시   |
| ------------------------------------ | -------------------------------------------------------- | -------------------------------------------- | ------ |
| `ENABLE_AUTO_FEEDBACK_DELETION`      | 애플리케이션 시작 시 자동 오래된 피드백 삭제 크론 활성화 | `false`                                      | `true` |
| `AUTO_FEEDBACK_DELETION_PERIOD_DAYS` | 자동 오래된 피드백 삭제 기간(일)                         | _ENABLE_AUTO_FEEDBACK_DELETION=true 시 필수_ | `365`  |
