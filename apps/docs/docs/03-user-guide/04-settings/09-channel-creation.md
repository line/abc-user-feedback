---
sidebar_position: 9
title: '채널 생성'
description: 'ABC User Feedback에서 피드백 수집을 위한 채널을 생성하는 방법에 대한 설명입니다.'
---

# 채널 생성

ABC User Feedback에서 피드백 수집을 위한 새로운 채널을 생성하는 방법을 단계별로 안내합니다.

## 개요

채널은 피드백을 수집하는 경로나 방법을 구분하는 단위입니다. 각 채널마다 고유한 특성과 목적에 맞는 필드 구조를 설정할 수 있으며, 이를 통해 다양한 소스의 피드백을 체계적으로 관리할 수 있습니다.

## 채널 생성 시작

### 접근 방법

채널 생성은 여러 경로로 시작할 수 있습니다:

#### 1. Settings에서 생성

1. **Settings** 메뉴 접근
2. 좌측 **Channel List** 섹션에서 **Create Channel** 버튼 클릭

#### 2. Feedback 페이지에서 생성

1. **Feedback** 탭 접근
2. "No Channel has been created." 메시지 확인
3. **Create Channel** 버튼 클릭

#### 3. 프로젝트 생성 완료 후

1. 프로젝트 생성 완료 화면에서 **Create Channel** 버튼 클릭

### 생성 과정 개요

채널 생성은 다음 2단계로 구성됩니다:

- **Step 1**: Channel Information (채널 정보)
- **Step 2**: Field Management (필드 관리)

## Step 1: Channel Information

### 채널 기본 정보 설정

#### 채널 설명

Channel Information 단계에서는 다음과 같은 안내가 제공됩니다:

> "Channel is a unit that distinguishes feedback collection paths or collection methods. Please enter information considering the characteristics of the Channel."

#### 필수 입력 필드

**Name** (필수)

- **목적**: 채널을 식별하기 위한 이름
- **입력 방법**: 텍스트 필드에 채널명 입력
- **예시**: "웹 피드백", "앱 리뷰", "고객 지원", "베타 테스트"
- **가이드**: 피드백 수집 경로나 방법을 명확히 표현하는 이름 사용

**Description**

- **목적**: 채널에 대한 상세 설명
- **입력 방법**: 텍스트 영역에 설명 입력
- **내용**: 채널의 용도, 수집 대상, 특징 등을 기술
- **예시**: "웹사이트 문의 폼을 통한 고객 피드백 수집"

**Maximum feedback search period**

- **목적**: 해당 채널에서 피드백을 검색할 수 있는 최대 기간 설정
- **선택 옵션**:
  - **30 Days**: 최근 30일간 피드백만 검색 가능
  - **90 Days**: 최근 90일간 피드백만 검색 가능
  - **180 Days**: 최근 180일간 피드백만 검색 가능
  - **365 Days**: 최근 1년간 피드백만 검색 가능
  - **Entire period**: 모든 기간의 피드백 검색 가능

### 검색 기간 설정 가이드

**선택 기준**

- **데이터 보관 정책**: 조직의 데이터 보관 규정 고려
- **성능 최적화**: 짧은 기간 설정 시 검색 성능 향상
- **비즈니스 요구사항**: 분석 및 리포팅 필요 기간 고려
- **스토리지 비용**: 전체 기간 설정 시 스토리지 비용 증가

**권장 설정**

- **활발한 채널**: 30-90일 (빠른 응답이 필요한 고객 지원 등)
- **분석용 채널**: 180-365일 (트렌드 분석이 중요한 제품 피드백 등)
- **아카이브 채널**: 전체 기간 (장기 보관이 필요한 중요 피드백 등)

### 단계 완료

1. 모든 필수 정보 입력 완료
2. **Next** 버튼을 클릭하여 다음 단계로 이동
3. "This is a required input step. Please enter the required information." 안내 확인

## Step 2: Field Management

### 필드 관리 개요

Field Management 단계에서는 채널에서 수집할 피드백의 데이터 구조를 정의합니다.

#### 필드 관리 설명

> "You can define feedback data to be collected in the Channel by Field units. Please add Fields considering the data type and properties."

### 기본 시스템 필드

채널 생성 시 다음 시스템 필드들이 자동으로 포함됩니다:

#### id

- **Display Name**: ID
- **Format**: number
- **Property**: Read Only
- **Status**: ACTIVE
- **용도**: 피드백 고유 식별번호

#### createdAt

- **Display Name**: Created
- **Format**: date
- **Property**: Read Only
- **Status**: ACTIVE
- **용도**: 피드백 생성일시

#### updatedAt

- **Display Name**: Updated
- **Format**: date
- **Property**: Read Only
- **Status**: ACTIVE
- **용도**: 피드백 수정일시

#### issues

- **Display Name**: Issue
- **Format**: multiSelect
- **Property**: Editable
- **Status**: ACTIVE
- **용도**: 연결된 이슈 관리

### 커스텀 필드 추가

#### Add Field 기능

