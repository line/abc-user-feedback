---
sidebar_position: 3
title: '초기 설정'
description: '초기 설정 대한 설명입니다.'
---

# 초기 설정

ABC User Feedback을 설치한 후에는 시스템을 사용하기 위한 초기 설정이 필요합니다. 이 문서에서는 관리자 계정 생성부터 기본 구성 요소 설정까지 초기 설정 과정을 안내합니다.

## 시스템 접근

설치가 완료되면 웹 브라우저에서 ABC User Feedback 웹 인터페이스에 접속합니다:

```
http://localhost:3000
```

> **참고**: 기본 포트를 변경했거나 다른 호스트에 설치한 경우 해당 URL을 사용하세요.

## 테넌트 설명 및 관리자 계정 생성

ABC User Feedback에 처음 접속하면 테넌트 생성 및 관리자 계정 설정 화면이 표시됩니다. 테넌트는 ABC User Feedback 내에서 조직 또는 회사를 나타내는 최상위 단위로, 모든 프로젝트와 사용자를 포함합니다.

### 테넌트 이름 입력

![테넌트 생성](../../static/assets/initial-setup/create-tenant-1.png)

- "Create Tenant" 화면에서 조직/회사 이름을 입력합니다.
- 이 이름은 ABC User Feedback을 관리할 회사나 조직의 식별자로 사용됩니다.
- 입력 후 "Next" 버튼을 클릭합니다.

### 관리자 계정 정보 입력

![관리자 계정 생성](../../static/assets/initial-setup/create-tenant-2.png)

- 이메일 주소: 관리자 계정으로 사용할 이메일 주소를 입력합니다.
- 비밀번호: 안전한 비밀번호를 설정합니다.
- 비밀번호 확인: 동일한 비밀번호를 재입력합니다.
- "Request Code" 버튼을 클릭하여 인증 코드를 요청합니다.

### 이메일 인증

![이메일 인증](../../static/assets/initial-setup/email-verification.png)

- SMTP 서버가 구성되어 있는 경우, 입력한 이메일 주소로 인증 코드가 포함된 메일이 발송됩니다.
- 이메일에서 인증 코드를 확인하고 인증 코드 입력 필드에 입력합니다.
- "Verify Code" 버튼을 클릭하여 코드를 검증합니다.

### 인증 완료 및 계정 생성

![인증 코드 입력](../../static/assets/initial-setup/create-tenant-3.png)

- 인증 코드가 확인되면 비밀번호 입력 필드가 활성화됩니다.
- 비밀번호와 비밀번호 확인을 입력한 후 "Next" 버튼을 클릭합니다.

### 테넌트 생성 완료

![테넌트 생성 완료](../../static/assets/initial-setup/create-tenant-4.png)

- 테넌트 생성이 완료되면 확인 화면이 표시됩니다.
- 테넌트 이름과 관리자 이메일 주소를 확인하고 "Confirm" 버튼을 클릭합니다.
- 테넌트 생성이 완료되면 로그인 화면으로 리디렉션됩니다.

> **참고**: 테넌트는 ABC User Feedback 내에서 완전히 격리된 환경을 제공합니다. 각 테넌트는 자체 사용자, 프로젝트, 설정을 가지며 다른 테넌트와 데이터를 공유하지 않습니다.

## 로그인

관리자 계정이 생성되면 로그인 화면이 표시됩니다. 생성한 계정 정보로 로그인합니다.

![로그인 화면](../../static/assets/initial-setup/login.png)

## 프로젝트 생성

로그인 후 첫 번째 단계는 프로젝트를 생성하는 것입니다. ABC User Feedback에서 프로젝트는 피드백을 수집하고 관리하는 기본 단위입니다. 프로젝트 생성은 3단계 과정으로 이루어집니다.

### 시작하기

