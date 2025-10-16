---
sidebar_position: 6
title: "이미지 설정"
description: "피드백에 첨부된 이미지 저장 방식과 보안 정책을 설정하는 방법을 안내합니다."
---

# 이미지 설정

ABC User Feedback에서는 사용자가 피드백을 제출할 때 **이미지와 함께 업로드**할 수 있도록 지원합니다. 이미지 저장 방식과 보안 정책을 적절히 설정하여 안전하고 효율적인 피드백 수집 환경을 구축할 수 있습니다.

---

## 접근 방법

1. 상단 메뉴에서 **Settings** 클릭
2. 좌측 메뉴에서 **Channel List > [채널 선택]**
3. 하단 탭 중 **Image Management** 선택

:::info 이미지 업로드 방식
ABC User Feedback은 두 가지 이미지 업로드 방식을 지원합니다:

- **Image URL 방식**: 외부 URL 링크 사용 (도메인 화이트리스트 설정 가능)
- **Multipart Upload API**: 서버로 직접 업로드 (S3 설정 필요)

:::

---

## Image Storage Integration 설정

**Multipart Upload API** 방식을 통해 이미지를 서버로 직접 업로드하거나 **Presigned URL Download** 기능을 활용하려면 S3 또는 S3 호환 저장소 연동이 필수입니다.

### 필수 설정 항목

| 항목                  | 설명                      | 예시                                      |
| --------------------- | ------------------------- | ----------------------------------------- |
| **Access Key ID**     | S3 접근을 위한 키 ID      | `AKIAIOSFODNN7EXAMPLE`                    |
| **Secret Access Key** | 키에 대한 시크릿          | `wJalrXUtnFEMI/K7MDENG/...`               |
| **End Point**         | S3 API 엔드포인트 URL     | `https://s3.ap-northeast-1.amazonaws.com` |
| **Region**            | 버킷이 위치한 지역        | `ap-northeast-1`                          |
| **Bucket Name**       | 이미지가 저장될 대상 버킷 | `consumer-ufb-images`                     |

### Presigned URL Download 설정

**Presigned URL Download** 옵션을 통해 이미지 다운로드 보안을 강화할 수 있습니다.

#### 설정 옵션

- **Enable**: 인증된 일회용 URL을 통해 이미지 접근 (보안 강화)
- **Disable**: 이미지 URL이 직접 노출되어 공개 접근 가능

:::tip Presigned URL 권장 상황

- 비공개 S3 버킷을 사용하는 경우
- 이미지 접근을 제한하고 싶은 경우
- 보안이 중요한 기업 환경
  :::

### 연결 테스트

모든 설정을 입력한 후 **Test Connection** 버튼을 클릭하여 저장소 연결을 확인합니다.

연결 결과:

- ✅ **성공**: "Connection test succeeded" 메시지
- ❌ **실패**: 입력 값, 버킷 권한, 네트워크 설정 재확인 필요

---

## Image URL Domain Whitelist 설정

**Image URL 방식**을 사용하거나 보안을 강화하고 싶은 경우, 신뢰할 수 있는 도메인만 허용하도록 화이트리스트를 설정할 수 있습니다.

### 현재 상태 확인

기본 설정은 **"All image URLs are allowed"** 상태로, 모든 도메인의 이미지 URL을 허용합니다.

### 화이트리스트 추가

보안 강화를 위해 특정 도메인만 허용하려면:

1. **Whitelist** 영역에 신뢰할 수 있는 도메인 추가
2. 예시 도메인:
   - `cdn.yourcompany.com`
   - `images.trusted-partner.io`
   - `storage.googleapis.com`

:::warning 화이트리스트 적용 시점
도메인 화이트리스트는 **새 피드백 생성 시점에만** 검증됩니다. 이미 저장된 이미지 URL에는 소급 적용되지 않습니다.
:::

---

## 지원되는 저장소 서비스

### AWS S3

- 가장 일반적으로 사용되는 클라우드 스토리지
- 안정적이고 확장성이 뛰어남

:::info 이미지 업로드 방식
S3 호환 서비스도 연결 가능합니다.
:::

---

## 설정 저장

모든 설정을 완료한 후 우측 상단의 **Save** 버튼을 클릭하여 변경사항을 저장합니다.

저장 후에는:

- 새로운 이미지 업로드가 설정한 방식으로 동작
- 기존 이미지는 기존 설정 그대로 유지
- Test Connection으로 설정 정상 작동 여부 재확인 권장

---

## 문제 해결

### 자주 발생하는 문제

| 문제 유형                         | 증상                    | 해결 방법                                        |
| --------------------------------- | ----------------------- | ------------------------------------------------ |
| **연결 실패**                     | Test Connection 실패    | End Point URL, 네트워크 설정, API 키 유효성 확인 |
| **이미지 표시 안됨**              | 이미지가 로드되지 않음  | Presigned URL 설정 여부, URL 만료 여부 확인      |
| **업로드는 되지만 다운로드 불가** | 저장은 되나 접근 불가   | 버킷 권한 또는 Presigned URL 문제 확인           |
| **화이트리스트 오류**             | 특정 도메인 이미지 차단 | 도메인이 화이트리스트에 포함되어 있는지 확인     |

### 디버깅 체크리스트

- [ ] S3 버킷이 올바른 리전에 생성되어 있는지 확인
- [ ] Access Key ID와 Secret Access Key가 정확한지 확인
- [ ] End Point URL 형식이 올바른지 확인
- [ ] 버킷 이름에 오타가 없는지 확인
- [ ] 방화벽이나 네트워크 제한이 없는지 확인
- [ ] 화이트리스트 도메인이 정확히 입력되었는지 확인

---

## 관련 문서

- [필드 설정하기](/docs/01-user-guide/04-feedback-management.md) - 이미지 필드를 피드백 폼에 추가하는 방법
- [피드백 확인 및 필터링](/docs/01-user-guide/04-feedback-management.md) - 업로드된 이미지를 피드백에서 확인하는 방법
- [API 키 관리](./02-api-key-management.md) - API 키 보안 관리 방법
