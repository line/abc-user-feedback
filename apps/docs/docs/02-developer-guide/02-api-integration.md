---
sidebar_position: 2
title: "API 연동"
description: "ABC User Feedback API를 활용한 외부 시스템 연동 방법과 실제 구현 예시를 안내합니다."
---

# API 연동

ABC User Feedback은 **RESTful API**를 통해 외부 시스템과 연동할 수 있습니다. 프로그래매틱하게 피드백을 수집하고, 이슈를 관리하며, 데이터를 조회할 수 있어 기존 서비스나 워크플로우에 쉽게 통합할 수 있습니다.

---

## API 기본 정보

### 공식 API 문서

ABC User Feedback의 **완전한 API 문서**는 다음 링크에서 확인할 수 있습니다:

🔗 **[공식 API 문서 (Redocly)](https://line.github.io/abc-user-feedback/)**

이 문서에서는 모든 엔드포인트의 상세한 스펙, 요청/응답 예제, 그리고 실제 테스트가 가능한 인터페이스를 제공합니다.

### Base URL

```
https://your-domain.com/api
```

### 인증 방식

모든 API 요청은 **API 키 기반 인증**을 사용합니다.

```http
X-API-KEY: your-api-key-here
Content-Type: application/json
```

:::warning 보안 주의사항
API 키는 서버 사이드에서만 사용하고, 클라이언트(브라우저, 모바일 앱)에 노출하지 마세요.
:::

### API 키 발급 방법

1. **관리자 페이지 접속**: ABC User Feedback 관리자 페이지에 로그인
2. **프로젝트 설정**: 해당 프로젝트의 설정 페이지로 이동
3. **API 키 관리**: "API 키 관리" 메뉴에서 새 API 키 생성
4. **키 복사**: 생성된 API 키를 안전한 곳에 저장

:::info API 키 권한
API 키는 프로젝트별로 발급되며, 해당 프로젝트의 데이터에만 접근할 수 있습니다.
:::

---

## 주요 API 엔드포인트 예제

### 1. 피드백 생성

#### 기본 피드백 생성

```javascript
const createFeedback = async (
  projectId,
  channelId,
  message,
  issueNames = []
) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "your-api-key-here",
      },
      body: JSON.stringify({
        message: message,
        issueNames: issueNames,
      }),
    }
  );

  return await response.json();
};

// 사용 예제
const feedback = await createFeedback(1, 1, "결제 오류가 발생했습니다", [
  "결제",
  "오류",
]);
```

### 2. 피드백 조회

#### 채널별 피드백 검색

```javascript
const searchFeedbacks = async (
  projectId,
  channelId,
  searchText,
  limit = 10,
  page = 1
) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "your-api-key-here",
      },
      body: JSON.stringify({
        limit: limit,
        page: page,
        query: {
          searchText: searchText,
          createdAt: {
            gte: "2024-01-01",
            lt: "2024-12-31",
          },
        },
        sort: {
          createdAt: "DESC",
        },
      }),
    }
  );

  return await response.json();
};

// 사용 예제
const feedbacks = await searchFeedbacks(1, 1, "결제", 20, 1);
console.log(
  `총 ${feedbacks.meta.totalItems}개의 피드백 중 ${feedbacks.items.length}개 조회`
);
```

#### 단일 피드백 조회

```javascript
const getFeedbackById = async (projectId, channelId, feedbackId) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks/${feedbackId}`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": "your-api-key-here",
      },
    }
  );

  return await response.json();
};

// 사용 예제
const feedback = await getFeedbackById(1, 1, 123);
console.log("피드백 상세:", feedback);
```

#### 피드백 업데이트

```javascript
const updateFeedback = async (projectId, channelId, feedbackId, updateData) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks/${feedbackId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "your-api-key-here",
      },
      body: JSON.stringify(updateData),
    }
  );

  return await response.json();
};

// 사용 예제
const updatedFeedback = await updateFeedback(1, 1, 123, {
  message: "수정된 피드백 내용",
  issueNames: ["수정된 이슈"],
});
```

#### 피드백 삭제

```javascript
const deleteFeedbacks = async (projectId, channelId, feedbackIds) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "your-api-key-here",
      },
      body: JSON.stringify({
        feedbackIds: feedbackIds,
      }),
    }
  );

  return await response.json();
};

// 사용 예제
const result = await deleteFeedbacks(1, 1, [123, 124, 125]);
console.log("삭제 완료:", result);
```

### 3. 이슈 관리

#### 이슈 생성

```javascript
const createIssue = async (projectId, name, description) => {
  const response = await fetch(`/api/projects/${projectId}/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "your-api-key-here",
    },
    body: JSON.stringify({
      name: name,
      description: description,
    }),
  });

  return await response.json();
};

// 사용 예제
const issue = await createIssue(
  1,
  "결제 오류",
  "사용자가 결제 과정에서 오류를 경험함"
);
```

#### 이슈 검색

```javascript
const searchIssues = async (projectId, query = {}) => {
  const response = await fetch(`/api/projects/${projectId}/issues/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "your-api-key-here",
    },
    body: JSON.stringify({
      limit: 10,
      page: 1,
      query: query,
      sort: {
        createdAt: "DESC",
      },
    }),
  });

  return await response.json();
};

// 사용 예제
const issues = await searchIssues(1, { name: "결제" });
```

#### 이슈 조회

```javascript
const getIssueById = async (projectId, issueId) => {
  const response = await fetch(`/api/projects/${projectId}/issues/${issueId}`, {
    method: "GET",
    headers: {
      "X-API-KEY": "your-api-key-here",
    },
  });

  return await response.json();
};