처음 로그인하면 환영 화면이 표시됩니다. ABC User Feedback에서는 테넌트 > 프로젝트 > 채널 구조로 피드백을 관리합니다. "Next" 버튼을 클릭하여 프로젝트 생성을 시작합니다.

![환영 화면](../../static/assets/initial-setup/welcome-screen.png)

### 1단계: 프로젝트 정보 입력

![프로젝트 정보 입력](../../static/assets/initial-setup/create-project-1.png)

첫 번째 단계에서는 프로젝트의 기본 정보를 입력합니다:

1. **프로젝트 이름**: 피드백을 수집할 제품이나 서비스의 이름을 입력합니다 (필수).
2. **설명**: 프로젝트에 대한 간략한 설명을 입력합니다 (선택 사항).
3. **시간대**: 프로젝트의 기본 시간대를 선택합니다. 이 시간대는 대시보드 통계 생성 및 날짜/시간 표시에 사용됩니다 (필수).
4. 모든 정보를 입력한 후 "Next" 버튼을 클릭하여 다음 단계로 진행합니다.

### 2단계: 멤버 관리

![멤버 관리](../../static/assets/initial-setup/create-project-2.png)

두 번째 단계에서는 프로젝트에 참여할 멤버를 관리합니다:

1. 초기에는 멤버가 등록되어 있지 않습니다.
2. "Register Member" 버튼을 클릭하여 새 멤버를 추가할 수 있습니다.
3. 멤버 등록 팝업에서 이메일과 역할을 선택합니다:
   ![멤버 등록](../../static/assets/initial-setup/register-member.png)
   - **이메일**: 시스템에 등록된 사용자 중에서 선택합니다.
   - **역할**: 해당 멤버에게 부여할 역할을 선택합니다.
4. "Save" 버튼을 클릭하여 멤버를 추가합니다.
5. 필요한 멤버를 모두 추가한 후 "Next" 버튼을 클릭합니다.

### 역할 관리 (선택 사항)

프로젝트 멤버 관리 화면에서 "Role Management" 버튼을 클릭하면 역할 관리 화면으로 이동합니다:

![역할 관리](../../static/assets/initial-setup/role-management.png)

여기서는 기본 제공되는 역할(Admin, Editor, Viewer)의 권한을 확인하고 필요에 따라 새 역할을 생성할 수 있습니다:

1. 각 역할별로 피드백, 이슈, 프로젝트, 멤버 관련 권한을 설정할 수 있습니다.
2. "Create Role" 버튼을 클릭하여 새 역할을 생성할 수 있습니다.
3. 설정을 완료한 후 멤버 관리 화면으로 돌아갑니다.

### 3단계: API 키 관리

![API 키 관리](../../static/assets/initial-setup/create-project-3.png)

세 번째 단계에서는 API 키를 생성하고 관리합니다:

1. API 키는 프로그래매틱 방식으로 피드백을 수집하거나 관리할 때 사용됩니다.
2. "Create API Key" 버튼을 클릭하여 새 API 키를 생성할 수 있습니다.
3. 생성된 API 키는 목록에 표시됩니다:
   ![API 키 생성됨](../../static/assets/initial-setup/api-key-created.png)
4. API 키를 안전한 곳에 보관하세요. 이 키는 다시 표시되지 않습니다.
5. "Complete" 버튼을 클릭하여 프로젝트 생성을 완료합니다.

### 프로젝트 생성 완료

![프로젝트 생성 완료](../../static/assets/initial-setup/project-creation-complete.png)

프로젝트 생성이 완료되면 요약 화면이 표시됩니다:

1. 프로젝트 정보, 역할 관리, 멤버 관리, API 키 관리 섹션을 확장하여 설정 내용을 확인할 수 있습니다.
2. "Create Channel" 버튼을 클릭하여 피드백을 수집할 채널을 생성하는 단계로 진행합니다.
3. 또는 "Later" 버튼을 클릭하여 나중에 채널을 생성할 수 있습니다.

