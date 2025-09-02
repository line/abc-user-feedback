---
sidebar_position: 1
title: '피드백 생성하기'
description: 'API를 통해 사용자 피드백을 생성하는 방법에 대한 설명입니다.'
---

# 피드백 생성하기

ABC User Feedback에서는 API 요청을 통해 사용자 피드백을 수집할 수 있습니다. 이 문서에서는 피드백을 생성하는 방법을 안내합니다.

## 개요

피드백 생성은 **API 요청**을 통해 수행됩니다. 웹 인터페이스에서는 직접 피드백을 생성하지 않고, 필드 설정 및 요청 코드 예시를 확인하는 용도로 사용됩니다.

## 피드백 요청 코드 확인하기

1. 왼쪽 메뉴에서 **Channel List**에서 원하는 채널을 선택합니다.
2. **Settings > Field Management** 탭으로 이동합니다.
3. **Feedback Request Code** 버튼을 클릭하여 API 요청 예시를 확인합니다.

<!-- ![Feedback 필드 관리 화면](/assets/803a0acc-2210-4280-af0a-a2dd93235137.png) -->

## API를 통한 피드백 생성하기

API 엔드포인트를 사용하여 시스템 연동 방식으로 피드백을 생성할 수 있습니다:

```bash
curl --request POST http://localhost:4000/api/projects/{projectId}/channels/{channelId}/feedbacks \
  --header 'Content-Type: application/json' \
  --header 'X-API-KEY: YOUR_API_KEY' \
  --data-raw '{
    "createdAt": "2025-04-28T15:14:00Z",
    "issueNames": [],
    "text": "피드백 내용"
  }'
```

- **createdAt**: 피드백 생성일자 (ISO 8601 형식)
- **issueNames**: 연결할 이슈 이름 배열
- **text**: 사용자가 정의한 커스텀 필드 예시 (본문 내용)

> **참고**: API 키는 프로젝트 생성 시 발급된 값을 사용해야 하며, 보안을 위해 안전하게 관리해야 합니다.

## 추가 정보

- 필드 설정은 채널별로 자유롭게 구성할 수 있습니다.
- **Add Field** 기능을 통해 다양한 커스텀 필드를 생성하고 관리할 수 있습니다.
- 필드 속성은 Editable 또는 Read Only로 설정할 수 있으며, 상태는 Active/Inactive로 관리할 수 있습니다.

---

이 문서는 API를 통한 피드백 생성의 기본 방법을 안내합니다. 고급 설정 및 자동화 방법은 추가 문서를 참고하세요.
