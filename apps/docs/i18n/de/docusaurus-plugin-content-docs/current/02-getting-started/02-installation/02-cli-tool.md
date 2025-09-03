---
sidebar_position: 2
title: 'CLI 도구 사용'
description: 'CLI 도구를 사용하여 ABC User Feedback을 설치, 실행 및 관리하는 방법을 안내합니다.'
---

# CLI 도구 사용

ABC User Feedback CLI(`auf-cli`)는 ABC User Feedback의 설치, 실행 및 관리를 간소화하기 위한 명령줄 인터페이스 도구입니다. 이 문서에서는 CLI 도구를 사용하여 ABC User Feedback을 빠르고 쉽게 설정하는 방법을 안내합니다.

## CLI 도구 소개

`auf-cli`는 다음과 같은 주요 기능을 제공합니다:

- 필요한 인프라(MySQL, SMTP, OpenSearch) 자동 설정
- 환경 변수 구성 간소화
- API 및 웹 서버 시작/중지 자동화
- 볼륨 데이터 정리

이 도구의 가장 큰 장점은 Node.js와 Docker만 설치되어 있으면 별도의 종속성 설치나 저장소 복제 없이 `npx`를 통해 바로 실행할 수 있다는 점입니다.

## 사전 요구사항

CLI 도구를 사용하기 전에 다음 요구사항을 충족해야 합니다:

- [Node.js v22 이상](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/desktop/)

## 기본 명령어

### 초기화

다음 명령을 실행하여 ABC User Feedback에 필요한 인프라를 설정합니다:

```bash
npx auf-cli init
```

이 명령은 다음 작업을 수행합니다:

1. 시스템 아키텍처(ARM/AMD)를 감지하고 적절한 Docker 이미지를 선택합니다.
2. MySQL, SMTP, OpenSearch 등 필요한 인프라 컨테이너를 설정합니다.
3. 환경 변수 구성을 위한 `config.toml` 파일을 생성합니다.

초기화가 완료되면 `config.toml` 파일이 생성됩니다. 이 파일을 편집하여 환경 변수를 필요에 맞게 조정할 수 있습니다.

### 서버 시작

다음 명령을 실행하여 API 및 웹 서버를 시작합니다:

```bash
npx auf-cli start
```

이 명령은 다음 작업을 수행합니다:

1. `config.toml` 파일에서 환경 변수를 읽어옵니다.
2. Docker Compose 파일을 생성합니다.
3. API 및 웹 서버 컨테이너를 시작합니다.

서버가 성공적으로 시작되면 웹 브라우저에서 `http://localhost:3000`(또는 구성된 URL)으로 접속하여 ABC User Feedback 웹 인터페이스에 액세스할 수 있습니다.

### 서버 중지

다음 명령을 실행하여 API 및 웹 서버를 중지합니다:

```bash
npx auf-cli stop
```

이 명령은 실행 중인 API 및 웹 서버 컨테이너를 중지합니다. 인프라 컨테이너(MySQL, SMTP, OpenSearch)는 계속 실행됩니다.

### 볼륨 정리

다음 명령을 실행하여 초기화 중에 생성된 Docker 볼륨을 정리합니다:

```bash
npx auf-cli clean
```

이 명령은 MySQL, SMTP, OpenSearch 등의 Docker 볼륨을 삭제합니다. **주의**: 이 작업은 모든 데이터를 삭제하므로 백업이 필요한 경우 미리 데이터를 백업하세요.

## 구성 파일 (config.toml)

`init` 명령을 실행하면 현재 디렉토리에 `config.toml` 파일이 생성됩니다. 이 파일은 ABC User Feedback의 환경 변수를 구성하는 데 사용됩니다.

다음은 `config.toml` 파일의 예시입니다:

```toml
[api]
JWT_SECRET = "jwtsecretjwtsecretjwtsecret"
MYSQL_PRIMARY_URL = "mysql://userfeedback:userfeedback@mysql:3306/userfeedback"
ACCESS_TOKEN_EXPIRED_TIME = "10m"
REFRESH_TOKEN_EXPIRED_TIME = "1h"
APP_PORT = 4000
APP_ADDRESS = "0.0.0.0"
AUTO_MIGRATION = true
NODE_OPTIONS = "--max_old_space_size=3072"
SMTP_HOST = "smtp4dev"
SMTP_PORT = 25
SMTP_SENDER = "user@feedback.com"
SMTP_BASE_URL = "http://localhost:3000"

# OpenSearch 설정 (선택 사항)
# OPENSEARCH_USE = true
# OPENSEARCH_NODE = "http://opensearch-node:9200"
# OPENSEARCH_USERNAME = "admin"
# OPENSEARCH_PASSWORD = "UserFeedback123!@#"

[web]
NEXT_PUBLIC_API_BASE_URL = "http://localhost:4000"
```

필요에 따라 이 파일을 편집하여 환경 변수를 조정할 수 있습니다. 환경 변수에 대한 자세한 설명은 [환경 변수 구성](./04-configuration.md) 문서를 참조하세요.

## 고급 사용법

### 포트 변경

기본적으로 웹 서버는 포트 3000, API 서버는 포트 4000을 사용합니다. 이를 변경하려면 `config.toml` 파일에서 다음 설정을 수정하세요:

```toml
[api]
APP_PORT = 8080  # API 서버 포트 변경

[web]
PORT = 8000  # 웹 서버 포트 변경
NEXT_PUBLIC_API_BASE_URL = "http://localhost:8080"  # API URL도 변경해야 함
```

### 사용자 정의 Docker Compose 파일

CLI 도구는 내부적으로 Docker Compose 파일을 생성하여 사용합니다. 생성된 Docker Compose 파일을 확인하려면 `start` 명령 실행 후 현재 디렉토리에서 `docker-compose.yml` 파일을 확인하세요.

이 파일을 직접 수정하여 추가적인 구성을 적용할 수 있지만, `auf-cli start` 명령을 다시 실행하면 변경 사항이 덮어쓰여질 수 있으므로 주의하세요.

## 문제 해결

### 일반적인 문제

1. **Docker 관련 오류**:

   - Docker가 실행 중인지 확인하세요.
   - Docker 명령을 실행할 권한이 있는지 확인하세요.

2. **포트 충돌**:

   - 포트 3000, 4000, 13306, 9200 등이 다른 애플리케이션에서 사용 중인지 확인하세요.
   - `config.toml` 파일에서 포트 설정을 변경하세요.

3. **메모리 부족**:
   - Docker에 할당된 메모리를 늘리세요.
   - OpenSearch는 최소 2GB의 메모리를 필요로 합니다.

## 제한 사항

CLI 도구는 개발 및 테스트 환경에서 사용하기에 적합합니다. 프로덕션 환경에서는 다음 사항을 고려하세요:

1. 보안 강화를 위해 환경 변수를 직접 설정하고 관리하세요.
2. 고가용성 및 확장성을 위해 Kubernetes 또는 Docker Swarm과 같은 오케스트레이션 도구를 사용하세요.
3. 데이터 지속성 및 백업 전략을 구현하세요.

## 다음 단계

CLI 도구를 사용하여 ABC User Feedback을 성공적으로 설치했다면, 다음 단계로 [튜토리얼](../03-tutorial.md)을 진행하여 시스템을 구성하고 사용자를 추가하세요.

자세한 API 및 웹 서버 구성 옵션은 [환경 변수 구성](./04-configuration.md) 문서를 참조하세요.
