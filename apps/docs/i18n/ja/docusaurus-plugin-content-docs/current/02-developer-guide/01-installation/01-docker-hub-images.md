---
id: docker-hub-images
title: Docker Hubイメージインストール
description: Docker Hubに登録されたABC User Feedback公式イメージを使用してシステムを迅速にインストールする方法を説明します。
sidebar_position: 1
---

# Docker Hubイメージインストール

ABC User Feedbackは公式Dockerイメージを提供しています。  
このドキュメントは、Docker Composeを使用して**Web UI、APIサーバー、データベース、SMTPサーバー**などのシステムをローカルで迅速に構成する方法を説明します。

---

## 1. 前提条件

| 項目           | 説明                                                                    |
| -------------- | ----------------------------------------------------------------------- |
| Docker         | 20.10以上                                                               |
| Docker Compose | v2以上推奨                                                              |
| 使用ポート     | `3000`、`4000`、`13306`、`5080`、`25`（ローカルで空いている必要がある） |

---

## 2. Dockerイメージ構成

| サービス名               | 説明                            | Dockerイメージ名                      |
| ------------------------ | ------------------------------- | ------------------------------------- |
| Web (Admin UI)           | フロントエンドWeb UI（Next.js） | `line/abc-user-feedback-web`          |
| API (Backend)            | バックエンドサーバー（NestJS）  | `line/abc-user-feedback-api`          |
| MySQL                    | データベース                    | `mysql:8.0`                           |
| SMTP4Dev                 | ローカルテスト用メールサーバー  | `rnwood/smtp4dev:v3`                  |
| （オプション）OpenSearch | 検索機能とAI分析精度向上用      | `opensearchproject/opensearch:2.16.0` |

---

## 3. `docker-compose.yml`の例

```yaml
name: abc-user-feedback
services:
  web:
    image: line/abc-user-feedback-web:latest
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
    ports:
      - 3000:3000
    depends_on:
      - api
    restart: unless-stopped

  api:
    image: line/abc-user-feedback-api:latest
    environment:
      - JWT_SECRET=jwtsecretjwtsecretjwtsecret
      - MYSQL_PRIMARY_URL=mysql://userfeedback:userfeedback@mysql:3306/userfeedback
      - SMTP_HOST=smtp4dev
      - SMTP_PORT=25
      - SMTP_SENDER=user@feedback.com
      # OpenSearchを使用する場合は以下のコメントを解除してください
      # - OPENSEARCH_USE=true
      # - OPENSEARCH_NODE=http://opensearch-node:9200
    ports:
      - 4000:4000
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    command:
      [
        '--default-authentication-plugin=mysql_native_password',
        '--collation-server=utf8mb4_bin',
      ]
    environment:
      MYSQL_ROOT_PASSWORD: userfeedback
      MYSQL_DATABASE: userfeedback
      MYSQL_USER: userfeedback
      MYSQL_PASSWORD: userfeedback
      TZ: UTC
    ports:
      - 13306:3306
    volumes:
      - mysql:/var/lib/mysql
    restart: unless-stopped

  smtp4dev:
    image: rnwood/smtp4dev:v3
    ports:
      - 5080:80
      - 25:25
      - 143:143
    volumes:
      - smtp4dev:/smtp4dev
    restart: unless-stopped

  # OpenSearchを使用する場合は以下のコメントを解除してください
  # opensearch-node:
  #   image: opensearchproject/opensearch:2.16.0
  #   restart: unless-stopped
  #   environment:
  #     - cluster.name=opensearch-cluster
  #     - node.name=opensearch-node
  #     - discovery.type=single-node
  #     - bootstrap.memory_lock=true
  #     - 'OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m'
  #     - plugins.security.disabled=true
  #     - OPENSEARCH_INITIAL_ADMIN_PASSWORD=UserFeedback123!@#
  #   ulimits:
  #     memlock:
  #       soft: -1
  #       hard: -1
  #     nofile:
  #       soft: 65536
  #       hard: 65536
  #   volumes:
  #     - opensearch:/usr/share/opensearch/data
  #   ports:
  #     - 9200:9200
  #     - 9600:9600

volumes:
  mysql:
  smtp4dev:
  # opensearch:
```

---

## 4. 実行手順

### 4.1 Dockerイメージのダウンロードと実行

```bash
# Docker Composeですべてのサービスをバックグラウンドで実行
docker compose up -d
```

### 4.2 実行状態の確認

```bash
# すべてのコンテナが正常に実行中か確認
docker compose ps
```

### 4.3 サービスアクセスの確認

