#!/bin/bash

# 문서 루트 디렉토리 설정 (기본값은 현재 디렉토리의 docs 폴더)
DOCS_ROOT="./docs"

# 기본 문서 디렉토리가 없으면 생성
mkdir -p "$DOCS_ROOT"

# 문서 카테고리 및 파일 생성 함수
create_doc_file() {
    local dir="$1"
    local file="$2"
    local title="$3"
    local order="$4"
    
    mkdir -p "$dir"
    
    # 파일 경로
    local filepath="$dir/$file.md"
    
    # 파일이 이미 존재하는지 확인
    if [ -f "$filepath" ]; then
        echo "파일이 이미 존재합니다: $filepath"
        return
    fi
    
    # 마크다운 파일 생성 (Docusaurus frontmatter 포함)
    cat > "$filepath" << EOF
---
sidebar_position: $order
title: '$title'
description: '$title에 대한 설명입니다.'
---

# $title

이 페이지는 '$title'에 대한 내용을 다룹니다.

## 개요

여기에 '$title'에 대한 개요를 작성하세요.

## 주요 내용

여기에 주요 내용을 작성하세요.

## 추가 정보

여기에 추가 정보를 작성하세요.
EOF

    echo "생성됨: $filepath"
}

# 메인 카테고리 생성 함수
create_category() {
    local category="$1"
    local title="$2"
    local order="$3"
    
    # 카테고리 디렉토리 생성
    local category_dir="$DOCS_ROOT/$category"
    mkdir -p "$category_dir"
    
    # 카테고리 인덱스 파일 생성 (_category_.json)
    cat > "$category_dir/_category_.json" << EOF
{
  "label": "$title",
  "position": $order,
  "link": {
    "type": "generated-index",
    "description": "$title에 대한 문서입니다."
  }
}
EOF

    echo "카테고리 생성됨: $category_dir"
}

echo "ABC User Feedback 문서 구조 생성을 시작합니다..."

# 1. 소개
create_category "01-introduction" "소개" 1
create_doc_file "$DOCS_ROOT/01-introduction" "01-project-overview" "프로젝트 개요" 1
create_doc_file "$DOCS_ROOT/01-introduction" "02-key-features" "주요 기능" 2
create_doc_file "$DOCS_ROOT/01-introduction" "03-architecture-overview" "아키텍처 개요" 3
create_doc_file "$DOCS_ROOT/01-introduction" "04-use-cases" "사용 사례" 4

# 2. 시작하기
create_category "02-getting-started" "시작하기" 2
create_doc_file "$DOCS_ROOT/02-getting-started" "01-system-requirements" "시스템 요구사항" 1

# 설치 가이드 서브 카테고리
create_category "02-getting-started/02-installation" "설치 가이드" 2
create_doc_file "$DOCS_ROOT/02-getting-started/02-installation" "01-docker-hub-images" "Docker Hub 이미지 사용" 1
create_doc_file "$DOCS_ROOT/02-getting-started/02-installation" "02-cli-tool" "CLI 도구 사용" 2
create_doc_file "$DOCS_ROOT/02-getting-started/02-installation" "03-manual-setup" "수동 설치" 3

create_doc_file "$DOCS_ROOT/02-getting-started" "03-initial-setup" "초기 설정" 3
create_doc_file "$DOCS_ROOT/02-getting-started" "04-quick-start" "빠른 시작 튜토리얼" 4

# 3. 사용자 가이드
create_category "03-user-guide" "사용자 가이드" 3
create_doc_file "$DOCS_ROOT/03-user-guide" "01-dashboard-overview" "대시보드 개요" 1

# 피드백 관리 서브 카테고리
create_category "03-user-guide/02-feedback-management" "피드백 관리" 2
create_doc_file "$DOCS_ROOT/03-user-guide/02-feedback-management" "01-viewing-filtering" "피드백 조회 및 필터링" 1
create_doc_file "$DOCS_ROOT/03-user-guide/02-feedback-management" "02-tagging-system" "피드백 태그 시스템" 2

# 이슈 관리 서브 카테고리
create_category "03-user-guide/03-issue-management" "이슈 관리" 3
create_doc_file "$DOCS_ROOT/03-user-guide/03-issue-management" "01-issue-tracker" "이슈 트래커 사용법" 1
create_doc_file "$DOCS_ROOT/03-user-guide/03-issue-management" "02-kanban-mode" "칸반 모드 활용" 2

