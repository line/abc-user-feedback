---
id: smtp-configuration
title: SMTPサーバー統合ガイド
description: 本番環境で認証メール送信のための外部SMTPサーバー統合方法を案内します。
sidebar_position: 4
---

# SMTPサーバー統合ガイド

本番環境では、`smtp4dev`のようなローカルテストサーバーではなく、  
**外部SMTPサーバー（Gmail、SendGrid、会社SMTPなど）**と接続して  
認証メール（登録、パスワードリセットなど）を正常に送信できる必要があります。

このドキュメントでは、SMTPサーバー統合のための環境変数設定と主要な統合事例を案内します。

---

## 1. SMTP関連環境変数

`api`サービスまたは`.env`ファイルに次の環境変数を設定してください：

> **参考**: 認証が不要なSMTPサーバーの場合、`SMTP_USERNAME`と`SMTP_PASSWORD`は省略できます。

| 環境変数                | 説明                                            | 必須 |
| ------------------------ | ----------------------------------------------- | --------- |
| `SMTP_HOST`              | SMTPサーバーアドレス（例：smtp.gmail.com）             | 必須      |
| `SMTP_PORT`              | ポート番号（通常587、465など）                    | 必須      |
| `SMTP_SENDER`            | 送信者メールアドレス（例：`noreply@yourdomain.com`） | 必須      |
| `SMTP_USERNAME`          | SMTP認証ユーザー名（アカウントID）                    | オプション      |
| `SMTP_PASSWORD`          | SMTP認証パスワードまたはAPIキー                  | オプション      |
| `SMTP_TLS`               | TLS使用有無（`true`または`false`）             | オプション      |
| `SMTP_CIPHER_SPEC`       | TLS暗号化アルゴリズム（デフォルト：`TLSv1.2`）         | オプション      |
| `SMTP_OPPORTUNISTIC_TLS` | STARTTLS使用有無（`true`または`false`）        | オプション      |

> **重要**: 実際のコードでは`SMTP_USERNAME`と`SMTP_PASSWORD`が使用され、`SMTP_TLS=true`はポート465に、`false`はポート587に主に使用されます。

---

## 2. Docker環境例

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

または`.env`ファイルで分離管理できます：

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

## 3. SMTP統合例

### ✅ Gmail SMTP統合（個人テスト用）

- `SMTP_HOST`: `smtp.gmail.com`
- `SMTP_PORT`: `587`
- `SMTP_USERNAME`: Gmailアドレス（例：`abc@gmail.com`）
- `SMTP_PASSWORD`: **アプリパスワード**（安全性の低いアプリを許可 → 非推奨）
- `SMTP_TLS`: `false`
- `SMTP_OPPORTUNISTIC_TLS`: `true`

> Gmailアカウントに**2段階認証**が有効になっている場合、[アプリパスワード](https://myaccount.google.com/apppasswords)を作成する必要があります。

---

### ✅ SendGrid統合（推奨）

- `SMTP_HOST`: `smtp.sendgrid.net`
- `SMTP_PORT`: `587`
- `SMTP_USERNAME`: `apikey`
- `SMTP_PASSWORD`: 実際のSendGrid APIキー
- `SMTP_SENDER`: 確認済み送信者アドレス
- `SMTP_TLS`: `false`
- `SMTP_OPPORTUNISTIC_TLS`: `true`

---

## 4. テスト方法

### 4.1 メール送信テスト

1. **メール認証テスト**：

   - 管理者またはユーザーアカウント作成
   - メール認証コード送信確認

2. **パスワードリセットテスト**：

   - パスワードリセットリクエスト
   - リセットリンクが含まれたメール受信確認

3. **ユーザー招待テスト**：
   - 管理者が新しいユーザーを招待
   - 招待メール送信確認

### 4.2 ログ確認

メール送信失敗時、次のコマンドで詳細ログを確認してください：

```bash
# Docker Compose環境
docker compose logs api

# 特定時間帯のログ確認
docker compose logs --since=10m api

# リアルタイムログモニタリング
docker compose logs -f api
```

SMTPエラーが発生すると、ログに詳細メッセージが表示されます。

---

## 5. トラブルシューティング

| 問題タイプ                  | 原因または解決方法                      |
| -------------------------- | ---------------------------------------- |
| 認証エラー（`535`）          | `SMTP_USERNAME` / `SMTP_PASSWORD`再確認 |
| 接続拒否（`ECONNREFUSED`） | ファイアウォールまたは誤ったポート設定             |
| メールが届かない               | `SMTP_SENDER`が認証されていない            |
| TLSエラー（`ETLS`）          | `SMTP_TLS`設定が誤っている                 |
| STARTTLS失敗              | `SMTP_OPPORTUNISTIC_TLS`設定確認       |

---

## 6. SMTPに関連するメールテンプレート

現在、システムでメールは次の状況で送信されます：

- **メール認証**: 管理者/ユーザー登録時に認証コード送信
- **パスワードリセット**: パスワードリセットリクエスト時にリンク送信
- **ユーザー招待**: 管理者がユーザーを招待するときに招待メール送信

メール内容は**Handlebarsテンプレート**ベースで構成されており、次の情報が含まれます：

- 送信者: `"User feedback" <SMTP_SENDER>`
- 基本URL: `ADMIN_WEB_URL`環境変数値を使用
- テンプレート位置: `src/configs/modules/mailer-config/templates/`

---

## 関連ドキュメント

- [Docker Hubインストールガイド](./docker-hub-images)
- [環境変数設定](./configuration)
- [初期設定ガイド](/ja/user-guide/getting-started)

