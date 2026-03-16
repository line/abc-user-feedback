---
id: configuration
title: 環境変数構成
description: ABC User FeedbackのAPIおよびウェブサーバーの環境変数構成方法を説明します。
sidebar_position: 5
---

# 環境変数構成

このドキュメントでは、ABC User Feedbackの**APIサーバー**および**ウェブサーバー**で使用する主要な環境変数と設定方法を説明します。

---

## 1. APIサーバー環境変数

### 必須環境変数

| 環境変数                     | 説明                      | デフォルト | 例                               |
| ---------------------------- | ------------------------- | ---------- | -------------------------------- |
| `JWT_SECRET`                 | JWT署名用シークレットキー | なし       | `jwtsecretjwtsecretjwtsecret`    |
| `MYSQL_PRIMARY_URL`          | MySQL接続URL              | なし       | `mysql://user:pass@host:3306/db` |
| `ACCESS_TOKEN_EXPIRED_TIME`  | Access Token有効期間      | `10m`      | `10m`、`30s`、`1h`               |
| `REFRESH_TOKEN_EXPIRED_TIME` | Refresh Token有効期間     | `1h`       | `1h`、`7d`                       |

> JWTシークレットは十分に複雑で安全な文字列を使用する必要があります。

⚠️ **セキュリティ注意事項**：

- `JWT_SECRET`は最低32文字以上の複雑な文字列を使用してください
- 本番環境では絶対にデフォルト値を使用しないでください
- 環境変数ファイル（`.env`）はバージョン管理に含めないでください
- 機密情報は環境変数やシークレット管理システムを通じて管理してください

---

### オプション環境変数

| 環境変数               | 説明                                              | デフォルト              | 例                          |
| ---------------------- | ------------------------------------------------- | ----------------------- | --------------------------- |
| `APP_PORT`             | APIサーバーポート                                 | `4000`                  | `4000`                      |
| `APP_ADDRESS`          | バインドアドレス                                  | `0.0.0.0`               | `127.0.0.1`                 |
| `ADMIN_WEB_URL`        | 管理者ウェブURL                                   | `http://localhost:3000` | `https://admin.company.com` |
| `BASE_URL`             | Swaggerドキュメントで使用するAPIサーバーの公開URL | なし                    | `https://api.example.com`   |
| `MYSQL_SECONDARY_URLS` | セカンダリDB URL（JSON配列）                      | なし                    | `["mysql://..."]`           |
| `AUTO_MIGRATION`       | アプリ起動時のDB自動マイグレーション              | `true`                  | `false`                     |
| `MASTER_API_KEY`       | マスター権限APIキー（オプション）                 | なし                    | `abc123xyz`                 |
| `NODE_OPTIONS`         | Node実行オプション                                | なし                    | `--max_old_space_size=4096` |

---

### SMTP設定（メール認証）

| 環境変数                 | 説明                             | 例                             |
| ------------------------ | -------------------------------- | ------------------------------ |
| `SMTP_HOST`              | SMTPサーバーアドレス             | `smtp.gmail.com`               |
| `SMTP_PORT`              | ポート（通常587または465）       | `587`                          |
| `SMTP_USERNAME`          | ログインユーザー                 | `user@example.com`             |
| `SMTP_PASSWORD`          | ログインパスワードまたはトークン | `app-password`                 |
| `SMTP_SENDER`            | 送信者アドレス                   | `noreply@company.com`          |
| `SMTP_BASE_URL`          | メール内リンク用基本URL          | `https://feedback.company.com` |
| `SMTP_TLS`               | TLS使用有無                      | `true`                         |
| `SMTP_CIPHER_SPEC`       | 暗号化仕様                       | `TLSv1.2`                      |
| `SMTP_OPPORTUNISTIC_TLS` | STARTTLSサポート有無             | `true`                         |

📎 詳細設定については、[SMTP統合ガイド](./04-smtp-configuration.md)を参照してください。

---

## 2. OpenSearch設定（オプション）

| 環境変数              | 説明                 | 例                      |
| --------------------- | -------------------- | ----------------------- |
| `OPENSEARCH_USE`      | OpenSearch有効化有無 | `true`                  |
| `OPENSEARCH_NODE`     | OpenSearchノードURL  | `http://localhost:9200` |
| `OPENSEARCH_USERNAME` | 認証ID               | `admin`                 |
| `OPENSEARCH_PASSWORD` | 認証パスワード       | `admin123`              |

> OpenSearchは検索速度向上およびAI機能改善に使用されます。

---

## 3. 自動フィードバック削除設定

| 環境変数                             | 説明                             | デフォルト / 条件       |
| ------------------------------------ | -------------------------------- | ----------------------- |
| `AUTO_FEEDBACK_DELETION_ENABLED`     | 古いフィードバック削除機能有効化 | `false`                 |
| `AUTO_FEEDBACK_DELETION_PERIOD_DAYS` | 削除基準日数                     | `365`（有効な場合必須） |

