---
sidebar_position: 4
title: 'AI 이슈 추천'
description: 'AI 기반 이슈 추천 기능을 설정하고 활용하는 방법에 대한 설명입니다.'
---

# AI 이슈 추천

ABC User Feedback의 AI 기반 이슈 추천 기능을 설정하고 활용하는 방법을 안내합니다.

## 개요

AI Issue Recommendation 기능은 피드백 내용을 분석하여 관련성이 높은 기존 이슈를 자동으로 추천하거나, 새로운 이슈 생성을 제안하는 지능형 기능입니다. 이를 통해 피드백 관리의 효율성을 높이고 이슈 분류의 일관성을 보장할 수 있습니다.

## AI 이슈 추천 접근

### 접근 방법

1. 상단 메뉴에서 **Settings** 탭을 클릭합니다.
2. 좌측 메뉴에서 **Generative AI Integration**을 선택합니다.
3. **AI Issue Recommendation** 탭을 클릭합니다.

### 화면 구성

**안내 메시지**

- AI 이슈 추천 기능 설정에 대한 설명
- 채널별 상세 설정 후 기능 사용 가능

**추천 설정 카드**

- **Create New**: 새로운 추천 설정 생성

## 추천 설정 생성

### Create New 설정

1. **Create New** 카드를 클릭합니다.
2. **AI Issue Recommend Details** 화면으로 이동합니다.

### Configuration 섹션

#### 기본 설정

**Channel** (필수)

- 이슈 추천을 적용할 채널 선택
- 드롭다운에서 사용 가능한 채널 목록 확인
- 예: Web Feedback, App Feedback, Survey Feedback

**Target Field** (필수)

- AI가 분석할 피드백 필드 선택
- 일반적으로 메시지 본문이나 주요 텍스트 필드
- 드롭다운에서 해당 채널의 필드 목록 확인

**Prompt**

- AI에게 전달할 이슈 추천 지시사항
- 추천 방식과 기준을 정의
- 플레이스홀더: "If there are additional instructions to request from the Generative AI, please enter them."

#### Enable/Disable 설정

**Enable/Disable 토글**

- AI 이슈 추천 기능의 활성화/비활성화
- "Set whether to use the AI issue recommendation feature."
- 활성화 시 해당 채널의 피드백에 대해 자동 추천 실행

### Advanced Configuration

#### 모델 설정

**Model**

- 사용할 AI 모델 선택 (예: gpt-4o)
- 추천 정확도와 처리 속도를 고려하여 선택

**Temperature**

- AI 추천의 창의성 조절
- **Precise**: 일관되고 정확한 추천
- **Creative**: 다양하고 유연한 추천
- 슬라이더로 세밀한 조정

#### 데이터 참조량 설정

**Data Reference Amount**

- AI가 참조할 기존 이슈 데이터의 양
- **Low**: 최근 이슈만 참조 (빠른 처리)
- **High**: 많은 이슈 데이터 참조 (정확한 추천)
- 슬라이더로 참조량 조정

## Playground 테스트

### Test Data (Input)

**데이터 추가**

- **Add Data** 버튼으로 테스트 피드백 추가
- 실제 피드백 예시로 추천 로직 테스트
- 다양한 유형의 피드백으로 검증

**뷰 옵션**

- **Horizontal View**: 가로 배치
- **Vertical View**: 세로 배치

### AI Result (Output)

**추천 실행**

- **AI test execution** 버튼으로 테스트 실행
- 설정된 추천 로직의 실제 결과 미리보기
- 추천 정확도와 관련성 검증

## 추천 기능 활용

### 피드백에서 이슈 추천 확인

AI 이슈 추천이 활성화된 채널에서는 피드백 처리 시 다음과 같이 활용할 수 있습니다:

#### 자동 추천 실행

1. **피드백 생성 시 자동 실행**:

   - 새 피드백이 등록되면 AI가 자동으로 관련 이슈 분석
   - Target Field의 내용을 바탕으로 추천 수행

