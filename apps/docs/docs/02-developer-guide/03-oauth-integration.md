---
sidebar_position: 3
title: "OAuth 연동"
description: "Google OAuth 및 커스텀 OAuth 제공자를 통한 싱글 사인온(SSO) 연동 방법을 안내합니다."
---

# OAuth 연동

ABC User Feedback에서 OAuth 2.0 기반의 싱글 사인온(SSO)을 설정하면, 사용자들이 별도의 계정 생성 없이 기존 계정(Google, Microsoft, GitHub 등)으로 로그인할 수 있습니다. 이는 사용자 편의성을 높이고 기업 환경에서 통합 인증을 구현하는 데 필수적입니다.

---

## OAuth 연동 개요

ABC User Feedback에서 지원하는 OAuth 방식:

### 1. Google OAuth

- 별도 설정 없이 기본 제공
- Google 계정을 통한 간편 로그인

### 2. 커스텀 OAuth 제공자

- 사내 인증 시스템
- 기타 OAuth 2.0/OpenID Connect 호환 서비스

OAuth를 설정하면 기존 이메일 로그인과 병행하여 사용할 수 있으며, 조직 정책에 따라 OAuth만 허용하도록 제한할 수도 있습니다.

---

## Google OAuth 연동 설정

### Google Cloud Console에서 설정

#### 1. Google Cloud Console 접속

[Google Cloud Console](https://console.cloud.google.com)에 접속하여 프로젝트를 생성하거나 기존 프로젝트를 선택합니다.

#### 2. OAuth 2.0 클라이언트 ID 생성

1. **API 및 서비스 > 사용자 인증 정보** 메뉴로 이동
2. **+ 사용자 인증 정보 만들기 > OAuth 클라이언트 ID** 선택
3. 애플리케이션 유형을 **웹 애플리케이션**으로 선택

#### 3. 승인된 리디렉션 URI 설정

**승인된 리디렉션 URI**에 다음 URL을 추가합니다:

```
https://your-domain.com/auth/oauth-callback
```

예시:

- `https://feedback.company.com/auth/oauth-callback`
- `http://localhost:3000/auth/oauth-callback` (개발 환경)

#### 4. 클라이언트 정보 확인

생성 완료 후 다음 정보를 확인하고 복사해둡니다:

- **클라이언트 ID**: `1234567890-abc123def456.apps.googleusercontent.com`
- **클라이언트 보안 비밀번호**: `GOCSPX-abcdef123456`

### ABC User Feedback에서 Google OAuth 설정

Google OAuth를 사용하려면 다음 단계를 따라 설정해야 합니다:

#### 1. Google OAuth 설정 활성화

**Settings > Login Management**에서:

1. **OAuth2.0 Login** 토글을 활성화
2. **Login Button Type**을 "Google Login"으로 선택
3. Google Cloud Console에서 얻은 정보 입력:
   - **Client ID**: Google Cloud Console에서 생성한 클라이언트 ID
   - **Client Secret**: Google Cloud Console에서 생성한 클라이언트 보안 비밀번호
   - **Authorization Code Request URL**: `https://accounts.google.com/o/oauth2/v2/auth`
   - **Scope**: `openid email profile`
   - **Access Token URL**: `https://oauth2.googleapis.com/token`
   - **User Profile Request URL**: `https://www.googleapis.com/oauth2/v2/userinfo`
   - **Email Key**: `email`

#### 2. 리디렉션 URI 등록

Google Cloud Console에서 다음 URL을 **승인된 리디렉션 URI**에 추가:

```
https://your-domain.com/auth/oauth-callback
```

개발 환경의 경우:

```
http://localhost:3000/auth/oauth-callback
```

---

## 커스텀 OAuth 제공자 연동

### 사내 인증 시스템 연동

ABC User Feedback은 기업 환경에서 사용하는 사내 인증 시스템과 연동할 수 있습니다. 대부분의 사내 인증 시스템은 OAuth 2.0 또는 OpenID Connect 표준을 지원하므로, 표준 OAuth 플로우를 통해 연동이 가능합니다.

#### 사내 인증 시스템 설정 요구사항

사내 인증 시스템과 연동하려면 다음 정보가 필요합니다:

1. **OAuth 클라이언트 등록**

   - 클라이언트 ID
   - 클라이언트 시크릿
   - 리디렉션 URI: `https://your-domain.com/auth/oauth-callback`

2. **OAuth 엔드포인트 정보**

   - Authorization URL (인증 요청 URL)
   - Token URL (토큰 교환 URL)
   - User Info URL (사용자 정보 조회 URL)

3. **권한 범위(Scope)**
   - 사용자 프로필 정보 접근 권한
   - 이메일 주소 접근 권한

#### 일반적인 사내 인증 시스템 예시

| 항목                               | 설명                               | 사내 시스템 예시                           |
| ---------------------------------- | ---------------------------------- | ------------------------------------------ |
| **Login Button Type**              | 로그인 버튼 타입                   | `CUSTOM`                                   |
| **Login Button Name**              | 로그인 버튼에 표시될 이름          | `사내 계정으로 로그인`                     |
| **Client ID**                      | OAuth 클라이언트 ID                | `company-auth-client-123`                  |
| **Client Secret**                  | 클라이언트 보안 비밀번호           | `company-secret-abc123`                    |
| **Authorization Code Request URL** | 사용자 인증 요청 URL               | `https://auth.company.com/oauth/authorize` |
| **Scope**                          | 요청할 권한 범위                   | `openid email profile`                     |
| **Access Token URL**               | 토큰 요청 URL                      | `https://auth.company.com/oauth/token`     |
| **User Profile Request URL**       | 사용자 정보 조회 API               | `https://auth.company.com/api/user`        |
| **Email Key**                      | 사용자 정보 JSON에서 이메일 필드명 | `email` 또는 `mail`                        |

### 기타 OAuth 2.0/OpenID Connect 호환 서비스

ABC User Feedback은 OAuth 2.0 또는 OpenID Connect 표준을 준수하는 모든 인증 서비스와 연동할 수 있습니다.

#### 지원 가능한 서비스 유형

- **OpenID Connect 제공자**: 표준 OpenID Connect 프로토콜을 지원하는 서비스
- **OAuth 2.0 제공자**: OAuth 2.0 Authorization Code 플로우를 지원하는 서비스
- **커스텀 인증 서버**: 표준 OAuth 엔드포인트를 제공하는 자체 구축 서비스

#### 연동 설정 방법

**Settings > Login Management**에서 커스텀 OAuth를 설정합니다:

1. **관리자 계정으로 로그인** 후 **Settings > Login Management** 메뉴로 이동
2. **OAuth2.0 Login** 토글을 활성화
3. **Login Button Type**을 `CUSTOM`으로 선택
4. 인증 서비스 제공자로부터 받은 정보 입력:
   - **Login Button Name**: 로그인 버튼에 표시될 텍스트 (예: "사내 계정으로 로그인")
   - **Client ID**: OAuth 클라이언트 식별자
   - **Client Secret**: 클라이언트 인증 비밀번호
   - **Authorization Code Request URL**: 사용자 인증 요청 URL
   - **Scope**: 요청할 권한 범위 (공백으로 구분, 예: "openid email profile")
   - **Access Token URL**: 액세스 토큰 요청 URL
   - **User Profile Request URL**: 사용자 프로필 정보 조회 URL
   - **Email Key**: 사용자 정보 JSON에서 이메일 필드명 (예: "email" 또는 "mail")

---

## 관련 문서

- [로그인 관리](/docs/01-user-guide/07-settings/01-tenant-settings.md) - UI에서 OAuth 설정하는 방법
