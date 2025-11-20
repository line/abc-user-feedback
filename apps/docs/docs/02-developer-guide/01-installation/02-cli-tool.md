---
sidebar_position: 2
title: "CLI 도구 사용법"
description: "ABC User Feedback CLI 도구로 빠르고 쉽게 시스템을 설치하고 관리하는 방법을 설명합니다."
---

# CLI 도구 사용법

ABC User Feedback CLI (`auf-cli`)는 시스템 설치, 실행, 관리를 간소화하는 명령줄 도구입니다. Node.js와 Docker만 설치되어 있으면 추가 의존성 설치나 저장소 클론 없이 `npx`를 통해 바로 실행할 수 있습니다.

## 주요 기능

- 필요한 인프라 자동 설정 (MySQL, SMTP, OpenSearch)
- 환경 변수 설정 간소화
- API 및 웹 서버 자동 시작/중지
- 볼륨 데이터 정리
- 동적 Docker Compose 파일 생성

## 사용되는 Docker 이미지

- `line/abc-user-feedback-web:latest` - 웹 프론트엔드
- `line/abc-user-feedback-api:latest` - API 백엔드
- `mysql:8.0` - 데이터베이스
- `rnwood/smtp4dev:v3` - SMTP 테스트 서버
- `opensearchproject/opensearch:2.16.0` - 검색 엔진 (선택사항)

## 사전 요구사항

CLI 도구를 사용하기 전에 다음 요구사항을 충족해야 합니다:

- [Node.js v22 이상](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/desktop/)

## 기본 명령어

### 초기화

ABC User Feedback에 필요한 인프라를 설정하려면 다음 명령어를 실행하세요:

```bash
npx auf-cli init
```

이 명령어는 다음 작업을 수행합니다:

1. 환경 변수 설정을 위한 `config.toml` 파일 생성
2. 아키텍처(ARM/AMD)에 따라 필요한 인프라 설정

초기화가 완료되면 현재 디렉토리에 `config.toml` 파일이 생성됩니다. 필요에 따라 이 파일을 편집하여 환경 변수를 조정할 수 있습니다.

### 서버 시작

API 및 웹 서버를 시작하려면 다음 명령어를 실행하세요:

```bash
npx auf-cli start
```

이 명령어는 다음 작업을 수행합니다:

1. `config.toml` 파일에서 환경 변수 읽기
2. Docker Compose 파일 생성 및 서비스 시작
3. API 및 웹 서버 컨테이너와 필요한 인프라(MySQL, SMTP, OpenSearch) 시작

서버가 성공적으로 시작되면 웹 브라우저에서 `http://localhost:3000` (또는 설정된 URL)로 ABC User Feedback 웹 인터페이스에 접근할 수 있습니다. CLI는 다음 URL들을 표시합니다:

- 웹 인터페이스 URL
- API URL
- MySQL 연결 문자열
- OpenSearch URL (활성화된 경우)
- SMTP 웹 인터페이스 (smtp4dev 사용 시)

### 서버 중지

API 및 웹 서버를 중지하려면 다음 명령어를 실행하세요:

```bash
npx auf-cli stop
```

이 명령어는 실행 중인 API 및 웹 서버 컨테이너와 인프라 컨테이너를 중지합니다. 볼륨에 저장된 모든 데이터는 보존됩니다.

### 볼륨 정리

시작 중 생성된 Docker 볼륨을 정리하려면 다음 명령어를 실행하세요:

```bash
npx auf-cli clean
```

이 명령어는 모든 컨테이너를 중지하고 MySQL, SMTP, OpenSearch 등의 Docker 볼륨을 삭제합니다.

**경고**: 이 작업은 모든 데이터를 삭제하므로 백업이 필요한 경우 미리 백업하세요.

`--images` 옵션을 사용하여 사용하지 않는 Docker 이미지도 정리할 수 있습니다:

```bash
npx auf-cli clean --images
```

## 설정 파일 (config.toml)

`init` 명령어를 실행하면 현재 디렉토리에 `config.toml` 파일이 생성됩니다. 이 파일은 ABC User Feedback의 환경 변수를 설정하는 데 사용됩니다.

다음은 `config.toml` 파일의 예시입니다:

```toml
[web]
port = 3000
# api_base_url = "http://localhost:4000"

[api]
port = 4000
jwt_secret = "jwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecret"

# master_api_key = "MASTER_KEY"
# access_token_expired_time = "10m"
# refresh_token_expired_time = "1h"

# [api.auto_feedback_deletion]
# enabled = true
# period_days = 365

# [api.smtp]
# host = "smtp4dev" # SMTP_HOST
# port = 25 # SMTP_PORT
# sender = "user@feedback.com"
# username=
# password=
# tls=
# cipher_spec=
# opportunitic_tls=

# [api.opensearch]
# enabled = true

[mysql]
port = 13306
```

