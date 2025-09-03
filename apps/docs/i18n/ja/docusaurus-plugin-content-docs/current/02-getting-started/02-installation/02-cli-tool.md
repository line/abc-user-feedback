---
sidebar_position: 2
title: 'CLIツールの使用'
description: 'CLIツールを使用してABC User Feedbackをインストール、実行、管理する方法をご案内します。'
---

# CLIツールの使用

ABC User Feedback CLI（`auf-cli`）は、ABC User Feedbackのインストール、実行、管理を簡素化するためのコマンドラインインターフェースツールです。この文書では、CLIツールを使用してABC User Feedbackを迅速かつ簡単に設定する方法をご案内します。

## CLIツールの紹介

`auf-cli`は以下の主要機能を提供します：

- 必要なインフラ（MySQL、SMTP、OpenSearch）の自動セットアップ
- 環境変数設定の簡素化
- APIとWebサーバーの開始/停止の自動化
- ボリュームデータのクリーンアップ

このツールの最大の利点は、Node.jsとDockerがインストールされていれば、別途依存関係のインストールやリポジトリのクローンなしに`npx`を通じて直接実行できることです。

## 前提条件

CLIツールを使用する前に、以下の要件を満たす必要があります：

- [Node.js v22以上](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/desktop/)

## 基本コマンド

### 初期化

次のコマンドを実行して、ABC User Feedbackに必要なインフラを設定します：

```bash
npx auf-cli init
```

このコマンドは以下の作業を実行します：

1. システムアーキテクチャ（ARM/AMD）を検出し、適切なDockerイメージを選択します。
2. MySQL、SMTP、OpenSearchなど必要なインフラコンテナを設定します。
3. 環境変数設定のための`config.toml`ファイルを生成します。

初期化が完了すると、`config.toml`ファイルが生成されます。このファイルを編集して環境変数を必要に応じて調整できます。

### サーバー開始

次のコマンドを実行してAPIとWebサーバーを開始します：

```bash
npx auf-cli start
```

このコマンドは以下の作業を実行します：

1. `config.toml`ファイルから環境変数を読み込みます。
2. Docker Composeファイルを生成します。
3. APIとWebサーバーコンテナを開始します。

サーバーが正常に開始されると、Webブラウザで`http://localhost:3000`（または設定されたURL）にアクセスして、ABC User FeedbackのWebインターフェースにアクセスできます。

### サーバー停止

次のコマンドを実行してAPIとWebサーバーを停止します：

```bash
npx auf-cli stop
```

このコマンドは実行中のAPIとWebサーバーコンテナを停止します。インフラコンテナ（MySQL、SMTP、OpenSearch）は継続して実行されます。

### ボリュームクリーンアップ

次のコマンドを実行して初期化中に作成されたDockerボリュームをクリーンアップします：

```bash
npx auf-cli clean
```

このコマンドはMySQL、SMTP、OpenSearchなどのDockerボリュームを削除します。**注意**：この操作はすべてのデータを削除するため、バックアップが必要な場合は事前にデータをバックアップしてください。

## 設定ファイル（config.toml）

`init`コマンドを実行すると、現在のディレクトリに`config.toml`ファイルが生成されます。このファイルはABC User Feedbackの環境変数を設定するために使用されます。

以下は`config.toml`ファイルの例です：

```toml
[api]
JWT_SECRET = "jwtsecretjwtsecretjwtsecret"
MYSQL_PRIMARY_URL = "mysql://userfeedback:userfeedback@mysql:3306/userfeedback"
ACCESS_TOKEN_EXPIRED_TIME = "10m"
REFRESH_TOKEN_EXPIRED_TIME = "1h"
APP_PORT = 4000
APP_ADDRESS = "0.0.0.0"
AUTO_MIGRATION = true
NODE_OPTIONS = "--max_old_space_size=3072"
SMTP_HOST = "smtp4dev"
SMTP_PORT = 25
SMTP_SENDER = "user@feedback.com"
SMTP_BASE_URL = "http://localhost:3000"

# OpenSearch設定（オプション）
# OPENSEARCH_USE = true
# OPENSEARCH_NODE = "http://opensearch-node:9200"
# OPENSEARCH_USERNAME = "admin"
# OPENSEARCH_PASSWORD = "UserFeedback123!@#"

[web]
NEXT_PUBLIC_API_BASE_URL = "http://localhost:4000"
```

必要に応じてこのファイルを編集して環境変数を調整できます。環境変数の詳細については、[環境変数設定](./04-configuration.md)の文書を参照してください。

## 高度な使用法

### ポート変更

デフォルトでは、Webサーバーはポート3000、APIサーバーはポート4000を使用します。これを変更するには、`config.toml`ファイルで以下の設定を変更してください：

```toml
[api]
APP_PORT = 8080  # APIサーバーポートを変更

[web]
PORT = 8000  # Webサーバーポートを変更
NEXT_PUBLIC_API_BASE_URL = "http://localhost:8080"  # API URLも変更する必要があります
```

### カスタムDocker Composeファイル

CLIツールは内部的にDocker Composeファイルを生成して使用します。生成されたDocker Composeファイルを確認するには、`start`コマンド実行後に現在のディレクトリで`docker-compose.yml`ファイルを確認してください。

このファイルを直接変更して追加の設定を適用できますが、`auf-cli start`コマンドを再実行すると変更内容が上書きされる可能性があることにご注意ください。

## トラブルシューティング

### 一般的な問題

1. **Docker関連エラー**：

   - Dockerが実行中であることを確認してください。
   - Dockerコマンドを実行する権限があることを確認してください。

2. **ポート競合**：

   - ポート3000、4000、13306、9200などが他のアプリケーションで使用されていないか確認してください。
   - `config.toml`ファイルでポート設定を変更してください。

3. **メモリ不足**：
   - Dockerに割り当てられたメモリを増やしてください。
   - OpenSearchは最低2GBのメモリを必要とします。

## 制限事項

CLIツールは開発およびテスト環境での使用に適しています。本番環境では以下の点を考慮してください：

1. セキュリティ強化のため、環境変数を直接設定して管理してください。
2. 高可用性とスケーラビリティのため、KubernetesやDocker Swarmなどのオーケストレーションツールを使用してください。
3. データ永続性とバックアップ戦略を実装してください。

## 次のステップ

CLIツールを使用してABC User Feedbackを正常にインストールした場合は、次のステップとして[チュートリアル](../03-tutorial.md)に進んでシステムを設定し、ユーザーを追加してください。

詳細なAPIとWebサーバーの設定オプションについては、[環境変数設定](./04-configuration.md)の文書を参照してください。
