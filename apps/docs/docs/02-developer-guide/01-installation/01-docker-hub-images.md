---
id: docker-hub-images
title: Docker Hub 이미지 설치
description: Docker Hub에 등록된 ABC User Feedback 공식 이미지로 빠르게 시스템을 설치하는 방법을 설명합니다.
sidebar_position: 1
---

# Docker Hub 이미지 설치

ABC User Feedback은 공식 Docker 이미지를 제공합니다.  
이 문서는 Docker Compose를 이용하여 **웹 UI, API 서버, 데이터베이스, SMTP 서버** 등 시스템을 로컬에서 빠르게 구성하는 방법을 설명합니다.

---

## 1. 사전 요구 사항

| 항목           | 설명                                                              |
| -------------- | ----------------------------------------------------------------- |
| Docker         | 20.10 이상                                                        |
| Docker Compose | v2 이상 권장                                                      |
| 사용 포트      | `3000`, `4000`, `13306`, `5080`, `25` (로컬에서 비워져 있어야 함) |

---

## 2. Docker 이미지 구성

| 서비스 이름       | 설명                               | Docker 이미지 이름                    |
| ----------------- | ---------------------------------- | ------------------------------------- |
| Web (Admin UI)    | 프론트엔드 웹 UI (Next.js)         | `line/abc-user-feedback-web`          |
| API (Backend)     | 백엔드 서버 (NestJS)               | `line/abc-user-feedback-api`          |
| MySQL             | 데이터베이스                       | `mysql:8.0`                           |
| SMTP4Dev          | 로컬 테스트용 이메일 서버          | `rnwood/smtp4dev:v3`                  |
| (선택) OpenSearch | 검색 기능 및 AI 분석 정확도 향상용 | `opensearchproject/opensearch:2.16.0` |

---

## 3. `docker-compose.yml` 예시

```yaml
name: abc-user-feedback
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
      # 필수: 임의의 값 (예: `openssl rand -hex 32` 출력). 공개된 기본값은 거부됩니다.
      - JWT_SECRET=${JWT_SECRET:?Set JWT_SECRET}
      - MYSQL_PRIMARY_URL=mysql://userfeedback:userfeedback@mysql:3306/userfeedback
      - SMTP_HOST=smtp4dev
      - SMTP_PORT=25
      - SMTP_SENDER=user@feedback.com
      # OpenSearch 사용 시 아래 주석을 제거하세요
      # - OPENSEARCH_USE=true
      # - OPENSEARCH_NODE=http://opensearch-node:9200
    ports:
      - 4000:4000
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    command:
      [
        "--default-authentication-plugin=mysql_native_password",
        "--collation-server=utf8mb4_bin",
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

  # OpenSearch를 사용하려면 아래 주석을 제거하세요
  # opensearch-node:
  #   image: opensearchproject/opensearch:2.16.0
  #   restart: unless-stopped
  #   environment:
  #     - cluster.name=opensearch-cluster
  #     - node.name=opensearch-node
  #     - discovery.type=single-node
  #     - bootstrap.memory_lock=true
  #     - 'OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m'
  #     - plugins.security.disabled=true
  #     - OPENSEARCH_INITIAL_ADMIN_PASSWORD=UserFeedback123!@#
  #   ulimits:
  #     memlock:
  #       soft: -1
  #       hard: -1
  #     nofile:
  #       soft: 65536
  #       hard: 65536
  #   volumes:
  #     - opensearch:/usr/share/opensearch/data
  #   ports:
  #     - 9200:9200
  #     - 9600:9600

volumes:
  mysql:
  smtp4dev:
  # opensearch:
```

---

## 4. 실행 단계

### 4.1 Docker 이미지 다운로드 및 실행

```bash
# Docker Compose로 모든 서비스를 백그라운드에서 실행
docker compose up -d
```

### 4.2 실행 상태 확인

```bash
# 모든 컨테이너가 정상적으로 실행 중인지 확인
docker compose ps
```

### 4.3 서비스 접속 확인

