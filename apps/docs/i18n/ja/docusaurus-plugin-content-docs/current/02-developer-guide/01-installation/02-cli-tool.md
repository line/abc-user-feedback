---
sidebar_position: 2
title: "CLIツール使用方法"
description: "ABC User Feedback CLIツールでシステムを迅速かつ簡単にインストール・管理する方法を説明します。"
---

# CLIツール使用方法

ABC User Feedback CLI（`auf-cli`）は、システムのインストール、実行、管理を簡素化するコマンドラインツールです。Node.jsとDockerがインストールされていれば、追加の依存関係をインストールしたりリポジトリをクローンしたりすることなく、`npx`を通じてすぐに実行できます。

## 主要機能

- 必要なインフラの自動設定（MySQL、SMTP、OpenSearch）
- 環境変数設定の簡素化
- APIおよびウェブサーバーの自動起動/停止
- ボリュームデータのクリーンアップ
- 動的Docker Composeファイル生成

## 使用されるDockerイメージ

- `line/abc-user-feedback-web:latest` - ウェブフロントエンド
- `line/abc-user-feedback-api:latest` - APIバックエンド
- `mysql:8.0` - データベース
- `rnwood/smtp4dev:v3` - SMTPテストサーバー
- `opensearchproject/opensearch:2.16.0` - 検索エンジン（オプション）

## 前提条件

CLIツールを使用する前に、次の要件を満たす必要があります：

- [Node.js v22以上](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/desktop/)

## 基本コマンド

### 初期化

ABC User Feedbackに必要なインフラを設定するには、次のコマンドを実行します：

```bash
npx auf-cli init
```

このコマンドは次の作業を実行します：

1. 環境変数設定用の`config.toml`ファイルを作成
2. アーキテクチャ（ARM/AMD）に応じて必要なインフラを設定

初期化が完了すると、現在のディレクトリに`config.toml`ファイルが作成されます。必要に応じてこのファイルを編集して環境変数を調整できます。

### サーバー起動

APIおよびウェブサーバーを起動するには、次のコマンドを実行します：

```bash
npx auf-cli start
```

このコマンドは次の作業を実行します：

1. `config.toml`ファイルから環境変数を読み取り
2. Docker Composeファイルを生成してサービスを開始
3. APIおよびウェブサーバーコンテナと必要なインフラ（MySQL、SMTP、OpenSearch）を起動

サーバーが正常に起動すると、ウェブブラウザで`http://localhost:3000`（または設定されたURL）からABC User Feedbackウェブインターフェースにアクセスできます。CLIは次のURLを表示します：

- ウェブインターフェースURL
- API URL
- MySQL接続文字列
- OpenSearch URL（有効な場合）
- SMTPウェブインターフェース（smtp4dev使用時）

### サーバー停止

APIおよびウェブサーバーを停止するには、次のコマンドを実行します：

```bash
npx auf-cli stop
```

このコマンドは実行中のAPIおよびウェブサーバーコンテナとインフラコンテナを停止します。ボリュームに保存されたすべてのデータは保持されます。

### ボリュームクリーンアップ

起動中に作成されたDockerボリュームをクリーンアップするには、次のコマンドを実行します：

```bash
npx auf-cli clean
```

このコマンドはすべてのコンテナを停止し、MySQL、SMTP、OpenSearchなどのDockerボリュームを削除します。

**警告**: この操作はすべてのデータを削除するため、必要な場合は事前にバックアップしてください。

`--images`オプションを使用して未使用のDockerイメージもクリーンアップできます：

```bash
npx auf-cli clean --images
```

## 設定ファイル（config.toml）

`init`コマンドを実行すると、現在のディレクトリに`config.toml`ファイルが作成されます。このファイルはABC User Feedbackの環境変数を設定するために使用されます。

以下は`config.toml`ファイルの例です：

```toml
[web]
port = 3000
# api_base_url = "http://localhost:4000"

[api]
port = 4000
jwt_secret = "jwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecret"

# master_api_key = "MASTER_KEY"
# access_token_expired_time = "10m"
# refresh_token_expired_time = "1h"

# [api.auto_feedback_deletion]
# enabled = true
# period_days = 365

# [api.smtp]
# host = "smtp4dev" # SMTP_HOST
# port = 25 # SMTP_PORT
# sender = "user@feedback.com"
# username=
# password=
# tls=
# cipher_spec=
# opportunitic_tls=

# [api.opensearch]
# enabled = true

[mysql]
port = 13306
```