> **참고**: ABC User Feedback에서 피드백을 수집하려면 최소한 하나의 채널이 필요합니다. 프로젝트 생성 후 바로 채널을 생성하는 것이 좋습니다.

## 채널 설정

프로젝트를 생성한 후에는 피드백을 수집할 채널을 설정해야 합니다. 채널은 피드백이 들어오는 출처를 나타냅니다. 채널 생성은 2단계 과정으로 이루어집니다.

### 1단계: 채널 정보 입력

![채널 정보 입력](../../static/assets/initial-setup/create-channel-1.png)

첫 번째 단계에서는 채널의 기본 정보를 입력합니다:

- **채널 이름**: 채널의 식별 이름을 입력합니다 (예: "인앱 피드백", "이메일 문의", "고객 지원") (필수)
- **설명**: 채널에 대한 간략한 설명을 입력합니다 (선택 사항)
- 채널은 피드백 수집 경로나 수집 방법을 구분하는 단위입니다. 채널의 특성을 고려하여 정보를 입력하세요.
- 정보 입력 후 "Next" 버튼을 클릭하여 다음 단계로 진행합니다.

### 2단계: 필드 관리

![필드 관리](../../static/assets/initial-setup/create-channel-2.png)

두 번째 단계에서는 채널에서 수집할 피드백 데이터의 필드를 정의합니다:

1. 기본적으로 id, createdAt, updatedAt, issues와 같은 시스템 필드가 제공됩니다.
2. "Add Field" 버튼을 클릭하여 새 필드를 추가할 수 있습니다:
   ![필드 추가](../../static/assets/initial-setup/add-field.png)
   - **Key**: 필드의 고유 식별자
   - **Display Name**: 사용자 인터페이스에 표시될 이름
   - **Format**: 텍스트, 숫자, 날짜 등 필드의 데이터 형식
   - **Property**: 읽기 전용 또는 편집 가능 여부
   - **Status**: 필드의 활성화 상태
   - **Description**: 필드에 대한 설명 (선택 사항)
3. "Preview" 버튼을 클릭하여 설정한 필드로 구성된 피드백 데이터의 미리보기를 확인할 수 있습니다:
   ![필드 미리보기](../../static/assets/initial-setup/field-preview.png)
4. 필요한 필드를 모두 추가한 후 "Complete" 버튼을 클릭하여 채널 생성을 완료합니다.

### 채널 생성 완료

![채널 생성 완료](../../static/assets/initial-setup/channel-creation-complete.png)

채널 생성이 완료되면 요약 화면이 표시됩니다:

1. 채널 정보와 필드 관리 섹션을 확장하여 설정 내용을 확인할 수 있습니다.
2. "Start" 버튼을 클릭하여 피드백 수집을 시작합니다.

> **참고**: 채널 설정이 완료되면 API를 통해 피드백을 수집하거나 웹 폼을 통해 사용자로부터 직접 피드백을 받을 수 있습니다.

## 다음 단계

초기 설정을 완료한 후에는 다음 단계로 진행할 수 있습니다:

- [피드백 관리](../03-user-guide/02-feedback-management/01-viewing-filtering.md): 피드백 조회, 필터링, 태그 지정 방법 학습
- [이슈 트래커 사용법](../03-user-guide/03-issue-management/01-issue-tracker.md): 이슈 관리 및 추적 방법 학습
- [API 개요](../04-integration-guide/01-api-overview.md): API를 통한 프로그래매틱 통합 방법 학습
- [웹훅 설정 및 활용](../04-integration-guide/03-webhooks.md): 웹훅을 통한 외부 시스템 연동 방법 학습

문제가 발생하거나 추가 지원이 필요한 경우 [문제 해결](../06-operations-guide/04-troubleshooting.md) 문서를 참조하거나 [지원 받는 방법](../07-community-support/03-getting-help.md)을 확인하세요.