필요에 따라 이 파일을 편집하여 환경 변수를 조정할 수 있습니다. 환경 변수 자세한 정보는 [환경 변수 설정](./05-configuration.md) 문서를 참조하세요.

## 고급 사용법

### 포트 변경

기본적으로 웹 서버는 포트 3000을, API 서버는 포트 4000을 사용합니다. 이를 변경하려면 `config.toml` 파일에서 다음 설정을 수정하세요:

```toml
[web]
port = 8000  # 웹 서버 포트 변경
api_base_url = "http://localhost:8080"  # API URL도 함께 변경해야 함

[api]
port = 8080  # API 서버 포트 변경

[mysql]
port = 13307  # 필요시 MySQL 포트 변경
```

### OpenSearch 활성화

고급 검색 기능을 위해 OpenSearch를 활성화하려면:

```toml
[api.opensearch]
enabled = true
```

**주의사항**:

- OpenSearch는 최소 2GB의 사용 가능한 메모리가 필요합니다
- OpenSearch 컨테이너는 `http://localhost:9200`에서 사용할 수 있습니다
- OpenSearch 상태 확인: `http://localhost:9200/_cluster/health`

### SMTP 설정

개발 환경에서는 기본 `smtp4dev` 설정을 권장합니다:

```toml
[api.smtp]
host = "smtp4dev"
port = 25
sender = "dev@feedback.local"
```

smtp4dev 웹 인터페이스는 `http://localhost:5080`에서 전송된 이메일을 확인할 수 있습니다.

## 문제 해결

### 일반적인 문제

1. **Docker 관련 오류**:

   - Docker가 실행 중인지 확인: `docker --version`
   - Docker 권한 확인: `docker ps`
   - Docker Desktop이 올바르게 설치되고 실행 중인지 확인

2. **포트 충돌**:

   - 포트 사용 확인: `lsof -i :PORT` (macOS/Linux) 또는 `netstat -ano | findstr :PORT` (Windows)
   - `config.toml`에서 포트 설정 변경
   - 일반적인 충돌 포트: 3000, 4000, 13306, 9200, 5080

3. **서비스 시작 실패**:

   - 컨테이너 로그 확인: `docker compose logs SERVICE_NAME`
   - Docker 이미지 사용 가능 여부 확인: `docker images`
   - 충분한 시스템 리소스(메모리, 디스크 공간) 확인

4. **데이터베이스 연결 문제**:
   - MySQL 컨테이너 상태 확인: `docker compose ps mysql`
   - MySQL 로그 확인: `docker compose logs mysql`
   - 연결 테스트: `docker compose exec mysql mysql -u userfeedback -p`

### 디버깅 팁

1. **컨테이너 로그 확인**:

   ```bash
   # 모든 컨테이너 로그
   docker compose logs

   # 특정 서비스 로그
   docker compose logs api
   docker compose logs web
   docker compose logs mysql
   ```

2. **서비스 상태 확인**:

   ```bash
   # API 상태 확인
   curl http://localhost:4000/api/health

   # OpenSearch 상태 확인 (활성화된 경우)
   curl http://localhost:9200/_cluster/health
   ```

3. **데이터베이스 직접 접근**:
   ```bash
   # MySQL 연결
   docker compose exec mysql mysql -u userfeedback -p userfeedback
   ```

## 제한사항

CLI 도구는 개발 및 테스트 환경을 위해 설계되었습니다. 프로덕션 배포를 위해서는 다음 사항을 고려하세요:

1. **보안 고려사항**:

   - 민감한 데이터에 대해서는 설정 파일 대신 환경 변수 사용
   - 적절한 비밀 관리 구현
   - 프로덕션급 JWT 비밀 사용
   - HTTPS/TLS 암호화 활성화

2. **확장성 및 가용성**:

   - Kubernetes 또는 Docker Swarm과 같은 오케스트레이션 도구 사용
   - 로드 밸런싱 및 자동 스케일링 구현
   - 적절한 모니터링 및 알림 설정
   - 관리형 데이터베이스 서비스(RDS, Cloud SQL 등) 사용

3. **데이터 관리**:
   - 자동화된 백업 전략 구현
   - 적절한 백업이 있는 영구 볼륨 사용
   - 데이터 보존 정책 고려
   - 디스크 사용량 및 성능 모니터링

## 다음 단계

자세한 API 및 웹 서버 설정 옵션은 [환경 변수 설정](./05-configuration.md) 문서를 참조하세요.
