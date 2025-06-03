---
sidebar_position: 1
title: 'API 연동'
description: '피드백 생성, 수정, 이슈 연결 및 해제 API 사용 방법을 설명합니다.'
---

# API 연동

ABC User Feedback은 API를 통해 피드백 생성, 수정, 이슈 연결 및 이슈 관리 기능을 제공합니다. 이 문서에서는 주요 API 경로와 사용 방법을 안내합니다.

[API Docs](https://line.github.io/abc-user-feedback/)

## 피드백 생성

### JSON 데이터로 피드백 생성

`POST /api/projects/{projectId}/channels/{channelId}/feedbacks`

- 피드백 본문 및 이슈 이름(`issueNames`) 배열을 포함한 JSON 데이터로 피드백을 생성할 수 있습니다.
- 이미지 URL 목록도 포함할 수 있습니다.

```json
{
  "message": "피드백 메시지",
  "issueNames": ["이슈 이름1", "이슈 이름2"]
}
```

### 이미지 파일과 함께 피드백 생성

`POST /api/projects/{projectId}/channels/{channelId}/feedbacks-with-images`

- 멀티파트 폼 데이터로 텍스트와 파일을 함께 업로드할 수 있습니다.

## 피드백 조회 및 검색

### 피드백 검색

`POST /api/projects/{projectId}/channels/{channelId}/feedbacks/search`

- 다양한 필터(작성일, 수정일, 검색어 등)를 사용하여 피드백을 검색할 수 있습니다.

## 피드백 수정

### 피드백 수정

`PUT /api/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}`

- 피드백의 편집 가능한 필드만 수정할 수 있습니다.
- 이슈 이름(`issueNames`)을 갱신할 수도 있습니다.

## 피드백 이슈 연결 및 해제

### 피드백에 이슈 추가

`POST /api/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}/issue/{issueId}`

- 특정 피드백에 기존 이슈를 연결합니다.

### 피드백에서 이슈 제거

`DELETE /api/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}/issue/{issueId}`

- 특정 피드백에서 연결된 이슈를 제거합니다.

## 이슈 관리

### 이슈 생성

`POST /api/projects/{projectId}/issues`

- 새 이슈를 생성합니다.

```json
{
  "name": "이슈 이름",
  "status": "INIT",
  "description": "이슈 설명",
  "externalIssueId": "외부 시스템 이슈 ID"
}
```

### 이슈 수정

`PUT /api/projects/{projectId}/issues/{issueId}`

- 이슈 이름, 설명, 상태를 수정할 수 있습니다.

### 이슈 삭제

`DELETE /api/projects/{projectId}/issues/{issueId}`

- 특정 이슈를 삭제합니다.

### 이슈 검색

`POST /api/projects/{projectId}/issues/search`

- 프로젝트 내 모든 이슈를 검색할 수 있습니다.

## 인증

모든 API 요청은 헤더에 `x-api-key`를 포함해야 합니다.

```bash
-H "x-api-key: YOUR_API_KEY"
```

---

이 문서는 ABC User Feedback의 피드백 및 이슈 관리 API 사용 방법을 간략히 정리한 것입니다. 보다 자세한 API 명세는 Swagger 문서(`/docs`)를 참고하세요.
