---
sidebar_position: 6
title: '画像設定'
description: 'フィードバックに添付された画像の保存方式とセキュリティポリシーを設定する方法を案内します。'
---

# 画像設定

ABC User Feedbackでは、ユーザーがフィードバックを提出する際に**画像と一緒にアップロード**できるようにサポートしています。画像の保存方式とセキュリティポリシーを適切に設定することで、安全で効率的なフィードバック収集環境を構築できます。

![image-setting.png](/img/image/image-setting.png)

---

## アクセス方法

1. 上部メニューで**Settings**をクリック
2. 左メニューから**Channel List > [チャネル選択]**
3. 下部タブから**Image Management**を選択

---

## Image Storage Integration設定

**Multipart Upload API**方式で画像をサーバーに直接アップロードするか、**Presigned URL Download**機能を活用するには、S3またはS3互換ストレージ統合が必要です。

### 必須設定項目

| 項目                  | 説明                         | 例                                        |
| --------------------- | ---------------------------- | ----------------------------------------- |
| **Access Key ID**     | S3アクセスのためのキーID     | `AKIAIOSFODNN7EXAMPLE`                    |
| **Secret Access Key** | キーに対するシークレット     | `wJalrXUtnFEMI/K7MDENG/...`               |
| **End Point**         | S3 APIエンドポイントURL      | `https://s3.ap-northeast-1.amazonaws.com` |
| **Region**            | バケットが位置する地域       | `ap-northeast-1`                          |
| **Bucket Name**       | 画像が保存される対象バケット | `consumer-ufb-images`                     |

### Presigned URL Download設定

**Presigned URL Download**オプションを通じて画像ダウンロードセキュリティを強化できます。

#### 設定オプション

- **Enable**: 認証されたワンタイムURLを通じて画像にアクセス（セキュリティ強化）
- **Disable**: 画像URLが直接公開され、公開アクセス可能

### 接続テスト

すべての設定を入力した後、**Test Connection**ボタンをクリックしてストレージ接続を確認します。

接続結果：

- ✅ **成功**: "Connection test succeeded"メッセージ
- ❌ **失敗**: 入力値、バケット権限、ネットワーク設定を再確認する必要があります

---

## Image URL Domain Whitelist設定

**Image URL方式**を使用するか、セキュリティを強化したい場合、信頼できるドメインのみを許可するようにホワイトリストを設定できます。

### 現在の状態確認

デフォルト設定は**"All image URLs are allowed"**状態で、すべてのドメインの画像URLを許可します。

### ホワイトリスト追加

セキュリティ強化のために特定のドメインのみを許可するには：

1. **Whitelist**エリアに信頼できるドメインを追加
2. 例示ドメイン：
   - `cdn.yourcompany.com`
   - `images.trusted-partner.io`
   - `storage.googleapis.com`

---

## サポートされるストレージサービス

### AWS S3

- 最も一般的に使用されるクラウドストレージ
- 安定性が高く、拡張性に優れています

---

## 設定保存

すべての設定を完了した後、右上の**Save**ボタンをクリックして変更を保存します。

保存後：

- 新しい画像アップロードが設定した方式で動作
- 既存の画像は既存設定のまま維持
- Test Connectionで設定の正常動作を再確認することを推奨

---

## 関連ドキュメント

- [フィールド設定](/ja/user-guide/feedback-management) - 画像フィールドをフィードバックフォームに追加する方法
- [フィードバック確認とフィルタリング](/ja/user-guide/feedback-management) - アップロードされた画像をフィードバックで確認する方法
- [APIキー管理](./02-api-key-management.md) - APIキーセキュリティ管理方法