必要に応じてこのファイルを編集して環境変数を調整できます。環境変数の詳細については、[環境変数設定](./05-configuration.md)ドキュメントを参照してください。

## 高度な使用方法

### ポート変更

デフォルトでは、ウェブサーバーはポート3000を、APIサーバーはポート4000を使用します。これらを変更するには、`config.toml`ファイルで次の設定を変更します：

```toml
[web]
port = 8000  # ウェブサーバーポート変更
api_base_url = "http://localhost:8080"  # API URLも一緒に変更する必要があります

[api]
port = 8080  # APIサーバーポート変更

[mysql]
port = 13307  # 必要に応じてMySQLポート変更
```

### OpenSearch有効化

高度な検索機能のためにOpenSearchを有効にするには：

```toml
[api.opensearch]
enabled = true
```

**注意事項**：

- OpenSearchには最低2GBの使用可能メモリが必要です
- OpenSearchコンテナは`http://localhost:9200`で利用可能です
- OpenSearchステータス確認: `http://localhost:9200/_cluster/health`

### SMTP設定

開発環境では、デフォルトの`smtp4dev`設定を推奨します：

```toml
[api.smtp]
host = "smtp4dev"
port = 25
sender = "dev@feedback.local"
```

smtp4devウェブインターフェースは`http://localhost:5080`で送信されたメールを確認できます。

## トラブルシューティング

### 一般的な問題

1. **Docker関連エラー**：

   - Dockerが実行中か確認: `docker --version`
   - Docker権限確認: `docker ps`
   - Docker Desktopが正しくインストールされ実行中か確認

2. **ポート競合**：

   - ポート使用確認: `lsof -i :PORT`（macOS/Linux）または`netstat -ano | findstr :PORT`（Windows）
   - `config.toml`でポート設定変更
   - 一般的な競合ポート: 3000、4000、13306、9200、5080

3. **サービス起動失敗**：

   - コンテナログ確認: `docker compose logs SERVICE_NAME`
   - Dockerイメージが利用可能か確認: `docker images`
   - 十分なシステムリソース（メモリ、ディスク容量）を確認

4. **データベース接続問題**：
   - MySQLコンテナステータス確認: `docker compose ps mysql`
   - MySQLログ確認: `docker compose logs mysql`
   - 接続テスト: `docker compose exec mysql mysql -u userfeedback -p`

### デバッグのヒント

1. **コンテナログ確認**：

   ```bash
   # すべてのコンテナログ
   docker compose logs

   # 特定のサービスログ
   docker compose logs api
   docker compose logs web
   docker compose logs mysql
   ```

2. **サービスステータス確認**：

   ```bash
   # APIステータス確認
   curl http://localhost:4000/api/health

   # OpenSearchステータス確認（有効な場合）
   curl http://localhost:9200/_cluster/health
   ```

3. **データベース直接アクセス**：
   ```bash
   # MySQL接続
   docker compose exec mysql mysql -u userfeedback -p userfeedback
   ```

## 制限事項

CLIツールは開発およびテスト環境用に設計されています。本番環境へのデプロイには、次を考慮してください：

1. **セキュリティ考慮事項**：

   - 機密データには設定ファイルではなく環境変数を使用
   - 適切なシークレット管理を実装
   - 本番レベルのJWTシークレットを使用
   - HTTPS/TLS暗号化を有効化

2. **スケーラビリティと可用性**：

   - KubernetesやDocker Swarmなどのオーケストレーションツールを使用
   - ロードバランシングと自動スケーリングを実装
   - 適切なモニタリングとアラートを設定
   - 管理データベースサービス（RDS、Cloud SQLなど）を使用

3. **データ管理**：
   - 自動化されたバックアップ戦略を実装
   - 適切なバックアップがある永続ボリュームを使用
   - データ保持ポリシーを考慮
   - ディスク使用量とパフォーマンスをモニタリング

## 次のステップ

詳細なAPIおよびウェブサーバー設定オプションについては、[環境変数設定](./05-configuration.md)ドキュメントを参照してください。