// 사용 예제
const issue = await getIssueById(1, 123);
console.log("이슈 상세:", issue);
```

#### 이슈 업데이트

```javascript
const updateIssue = async (projectId, issueId, updateData) => {
  const response = await fetch(`/api/projects/${projectId}/issues/${issueId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "your-api-key-here",
    },
    body: JSON.stringify(updateData),
  });

  return await response.json();
};

// 사용 예제
const updatedIssue = await updateIssue(1, 123, {
  name: "수정된 이슈명",
  description: "수정된 이슈 설명",
});
```

#### 이슈 삭제

```javascript
const deleteIssues = async (projectId, issueIds) => {
  const response = await fetch(`/api/projects/${projectId}/issues`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "your-api-key-here",
    },
    body: JSON.stringify({
      issueIds: issueIds,
    }),
  });

  return await response.json();
};

// 사용 예제
const result = await deleteIssues(1, [123, 124, 125]);
console.log("이슈 삭제 완료:", result);
```

#### 피드백에 이슈 추가

```javascript
const addIssueToFeedback = async (
  projectId,
  channelId,
  feedbackId,
  issueId
) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks/${feedbackId}/issues/${issueId}`,
    {
      method: "POST",
      headers: {
        "X-API-KEY": "your-api-key-here",
      },
    }
  );

  return await response.json();
};

// 사용 예제
const result = await addIssueToFeedback(1, 1, 123, 456);
console.log("이슈 추가 완료:", result);
```

#### 피드백에서 이슈 제거

```javascript
const removeIssueFromFeedback = async (
  projectId,
  channelId,
  feedbackId,
  issueId
) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks/${feedbackId}/issues/${issueId}`,
    {
      method: "DELETE",
      headers: {
        "X-API-KEY": "your-api-key-here",
      },
    }
  );

  return await response.json();
};

// 사용 예제
const result = await removeIssueFromFeedback(1, 1, 123, 456);
console.log("이슈 제거 완료:", result);
```

### 4. 프로젝트 및 채널 정보

#### 프로젝트 정보 조회

```javascript
const getProjectInfo = async (projectId) => {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "GET",
    headers: {
      "X-API-KEY": "your-api-key-here",
    },
  });

  return await response.json();
};

// 사용 예제
const project = await getProjectInfo(1);
console.log("프로젝트 정보:", project);
```

#### 채널 필드 조회

```javascript
const getChannelFields = async (projectId, channelId) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/fields`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": "your-api-key-here",
      },
    }
  );

  return await response.json();
};

// 사용 예제
const fields = await getChannelFields(1, 1);
console.log("채널 필드:", fields);
```

---

## Swagger를 통한 API 테스트

ABC User Feedback은 **Swagger UI**를 제공하여 API를 쉽게 테스트하고 이해할 수 있습니다.

### Swagger 접근 방법

**API 서버 주소 + `/docs`** 로 접속합니다:

```
https://your-domain.com/api/docs
```

또는 **ReDoc 형식**으로:

```
https://your-domain.com/api/docs/redoc
```

### Swagger에서 API 키 설정

1. Swagger UI 상단의 **"Authorize"** 버튼 클릭
2. **X-API-KEY** 필드에 발급받은 API 키 입력
3. **"Authorize"** 클릭으로 인증 완료

이후 모든 API 요청에서 자동으로 API 키가 포함되어 테스트할 수 있습니다.

### Swagger 활용 팁

- **"Try it out"** 버튼으로 실제 API 호출 테스트
- **Response body** 섹션에서 실제 응답 데이터 구조 확인
- **Schema** 탭에서 요청/응답 데이터 형식 상세 확인
- **cURL** 명령어 자동 생성으로 CLI 테스트 가능

---

## 에러 처리 및 재시도 로직

### HTTP 상태 코드

| 상태 코드 | 의미           | 처리 방법               |
| --------- | -------------- | ----------------------- |
| **200**   | 성공           | 정상 처리               |
| **400**   | 잘못된 요청    | 요청 데이터 검증        |
| **401**   | 인증 실패      | API 키 확인             |
| **403**   | 권한 없음      | 프로젝트 접근 권한 확인 |
| **404**   | 리소스 없음    | ID 값 확인              |
| **429**   | 요청 한도 초과 | 잠시 후 재시도          |
| **500**   | 서버 오류      | 재시도 또는 지원팀 문의 |

## 응답 데이터 파싱 방법

### 페이지네이션 응답 구조

```json
{
  "meta": {
    "itemCount": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "totalPages": 10,
    "currentPage": 1
  },
  "items": [
    {
      "id": 1,
      "message": "피드백 내용",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "issues": [
        {
          "id": 1,
          "name": "이슈명"
        }
      ]
    }
  ]
}
```

## 보안 및 성능 최적화

### API 키 보안

- **환경 변수 사용**: API 키를 환경 변수로 관리
- **서버 사이드만**: 클라이언트에 API 키 노출 금지
- **키 로테이션**: 정기적인 API 키 교체
- **IP 화이트리스트**: 가능한 경우 특정 IP에서만 접근 허용

### 성능 최적화

- **페이지네이션 활용**: 대량 데이터 조회 시 적절한 limit 설정
- **필요한 필드만 요청**: 쿼리 최적화로 응답 속도 개선
- **캐싱 전략**: 자주 조회하는 데이터는 클라이언트 사이드 캐싱
- **배치 처리**: 여러 요청을 묶어서 처리

## 관련 문서

- [API 키 관리](/docs/01-user-guide/07-settings/02-api-key-management.md) - UI에서 API 키 발급하는 방법
- [이미지 설정](/docs/01-user-guide/07-settings/06-image-setting.md) - 이미지 업로드 API 사용을 위한 설정
- [Webhook 연동](/docs/01-user-guide/07-settings/04-webhook-management.md) - API와 함께 활용할 수 있는 실시간 알림 설정
