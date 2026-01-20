---
sidebar_position: 3
title: '手動インストール'
description: 'ソースコードから直接ABC User Feedbackをビルドして実行する手動インストールガイド'
---

# 手動インストール

このドキュメントは、ABC User Feedbackを手動でインストール・構成する方法を説明します。ソースコードから直接アプリケーションをビルドして実行したい場合に便利です。

## 前提条件

手動インストールを進める前に、次の要件を満たす必要があります：

- [Node.js v22.19.0以上](https://nodejs.org/en/download/)
- [pnpm v10.15.0以上](https://pnpm.io/installation)（パッケージマネージャー）
- [Git](https://git-scm.com/downloads)
- [MySQL 8.0](https://www.mysql.com/downloads/)
- SMTPサーバー
- （オプション）[OpenSearch 2.16](https://opensearch.org/)

## ソースコードのダウンロード

まず、GitHubリポジトリからABC User Feedbackのソースコードをクローンします：

```bash
git clone https://github.com/line/abc-user-feedback.git
cd abc-user-feedback
```

## インフラ設定

ABC User FeedbackにはMySQLデータベース、SMTPサーバー、そしてオプションでOpenSearchが必要です。これらのインフラコンポーネントを設定する方法はいくつかあります。

### Dockerを使用したインフラ設定

最も簡単な方法は、Docker Composeで必要なインフラを設定することです：

```bash
docker-compose -f docker/docker-compose.infra.yml up -d
```

### 既存インフラの使用

既にMySQL、OpenSearch、またはSMTPサーバーがある場合は、後で環境変数として接続情報を構成できます。

## 依存関係のインストール

ABC User FeedbackはTurboRepoを通じて管理されるモノレポ構造を使用します。すべてのパッケージの依存関係をインストールするには：

```bash
pnpm install
```

依存関係のインストール後、すべてのパッケージをビルドします：

```bash
pnpm build
```

## 環境変数設定

### APIサーバー環境変数

`apps/api`ディレクトリに`.env`ファイルを作成し、`.env.example`を参照して構成します：

```env
# Required environment variables
JWT_SECRET=DEV

MYSQL_PRIMARY_URL=mysql://userfeedback:userfeedback@localhost:13306/userfeedback # required

ACCESS_TOKEN_EXPIRED_TIME=10m # default: 10m
REFRESH_TOKEN_EXPIRED_TIME=1h # default: 1h

# Optional environment variables

# APP_PORT=4000 # default: 4000
# APP_ADDRESS=0.0.0.0 # default: 0.0.0.0

# MYSQL_SECONDARY_URLS= ["mysql://userfeedback:userfeedback@localhost:13306/userfeedback"] # optional

SMTP_HOST=localhost # required
SMTP_PORT=25 # required
SMTP_SENDER=user@feedback.com # required
# SMTP_USERNAME= # optional
# SMTP_PASSWORD= # optional
# SMTP_TLS= # default: false
# SMTP_CIPHER_SPEC= # default: TLSv1.2 if SMTP_TLS=true
# SMTP_OPPORTUNISTIC_TLS= # default: true if SMTP_TLS=true

# OPENSEARCH_USE=false # default: false
# OPENSEARCH_NODE= # required if OPENSEARCH_USE=true
# OPENSEARCH_USERNAME= # optional
# OPENSEARCH_PASSWORD= # optional

# AUTO_MIGRATION=true # default: true

# MASTER_API_KEY= # default: none

# BASE_URL=https://api.example.com # Swaggerドキュメントで使用するAPIサーバーの公開URL（オプション）

# AUTO_FEEDBACK_DELETION_ENABLED=false # default: false
# AUTO_FEEDBACK_DELETION_PERIOD_DAYS=365*5
```

### ウェブサーバー環境変数

`apps/web`ディレクトリに`.env`ファイルを作成し、`.env.example`を参照して構成します：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

環境変数の詳細については、[環境変数設定](./05-configuration.md)ドキュメントを参照してください。

## データベースマイグレーション

APIサーバーを初めて実行する前に、データベーススキーマを作成する必要があります。`AUTO_MIGRATION=true`環境変数を設定すると、サーバー起動時にマイグレーションが自動的に実行されます。

手動でマイグレーションを実行するには：

```bash
cd apps/api
npm run migration:run
```

## 開発モードでの実行

### 単一コマンドで実行

APIサーバーとウェブサーバーを開発モードで実行するには：

```bash
# プロジェクトルートディレクトリから
pnpm dev
```

このコマンドはAPIサーバーとウェブサーバーを同時に起動します。APIサーバーはデフォルトでポート4000で、ウェブサーバーはポート3000で実行されます。

### 個別パッケージの実行

#### 共通パッケージのビルド

ウェブアプリケーションを実行する前に、共有パッケージをビルドする必要があります：

```bash
# プロジェクトルートディレクトリから
cd packages/ufb-shared
pnpm build
```

#### UIパッケージのビルド

ウェブアプリケーションを実行する前に、UIパッケージをビルドする必要があります：

```bash
# プロジェクトルートディレクトリから
cd packages/ufb-tailwindcss
pnpm build
```

#### 各サーバーの個別実行

各サーバーを個別に実行するには：

```bash
# APIサーバーのみ実行
cd apps/api
pnpm dev

# ウェブサーバーのみ実行
cd apps/web
pnpm dev
```

## 本番ビルド

本番環境用のアプリケーションをビルドするには：

```bash
# プロジェクトルートディレクトリから
pnpm build
```

このコマンドはAPIサーバーとウェブサーバーの両方をビルドします。

## 本番モードでの実行

本番ビルドを実行するには：

```bash
# APIサーバー実行
cd apps/api
pnpm start

# ウェブサーバー実行
cd apps/web
pnpm start
```

## APIタイプ生成

バックエンドAPIが実行中の場合、フロントエンド用のAPIタイプを生成できます：

```bash
cd apps/web
pnpm generate-api-type
```

このコマンドはOpenAPI仕様からTypeScriptタイプを生成し、`src/shared/types/api.type.ts`ファイルに保存します。

**注意**: このコマンドが正しく動作するには、APIサーバーが`http://localhost:4000`で実行中である必要があります。

## コード品質管理

### リンティング

コードリンティングを実行するには：

```bash
pnpm lint
```

### フォーマット

コードフォーマットを実行するには：

```bash
pnpm format
```

### テスト

テストを実行するには：

```bash
pnpm test
```

## Swaggerドキュメント

APIサーバーが実行中の場合、次のエンドポイントでSwaggerドキュメントを確認できます：

- **APIドキュメント**: http://localhost:4000/docs
- **管理者APIドキュメント**: http://localhost:4000/admin-docs
- **OpenAPI JSON**: http://localhost:4000/docs-json
- **管理者OpenAPI JSON**: http://localhost:4000/admin-docs-json

> **注意**: APIサーバーをリバースプロキシの後ろで異なるURLで提供する場合、`BASE_URL`環境変数を設定すると、Swaggerドキュメントで正しいAPIエンドポイントURLが生成されます。例: `BASE_URL=https://api.example.com`

## トラブルシューティング

### 一般的な問題

1. **依存関係インストールエラー**：
   - Node.jsバージョンがv22.19.0以上であることを確認してください。
   - pnpmバージョンがv10.15.0以上であることを確認してください。
   - pnpmを最新バージョンに更新してください。
   - `pnpm install --force`を試してください。

2. **データベース接続エラー**：
   - MySQLサーバーが実行中であることを確認してください。
   - データベース認証情報が正しいことを確認してください。
   - `MYSQL_PRIMARY_URL`環境変数の形式が正しいことを確認してください。
   - Dockerインフラを使用する場合、MySQLがポート13306（3306ではない）で実行されていることを確認してください。

3. **ビルドエラー**：
   - UIパッケージがビルドされていることを確認してください（`pnpm build:ui`）。
   - すべての依存関係がインストールされていることを確認してください。
   - TypeScriptエラーを確認してください。

4. **ランタイムエラー**：
   - 環境変数が正しく設定されていることを確認してください。
   - 必要なポートが利用可能であることを確認してください。
   - ログのエラーメッセージを確認してください。
