---
sidebar_position: 4
title: '웹훅 연동'
description: '웹훅을 활용하여 외부 시스템과 실시간 연동하는 방법과 구현 예시를 안내합니다.'
---

# 웹훅 연동

웹훅으로 ABC User Feedback에서 발생하는 주요 이벤트를 실시간으로 외부 시스템에 전달할 수 있습니다. Slack 알림, 자동화 워크플로우, 커스텀 분석 시스템 등과 연동할 수 있습니다.

---

## 지원되는 이벤트 타입

ABC User Feedback에서 지원하는 이벤트는 다음과 같습니다:

### 1. FEEDBACK_CREATION

새로운 피드백이 생성되었을 때 발생합니다.

**요청 헤더:**

```
Content-Type: application/json
x-webhook-token: your-secret-token
```

**페이로드 예시:**

```json
{
  "event": "FEEDBACK_CREATION",
  "data": {
    "feedback": {
      "id": 123,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "message": "사용자 피드백 내용",
      "userEmail": "user@example.com",
      "issues": [
        {
          "id": 456,
          "createdAt": "2024-01-15T10:30:00.000Z",
          "updatedAt": "2024-01-15T10:30:00.000Z",
          "name": "버그 리포트",
          "description": "이슈 설명",
          "status": "OPEN",
          "externalIssueId": "EXT-123",
          "feedbackCount": 5
        }
      ]
    },
    "channel": {
      "id": 1,
      "name": "웹사이트 피드백"
    },
    "project": {
      "id": 1,
      "name": "My Project"
    }
  }
}
```

### 2. ISSUE_CREATION

새로운 이슈가 생성되었을 때 발생합니다.

**페이로드 예시:**

```json
{
  "event": "ISSUE_CREATION",
  "data": {
    "issue": {
      "id": 789,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z",
      "name": "새로운 이슈",
      "description": "이슈 설명",
      "status": "OPEN",
      "externalIssueId": "EXT-789",
      "feedbackCount": 0
    },
    "project": {
      "id": 1,
      "name": "My Project"
    }
  }
}
```

### 3. ISSUE_STATUS_CHANGE

이슈 상태가 변경되었을 때 발생합니다.

**페이로드 예시:**

```json
{
  "event": "ISSUE_STATUS_CHANGE",
  "data": {
    "issue": {
      "id": 789,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z",
      "name": "이슈 이름",
      "description": "이슈 설명",
      "status": "IN_PROGRESS",
      "externalIssueId": "EXT-789",
      "feedbackCount": 3
    },
    "project": {
      "id": 1,
      "name": "My Project"
    },
    "previousStatus": "OPEN"
  }
}
```

### 4. ISSUE_ADDITION

피드백에 이슈가 추가되었을 때 발생합니다.

**페이로드 예시:**

```json
{
  "event": "ISSUE_ADDITION",
  "data": {
    "feedback": {
      "id": 123,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "message": "사용자 피드백 내용",
      "issues": [
        {
          "id": 456,
          "name": "기존 이슈",
          "status": "OPEN"
        },
        {
          "id": 789,
          "name": "새로 추가된 이슈",
          "status": "OPEN"
        }
      ]
    },
    "channel": {
      "id": 1,
      "name": "웹사이트 피드백"
    },
    "project": {
      "id": 1,
      "name": "My Project"
    },
    "addedIssue": {
      "id": 789,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z",
      "name": "새로 추가된 이슈",
      "description": "이슈 설명",
      "status": "OPEN",
      "externalIssueId": "EXT-456",
      "feedbackCount": 1
    }
  }
}
```

---

## 웹훅 수신 서버 구현

웹훅을 받기 위한 HTTP 서버를 구현해야 합니다. 서버는 다음 요구사항을 만족해야 합니다:

### 기본 요구사항

1. **HTTP POST 요청 처리**: 웹훅은 HTTP POST로 전송됩니다
2. **JSON 페이로드 파싱**: 요청 본문은 JSON 형식입니다
3. **200 응답 코드 반환**: 처리 성공 시 반드시 200 상태 코드로 응답

### 구현 예시 (Node.js/Express)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  const token = req.headers['x-webhook-token'];

  // 토큰 검증
  if (token !== 'your-secret-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 이벤트 처리
  switch (event) {
    case 'FEEDBACK_CREATION':
      console.log('새 피드백 생성:', data.feedback);
      // 피드백 처리 로직
      break;
    case 'ISSUE_CREATION':
      console.log('새 이슈 생성:', data.issue);
      // 이슈 처리 로직
      break;
    case 'ISSUE_STATUS_CHANGE':
      console.log(
        '이슈 상태 변경:',
        data.issue,
        '이전 상태:',
        data.previousStatus,
      );
      // 상태 변경 처리 로직
      break;
    case 'ISSUE_ADDITION':
      console.log('이슈 추가:', data.addedIssue);
      // 이슈 추가 처리 로직
      break;
  }

  res.status(200).json({ success: true });
});

app.listen(3000, () => {
  console.log('웹훅 리스너 서버가 포트 3000에서 실행 중입니다.');
});
```

---

## 보안 및 재시도 정책

### 보안 고려사항

- **토큰 검증**: `x-webhook-token` 헤더를 통해 요청을 검증합니다
- **HTTPS 사용**: 프로덕션 환경에서는 반드시 HTTPS를 사용하세요

### 재시도 정책

- **자동 재시도**: ABC User Feedback은 웹훅 전송 실패 시 최대 3회까지 자동 재시도합니다
- **재시도 간격**: 각 재시도는 3초 후에 실행됩니다

### 에러 처리

- **4xx 에러**: 클라이언트 오류로 간주하여 재시도하지 않습니다
- **5xx 에러**: 서버 오류로 간주하여 재시도합니다
- **네트워크 오류**: 연결 실패 시 재시도합니다

---

## 활용 사례

### 1. 자동 번역

```javascript
// FEEDBACK_CREATION 이벤트를 받아서 자동 번역
if (event === 'FEEDBACK_CREATION') {
  const translatedMessage = await translateText(data.feedback.message);
  // 번역된 내용을 피드백에 업데이트
  await updateFeedback(data.feedback.id, { translatedMessage });
}
```

### 2. 외부 티켓 시스템 연동

```javascript
// ISSUE_CREATION 이벤트를 받아서 외부 시스템에 티켓 생성
if (event === 'ISSUE_CREATION') {
  const ticketId = await createExternalTicket({
    title: data.issue.name,
    description: data.issue.description,
    priority: 'medium',
  });
  // 외부 티켓 ID를 이슈에 저장
  await updateIssue(data.issue.id, { externalIssueId: ticketId });
}
```

### 3. 알림 시스템 연동

```javascript
// ISSUE_STATUS_CHANGE 이벤트를 받아서 팀에 알림
if (event === 'ISSUE_STATUS_CHANGE') {
  await sendSlackNotification({
    channel: '#feedback-alerts',
    message: `이슈 "${data.issue.name}"의 상태가 ${data.previousStatus}에서 ${data.issue.status}로 변경되었습니다.`,
  });
}
```

---

## 관련 문서

- [웹훅 관리](/docs/01-user-guide/07-settings/04-webhook-management.md) - UI에서 웹훅 설정하는 방법
- [API 연동](./02-api-integration.md) - 웹훅과 함께 사용할 수 있는 API 활용
- [이슈 관리](/docs/01-user-guide/05-issue-management.md) - 이슈 상태 변경 이벤트 이해
