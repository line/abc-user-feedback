---
sidebar_position: 3
title: 'AI 필드 템플릿 관리'
description: 'AI 분석을 위한 필드 템플릿을 생성하고 관리하는 방법에 대한 설명입니다.'
---

# AI 필드 템플릿 관리

ABC User Feedback에서 AI 분석을 위한 필드 템플릿을 생성하고 관리하는 방법을 안내합니다.

## 개요

AI Field Template 기능을 통해 피드백 데이터에 대한 다양한 AI 분석 템플릿을 사전 정의하고 관리할 수 있습니다. 이를 통해 감정 분석, 키워드 추출, 요약, 번역 등의 AI 기능을 일관성 있게 적용하고, 필드 관리에서 AI 필드로 활용할 수 있습니다.

## AI 필드 템플릿 접근

### 접근 방법

1. 상단 메뉴에서 **Settings** 탭을 클릭합니다.
2. 좌측 메뉴에서 **Generative AI Integration**을 선택합니다.
3. **AI Field Template** 탭을 클릭합니다.

### 화면 구성

**안내 메시지**

- AI 필드의 동작 방식 정의에 대한 설명
- 템플릿을 통한 지시사항 입력 및 고급 설정 조정 안내

**템플릿 카드**

- **Create New**: 새 템플릿 생성
- **기본 템플릿들**: Summary, Sentiment Analysis, Translation, Keyword Extraction

## 기본 템플릿 소개

### 제공되는 기본 템플릿

#### Summary (요약)

- **목적**: 피드백 내용을 간결하게 요약
- **Prompt Preview**: "Summarize the following feedback within a sentence"
- **활용**: 긴 피드백의 핵심 내용 추출

#### Sentiment Analysis (감정 분석)

- **목적**: 피드백의 감정 상태 분석
- **Prompt Preview**: "Analyze the sentiment of the following feedback and express it both as a sentiment label"
- **활용**: 고객 만족도 측정 및 감정 트렌드 분석

#### Translation (번역)

- **목적**: 피드백을 다른 언어로 번역
- **Prompt Preview**: "Translate the following feedback to English"
- **활용**: 다국어 피드백의 일관된 분석

#### Keyword Extraction (키워드 추출)

- **목적**: 피드백에서 중요 키워드 추출
- **Prompt Preview**: "Extract the 2-3 most important keywords from the following feedback"
- **활용**: 주요 이슈 및 관심사 파악

## 템플릿 상세 설정

### Template Details 화면

템플릿을 클릭하면 상세 설정 화면으로 이동합니다:

#### Configuration 섹션

**Title** (필수)

- 템플릿의 이름 설정
- 필드 관리에서 템플릿 선택 시 표시되는 이름

**Prompt** (필수)

- AI에게 전달할 구체적인 지시사항
- 분석 방식과 출력 형식을 명확히 정의
- 플레이스홀더: "Please enter instructions on how the Generative AI should process."

#### Advanced Configuration

**Model**

- 사용할 AI 모델 선택 (예: gpt-4o)
- 드롭다운에서 사용 가능한 모델 목록 확인

**Temperature**

- AI 응답의 창의성 조절
- **Precise** (낮은 값): 일관되고 정확한 응답
- **Creative** (높은 값): 다양하고 창의적인 응답
- 슬라이더로 세밀한 조정 가능

### Playground 섹션

**Test Data (Input)**

- **Add Data** 버튼으로 테스트 데이터 추가
- 실제 피드백 예시로 템플릿 테스트
- "There is no data yet." 상태에서 시작

**AI Result (Output)**

- **AI test execution** 버튼으로 테스트 실행
- 설정된 템플릿의 실제 결과 미리보기
- 프롬프트 및 설정 검증

**뷰 옵션**

- **Horizontal View**: 가로 배치
- **Vertical View**: 세로 배치

## 새 템플릿 생성

### Create New 템플릿

1. **Create New** 카드를 클릭합니다.
2. Template Details 화면에서 다음을 설정합니다:

#### 기본 설정

**제목 설정**

- 템플릿의 목적을 명확히 표현하는 이름
- 예: "Product Feature Analysis", "Bug Priority Classification"

**프롬프트 작성**

- 구체적이고 명확한 지시사항 작성
- 입력 데이터 형식과 출력 형식 명시
- 예시 및 제약사항 포함

#### 고급 설정

**모델 선택**

- 작업 복잡도에 맞는 적절한 모델 선택
- 비용과 성능의 균형 고려

**Temperature 조정**

- 분석 작업: Precise (낮은 Temperature)
- 창작 작업: Creative (높은 Temperature)

### 프롬프트 작성 가이드

#### 효과적인 프롬프트 구조