2. **수동 추천 실행**:
   - 피드백 상세 화면에서 **Run AI** 버튼 클릭
   - 즉시 이슈 추천 결과 확인

#### 추천 결과 활용

**추천 이슈 확인**

- Issue 컬럼의 **+** 버튼 클릭
- "I will recommend issues for the feedback." 메시지 확인
- **AI Recommend** 섹션에서 추천된 이슈 목록 확인

**추천 이슈 선택**

- 추천된 이슈 중 적절한 것을 선택
- **Retry** 버튼으로 다른 추천 요청
- Issue List에서 기존 이슈 직접 선택도 가능

**추천 이슈 적용**

- 선택한 추천 이슈가 피드백에 연결
- 이슈 관리에서 피드백 연결 상태 확인

## 추천 설정 최적화

### 프롬프트 작성 가이드

#### 효과적인 추천 프롬프트

```
Based on the feedback content, recommend the most relevant existing issues.
Consider the following criteria:
1. Content similarity and topic relevance
2. Issue priority and current status
3. Recent activity and user impact
Provide up to 3 most relevant issues with brief reasoning.
```

#### 추천 기준 설정

**유사도 기반 추천**

- 텍스트 유사성 분석
- 키워드 매칭
- 의미적 연관성

**우선순위 기반 추천**

- 이슈 중요도 고려
- 활성 상태 이슈 우선
- 사용자 영향도 반영

### 설정 최적화 방법

#### Data Reference Amount 조정

**Low 설정 (빠른 처리)**

- 최근 생성된 이슈만 참조
- 빠른 응답 시간
- 메모리 사용량 적음

**High 설정 (정확한 추천)**

- 전체 이슈 데이터베이스 참조
- 높은 추천 정확도
- 처리 시간 증가

#### Temperature 조정

**Precise (낮은 값)**

- 명확한 일치 조건의 이슈만 추천
- 보수적이고 안전한 추천
- 거짓 양성 최소화

**Creative (높은 값)**

- 연관성이 있는 다양한 이슈 추천
- 창의적 연결 고려
- 새로운 관점의 이슈 발견

## 추천 품질 개선

### 지속적인 모니터링

**추천 정확도 평가**

- 사용자가 선택한 추천 이슈 비율 추적
- 추천되지 않은 이슈 선택 패턴 분석
- 피드백 기반 프롬프트 개선

**성능 최적화**

- 응답 시간 모니터링
- 토큰 사용량 추적
- 사용자 만족도 조사

### 학습 및 개선

**프롬프트 반복 개선**

- 추천 결과 분석을 통한 프롬프트 수정
- A/B 테스트를 통한 최적 설정 발견
- 도메인별 특화 프롬프트 개발

**데이터 품질 관리**

- 이슈 제목과 설명의 일관성 유지
- 중복 이슈 정리 및 통합
- 태그 체계 표준화

## 문제 해결

### 추천 품질 문제

**관련성 낮은 추천**

- 프롬프트 명확성 개선
- Data Reference Amount 조정
- Temperature 값 낮춤

**추천 결과 부족**

- 기존 이슈 데이터 충분성 확인
- 프롬프트 포괄성 증대
- Temperature 값 증가

### 성능 문제

**응답 시간 지연**

- Data Reference Amount 감소
- 더 빠른 모델로 변경
- 프롬프트 길이 최적화

**토큰 사용량 과다**

- 참조 데이터양 조절
- 프롬프트 간소화
- 배치 처리 고려

> **참고**: AI 이슈 추천은 피드백 처리 효율성을 크게 향상시킬 수 있는 강력한 기능입니다. 초기 설정 후 지속적인 모니터링과 개선을 통해 최적의 추천 품질을 달성하시기 바랍니다.

---

이 문서는 AI 이슈 추천의 기본적인 설정 방법을 안내합니다. 생성형 AI 연동의 전체적인 활용 방법은 다른 AI 관련 문서들을 함께 참고하세요.
