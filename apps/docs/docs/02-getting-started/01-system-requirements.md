---
sidebar_position: 1
title: '시스템 요구사항'
description: '시스템 요구사항 대한 설명입니다.'
---

# 시스템 요구사항

ABC User Feedback을 설치하고 운영하기 위한 시스템 요구사항을 안내합니다. 이 문서는 서버 환경 설정 및 필수/선택 구성 요소에 대한 정보를 제공합니다.

## 필수 요구사항

ABC User Feedback을 설치하기 위해 다음 구성 요소가 필요합니다:

### Node.js

- **버전**: v22.0.0 이상
- **설명**: 백엔드 API 서버와 프론트엔드 웹 서버를 실행하기 위해 필요합니다.
- **다운로드**: [Node.js 공식 웹사이트](https://nodejs.org/en/download/)

### MySQL

- **버전**: 8.0 이상
- **설명**: 피드백, 이슈, 사용자 데이터 등을 저장하는 주 데이터베이스입니다.
- **다운로드**: [MySQL 공식 웹사이트](https://www.mysql.com/downloads/)
- **최소 사양**:
  - RAM: 4GB 이상
  - 디스크: 20GB 이상 (데이터 양에 따라 증가)

## 선택적 요구사항

다음 구성 요소는 선택적이지만, 특정 기능을 사용하기 위해 필요할 수 있습니다:

### SMTP 서버

- **목적**: 이메일 인증, 비밀번호 재설정 등의 이메일 기능을 위해 필요합니다.
- **옵션**:
  - 자체 호스팅 SMTP 서버
  - SendGrid, Mailgun, Amazon SES 등의 클라우드 이메일 서비스
- **참고**: SMTP 서버가 없으면 이메일 인증 기능을 사용할 수 없습니다.

### OpenSearch

- **버전**: 2.16 이상
- **목적**: 대량의 피드백 데이터에 대한 고성능 검색 기능 제공
- **다운로드**: [OpenSearch 공식 웹사이트](https://opensearch.org/)
- **최소 사양**:
  - RAM: 8GB 이상
  - 디스크: 50GB 이상 (데이터 양에 따라 증가)
- **참고**: OpenSearch가 없어도 기본 검색 기능은 작동하지만, 대량의 데이터를 처리할 때 성능이 저하될 수 있습니다.

### S3 호환 스토리지

- **목적**: 피드백에 첨부된 이미지 저장
- **옵션**:
  - Amazon S3
  - MinIO
  - Google Cloud Storage (S3 호환 모드)
  - 기타 S3 호환 스토리지 서비스
- **참고**: S3 호환 스토리지가 없으면 이미지 첨부 기능을 사용할 수 없습니다.

## 개발 환경 요구사항

로컬 개발 환경을 설정하려면 다음 추가 도구가 필요합니다:

- **Git**: 소스 코드 관리
- **pnpm**: 패키지 관리자 (v8.0.0 이상)
- **Docker Compose**: 개발 인프라 구성

## 인프라 설정 예시

Docker Compose를 사용하여 필요한 인프라를 쉽게 설정할 수 있습니다. ABC User Feedback은 아키텍처에 따라 두 가지 Docker Compose 파일을 제공합니다:

```bash
docker-compose -f docker/docker-compose.infra.yml up -d
```

이 명령은 MySQL과 OpenSearch를 포함한 필요한 인프라 컴포넌트를 시작합니다.

## 다음 단계

시스템 요구사항을 충족했다면 다음 단계로 ABC User Feedback 설치를 진행할 수 있습니다:

- [Docker Hub 이미지 사용](./02-installation/01-docker-hub-images.md)
- [CLI 도구 사용](./02-installation/02-cli-tool.md)
- [수동 설치](./02-installation/03-manual-setup.md)
