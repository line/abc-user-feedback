---
id: smtp-configuration
title: SMTP 서버 연동 가이드
description: 운영 환경에서 인증 메일 발송을 위한 외부 SMTP 서버 연동 방법을 안내합니다.
sidebar_position: 4
---

# SMTP 서버 연동 가이드

운영 환경에서는 `smtp4dev`와 같은 로컬 테스트 서버 대신,  
**외부 SMTP 서버(Gmail, SendGrid, 회사 SMTP 등)** 와 연결하여  
인증 메일(가입, 비밀번호 재설정 등)을 정상적으로 발송할 수 있어야 합니다.

이 문서에서는 SMTP 서버 연동을 위한 환경 변수 설정과 주요 연동 사례를 안내합니다.

---

## 1. SMTP 관련 환경 변수

`api` 서비스 또는 `.env` 파일에 다음 환경변수를 설정하세요:

> **참고**: 인증이 필요하지 않은 SMTP 서버의 경우 `SMTP_USERNAME`과 `SMTP_PASSWORD`는 생략할 수 있습니다.

| 환경 변수                | 설명                                            | 필수 여부 |
| ------------------------ | ----------------------------------------------- | --------- |
| `SMTP_HOST`              | SMTP 서버 주소 (예: smtp.gmail.com)             | 필수      |
| `SMTP_PORT`              | 포트 번호 (보통 587, 465 등)                    | 필수      |
| `SMTP_SENDER`            | 발신 이메일 주소 (예: `noreply@yourdomain.com`) | 필수      |
| `SMTP_USERNAME`          | SMTP 인증 사용자명 (계정 ID)                    | 선택      |
| `SMTP_PASSWORD`          | SMTP 인증 비밀번호 또는 API 키                  | 선택      |
| `SMTP_TLS`               | TLS 사용 여부 (`true` 또는 `false`)             | 선택      |
| `SMTP_CIPHER_SPEC`       | TLS 암호화 알고리즘 (기본값: `TLSv1.2`)         | 선택      |
| `SMTP_OPPORTUNISTIC_TLS` | STARTTLS 사용 여부 (`true` 또는 `false`)        | 선택      |

> **중요**: 실제 코드에서는 `SMTP_USERNAME`과 `SMTP_PASSWORD`를 사용하며, `SMTP_TLS=true`는 포트 465에, `false`는 포트 587에 주로 사용됩니다.

---

## 2. Docker 환경 예시

```yaml
api:
  image: line/abc-user-feedback-api
  environment:
    - SMTP_HOST=smtp.gmail.com
    - SMTP_PORT=587
    - SMTP_USERNAME=your-email@gmail.com
    - SMTP_PASSWORD=your-email-app-password
    - SMTP_SENDER=noreply@yourdomain.com
    - SMTP_TLS=false
    - SMTP_OPPORTUNISTIC_TLS=true
```

또는 `.env` 파일로 분리 관리할 수 있습니다:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-email-app-password
SMTP_SENDER=noreply@yourdomain.com
SMTP_TLS=false
SMTP_OPPORTUNISTIC_TLS=true
```

---

## 3. SMTP 연동 예시

### ✅ Gmail SMTP 연동 (개인 테스트용)

- `SMTP_HOST`: `smtp.gmail.com`
- `SMTP_PORT`: `587`
- `SMTP_USERNAME`: Gmail 주소 (예: `abc@gmail.com`)
- `SMTP_PASSWORD`: **앱 비밀번호** (보안 수준 낮은 앱 허용 → 비권장)
- `SMTP_TLS`: `false`
- `SMTP_OPPORTUNISTIC_TLS`: `true`

> Gmail 계정에 **2단계 인증**이 활성화된 경우 [앱 비밀번호](https://myaccount.google.com/apppasswords)를 생성해야 합니다.

---

### ✅ SendGrid 연동 (권장)

- `SMTP_HOST`: `smtp.sendgrid.net`
- `SMTP_PORT`: `587`
- `SMTP_USERNAME`: `apikey`
- `SMTP_PASSWORD`: 실제 SendGrid API Key
- `SMTP_SENDER`: verified sender 주소
- `SMTP_TLS`: `false`
- `SMTP_OPPORTUNISTIC_TLS`: `true`

---

## 4. 테스트 방법

### 4.1 메일 발송 테스트

1. **이메일 인증 테스트**:

   - 관리자 또는 사용자 계정 생성
   - 이메일 인증 코드 발송 확인

2. **비밀번호 재설정 테스트**:

   - 비밀번호 재설정 요청
   - 재설정 링크가 포함된 메일 수신 확인

3. **사용자 초대 테스트**:
   - 관리자가 새 사용자 초대
   - 초대 메일 발송 확인

### 4.2 로그 확인

메일 발송 실패 시 다음 명령어로 상세 로그를 확인하세요:

```bash
# Docker Compose 환경
docker compose logs api

# 특정 시간대 로그 확인
docker compose logs --since=10m api

# 실시간 로그 모니터링
docker compose logs -f api
```

SMTP 오류가 발생하면 로그에 상세 메시지가 표시됩니다.

---

## 5. 문제 해결 (Troubleshooting)

| 문제 유형                  | 원인 또는 해결 방법                      |
| -------------------------- | ---------------------------------------- |
| 인증 오류 (`535`)          | `SMTP_USERNAME` / `SMTP_PASSWORD` 재확인 |
| 연결 거부 (`ECONNREFUSED`) | 방화벽 또는 잘못된 포트 설정             |
| 메일 안 도착               | `SMTP_SENDER`가 인증되지 않음            |
| TLS 오류 (`ETLS`)          | `SMTP_TLS` 설정이 잘못됨                 |
| STARTTLS 실패              | `SMTP_OPPORTUNISTIC_TLS` 설정 확인       |

---

## 6. SMTP와 관련된 메일 템플릿

현재 시스템에서 메일은 다음 상황에서 발송됩니다:

- **이메일 인증**: 관리자/사용자 가입 시 인증 코드 발송
- **비밀번호 재설정**: 비밀번호 재설정 요청 시 링크 발송
- **사용자 초대**: 관리자가 사용자를 초대할 때 초대 메일 발송

메일 내용은 **Handlebars 템플릿** 기반으로 구성되어 있으며, 다음 정보가 포함됩니다:

- 발신자: `"User feedback" <SMTP_SENDER>`
- 기본 URL: `ADMIN_WEB_URL` 환경변수 값 사용
- 템플릿 위치: `src/configs/modules/mailer-config/templates/`

---

## 관련 문서

- [Docker Hub 설치 가이드](./01-docker-hub-images.md)
- [환경 변수 설정](./05-configuration.md)
- [초기 셋팅 가이드](/docs/01-user-guide/01-getting-started.md)