- **Webアプリケーション**: [http://localhost:3000](http://localhost:3000)
- **APIサーバー**: [http://localhost:4000](http://localhost:4000)
- **SMTPテストページ**: [http://localhost:5080](http://localhost:5080)
- **MySQLデータベース**: `localhost:13306`（ユーザー：`userfeedback`、パスワード：`userfeedback`）

---

## 5. SMTP設定

デフォルトでは、この構成では`smtp4dev`を通じてメールをテストできます。

- **Webインターフェース**: [http://localhost:5080](http://localhost:5080)
- **SMTPポート**: `25`
- **IMAPポート**: `143`

### SMTPテスト方法

1. Webアプリケーションでユーザー登録またはユーザー招待機能を使用
2. [http://localhost:5080](http://localhost:5080)で送信されたメールを確認
3. メール内容と添付ファイルなどをテスト

> **重要**: 実際の本番環境では、必ず外部SMTPサーバー（例：Gmail、SendGrid、社内SMTPなど）と連携する必要があります。

## 6. インストール確認

### 6.1 Webアプリケーションアクセス確認

ブラウザで`http://localhost:3000`にアクセスし、以下を確認してください：

- テナント作成画面が正常に表示されるか
- ページの読み込みが完了するか
- JavaScriptエラーがないか（ブラウザの開発者ツールで確認）

### 6.2 APIサーバーステータス確認

```bash
# APIサーバーヘルスチェック
curl http://localhost:4000/api/health
```

予想される応答：

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  }
}
```

### 6.3 データベース接続確認

```bash
# MySQLコンテナに直接アクセスしてデータベースを確認
docker compose exec mysql mysql -u userfeedback -puserfeedback -e "SHOW DATABASES;"

# テーブル作成確認
docker compose exec mysql mysql -u userfeedback -puserfeedback -e "USE userfeedback; SHOW TABLES;"
```

### 6.4 ログ確認

```bash
# すべてのサービスのログを確認
docker compose logs

# 特定のサービスのログのみ確認
docker compose logs api
docker compose logs web
docker compose logs mysql
```

---

## 7. OpenSearch使用時の注意事項

OpenSearchは、検索機能とAI分析の精度を向上させるオプションコンポーネントです。

### 7.1 OpenSearch有効化方法

1. `docker-compose.yml`ファイルで`api`サービスの環境変数のコメントを解除：

```yaml
- OPENSEARCH_USE=true
- OPENSEARCH_NODE=http://opensearch-node:9200
```

2. `opensearch-node`サービスのコメントを解除
3. `volumes:`セクションで`opensearch:`のコメントを解除
4. ポート`9200`、`9600`がローカルで使用されていないことを確認

### 7.2 メモリ要件

> **注意**: OpenSearchは最低2GB以上のメモリを必要とします。メモリ不足の場合、コンテナが自動的に終了する可能性があります。

### 7.3 OpenSearchステータス確認

```bash
# OpenSearchクラスターステータス確認
curl http://localhost:9200/_cluster/health

# OpenSearchノード情報確認
curl http://localhost:9200/_nodes

# インデックス確認
curl http://localhost:9200/_cat/indices
```

### 7.4 OpenSearch無効化

OpenSearchを使用しない場合は、`docker-compose.yml`で該当サービスと環境変数をコメントアウトします。

---

## 8. トラブルシューティング

### 8.1 ポート競合の問題

**症状**: `docker compose up`実行時にポートバインディングエラーが発生

**解決方法**:

```bash
# 使用中のポートを確認
lsof -i :3000  # Webポート
lsof -i :4000  # APIポート
lsof -i :13306 # MySQLポート
lsof -i :5080  # SMTPポート

# 該当ポートを使用しているプロセスを停止して再起動
docker compose down
docker compose up -d
```

### 8.2 コンテナ起動失敗

**症状**: 一部のコンテナが起動しない、または継続的に再起動される

**解決方法**:

```bash
# コンテナステータス確認
docker compose ps

# 失敗したコンテナのログを確認
docker compose logs [サービス名]

# すべてのコンテナを停止して削除
docker compose down

# ボリュームも削除（データ損失に注意）
docker compose down -v

# 再度起動
docker compose up -d
```

### 8.3 データベース接続エラー

**症状**: APIサーバーからMySQL接続失敗

**解決方法**:

```bash
# MySQLコンテナが完全に起動するまで待機
docker compose logs mysql

# MySQLコンテナに直接接続テスト
docker compose exec mysql mysql -u userfeedback -puserfeedback -e "SELECT 1;"

# APIサービスを再起動
docker compose restart api
```

### 8.4 イメージダウンロード失敗

**症状**: Dockerイメージをダウンロードできない

**解決方法**:

```bash
# Docker Hubログイン確認
docker login

# イメージを手動でダウンロード
docker pull line/abc-user-feedback-web:latest
docker pull line/abc-user-feedback-api:latest

# ネットワーク接続確認
ping hub.docker.com
```

### 8.5 メモリ不足の問題

**症状**: OpenSearchコンテナが自動的に終了する

**解決方法**:

```bash
# システムメモリ確認
free -h

# Dockerメモリ使用量確認
docker stats

# OpenSearchを無効化（docker-compose.ymlでコメントアウト）
# またはメモリ割り当てを増やす
```

---

## 9. 参考リンク

- [ABC User Feedback Web - Docker Hub](https://hub.docker.com/r/line/abc-user-feedback-web)
- [ABC User Feedback API - Docker Hub](https://hub.docker.com/r/line/abc-user-feedback-api)
- [smtp4dev - Docker Hub](https://hub.docker.com/r/rnwood/smtp4dev)
- [OpenSearch - Docker Hub](https://hub.docker.com/r/opensearchproject/opensearch)

---

## 関連ドキュメント

- [初期設定ガイド](/ja/user-guide/getting-started)
