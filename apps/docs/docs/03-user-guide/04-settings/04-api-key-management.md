---
sidebar_position: 4
title: 'API 키 관리'
description: 'ABC User Feedback API 연동을 위한 API 키를 생성하고 관리하는 방법에 대한 설명입니다.'
---

# API 키 관리

ABC User Feedback API와 연동하기 위한 API 키를 생성하고 관리하는 방법을 안내합니다.

## 개요

API 키 관리 기능을 통해 외부 시스템에서 ABC User Feedback API에 접근할 수 있는 인증 키를 생성하고 관리할 수 있습니다. 이 키를 사용하여 피드백 데이터를 자동으로 수집하거나, 외부 애플리케이션과 통합할 수 있습니다.

## API 키 관리 접근

### 접근 방법

1. 상단 메뉴에서 **Settings** 탭을 클릭합니다.
2. 좌측 메뉴에서 **API Key Management**를 선택합니다.

### 화면 구성

**상단 정보 패널**

- API 키 관리에 대한 안내 메시지
- API 문서(API Docs) 링크 제공

**API 키 테이블**

- **API KEY**: 생성된 API 키 값
- **Status**: 키의 활성화 상태 (Active/Inactive)
- **Created**: 키 생성일시

**컨트롤 버튼**

- **Create API Key**: 새 API 키 생성 버튼

## API 키 생성

### 새 API 키 생성 방법

1. 우측 상단의 **Create API Key** 버튼을 클릭합니다.
2. 시스템에서 자동으로 고유한 API 키를 생성합니다.
3. 생성된 키는 즉시 테이블에 표시되며 기본적으로 **Active** 상태로 설정됩니다.
4. 성공적으로 생성되면 "Successfully processed." 메시지가 표시됩니다.

### API 키 특징

- **고유성**: 각 API 키는 프로젝트별로 고유한 값을 가집니다
- **형식**: 영숫자 조합의 긴 문자열 (예: E160CB5A5B1587318389)
- **자동 생성**: 사용자가 별도로 값을 입력할 필요 없음
- **즉시 사용**: 생성 즉시 API 호출에 사용 가능

## API 키 관리

### 기존 API 키 편집

1. API 키 목록에서 수정할 키를 클릭합니다.
2. **API Key Details** 모달창이 열리면 다음을 확인하고 수정할 수 있습니다:

#### 수정 가능한 항목

**API Key**

- 현재 API 키 값 표시
- 키 값 자체는 수정 불가능

**Status**

- **Active**: 키가 활성화되어 API 호출 가능
- **Inactive**: 키가 비활성화되어 API 호출 불가능
- 드롭다운에서 상태 변경 가능

#### 관리 옵션

- **Save**: 변경사항 저장
- **Cancel**: 변경사항 취소
- **Delete**: API 키 완전 삭제

## API 키 사용법

### HTTP 헤더 설정

생성된 API 키는 HTTP 요청 헤더에 포함하여 사용합니다:

```bash
curl --request POST {API_SERVER_HOST}/api/projects/{projectId}/channels/{channelId}/feedbacks \
  --header 'Content-Type: application/json' \
  --header 'X-API-KEY: YOUR_API_KEY' \
  --data-raw '{
    "createdAt": "2025-04-28T15:14:00Z",
    "issueNames": [],
    "text": "피드백 내용"
  }'
```

:::tip API 서버 주소
`{API_SERVER_HOST}` 부분은 실제 API 서버 주소로 변경하여 사용하세요.
:::

### API 엔드포인트

API 키로 접근 가능한 주요 엔드포인트들:

#### 피드백 관련

- **POST** `/api/projects/{projectId}/channels/{channelId}/feedbacks` - 피드백 생성
- **GET** `/api/projects/{projectId}/channels/{channelId}/feedbacks` - 피드백 조회
- **PUT** `/api/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}` - 피드백 수정
- **DELETE** `/api/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}` - 피드백 삭제

#### 이슈 관련

- **POST** `/api/projects/{projectId}/issues` - 이슈 생성
- **GET** `/api/projects/{projectId}/issues` - 이슈 조회
- **PUT** `/api/projects/{projectId}/issues/{issueId}` - 이슈 수정
- **DELETE** `/api/projects/{projectId}/issues/{issueId}` - 이슈 삭제

#### 채널 관리

- **GET** `/api/projects/{projectId}/channels` - 채널 목록 조회
- **POST** `/api/projects/{projectId}/channels` - 채널 생성

### API 문서 참조

더 자세한 API 사용법은 화면 상단의 **API Docs** 링크를 통해 확인할 수 있습니다. API 문서에서는 다음 정보를 제공합니다:

- 모든 엔드포인트의 상세 명세
- 요청/응답 스키마
- 예제 코드
- 오류 코드 및 해결 방법

## 보안 관리

### API 키 보안 원칙

**안전한 저장**

- API 키는 환경 변수나 설정 파일에 저장
- 소스 코드에 직접 하드코딩 금지
- 버전 관리 시스템에 키 값 노출 방지

**접근 제한**

- 필요한 팀원에게만 API 키 공유
- 정기적인 키 로테이션 수행
- 불필요한 키는 즉시 삭제

**모니터링**

- API 호출 로그 정기 검토
- 비정상적인 사용 패턴 감지 시 즉시 키 비활성화
- 사용하지 않는 키는 Inactive 상태로 변경

### 키 생명주기 관리

**생성 단계**

- 목적에 맞는 키 생성
- 키 사용 용도 문서화
- 담당자 및 사용 시스템 기록

**사용 단계**

- 정기적인 키 사용량 모니터링
- 보안 이슈 발생 시 즉시 대응
- 필요 시 키 상태 변경

**폐기 단계**

- 사용 종료 시 키 삭제
- 관련 시스템에서 키 제거 확인
- 삭제 기록 보관

## 문제 해결

### 일반적인 문제

**API 호출 실패**

1. API 키가 Active 상태인지 확인
2. HTTP 헤더에 올바른 키 값 포함 여부 확인
3. API 엔드포인트 URL 정확성 검증

**인증 오류**

- 키 값에 공백이나 특수문자 포함 여부 확인
- 헤더명이 'X-API-KEY'로 정확히 설정되었는지 확인
- 키가 삭제되거나 비활성화되지 않았는지 확인

**권한 오류**

- 해당 프로젝트에 대한 API 키인지 확인
- 사용자의 API 키 관리 권한 확인
- 프로젝트 접근 권한 검토

### 연동 개발 시 유의사항

**키 보안**

- API 키는 클라이언트 사이드(브라우저, 모바일 앱)에 노출하지 않기
- 서버 사이드에서만 API 키 사용
- 키가 유출된 경우 즉시 비활성화 후 새 키 생성

**에러 처리**

- API 응답 상태 코드에 따른 적절한 에러 처리
- 인증 실패 시 재시도 로직 구현
- API 제한 사항 고려한 요청 빈도 조절

**테스트 환경**

- 개발/테스트용 별도 API 키 사용
- 프로덕션 키와 개발 키 분리 관리
- 테스트 완료 후 불필요한 키 정리

> **참고**: API 키는 프로젝트별로 생성되며, 다른 프로젝트에서는 사용할 수 없습니다. 키 삭제 시에는 해당 키를 사용하는 모든 외부 시스템에서 새로운 키로 교체해야 합니다.

---

이 문서는 API 키 관리의 기본적인 방법을 안내합니다. API 연동 개발에 대한 자세한 내용은 API 문서를 참고하세요.
