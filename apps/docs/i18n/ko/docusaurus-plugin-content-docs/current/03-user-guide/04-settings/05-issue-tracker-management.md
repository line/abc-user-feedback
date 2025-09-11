---
sidebar_position: 5
title: '이슈 트래커 관리'
description: '외부 이슈 트래킹 시스템과 ABC User Feedback을 연동하는 방법에 대한 설명입니다.'
---

# 이슈 트래커 관리

ABC User Feedback과 Jira 이슈 트래킹 시스템을 연동하여 피드백과 개발 프로세스를 효율적으로 연결하는 방법을 안내합니다.

## 개요

이슈 트래커 관리 기능을 통해 ABC User Feedback에서 생성된 이슈를 Jira 시스템과 링크로 연결할 수 있습니다. 이를 통해 기존 개발 워크플로우를 그대로 유지하면서 고객 피드백을 체계적으로 관리할 수 있습니다.

## 이슈 트래커 설정 접근

### 접근 방법

1. 상단 메뉴에서 **Settings** 탭을 클릭합니다.
2. 좌측 메뉴에서 **Issue Tracker Management**를 선택합니다.

### 화면 구성

**상단 안내 패널**

- 이슈 트래킹 시스템 연동에 대한 설명
- 설정 정보 입력 안내

**설정 폼**

- Issue Tracking System 선택
- Base URL 입력
- Project Key 입력
- Preview 영역

## 연동 설정

### Issue Tracking System 선택

**지원되는 시스템**

현재 ABC User Feedback에서 지원하는 이슈 트래킹 시스템:

- **Jira**: Atlassian Jira Cloud 및 Server

**설정 방법**

1. **Issue Tracking System** 드롭다운에서 **Jira**를 선택합니다.
2. 선택 후 Base URL과 Project Key 설정 필드가 표시됩니다.

### Base URL 설정

**목적**

- Jira 시스템의 기본 URL 설정
- 이슈 링크 생성 시 사용되는 도메인 주소

**입력 방법**

1. **Base URL** 필드에 Jira 시스템의 URL을 입력합니다.
2. 형식: `https://example.com` (프로토콜 포함 필수)

**URL 예시**

- **Jira Cloud**: `https://yourcompany.atlassian.net`
- **Jira Server**: `https://jira.yourcompany.com`

### Project Key 설정

**목적**

- Jira에서 사용하는 프로젝트 식별자
- 이슈 번호와 조합하여 완전한 이슈 링크 생성

**입력 방법**

1. **Project Key** 필드에 Jira 프로젝트 키를 입력합니다.
2. Jira 프로젝트 설정에서 확인 가능한 키 사용

**Project Key 예시**

- **Jira**: `PROJ`, `DEV`, `BUG`, `TASK` 등 (대문자 권장)

### Preview 확인

**기능**

- 설정된 정보를 바탕으로 생성될 이슈 링크 미리보기
- 설정이 올바른지 확인하는 용도

**표시 형식**

```
🔗 https://yourcompany.atlassian.net/browse/PROJ-{Number}
```

**확인 사항**

- URL 형식이 Jira 시스템과 일치하는지 확인
- 프로젝트 키가 올바르게 포함되었는지 확인
- 이슈 번호 부분 `{Number}`가 적절히 표시되는지 확인

## 연동 활용

### 이슈 링크 생성

**자동 링크 생성**

1. ABC User Feedback에서 이슈 생성 시 Ticket 필드에 Jira 티켓 ID 입력
2. 시스템이 자동으로 Base URL + Project Key + 티켓 ID 조합
3. 완성된 링크가 이슈 상세 정보에 표시

**링크 형식 예시**

```bash
# Jira 연동 시
Base URL: https://company.atlassian.net
Project Key: PROJ
Ticket ID: 123
→ 생성된 링크: https://company.atlassian.net/browse/PROJ-123
```

**수동 링크 설정**

1. 기존 이슈 편집 시 Ticket 필드에 Jira 티켓 ID 추가
2. 링크 클릭으로 Jira 시스템 직접 이동

:::info 연동 범위
현재 ABC User Feedback과 Jira 간의 연동은 **링크 생성**에 한정됩니다. 이슈 상태나 내용의 실시간 동기화는 지원하지 않으며, 각 시스템에서 독립적으로 관리됩니다.
:::

### 워크플로우 통합

**피드백 → 이슈 → Jira 연동 프로세스**

1. **피드백 수집**: ABC User Feedback에서 고객 피드백 수집
2. **이슈 생성**: 피드백 기반으로 이슈 생성
3. **Jira 연동**: Jira에서 개발 티켓 생성 후 ID를 ABC User Feedback 이슈에 입력
4. **상호 참조**: 링크를 통한 양방향 참조

**개발팀 협업 시나리오**

- **개발자**: Jira에서 티켓 생성 및 작업 관리
- **CS/기획팀**: ABC User Feedback에서 피드백 관리 및 이슈 생성
- **연결점**: 수동으로 티켓 ID를 입력하여 상호 참조
- **추적**: 각 시스템에서 링크를 통해 관련 정보 확인

