---
sidebar_position: 2
title: '이미지 저장소 연동'
description: 'ABC User Feedback의 이미지 저장소 연동 방법을 안내합니다.'
---

# 이미지 저장소 연동

이 페이지는 ABC User Feedback의 이미지 저장소 연동에 대해 설명합니다.

## 개요

ABC User Feedback은 사용자 피드백에 첨부된 이미지를 관리하기 위해 S3 및 S3 호환 스토리지를 지원합니다.

## 주요 내용

### 이미지 저장소 연동

#### 업로드 방법

1. **멀티파트 업로드 API 사용**
   - S3 설정을 완료한 후, 멀티파트 업로드 API를 통해 직접 파일 업로드가 가능합니다.
   - 이 경우 멀티파트 업로드 API로 전송된 파일은 설정된 S3 스토리지에 저장됩니다.
2. **이미지 URL 제출**
   - 별도 설정 없이, 이미지 URL만 포함하여 피드백 생성이 가능합니다.
   - 단, URL은 사전에 등록된 허용 도메인(Whitelist) 목록에 포함되어야 합니다.

> 자세한 사용 방법은 API 문서(`/docs` 또는 `/docs/redoc`)를 참조하세요.

#### S3 설정

이미지 업로드를 활성화하려면 다음 항목을 설정해야 합니다:

**필수 설정 항목:**

- `accessKeyId`: S3에서 발급받은 access key를 입력합니다.
- `secretAccessKey`: S3에서 발급받은 secret access key를 입력합니다.
- `endpoint`: S3 endpoint를 입력합니다. (example: https://s3.ap-northeast-1.amazonaws.com)
- `region`: S3 region을 입력합니다. (example: ap-northeast-1)
- `bucket`: S3 bucket 이름을 입력합니다.

**선택 설정 항목:**

- `enablePresignedUrlDownload`: 이미지 다운로드 보안 강화를 위해 S3에서 제공하는 pre-signed URL 기능 사용여부를 설정합니다. (기본값: false)

위 항목들을 설정 후에 `Test Connection` 버튼을 이용하여 S3 스토리지와 연결이 잘 되는지 확인할 수 있습니다.

#### 도메인 화이트리스트

- 이미지 URL 등록 시, 허용된 도메인만 저장할 수 있도록 제한합니다.
- 최초 업로드 시에만 검사하며, 이미 저장된 이미지 URL에는 소급적용 되지 않습니다.

## API 사용 방법

### 1. Presigned URL을 통한 이미지 업로드

이미지 업로드를 위한 presigned URL을 발급받아 직접 S3에 업로드하는 방법입니다.

#### Presigned URL 발급

`GET /api/projects/{projectId}/channels/{channelId}/image-upload-url`

**요청 예시:**

```bash
curl --request GET '{API_ENDPOINT}/api/projects/{PROJECT_ID}/channels/{CHANNEL_ID}/image-upload-url?extension=png' \
--header 'x-api-key: {API_KEY}'
```

**응답 예시:**

```json
"https://bucket-name.s3.ap-northeast-1.amazonaws.com/1_1_1703123456789.png?X-Amz-Algorithm=..."
```

#### Presigned URL로 이미지 업로드

발급받은 presigned URL을 사용하여 PUT 요청으로 이미지를 업로드합니다.

```bash
curl --request PUT '{PRESIGNED_URL}' \
--header 'Content-Type: image/png' \
--data-binary '@/path/to/image.png'
```

### 2. 멀티파트 업로드를 통한 피드백 생성

이미지 파일과 함께 피드백을 직접 생성하는 방법입니다.

`POST /api/projects/{projectId}/channels/{channelId}/feedbacks-with-images`

**요청 예시:**

```bash
curl --request POST '{API_ENDPOINT}/api/projects/{PROJECT_ID}/channels/{CHANNEL_ID}/feedbacks-with-images' \
--header 'x-api-key: {API_KEY}' \
--form 'message="피드백 메시지"' \
--form 'imageFiles=@/path/to/image1.png' \
--form 'imageFiles=@/path/to/image2.jpg'
```

### 3. 이미지 다운로드 URL 생성 (Admin용)

보안이 강화된 이미지 다운로드를 위한 presigned URL을 생성합니다.

`GET /admin/projects/{projectId}/channels/{channelId}/image-download-url`

**요청 예시:**

```bash
curl --request GET '{API_ENDPOINT}/admin/projects/{PROJECT_ID}/channels/{CHANNEL_ID}/image-download-url?imageKey=1_1_1703123456789.png' \
--header 'Authorization: Bearer {JWT_TOKEN}'
```

## 제한사항 및 주의사항

### 파일 형식 제한

- 지원되는 이미지 형식: PNG, JPEG, GIF, WebP
- 파일 크기 제한: 설정에 따라 다름 (기본값 확인 필요)
- 파일명에 특수문자 사용 시 URL 인코딩 필요

### 보안 고려사항

- Presigned URL은 1시간 후 만료됩니다
- 이미지 파일은 실제 파일 타입 검증을 수행합니다
- 허용되지 않은 파일 형식은 업로드가 거부됩니다

### 에러 처리

- S3 연결 실패 시 `BadRequestException` 발생
- 이미지 설정이 없는 채널에서 업로드 시도 시 `BadRequestException` 발생
- 잘못된 파일 형식 업로드 시 `BadRequestException` 발생

## 추가 정보

- presigned URL에 대해서는 [AWS 공식 문서](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)를 참조하세요.
- 자세한 API 명세와 예시는 `/docs` 경로의 Swagger 문서를 참고하세요.
- [Guide 문서](https://github.com/line/abc-user-feedback/blob/main/GUIDE.md)에도 자세한 설명이 있습니다.