```
1. 역할 정의: "You are a customer feedback analyst."
2. 작업 설명: "Analyze the following feedback for..."
3. 입력 형식: "The feedback text will be provided as..."
4. 출력 형식: "Provide the result in the following format..."
5. 제약사항: "Do not include personal information..."
6. 예시: "Example: Input: 'Great app!' Output: 'Positive'"
```

#### 분야별 프롬프트 예시

**감정 분석**

```
Analyze the sentiment of the following feedback and classify it as:
- Positive: Customer is satisfied
- Negative: Customer has complaints
- Neutral: No clear sentiment
Provide only the classification label.
```

**버그 분류**

```
Categorize the following feedback into bug severity:
- Critical: System crashes or data loss
- High: Major feature not working
- Medium: Minor functionality issues
- Low: Cosmetic or minor inconvenience
```

## AI 필드와의 연동

### 필드 관리에서 AI 필드 생성

템플릿 생성 후 Field Management에서 활용:

1. **Settings > Channel List > [채널 선택] > Field Management**로 이동
2. **Add Field** 버튼 클릭
3. **Format**에서 **aiField** 선택
4. **Template** 드롭다운에서 생성한 템플릿 선택
5. **AI Field Automation** 토글로 자동 실행 설정

### AI 필드 설정 옵션

**Template 선택**

- 생성한 커스텀 템플릿 또는 기본 템플릿 선택
- "Go to Template Settings" 링크로 템플릿 수정 가능

**Target Field**

- AI 분석 대상이 될 필드 선택
- 보통 메시지 본문이나 주요 텍스트 필드

### AI 필드 실행 방법

템플릿을 AI 필드로 적용한 후 다음과 같은 방법으로 분석을 실행할 수 있습니다:

#### 자동 실행

- **AI Field Automation** 토글 활성화 시
- 새로운 피드백이 생성되면 자동으로 AI 분석 실행
- 백그라운드에서 처리되어 결과가 해당 필드에 자동 저장

#### 수동 실행

**개별 피드백 분석**

1. 피드백 목록에서 원하는 피드백 클릭
2. Feedback Details 모달에서 **Run AI** 버튼 클릭
3. 설정된 AI 템플릿에 따라 분석 실행
4. 결과가 해당 AI 필드에 표시됨

**일괄 피드백 분석**

1. 피드백 목록에서 체크박스로 여러 피드백 선택
2. 상단 컨트롤 바의 **Run AI** 버튼 클릭
3. 선택된 모든 피드백에 대해 동시 분석 실행
4. 각 피드백의 AI 필드에 분석 결과 저장

**수동 실행 활용 시나리오**

- 기존 피드백에 새로운 AI 템플릿 적용
- AI Field Automation이 비활성화된 상태에서 선택적 분석
- 템플릿 수정 후 기존 분석 결과 재실행
- 특정 조건의 피드백만 골라서 분석

**Property 및 Status**

- 필드의 편집 권한 설정
- 필드 활성화 상태 관리

## 템플릿 관리

### 템플릿 수정

1. 수정할 템플릿 카드 클릭
2. Template Details에서 설정 변경
3. Playground에서 변경사항 테스트
4. **Save** 버튼으로 저장

### 템플릿 삭제

- Template Details 화면에서 **Delete Template** 버튼 클릭
- 삭제 시 해당 템플릿을 사용하는 AI 필드에 영향
- 삭제 전 사용 중인 필드 확인 필요

### 템플릿 복사

기존 템플릿을 기반으로 새 템플릿 생성:

1. 기존 템플릿의 설정을 참고
2. Create New로 새 템플릿 생성
3. 유사한 설정을 복사하여 수정

## 모범 사례

### 템플릿 설계 원칙

**명확성**

- 구체적이고 이해하기 쉬운 지시사항
- 모호한 표현이나 중의적 해석 방지

**일관성**

- 동일한 형식의 출력 보장
- 여러 피드백에 대한 일관된 분석

**효율성**

- 필요한 정보만 요청
- 토큰 사용량 최적화

### 테스트 및 검증

**Playground 활용**

- 다양한 샘플 데이터로 테스트
- 예상치 못한 입력에 대한 응답 확인
- 출력 품질 및 일관성 검증

**점진적 개선**

- 초기 버전 배포 후 결과 모니터링
- 사용자 피드백 수집
- 프롬프트 및 설정 지속적 개선

> **참고**: AI 필드 템플릿은 피드백 분석의 품질과 일관성을 결정하는 중요한 요소입니다. 충분한 테스트와 검증을 통해 최적의 템플릿을 구성하시기 바랍니다.

---

이 문서는 AI 필드 템플릿 관리의 기본적인 방법을 안내합니다. AI 이슈 추천 기능에 대한 내용은 AI Issue Recommendation 탭에서 확인할 수 있습니다.