## 설정 저장 및 적용

### 설정 저장

1. 모든 필드 입력 완료 후 **Save** 버튼을 클릭합니다.
2. 설정이 저장되면 즉시 새로운 이슈부터 적용됩니다.
3. 기존 이슈는 수동으로 Ticket 필드에 Jira 티켓 ID를 추가해야 합니다.

### 설정 테스트

**연동 확인 방법**

1. **테스트 이슈 생성**: 간단한 테스트 이슈 생성
2. **Jira 티켓 생성**: 실제 Jira에서 티켓 생성
3. **ID 연결**: ABC User Feedback 이슈의 Ticket 필드에 Jira 티켓 ID 입력
4. **링크 테스트**: 생성된 링크 클릭하여 Jira 접속 확인

## Jira 연동 상세 설정

**필수 정보**

- **Base URL**: `https://yourcompany.atlassian.net` (Jira Cloud)
- **Project Key**: Jira 프로젝트 키 (예: `PROJ`, `DEV`)

**생성되는 링크 형식**

```
https://yourcompany.atlassian.net/browse/PROJ-123
```

**추가 고려사항**

- Jira 프로젝트 키는 대소문자 구분됨
- 사용자 권한에 따른 링크 접근 가능성 확인 필요
- Jira Server의 경우 `/browse/` 경로 확인 필요

## 연동 제한사항

### 현재 지원 범위

- **링크 생성**: ABC User Feedback 이슈에서 Jira 티켓으로의 링크 제공
- **수동 연결**: 티켓 ID를 직접 입력하여 연결

### 지원하지 않는 기능

- **자동 동기화**: 이슈 상태, 내용, 댓글 등의 실시간 동기화 없음
- **양방향 연동**: Jira에서 ABC User Feedback으로의 자동 업데이트 없음
- **일괄 연결**: 기존 이슈들의 자동 연결 기능 없음

### 관리 방법

1. **수동 관리**: 각 시스템에서 독립적으로 이슈 상태 관리
2. **링크 활용**: 상호 참조를 위해 링크 클릭하여 정보 확인
3. **커뮤니케이션**: 팀 간 상태 변경 사항 수동 공유

## 문제 해결

### 일반적인 문제

**링크가 작동하지 않는 경우**

1. **Base URL 검증**: 프로토콜(https://) 포함 여부 확인
2. **Project Key 확인**: 철자 및 대소문자 정확성 검증
3. **접근 권한**: Jira 시스템 접근 권한 확인
4. **네트워크 연결**: 방화벽 또는 VPN 설정 점검

**Preview가 올바르지 않은 경우**

1. **URL 형식**: 도메인 주소 정확성 재확인
2. **Path 구조**: Jira의 URL 패턴 재검토 (`/browse/` 포함 여부)
3. **특수 문자**: Project Key에 특수 문자 포함 여부 확인

**Jira 연결 실패**

- **서비스 상태**: Jira 시스템의 서비스 상태 확인
- **DNS 해석**: 도메인 주소 해석 문제 여부 점검
- **SSL 인증서**: HTTPS 인증서 유효성 확인

### 설정 변경 시 주의사항

**기존 이슈에 미치는 영향**

- **새로운 설정**: 설정 변경 후 생성되는 이슈부터 적용
- **기존 이슈**: 이전 설정 그대로 유지 (필요시 수동 업데이트)
- **링크 일관성**: 프로젝트 내 이슈들의 링크 형식 통일을 위해 기존 이슈 재검토 권장

**팀 공유 및 소통**

- **변경 공지**: 설정 변경 사항을 팀원들에게 사전 공지
- **링크 형식**: 새로운 링크 형식에 대한 안내
- **북마크 업데이트**: 기존 북마크나 즐겨찾기 업데이트 안내

### 보안 고려사항

**접근 권한 관리**

- Jira 티켓에 접근할 수 있는 권한 확인
- 민감한 정보가 포함된 티켓의 경우 접근 제한 검토
- 팀원별 Jira 계정 및 권한 상태 점검

**데이터 동기화**

- ABC User Feedback과 Jira 간 실시간 데이터 동기화는 지원되지 않음
- 각 시스템에서 독립적으로 이슈 상태 및 내용 관리
- 중요한 변경사항은 팀 간 수동 공유 필요

> **참고**: 이슈 트래커 연동은 현재 Jira와의 링크 생성 기능에 한정됩니다. 실시간 데이터 동기화나 자동 상태 업데이트는 지원하지 않으므로, 각 시스템에서 독립적으로 이슈를 관리하고 필요시 수동으로 정보를 공유해야 합니다.

---

이 문서는 Jira 이슈 트래커 연동의 기본적인 방법을 안내합니다. Jira 설정에 대한 자세한 내용은 Atlassian Jira 공식 문서를 참고하세요.
