---
sidebar_position: 3
title: "OAuth統合"
description: "Google OAuthおよびカスタムOAuthプロバイダーによるシングルサインオン（SSO）統合方法を案内します。"
---

# OAuth統合

ABC User FeedbackでOAuth 2.0ベースのシングルサインオン（SSO）を設定すると、ユーザーは別のアカウント作成なしで既存のアカウント（Google、Microsoft、GitHubなど）でログインできます。これはユーザーの利便性を向上させ、企業環境で統合認証を実装するために不可欠です。

---

## OAuth統合の概要

ABC User FeedbackでサポートされるOAuth方式：

### 1. Google OAuth

- 追加設定なしでデフォルト提供
- Googleアカウントによる簡単なログイン

### 2. カスタムOAuthプロバイダー

- 社内認証システム
- その他のOAuth 2.0/OpenID Connect互換サービス

OAuthを設定すると、既存のメールログインと並行して使用でき、組織ポリシーに応じてOAuthのみを許可するように制限することもできます。

---

## Google OAuth統合設定

### Google Cloud Consoleでの設定

#### 1. Google Cloud Consoleにアクセス

[Google Cloud Console](https://console.cloud.google.com)にアクセスしてプロジェクトを作成するか、既存のプロジェクトを選択します。

#### 2. OAuth 2.0クライアントID作成

1. **APIとサービス > 認証情報**メニューに移動
2. **+ 認証情報を作成 > OAuthクライアントID**を選択
3. アプリケーションタイプを**ウェブアプリケーション**として選択

#### 3. 承認済みリダイレクトURI設定

**承認済みリダイレクトURI**に次のURLを追加します：

```
https://your-domain.com/auth/oauth-callback
```

例：

- `https://feedback.company.com/auth/oauth-callback`
- `http://localhost:3000/auth/oauth-callback`（開発環境）

#### 4. クライアント情報確認

作成完了後、次の情報を確認してコピーしておきます：

- **クライアントID**: `1234567890-abc123def456.apps.googleusercontent.com`
- **クライアントシークレット**: `GOCSPX-abcdef123456`

### ABC User FeedbackでのGoogle OAuth設定

Google OAuthを使用するには、次の手順に従って設定する必要があります：

#### 1. Google OAuth設定有効化

**Settings > Login Management**で：

1. **OAuth2.0 Login**トグルを有効化
2. **Login Button Type**を"Google Login"として選択
3. Google Cloud Consoleで取得した情報を入力：
   - **Client ID**: Google Cloud Consoleで作成したクライアントID
   - **Client Secret**: Google Cloud Consoleで作成したクライアントシークレット
   - **Authorization Code Request URL**: `https://accounts.google.com/o/oauth2/v2/auth`
   - **Scope**: `openid email profile`
   - **Access Token URL**: `https://oauth2.googleapis.com/token`
   - **User Profile Request URL**: `https://www.googleapis.com/oauth2/v2/userinfo`
   - **Email Key**: `email`

#### 2. リダイレクトURI登録

Google Cloud Consoleで次のURLを**承認済みリダイレクトURI**に追加：

```
https://your-domain.com/auth/oauth-callback
```

開発環境の場合：

```
http://localhost:3000/auth/oauth-callback
```

---

## カスタムOAuthプロバイダー統合

### 社内認証システム統合

ABC User Feedbackは、企業環境で使用される社内認証システムと統合できます。ほとんどの社内認証システムはOAuth 2.0またはOpenID Connect標準をサポートしているため、標準OAuthフローを通じて統合が可能です。

#### 社内認証システム設定要件

社内認証システムと統合するには、次の情報が必要です：

1. **OAuthクライアント登録**

   - クライアントID
   - クライアントシークレット
   - リダイレクトURI: `https://your-domain.com/auth/oauth-callback`

2. **OAuthエンドポイント情報**

   - Authorization URL（認証リクエストURL）
   - Token URL（トークン交換URL）
   - User Info URL（ユーザー情報照会URL）

3. **権限範囲（Scope）**
   - ユーザープロフィール情報アクセス権限
   - メールアドレスアクセス権限

#### 一般的な社内認証システム例

| 項目                               | 説明                               | 社内システム例                           |
| ---------------------------------- | ---------------------------------- | ------------------------------------------ |
| **Login Button Type**              | ログインボタンタイプ                   | `CUSTOM`                                   |
| **Login Button Name**              | ログインボタンに表示される名前          | `社内アカウントでログイン`                     |
| **Client ID**                      | OAuthクライアントID                | `company-auth-client-123`                  |
| **Client Secret**                  | クライアントシークレット           | `company-secret-abc123`                    |
| **Authorization Code Request URL** | ユーザー認証リクエストURL               | `https://auth.company.com/oauth/authorize` |
| **Scope**                          | リクエストする権限範囲                   | `openid email profile`                     |
| **Access Token URL**               | トークンリクエストURL                      | `https://auth.company.com/oauth/token`     |
| **User Profile Request URL**       | ユーザー情報照会API               | `https://auth.company.com/api/user`        |
| **Email Key**                      | ユーザー情報JSONのメールフィールド名 | `email`または`mail`                        |

### その他のOAuth 2.0/OpenID Connect互換サービス

ABC User Feedbackは、OAuth 2.0またはOpenID Connect標準に準拠するすべての認証サービスと統合できます。

#### サポート可能なサービスタイプ

- **OpenID Connectプロバイダー**: 標準OpenID Connectプロトコルをサポートするサービス
- **OAuth 2.0プロバイダー**: OAuth 2.0 Authorization Codeフローをサポートするサービス
- **カスタム認証サーバー**: 標準OAuthエンドポイントを提供する自己構築サービス

#### 統合設定方法

**Settings > Login Management**でカスタムOAuthを設定します：

1. **管理者アカウントでログイン**後、**Settings > Login Management**メニューに移動
2. **OAuth2.0 Login**トグルを有効化
3. **Login Button Type**を`CUSTOM`として選択
4. 認証サービスプロバイダーから受け取った情報を入力：
   - **Login Button Name**: ログインボタンに表示されるテキスト（例：「社内アカウントでログイン」）
   - **Client ID**: OAuthクライアント識別子
   - **Client Secret**: クライアント認証シークレット
   - **Authorization Code Request URL**: ユーザー認証リクエストURL
   - **Scope**: リクエストする権限範囲（スペース区切り、例：「openid email profile」）
   - **Access Token URL**: アクセストークンリクエストURL
   - **User Profile Request URL**: ユーザープロフィール情報照会URL
   - **Email Key**: ユーザー情報JSONのメールフィールド名（例：「email」または「mail」）

---

## 関連ドキュメント

- [ログイン管理](/ja/user-guide/settings/tenant-settings) - UIでOAuthを設定する方法