# 설정 서브 카테고리
create_category "03-user-guide/04-settings" "설정 및 환경설정" 4
create_doc_file "$DOCS_ROOT/03-user-guide/04-settings" "01-user-role-management" "사용자 및 역할 관리" 1
create_doc_file "$DOCS_ROOT/03-user-guide/04-settings" "02-sso-configuration" "싱글 사인온(SSO) 설정" 2

# 4. 통합 가이드
create_category "04-integration-guide" "통합 가이드" 4
create_doc_file "$DOCS_ROOT/04-integration-guide" "01-api-overview" "API 개요" 1
create_doc_file "$DOCS_ROOT/04-integration-guide" "02-image-storage" "이미지 스토리지 통합" 2
create_doc_file "$DOCS_ROOT/04-integration-guide" "03-webhooks" "웹훅 설정 및 활용" 3
create_doc_file "$DOCS_ROOT/04-integration-guide" "04-external-systems" "외부 시스템 연동" 4

# 5. 개발자 가이드
create_category "05-developer-guide" "개발자 가이드" 5
create_doc_file "$DOCS_ROOT/05-developer-guide" "01-detailed-architecture" "아키텍처 상세" 1
create_doc_file "$DOCS_ROOT/05-developer-guide" "02-local-development" "로컬 개발 환경 설정" 2
create_doc_file "$DOCS_ROOT/05-developer-guide" "03-contribution-guide" "코드 기여 가이드" 3
create_doc_file "$DOCS_ROOT/05-developer-guide" "04-extensions" "확장 개발" 4

# 6. 운영 가이드
create_category "06-operations-guide" "운영 가이드" 6

# 환경 변수 서브 카테고리
create_category "06-operations-guide/01-environment-variables" "환경 변수 및 설정" 1
create_doc_file "$DOCS_ROOT/06-operations-guide/01-environment-variables" "01-frontend-config" "프론트엔드 설정" 1
create_doc_file "$DOCS_ROOT/06-operations-guide/01-environment-variables" "02-backend-config" "백엔드 설정" 2

create_doc_file "$DOCS_ROOT/06-operations-guide" "02-database-management" "데이터베이스 관리" 2
create_doc_file "$DOCS_ROOT/06-operations-guide" "03-performance-optimization" "성능 최적화" 3
create_doc_file "$DOCS_ROOT/06-operations-guide" "04-troubleshooting" "문제 해결" 4

# 7. 커뮤니티 및 지원
create_category "07-community-support" "커뮤니티 및 지원" 7
create_doc_file "$DOCS_ROOT/07-community-support" "01-faq" "FAQ" 1
create_doc_file "$DOCS_ROOT/07-community-support" "02-known-issues" "알려진 이슈" 2
create_doc_file "$DOCS_ROOT/07-community-support" "03-getting-help" "지원 받는 방법" 3

# 8. 릴리스 정보
create_category "08-release-info" "릴리스 정보" 8
create_doc_file "$DOCS_ROOT/08-release-info" "01-version-history" "버전 히스토리" 1
create_doc_file "$DOCS_ROOT/08-release-info" "02-roadmap" "로드맵" 2

# 메인 인덱스 파일 생성
cat > "$DOCS_ROOT/index.md" << EOF
---
sidebar_position: 1
slug: /
---

# ABC User Feedback 문서

환영합니다! 이 문서는 ABC User Feedback에 대한 포괄적인 가이드를 제공합니다.

## ABC User Feedback이란?

ABC User Feedback은 고객의 소리(Voice of Customer, VoC)를 효율적으로 수집, 분류 및 관리하기 위해 설계된 독립형 웹 애플리케이션입니다. 이 오픈소스 솔루션은 사용자 피드백을 체계적으로 관리하여 제품과 서비스 개선에 필요한 인사이트를 도출하는 데 중점을 두고 있습니다.

## 시작하기

새로운 사용자이신가요? [시작하기](/docs/category/시작하기) 섹션에서 설치 방법과 기본 사용법을 알아보세요.

## 주요 섹션

- [사용자 가이드](/docs/category/사용자-가이드) - 웹 인터페이스 사용 방법
- [통합 가이드](/docs/category/통합-가이드) - API, 웹훅, 외부 시스템 연동
- [개발자 가이드](/docs/category/개발자-가이드) - 개발 환경 설정 및 기여 방법
- [운영 가이드](/docs/category/운영-가이드) - 배포 및 유지 관리

## 지원 받기

질문이 있으신가요? [커뮤니티 및 지원](/docs/category/커뮤니티-및-지원) 섹션을 확인하세요.
EOF

echo "ABC User Feedback 문서 구조 생성이 완료되었습니다!"
echo "생성된 문서는 $DOCS_ROOT 디렉토리에 있습니다."
