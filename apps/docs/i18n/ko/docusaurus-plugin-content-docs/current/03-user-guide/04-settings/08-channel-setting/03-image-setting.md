---
sidebar_position: 3
title: '이미지 관리'
description: '피드백에 첨부된 이미지 저장소 연동 및 도메인 화이트리스트 설정'
---

# 이미지 관리

피드백에 첨부된 이미지를 안전하게 저장하고 관리하기 위한 설정입니다.

## 접근 방법

1. **Settings** > **Channel List** > 채널 선택
2. **Image Management** 탭 클릭

## 이미지 업로드 방법

ABC User Feedback은 두 가지 이미지 업로드 방법을 지원합니다:

### 1. Multipart Upload API

- 이미지 저장소 연동 설정 후 서버로 직접 업로드
- 보안이 강화된 업로드 방식
- S3 또는 S3 호환 저장소 필요

### 2. Image URL 방식

- 이미지 URL을 피드백과 함께 제출
- 저장소 설정 불필요
- 화이트리스트 도메인의 URL만 허용

## Image Storage Integration 설정

S3 또는 S3 호환 저장소를 연동하여 이미지를 안전하게 저장할 수 있습니다.

### 필수 설정 항목

| 필드                  | 설명                         | 예시                                       |
| --------------------- | ---------------------------- | ------------------------------------------ |
| **Access Key ID**     | 저장소 서비스 접근 키 ID     | `AKIAIOSFODNN7EXAMPLE`                     |
| **Secret Access Key** | 저장소 서비스 비밀 키        | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| **End Point**         | 저장소 서비스 엔드포인트 URL | `https://s3.amazonaws.com`                 |
| **Region**            | 저장소 서비스 지역           | `us-east-1`                                |
| **Bucket Name**       | 이미지가 저장될 버킷 이름    | `my-feedback-images`                       |

### 추가 설정

**Presigned URL Download**

- 활성화 시 사전 서명된 URL로 다운로드 보안 강화
- AWS S3의 사전 서명 URL 기능 활용
- 선택/비선택 가능

### 연결 테스트

**Test Connection** 버튼으로 설정한 저장소 연결 상태를 확인할 수 있습니다.

## Image URL Domain Whitelist

신뢰할 수 있는 도메인에서만 이미지 URL을 허용하도록 설정합니다.

### 화이트리스트 설정

**Whitelist 탭**에서 허용할 도메인 목록을 관리할 수 있습니다.

- 기본값: "All Image URLs are allowed" (모든 URL 허용)
- 보안 강화를 위해 특정 도메인만 허용 권장

### 중요 사항

:::warning 화이트리스트 적용 시점
도메인 화이트리스트는 **새 피드백 제출 시에만** 검증됩니다. 이미 데이터베이스에 저장된 이미지 URL은 화이트리스트 변경의 영향을 받지 않습니다.
:::

## 버킷 권한 설정

### 공개 접근이 필요한 경우

이미지가 공개적으로 접근 가능해야 한다면 S3 버킷 정책을 다음과 같이 설정하세요:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### 제한된 접근이 필요한 경우

Presigned URL Download 기능을 활용하여 보안을 유지하면서 접근을 제어할 수 있습니다.

## API 연동

### Multipart Upload API 사용

저장소 설정 완료 후 API 문서에서 확인할 수 있습니다:

- `{API server host}/docs`
- `{API server host}/docs/redoc`

### Feedback API with Image URLs

```json
{
  "message": "앱이 자주 멈춰요",
  "images": [
    "https://trusted-domain.com/screenshot1.png",
    "https://trusted-domain.com/screenshot2.png"
  ]
}
```

## 모범 사례

### 보안

- 신뢰할 수 있는 도메인만 화이트리스트에 추가
- Presigned URL Download 기능 활용으로 접근 제어
- 정기적인 접근 키 교체

### 성능

- 적절한 이미지 크기 제한 설정
- CDN 활용으로 이미지 로딩 속도 향상
- 이미지 압축 및 최적화

### 비용 관리

- 버킷 생명주기 정책으로 오래된 이미지 자동 삭제
- 스토리지 클래스 최적화
- 사용량 모니터링 및 알림 설정

---

이미지 관리 설정은 피드백의 시각적 정보를 안전하게 보관하고 효율적으로 활용하는 데 중요합니다.
