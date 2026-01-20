---
sidebar_position: 5
title: 'AI 설정'
description: '생성형 AI 기능을 사용하기 위한 기본 설정 및 연동 방법을 설명합니다.'
---

# AI 설정

ABC User Feedback에서 **생성형 AI 기능**을 사용하려면 먼저 AI 제공자와의 연동을 설정해야 합니다.  
AI 설정을 완료하면 **AI 필드 템플릿**, **AI 이슈 추천**, **AI 사용량 모니터링** 등의 모든 기능을 활용할 수 있습니다.

---

## 접근 방법

1. 상단 메뉴에서 **Settings** 클릭
2. 좌측 메뉴에서 **Generative AI Integration** 선택
3. 상단 탭에서 **AI Setting** 클릭

---

## AI 제공자 선택 및 설정

![ai-setting.png](/img/ai/ai-setting.png)

### 1. 제공자 선택

현재 지원되는 AI 제공자 OpenAI, Google Gemini 중 하나를 선택합니다:

### 2. API 키 입력

선택한 AI 제공자에서 발급받은 API 키를 입력합니다.

### 3. Base URL 설정 (선택사항)

대부분의 경우 **비워두면 기본값**이 자동으로 사용됩니다.

특별한 엔드포인트나 프록시 서버를 사용하는 경우에만 입력하세요.

### 4. System Prompt 설정 (선택사항)

AI가 모든 요청을 처리할 때 참고할 **기본 지시사항**을 설정할 수 있습니다.

조직의 톤앤매너나 특별한 요구사항이 있을 때 활용하세요.

### 5. 설정 저장

모든 정보를 입력한 후 우측 상단의 **Save** 버튼을 클릭합니다.

---

## AI 사용량 모니터링

![ai-usage.png](/img/ai/ai-usage.png)

**AI Usage** 탭에서 AI 기능 사용량과 비용을 모니터링할 수 있습니다.

### 사용량 대시보드

확인할 수 있는 정보:

- **일별/월별 API 호출 수**
- **토큰 사용량** (입력/출력 별도)
- **기능별 사용 분포** (AI 필드 vs 이슈 추천)

---

## AI 필드 템플릿 관리

![ai-field-template.png](/img/ai/ai-field-template.png)

AI 설정을 완료한 후, **AI Field Template** 탭에서 피드백 자동 분석 템플릿을 관리할 수 있습니다.

### 기본 제공 템플릿

시스템에서 제공하는 기본 템플릿들:

| 템플릿                 | 설명                       | 활용 예시               |
| ---------------------- | -------------------------- | ----------------------- |
| **Feedback Summary**   | 피드백을 1문장으로 요약    | 긴 피드백의 핵심 파악   |
| **Sentiment Analysis** | 감정 분석 (긍정/부정/중립) | 고객 만족도 추세 분석   |
| **Translation**        | 피드백을 영어로 번역       | 다국어 피드백 통합 분석 |
| **Keyword Extraction** | 핵심 키워드 2-3개 추출     | 이슈 카테고리 자동 태깅 |

### 커스텀 템플릿 생성

![ai-field-template-create.png](/img/ai/ai-field-template-create.png)

1. **Create New** 카드 클릭
2. 템플릿 정보 입력

| 항목            | 설명                  |
| --------------- | --------------------- |
| **Title**       | 템플릿 이름           |
| **Prompt**      | AI에게 줄 지시 문장   |
| **Model**       | 사용할 AI 모델 선택   |
| **Temperature** | 창의성 조절 (0.0~1.0) |

3. Playground에서 테스트

- "Add Data" 버튼으로 테스트 피드백 입력
- "AI test execution" 클릭으로 결과 확인

### 템플릿 편집 및 삭제

- 템플릿 카드 클릭 → 편집
- **Delete Template** 버튼으로 삭제
- 삭제 시 해당 템플릿을 사용하는 AI 필드에 영향을 줄 수 있음

---

## AI 필드를 채널에 적용하기

AI 필드 템플릿을 생성한 후, 실제 채널의 필드로 적용해야 피드백에서 AI 분석 결과를 확인할 수 있습니다.

### 1. Field Management에서 AI 필드 추가

**Settings > Channel List > [채널 선택] > Field Management**에서 AI 필드를 추가합니다.

#### AI 필드 설정 항목

| 항목                    | 설명                       | 필수 여부 |
| ----------------------- | -------------------------- | --------- |
| **Key**                 | 필드 고유 식별자           | 필수      |
| **Display Name**        | UI에 표시될 이름           | 필수      |
| **Format**              | `aiField` 선택             | 필수      |
| **Template**            | 생성한 AI 필드 템플릿 선택 | 필수      |
| **Target Field**        | 분석 대상이 될 텍스트 필드 | 필수      |
| **Property**            | Editable 또는 Read Only    | 필수      |
| **AI Field Automation** | 자동 실행 여부             | 선택      |

#### 설정 예시

```
Key: sentiment_analysis
Display Name: 감정 분석
Format: aiField
Template: Feedback Sentiment Analysis
Target Field: message
Property: Read Only
AI Field Automation: ON (자동 실행)
```