- **웹 애플리케이션**: [http://localhost:3000](http://localhost:3000)
- **API 서버**: [http://localhost:4000](http://localhost:4000)
- **SMTP 테스트 페이지**: [http://localhost:5080](http://localhost:5080)
- **MySQL 데이터베이스**: `localhost:13306` (사용자: `userfeedback`, 비밀번호: `userfeedback`)

---

## 5. SMTP 설정

기본적으로 이 구성에서는 `smtp4dev`를 통해 메일을 테스트할 수 있습니다.

- **웹 인터페이스**: [http://localhost:5080](http://localhost:5080)
- **SMTP 포트**: `25`
- **IMAP 포트**: `143`

### SMTP 테스트 방법

1. 웹 애플리케이션에서 사용자 가입을 하거나 사용자 초대 기능을 사용
2. [http://localhost:5080](http://localhost:5080)에서 전송된 이메일 확인
3. 이메일 내용과 첨부파일 등을 테스트

> **중요**: 실제 운영 환경에서는 반드시 외부 SMTP 서버(예: Gmail, SendGrid, 사내 SMTP 등)와 연동해야 합니다.

👉 운영용 SMTP 연동이 필요하다면 [SMTP 서버 연동 가이드](./04-smtp-configuration.md)를 참고하세요.

## 6. 설치 확인

### 6.1 웹 애플리케이션 접속 확인

브라우저에서 `http://localhost:3000`으로 접속하여 다음을 확인하세요:

- 테넌트 생성 화면이 정상적으로 표시되는지
- 페이지 로딩이 완료되는지
- JavaScript 오류가 없는지 (브라우저 개발자 도구에서 확인)

### 6.2 API 서버 상태 확인

```bash
# API 서버 헬스 체크
curl http://localhost:4000/api/health
```

예상 응답:

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  }
}
```

### 6.3 데이터베이스 연결 확인

```bash
# MySQL 컨테이너에 직접 접속하여 데이터베이스 확인
docker compose exec mysql mysql -u userfeedback -puserfeedback -e "SHOW DATABASES;"

# 테이블 생성 확인
docker compose exec mysql mysql -u userfeedback -puserfeedback -e "USE userfeedback; SHOW TABLES;"
```

### 6.4 로그 확인

```bash
# 모든 서비스의 로그 확인
docker compose logs

# 특정 서비스의 로그만 확인
docker compose logs api
docker compose logs web
docker compose logs mysql
```

---

## 7. OpenSearch 사용 시 주의사항

OpenSearch는 검색 기능과 AI 분석의 정확도를 향상시키는 선택적 구성 요소입니다.

### 7.1 OpenSearch 활성화 방법

1. `docker-compose.yml` 파일에서 `api` 서비스의 환경 변수 주석 해제:

```yaml
- OPENSEARCH_USE=true
- OPENSEARCH_NODE=http://opensearch-node:9200
```

2. `opensearch-node` 서비스 주석 해제
3. `volumes:` 섹션에서 `opensearch:` 주석 해제
4. 포트 `9200`, `9600`이 로컬에서 사용 중이지 않은지 확인

### 7.2 메모리 요구사항

> **주의**: OpenSearch는 최소 2GB 이상의 메모리를 요구합니다. 메모리 부족 시 컨테이너가 자동 종료될 수 있습니다.

### 7.3 OpenSearch 상태 확인

```bash
# OpenSearch 클러스터 상태 확인
curl http://localhost:9200/_cluster/health

# OpenSearch 노드 정보 확인
curl http://localhost:9200/_nodes

# 인덱스 확인
curl http://localhost:9200/_cat/indices
```

### 7.4 OpenSearch 비활성화

OpenSearch를 사용하지 않으려면 `docker-compose.yml`에서 해당 서비스와 환경 변수를 주석 처리하면 됩니다.

---

## 8. 문제 해결

### 8.1 포트 충돌 문제

**증상**: `docker compose up` 실행 시 포트 바인딩 오류 발생

**해결 방법**:

```bash
# 사용 중인 포트 확인
lsof -i :3000  # 웹 포트
lsof -i :4000  # API 포트
lsof -i :13306 # MySQL 포트
lsof -i :5080  # SMTP 포트

# 해당 포트를 사용하는 프로세스 종료 후 재시작
docker compose down
docker compose up -d
```

### 8.2 컨테이너 시작 실패

**증상**: 일부 컨테이너가 시작되지 않거나 계속 재시작됨

**해결 방법**:

```bash
# 컨테이너 상태 확인
docker compose ps

# 실패한 컨테이너의 로그 확인
docker compose logs [서비스명]

# 모든 컨테이너 중지 및 제거
docker compose down

# 볼륨까지 제거 (데이터 손실 주의)
docker compose down -v

# 다시 시작
docker compose up -d
```

### 8.3 데이터베이스 연결 오류

**증상**: API 서버에서 MySQL 연결 실패

**해결 방법**:

```bash
# MySQL 컨테이너가 완전히 시작될 때까지 대기
docker compose logs mysql

# MySQL 컨테이너에 직접 접속 테스트
docker compose exec mysql mysql -u userfeedback -puserfeedback -e "SELECT 1;"

# API 서비스 재시작
docker compose restart api
```

### 8.4 이미지 다운로드 실패

**증상**: Docker 이미지를 다운로드할 수 없음

**해결 방법**:

```bash
# Docker Hub 로그인 확인
docker login

# 이미지 수동 다운로드
docker pull line/abc-user-feedback-web:latest
docker pull line/abc-user-feedback-api:latest

# 네트워크 연결 확인
ping hub.docker.com
```

### 8.5 메모리 부족 문제

**증상**: OpenSearch 컨테이너가 자동 종료됨

**해결 방법**:

```bash
# 시스템 메모리 확인
free -h

# Docker 메모리 사용량 확인
docker stats

# OpenSearch 비활성화 (docker-compose.yml에서 주석 처리)
# 또는 메모리 할당량 증가
```

---

## 9. 참고 링크

- [ABC User Feedback Web - Docker Hub](https://hub.docker.com/r/line/abc-user-feedback-web)
- [ABC User Feedback API - Docker Hub](https://hub.docker.com/r/line/abc-user-feedback-api)
- [smtp4dev - Docker Hub](https://hub.docker.com/r/rnwood/smtp4dev)
- [OpenSearch - Docker Hub](https://hub.docker.com/r/opensearchproject/opensearch)

---

## 관련 문서

- [수동 설치 가이드](./03-manual-setup.md)
- [SMTP 서버 연동 가이드](./04-smtp-configuration.md)
- [환경 변수 목록 및 설정](./05-configuration.md)
- [초기 셋팅 가이드](/docs/01-user-guide/01-getting-started.md)
