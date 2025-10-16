---
sidebar_position: 4
title: '웹훅 설정'
description: '외부 시스템과 자동 연동을 위해 웹훅을 설정하고 이벤트 발생 시 알림을 전송하는 방법을 설명합니다.'
---

# 웹훅 설정

웹훅은 ABC User Feedback에서 **특정 이벤트 발생 시 외부 시스템으로 자동 알림**을 전송하는 기능입니다. 피드백 생성, 이슈 상태 변경 등의 이벤트를 실시간으로 외부 서비스(Slack, Discord, 자체 서버 등)에 전달할 수 있습니다. 자세한 연동 가이드는 [웹훅 연동](/docs/02-developer-guide/04-webhook-integration.md) 문서를 참고하세요.

---

## 접근 방법

1. 상단 메뉴에서 **Settings** 클릭
2. 좌측 메뉴에서 **Webhook Integration** 선택

---

## Webhook Integration 화면 개요

웹훅 연동 화면은 다음처럼 구성됩니다:

### 웹훅 목록 테이블 구성

| 컬럼              | 설명                             |
| ----------------- | -------------------------------- |
| **On/Off**        | 웹훅 활성화/비활성화 토글 스위치 |
| **Name**          | 웹훅 이름                        |
| **URL**           | 알림을 받을 외부 엔드포인트      |
| **Event Trigger** | 구독 중인 이벤트 트리거          |
| **Created**       | 웹훅 생성일시                    |

---

## 새 웹훅 생성하기

### 1. 웹훅 등록 시작

우측 상단의 **Register Webhook** 버튼을 클릭하면 웹훅 등록 모달이 열립니다.

### 2. 기본 정보 입력

#### 필수 입력 항목

| 항목     | 설명                             |
| -------- | -------------------------------- |
| **Name** | 웹훅 식별을 위한 이름            |
| **URL**  | HTTP POST 요청을 받을 엔드포인트 |

### 3. 토큰 설정 (선택사항)

**Token** 필드에서 인증을 위한 토큰을 설정할 수 있습니다:

- **Generate** 버튼을 클릭하여 자동 생성
- 또는 직접 토큰 값 입력

### 4. Event Trigger 선택

구독할 이벤트를 채널별로 선택할 수 있습니다:

#### 지원되는 이벤트 타입

각 채널(VOC, Review, Survey, VOC Test)에 대해 다음 이벤트를 선택할 수 있습니다:

| 이벤트 타입             | 설명                          |
| ----------------------- | ----------------------------- |
| **Feedback Creation**   | 새 피드백이 등록되었을 때     |
| **Issue Registration**  | 새 이슈가 생성되었을 때       |
| **Issue Status Change** | 이슈 상태가 변경되었을 때     |
| **Issue Creation**      | 이슈가 피드백에 연결되었을 때 |

### 5. 웹훅 저장

모든 정보를 입력한 후:

1. **OK** 버튼을 클릭하여 웹훅 생성
2. **Cancel** 버튼으로 취소 가능

---

## 웹훅 상태 관리

### 활성화/비활성화 전환

웹훅 목록에서 각 웹훅의 **On/Off** 컬럼에 있는 토글 스위치를 클릭하여 상태를 변경할 수 있습니다:

- **On (활성화)**: 이벤트 발생 시 실시간 전송
- **Off (비활성화)**: 웹훅은 유지되지만 전송 중단

### 임시 비활성화 시나리오

- 외부 서버 점검 중일 때
- 웹훅 URL 변경 작업 중일 때
- 스팸성 알림 방지가 필요할 때

---

## 웹훅 편집 및 삭제

### 웹훅 편집

웹훅 목록에서 수정하려는 웹훅을 클릭하면 편집 모달이 열립니다:

#### 편집 가능한 항목

- 웹훅 이름
- Target URL 변경
- 토큰 값 수정
- 이벤트 타입 추가/제거

### 웹훅 삭제

웹훅을 완전히 제거하려면:

1. 편집 모달에서 삭제 옵션 선택
2. 또는 목록에서 직접 삭제 버튼 클릭 (UI에 삭제 버튼이 있는 경우)

---

## 웹훅 테스트 및 검증

### 수동 검증 방법

1. **피드백 생성 테스트**:
   - 테스트 피드백을 등록하여 `Feedback Creation` 이벤트 확인
2. **이슈 관리 테스트**:
   - 이슈를 생성하거나 상태를 변경하여 관련 이벤트 확인
3. **외부 서비스 확인**:
   - Slack, Discord 등에서 메시지 수신 여부 확인

---

## 일반적인 연동 예시

### Slack 웹훅 설정

```
Name: Slack 알림
URL: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXX
Events: Feedback Creation, Issue Registration (모든 채널)
```

### Discord 웹훅 설정

```
Name: Discord 개발팀 알림
URL: https://discord.com/api/webhooks/123456789/abcdefghijk
Events: Issue Status Change (VOC 채널만)
```

### 커스텀 서버 연동

```
Name: 내부 분석 시스템
URL: https://api.yourcompany.com/webhooks/feedback
Token: your-generated-token
Events: 모든 이벤트 (전체 채널)
```

---

## 관련 문서

- [Webhook 개발자 가이드](/docs/02-developer-guide/04-webhook-integration.md) - 웹훅 수신 서버 구현 방법
- [API 키 관리](./02-api-key-management.md) - API 키 기반 인증 설정
