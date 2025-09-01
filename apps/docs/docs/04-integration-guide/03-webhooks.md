---
sidebar_position: 3
title: '웹훅 연동'
description: 'ABC User Feedback의 웹훅(Webhook) 기능 사용 방법을 안내합니다.'
---

# 웹훅 연동

이 페이지는 ABC User Feedback의 웹훅(Webhook) 기능에 대해 설명합니다.

## 개요

ABC User Feedback은 다양한 이벤트 발생 시 외부 시스템으로 실시간 알림을 전송할 수 있도록 웹훅 기능을 제공합니다. 이를 통해 번역, 감정 분석, 티켓 생성 등의 자동화를 구현할 수 있습니다.

## 주요 내용

### 웹훅 설정 방법

1. 프로젝트 설정 페이지로 이동합니다.
2. 웹훅 URL과 구독할 이벤트를 설정합니다.
3. 저장 후, 이벤트 발생 시 설정된 URL로 POST 요청이 전송됩니다.

> 웹훅 리스너 서버는 JSON POST 요청을 수신할 수 있어야 합니다.

### 지원하는 이벤트 및 요청 본문 예시

#### FEEDBACK_CREATION

새 피드백이 생성될 때 발생합니다.

```json
{
  "event": "FEEDBACK_CREATION",
  "data": { ... }
}
```

#### ISSUE_ADDITION

피드백에 이슈가 추가될 때 발생합니다.

```json
{
  "event": "ISSUE_ADDITION",
  "data": { ... }
}
```

#### ISSUE_CREATION

새 이슈가 생성될 때 발생합니다.

```json
{
  "event": "ISSUE_CREATION",
  "data": { ... }
}
```

#### ISSUE_STATUS_CHANGE

이슈 상태가 변경될 때 발생합니다.

```json
{
  "event": "ISSUE_STATUS_CHANGE",
  "data": { ... }
}
```

### 웹훅 처리 가이드

- 수신 서버는 HTTP POST 요청을 처리해야 합니다.
- JSON Payload를 파싱하고, 이벤트 종류에 따라 적절한 후처리를 수행할 수 있습니다.
- 실패 시 재시도 로직은 수신 서버에서 구현해야 합니다.

## 추가 정보

- 웹훅과 ABC User Feedback API를 조합하여 피드백 자동 분석, 이슈 자동 업데이트 등 다양한 확장이 가능합니다.
- 자세한 이벤트 별 스펙과 예시는 `/docs` 경로의 Swagger 문서를 참고하세요.
