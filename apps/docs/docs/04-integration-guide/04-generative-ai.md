---
sidebar_position: 4
title: '생성형 AI 연동'
description: 'ABC User Feedback의 생성형 AI 기능인 AI Field와 AI Issue Recommendation 설정 및 사용 방법을 안내합니다.'
---

# 생성형 AI 연동

ABC User Feedback은 생성형 AI를 활용하여 피드백 데이터를 자동으로 분석하고 처리하는 기능을 제공합니다. 이 문서에서는 AI Field와 AI Issue Recommendation 기능의 설정 및 사용 방법을 설명합니다.

## 개요

ABC User Feedback의 생성형 AI 기능은 다음과 같은 두 가지 주요 기능으로 구성됩니다:

### 1. AI Field

- 피드백 데이터를 기반으로 AI가 자동으로 필드 값을 생성하는 기능
- 요약, 감정 분석, 번역, 키워드 추출 등의 작업을 자동화
- 사용자 정의 프롬프트를 통한 맞춤형 AI 처리 가능

### 2. AI Issue Recommendation

- 피드백 내용을 분석하여 관련 이슈를 자동으로 추천하는 기능
- 기존 이슈 데이터를 참조하여 더 정확한 추천 제공
- 이슈 생성 및 연결 작업의 자동화

## 지원하는 AI 제공업체

현재 다음 AI 제공업체를 지원합니다:

- **OpenAI**: GPT 모델 사용 (GPT-4o, GPT-3.5-turbo 등)
- **Google**: Gemini 모델 사용 (gemini-2.0-flash 등)
- **기타 호환 API**: OpenAI 호환 API 엔드포인트 지원

## AI 통합 설정

### AI 제공업체 설정

Admin Web에서 다음 단계를 따라 AI 통합을 설정합니다:

1. **Settings** 메뉴에서 **AI Integration** 선택
2. **AI Provider** 선택 (OpenAI 또는 Google)
3. **API Key** 입력
4. **Endpoint URL** 입력 (필요한 경우)
5. **System Prompt** 설정 (선택사항)
6. **Token Threshold** 설정 (월간 사용량 제한)

### API Key 검증

설정한 API Key가 유효한지 확인할 수 있습니다. 시스템에서 자동으로 API Key의 유효성을 검증하며, 유효하지 않은 경우 오류 메시지가 표시됩니다.

### 사용 가능한 모델 조회

설정된 AI 제공업체에서 사용 가능한 모델 목록을 자동으로 조회하여 선택할 수 있습니다. OpenAI의 경우 GPT-4o, GPT-3.5-turbo 등이, Google의 경우 gemini-2.0-flash 등이 표시됩니다.

## AI Field 설정 및 사용

### 1. AI Field 템플릿 관리

#### 기본 템플릿

AI 통합을 처음 설정하면 다음과 같은 기본 템플릿이 자동으로 생성됩니다:

- **Summary**: 피드백 요약
- **Sentiment Analysis**: 감정 분석
- **Translation**: 영어 번역
- **Keyword Extraction**: 키워드 추출

이 외에도 사용자가 원하는 추가적인 템플릿들을 생성하여 사용할 수 있습니다.

### 2. 채널에서 AI Field 설정

1. **Settings** > **Channel** > **Field Management** 메뉴로 이동
2. **새 필드 추가** 또는 기존 필드 수정
3. **Field Format**을 **AI Field**로 선택
4. **AI Field Template** 선택
5. **AI Field Target Keys** 설정 (AI가 분석할 대상 필드들)

### 3. AI Field 처리

각 AI Field에는 **AI Field Automation** 이라는 토글 설정이 있는데 이를 활성화 할 경우 입력되는 피드백에 대해서 자동으로 AI Field가 처리 됩니다. 비활성화 할 경우 피드백 입력시 자동으로 처리되지 않고, 사용자가 수동으로 **Run AI** 버튼을 눌러서 실행합니다.

### 4. AI Field Playground

AI Field 템플릿을 테스트할 수 있는 Playground 기능을 제공합니다. Playground에서는 사용자가 실제 AI Field 실행 환경과 거의 유사한 환경에서 여러가지 입력 값들을 변경해보면서 테스트를 할 수 있습니다.