### 2. Template 연결 및 Target Field 설정

**Template** 드롭다운에서 이전에 생성한 AI 필드 템플릿을 선택합니다.

**Target Field**는 AI 분석의 대상이 될 필드들을 지정합니다

### 3. AI Field Automation 설정

**AI Field Automation** 토글을 통해 실행 방식을 선택합니다:

- **ON (자동 실행)**: 새 피드백 등록 시 자동으로 AI 분석 실행
- **OFF (수동 실행)**: 사용자가 수동으로 실행 버튼을 클릭해야 함

## 피드백에서 AI 분석 결과 확인

AI 필드 설정이 완료되면 피드백 목록과 상세 화면에서 AI 분석 결과를 확인할 수 있습니다.

### 피드백 목록에서 확인

피드백 테이블에 AI 필드가 새로운 컬럼으로 추가됩니다:

- **Summary**: AI가 생성한 요약
- **Classification**: AI 분류 결과
- **Korean**: 번역 결과 등

### 피드백 상세 화면에서 확인

피드백 상세 보기 패널에서 더 자세한 AI 분석 결과를 확인할 수 있습니다:

1. 피드백 행 클릭 → 우측 상세 패널 열림
2. AI 필드별 분석 결과 확인
3. 각 AI 필드마다 분석 결과와 함께 표시

## AI 분석 수동 실행

피드백 상세 화면에서 수동으로 AI 분석을 실행할 수 있습니다.

### Run AI 버튼 사용

1. 피드백 상세 화면에서 **Run AI** 버튼 클릭
2. AI 분석이 실행되고 결과가 해당 필드에 자동 입력됨
3. 분석 완료 후 결과 즉시 확인 가능

### 수동 실행 활용 시나리오

- **비용 절약**: 필요한 피드백만 선별하여 AI 분석
- **성능 확인**: 새로운 템플릿의 결과를 미리 테스트
- **재분석**: 템플릿 수정 후 기존 피드백 재분석

---

## AI 이슈 추천 설정

![ai-issue-recommendation.png](/img/ai/ai-issue-recommendation.png)

**AI Issue Recommendation** 탭에서 피드백 기반 자동 이슈 추천 기능을 설정할 수 있습니다.

### AI 이슈 추천 설정 생성

![ai-issue-recommendation-create.png](/img/ai/ai-issue-recommendation-create.png)

1. **Create New** 버튼 클릭
2. 설정 항목 입력

| 항목             | 설명                         | 필수 여부 |
| ---------------- | ---------------------------- | --------- |
| **Channel**      | 적용할 채널 선택             | 필수      |
| **Target Field** | 분석 대상 필드 (예: message) | 필수      |
| **Prompt**       | 추천 기준 프롬프트           | 선택      |
| **Enable**       | 기능 활성화 토글             | 필수      |

3. 고급 설정

| 설정                      | 설명                                  |
| ------------------------- | ------------------------------------- |
| **Model**                 | 사용 모델                             |
| **Temperature**           | 창의성 조절                           |
| **Data Reference Amount** | 참조할 이슈 양 (이슈와 관련 피드백들) |

### AI 이슈 추천 기능 테스트

입력된 설정에 대해 Playground에서 테스트:

1. 예시 피드백 입력
2. "AI test execution" 클릭
3. 추천 이슈 목록 확인

### 실제 피드백에서 추천 활용

피드백 상세 보기에서:

- AI 추천 이슈 목록 확인
- 체크박스로 적절한 이슈 선택
- **Retry** 버튼으로 다른 추천 요청

### 피드백 목록에서 이슈 추천 사용

AI 이슈 추천을 설정한 채널에서는 피드백 목록 화면에서도 직접 이슈 추천 기능을 사용할 수 있습니다.

#### 사용 방법

1. 피드백 목록에서 이슈를 연결하고 싶은 피드백의 **Issue 컬럼**에 있는 **+ 버튼** 클릭
2. 드롭다운 메뉴가 표시되면 **"Run AI"** 선택
3. AI가 관련 이슈를 분석하여 추천 목록 표시

#### 추천 결과 확인 및 적용

AI 분석 완료 후 추천 이슈 목록에서:

- **추천된 이슈들** 확인
- 추천된 적절한 이슈 선택
- 새 이슈 생성 옵션도 제공
- 선택 완료 후 해당 이슈가 피드백에 자동 연결

#### 일괄 처리 활용

여러 피드백을 선택한 상태에서도 AI 이슈 추천을 사용할 수 있어 효율적인 피드백 분류가 가능합니다:

1. 피드백 목록에서 여러 행 선택 (체크박스 활용)
2. 상단 일괄 작업 메뉴에서 AI 이슈 추천 실행
3. 각 피드백별로 추천 이슈 확인 및 적용

---

## 관련 문서

- [필드 설정하기](/docs/01-user-guide/04-feedback-management.md) - AI 필드를 채널에 적용하는 방법
- [이슈 생성 및 상태 관리](/docs/01-user-guide/05-issue-management.md) - AI 추천 이슈 활용법
- [피드백 확인 및 필터링](/docs/01-user-guide/04-feedback-management.md) - AI 분석 결과 확인 방법