---

## 4. APIログExport設定（オプション）

APIは標準のコンソールログに加えて、OpenTelemetry経由でアプリケーションログをexportできます。

<!-- markdownlint-disable MD060 -->

| 環境変数                           | 説明                                                              | デフォルト | 例                              |
| ---------------------------------- | ----------------------------------------------------------------- | ---------- | ------------------------------- |
| `OTEL_LOG_EXPORT_ENABLED`          | APIサーバーのOTLPログexportを有効化するか                         | `false`    | `true`                          |
| `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT` | pino OpenTelemetry transportが使用するOTLP HTTPログエンドポイント | なし       | `http://localhost:4319/v1/logs` |

<!-- markdownlint-enable MD060 -->

> `OTEL_LOG_EXPORT_ENABLED=true` の場合、APIはpretty consoleログを継続して出力しつつ、同じログを設定されたOTLP HTTPエンドポイントにも送信します。
> ローカル開発環境では `apps/api/.env.example` の例を基準に設定してください。

### ローカル検証手順

- リポジトリルートでローカルOTELテストスタックを起動します。

```bash
docker compose -f docker/docker-compose.otel-test.yml up -d
```

- `apps/api/.env.example` を参考にして、`apps/api/.env` に次の値を設定します。

```env
OTEL_LOG_EXPORT_ENABLED=true
OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://localhost:4319/v1/logs
```

- APIサーバーを起動し、ログが発生するリクエストを送信します。

```bash
pnpm --dir apps/api dev
```

- OpenTelemetryパイプラインがログを受信していることを確認します。
  - Vectorはポート `4319` でOTLPログを受信し、変換済みログレコードをコンソールへ出力します。
  - OpenSearchにはホストポート `9201` でアクセスできる必要があります。
  - OpenSearch Dashboardsには [http://localhost:5602](http://localhost:5602) でアクセスでき、ローカルスタックが作成した `logs-*` インデックスを確認できます。

> ローカルテストスタックは `docker/docker-compose.otel-test.yml` の定義に従い、OTLP HTTP `4319`、OpenSearch `9201`、OpenSearch Dashboards `5602` を使用します。

---

## 5. ウェブサーバー環境変数

### 必須環境変数

| 環境変数                   | 説明                                      | 例                      |
| -------------------------- | ----------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | クライアントで使用するAPIサーバーアドレス | `http://localhost:4000` |

### オプション環境変数

| 環境変数 | 説明                 | デフォルト | 例     |
| -------- | -------------------- | ---------- | ------ |
| `PORT`   | フロントエンドポート | `3000`     | `3000` |

---

## 6. 設定方法

### Docker Compose例

```yaml
services:
  api:
    image: line/abc-user-feedback-api
    environment:
      - JWT_SECRET=changeme
      - MYSQL_PRIMARY_URL=mysql://user:pass@mysql:3306/userfeedback
      - SMTP_HOST=smtp.sendgrid.net
      - SMTP_USERNAME=apikey
      - SMTP_PASSWORD=your-sendgrid-key
```

### .envファイル例

```env
# apps/api/.env
JWT_SECRET=changemechangemechangeme
MYSQL_PRIMARY_URL=mysql://root:pass@localhost:3306/db
ACCESS_TOKEN_EXPIRED_TIME=10m
REFRESH_TOKEN_EXPIRED_TIME=1h
SMTP_HOST=smtp.example.com
SMTP_SENDER=noreply@example.com
# BASE_URL=https://api.example.com  # リバースプロキシの後ろで提供する場合に設定

# apps/web/.env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

---

## 7. トラブルシューティングガイド

<!-- markdownlint-disable MD060 -->

| 問題                   | 原因と解決策                                                                    |
| ---------------------- | ------------------------------------------------------------------------------- |
| 環境変数が認識されない | `.env`位置確認またはコンテナ再起動                                              |
| DB接続失敗             | `MYSQL_PRIMARY_URL`形式または接続情報確認                                       |
| SMTPエラー             | ポート/TLS設定または認証情報再確認                                              |
| OpenSearchエラー       | ノードURLまたはユーザー認証確認                                                 |
| OTELログexport失敗     | `OTEL_LOG_EXPORT_ENABLED`、endpoint URL、OTELスタック起動有無を確認してください |
| JWTトークンエラー      | `JWT_SECRET`長さおよび複雑性確認                                                |
| 環境変数検証失敗       | 必須環境変数欠落またはタイプエラー確認                                          |
| ポート競合             | `APP_PORT`、`PORT`設定確認                                                      |

<!-- markdownlint-enable MD060 -->

---

## 関連ドキュメント

- [Dockerインストールガイド](./docker-hub-images)
- [SMTP統合ガイド](./smtp-configuration)
- [初期設定ガイド](/ja/user-guide/getting-started)