## AI Issue Recommendation 설정 및 사용

### 1. AI Issue 템플릿 관리

#### AI Issue 템플릿 조회

Admin Web에서 현재 설정된 AI Issue 템플릿들을 확인할 수 있습니다. 각 템플릿의 설정 상태와 활성화 여부를 한눈에 볼 수 있습니다.

#### 새 AI Issue 템플릿 생성

새로운 AI Issue 템플릿을 생성할 때는 다음 정보를 설정해야 합니다:

- **채널 선택**: 템플릿이 적용될 채널
- **대상 필드**: AI가 분석할 피드백 필드들 (예: message, summary 등)
- **프롬프트**: 이슈 추천을 위한 AI 지시사항
- **모델**: 사용할 AI 모델 (GPT-4o, gemini-2.0-flash 등)
- **Temperature**: AI 응답의 창의성 수준 (0.0-1.0)
- **데이터 참조량**: 기존 이슈 데이터를 얼마나 참조할지 설정 (1-5)

#### AI Issue 템플릿 수정

기존 템플릿의 설정을 언제든지 수정할 수 있습니다. 프롬프트, 모델, temperature 설정 등을 변경하여 더 정확한 이슈 추천을 받을 수 있습니다.

### 2. AI Issue Recommendation 사용

#### 특정 피드백에 대한 이슈 추천

피드백 상세 화면에서 **AI Issue Recommendation** 버튼을 클릭하면 해당 피드백과 관련된 이슈들을 자동으로 추천받을 수 있습니다. AI는 피드백 내용을 분석하고 기존 이슈 데이터를 참조하여 관련성 높은 이슈 이름들을 제안합니다.

추천된 이슈들은 다음과 같은 형태로 표시됩니다:

```json
{
  "success": true,
  "result": [
    {
      "issueName": "Login Issue"
    },
    {
      "issueName": "Performance Problem"
    }
  ]
}
```

### 3. AI Issue Playground

AI Issue 템플릿을 테스트할 수 있는 Playground 기능을 제공합니다. 실제 피드백 데이터를 사용하지 않고도 다양한 입력값으로 이슈 추천 기능을 테스트해볼 수 있습니다. 이를 통해 프롬프트나 설정을 최적화할 수 있습니다.

## AI 사용량 모니터링

### 사용량 조회

Admin Web의 **AI Integration** 설정 페이지에서 AI 기능 사용량을 확인할 수 있습니다. 일별, 월별로 사용된 토큰 수와 비용을 추적할 수 있으며, 다음과 같은 정보를 제공합니다:

- **사용 일자**: 토큰이 사용된 날짜
- **카테고리**: AI Field 또는 Issue Recommendation 구분
- **제공업체**: OpenAI, Google 등 사용한 AI 제공업체
- **사용 토큰 수**: 해당 일에 사용된 토큰 수

### 토큰 임계값 설정

월간 사용량 제한을 설정하여 비용을 관리할 수 있습니다:

1. **AI Integration** 설정에서 **Token Threshold** 설정
2. 임계값 초과 시 AI 기능 자동 비활성화
3. 사용량 모니터링을 통한 비용 관리

## 권한 관리

AI 기능 사용을 위한 권한이 필요합니다:

- **Admin**: 모든 AI 기능 사용 가능
- **Editor**: AI 기능 조회만 가능
- **Viewer**: AI 기능 사용 불가

## 주의사항

### 1. 비용 관리

- AI API 사용량에 따른 비용 발생
- 토큰 임계값 설정을 통한 비용 제어 권장
- 정기적인 사용량 모니터링 필요

### 2. 데이터 보안

- API Key는 안전하게 관리
- 민감한 데이터가 포함된 피드백 처리 시 주의
- AI 제공업체의 데이터 처리 정책 확인

### 3. 성능 고려사항

- AI 처리 시간이 소요될 수 있음
- 대량 처리 시 배치 처리 권장
- 네트워크 상태에 따른 처리 시간 변동 가능

## 추가 정보

- 자세한 API 명세는 Swagger 문서(`/docs`)를 참조하세요
- AI 기능 관련 문제는 시스템 로그를 확인하세요
- 커스텀 프롬프트 작성 시 AI 모델의 특성을 고려하세요