1. **+ Add Field** 버튼을 클릭하여 새 필드 추가
2. 필드 정보 입력:
   - **Key**: 필드 고유 식별자
   - **Display Name**: 사용자 인터페이스 표시명
   - **Format**: 데이터 형식 (text, number, date, select 등)
   - **Property**: 편집 권한 (Read Only/Editable)
   - **Status**: 활성화 상태 (Active/Inactive)

#### 필드 형식 옵션

- **text**: 일반 텍스트 입력
- **keyword**: 키워드 태그
- **number**: 숫자 입력
- **date**: 날짜 선택
- **select**: 단일 선택
- **multiSelect**: 다중 선택
- **aiField**: AI 분석 필드

### Preview 기능

#### 필드 구성 미리보기

1. **👁️ Preview** 버튼을 클릭하여 현재 필드 설정 확인
2. 실제 피드백 테이블에서 어떻게 표시되는지 미리보기
3. 필드 순서 및 레이아웃 검증

### 테이블 구성

필드 목록은 다음 컬럼으로 표시됩니다:

- **Key**: 필드 식별자
- **Display Name**: 표시명
- **Format**: 데이터 형식
- **Option**: 추가 옵션 설정
- **Property**: 편집 권한
- **Status**: 활성화 상태
- **Description**: 필드 설명
- **Created**: 생성일시

### 단계 완료

1. 필요한 필드 추가 및 설정 완료 (선택사항)
2. **Complete** 버튼으로 채널 생성 완료
3. **Previous** 버튼으로 이전 단계 돌아가기
4. "This is an optional input step. You can enter it again later in the settings menu." 안내 확인

## 채널 생성 후 관리

### 채널 목록 확인

채널 생성 완료 후:

1. Settings > Channel List에서 생성된 채널 확인
2. 채널명 클릭으로 상세 설정 접근
3. 추가 설정 및 관리 가능

### 추가 설정 메뉴

생성된 채널에서 접근 가능한 설정들:

- **Channel Information**: 기본 정보 수정
- **Field Management**: 필드 추가/수정/삭제
- **Image Management**: 이미지 첨부 설정

## 채널 유형별 설정 가이드

### 웹 피드백 채널

**추천 설정**

- Name: "Web Feedback"
- Description: "웹사이트 문의 폼 및 피드백 위젯을 통한 수집"
- 검색 기간: 90 Days

**추가 필드 예시**

- message (text): 피드백 내용
- user_email (text): 사용자 이메일
- page_url (text): 피드백 발생 페이지
- category (select): 피드백 카테고리

### 앱 리뷰 채널

**추천 설정**

- Name: "App Store Review"
- Description: "앱스토어 리뷰 자동 수집"
- 검색 기간: 180 Days

**추가 필드 예시**

- review_text (text): 리뷰 내용
- rating (number): 평점
- store_type (select): 스토어 구분 (iOS/Android)
- app_version (text): 앱 버전

### 고객 지원 채널

**추천 설정**

- Name: "Customer Support"
- Description: "고객 지원팀을 통한 피드백 수집"
- 검색 기간: 365 Days

**추가 필드 예시**

- customer_id (text): 고객 ID
- support_ticket (text): 지원 티켓 번호
- priority (select): 우선순위
- resolution_status (select): 해결 상태

## 모범 사례

### 채널 설계 원칙

**명확한 분리**

- 피드백 소스별 채널 분리
- 목적별 채널 구분 (버그 신고, 기능 요청, 일반 의견 등)
- 환경별 분리 (개발, 스테이징, 운영)

**일관된 명명 규칙**

- 조직 내 일관된 채널명 사용
- 목적과 소스를 명확히 표현
- 약어보다는 명확한 용어 사용

### 필드 설계

**필수 필드 식별**

- 분석에 필요한 핵심 데이터 식별
- 과도한 필드로 인한 복잡성 방지
- 향후 확장 가능성 고려

**데이터 타입 선택**

- 분석 목적에 맞는 적절한 형식 선택
- 검색 및 필터링 요구사항 고려
- 일관된 데이터 형식 유지

### 성능 고려사항

**검색 기간 최적화**

- 필요 이상으로 긴 기간 설정 방지
- 정기적인 데이터 아카이빙 계획
- 성능 모니터링 및 조정

**필드 수 관리**

- 필요한 필드만 Active 상태 유지
- 사용하지 않는 필드는 Inactive 처리
- 정기적인 필드 사용량 검토

## 주의사항

### 채널 생성 후 변경

- **필드 구조 변경**: 기존 데이터와의 호환성 고려
- **검색 기간 단축**: 기존 데이터 접근 불가능해질 수 있음
- **필드 삭제**: 관련 데이터 완전 삭제되므로 신중 결정

### 데이터 일관성

- **API 연동**: 필드 구조 변경 시 연동 시스템 업데이트 필요
- **외부 연결**: 웹훅이나 외부 도구 설정 검토
- **팀 공유**: 채널 구조 변경 시 팀원들에게 공지

> **참고**: 채널은 피드백 수집의 기본 단위이므로 초기 설계를 신중하게 진행하는 것이 중요합니다. 필요에 따라 단계적으로 기능을 추가하고 최적화하는 것을 권장합니다.

---

이 문서는 채널 생성의 기본적인 방법을 안내합니다. 채널별 상세 설정에 대한 내용은 해당 관리 문서를 참고하세요.
