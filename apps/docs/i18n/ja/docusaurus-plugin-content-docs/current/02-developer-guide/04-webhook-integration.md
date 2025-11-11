---
sidebar_position: 4
title: 'ウェブフック統合'
description: 'ウェブフックを活用して外部システムとリアルタイム統合する方法と実装例を案内します。'
---

# ウェブフック統合

ウェブフックにより、ABC User Feedbackで発生する主要イベントをリアルタイムで外部システムに配信できます。Slack通知、自動化ワークフロー、カスタム分析システムなどと統合できます。

---

## サポートされるイベントタイプ

ABC User Feedbackでサポートされるイベントは次のとおりです：

### 1. FEEDBACK_CREATION

新しいフィードバックが作成されたときに発生します。

**リクエストヘッダー：**

```
Content-Type: application/json
x-webhook-token: your-secret-token
```

**ペイロード例：**

```json
{
  "event": "FEEDBACK_CREATION",
  "data": {
    "feedback": {
      "id": 123,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "message": "ユーザーフィードバック内容",
      "userEmail": "user@example.com",
      "issues": [
        {
          "id": 456,
          "createdAt": "2024-01-15T10:30:00.000Z",
          "updatedAt": "2024-01-15T10:30:00.000Z",
          "name": "バグレポート",
          "description": "イシュー説明",
          "status": "OPEN",
          "externalIssueId": "EXT-123",
          "feedbackCount": 5
        }
      ]
    },
    "channel": {
      "id": 1,
      "name": "ウェブサイトフィードバック"
    },
    "project": {
      "id": 1,
      "name": "My Project"
    }
  }
}
```

### 2. ISSUE_CREATION

新しいイシューが作成されたときに発生します。

**ペイロード例：**

```json
{
  "event": "ISSUE_CREATION",
  "data": {
    "issue": {
      "id": 789,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z",
      "name": "新しいイシュー",
      "description": "イシュー説明",
      "status": "OPEN",
      "externalIssueId": "EXT-789",
      "feedbackCount": 0
    },
    "project": {
      "id": 1,
      "name": "My Project"
    }
  }
}
```

### 3. ISSUE_STATUS_CHANGE

イシューステータスが変更されたときに発生します。

**ペイロード例：**

```json
{
  "event": "ISSUE_STATUS_CHANGE",
  "data": {
    "issue": {
      "id": 789,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z",
      "name": "イシュー名",
      "description": "イシュー説明",
      "status": "IN_PROGRESS",
      "externalIssueId": "EXT-789",
      "feedbackCount": 3
    },
    "project": {
      "id": 1,
      "name": "My Project"
    },
    "previousStatus": "OPEN"
  }
}
```

### 4. ISSUE_ADDITION

フィードバックにイシューが追加されたときに発生します。

**ペイロード例：**

```json
{
  "event": "ISSUE_ADDITION",
  "data": {
    "feedback": {
      "id": 123,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "message": "ユーザーフィードバック内容",
      "issues": [
        {
          "id": 456,
          "name": "既存イシュー",
          "status": "OPEN"
        },
        {
          "id": 789,
          "name": "新しく追加されたイシュー",
          "status": "OPEN"
        }
      ]
    },
    "channel": {
      "id": 1,
      "name": "ウェブサイトフィードバック"
    },
    "project": {
      "id": 1,
      "name": "My Project"
    },
    "addedIssue": {
      "id": 789,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z",
      "name": "新しく追加されたイシュー",
      "description": "イシュー説明",
      "status": "OPEN",
      "externalIssueId": "EXT-456",
      "feedbackCount": 1
    }
  }
}
```

---

## ウェブフック受信サーバー実装

ウェブフックを受信するためのHTTPサーバーを実装する必要があります。サーバーは次の要件を満たす必要があります：

### 基本要件

1. **HTTP POSTリクエスト処理**: ウェブフックはHTTP POSTで送信されます
2. **JSONペイロード解析**: リクエスト本文はJSON形式です
3. **200レスポンスコード返却**: 処理成功時は必ず200ステータスコードで応答

### 実装例（Node.js/Express）

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  const token = req.headers['x-webhook-token'];

  // トークン検証
  if (token !== 'your-secret-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // イベント処理
  switch (event) {
    case 'FEEDBACK_CREATION':
      console.log('新しいフィードバック作成:', data.feedback);
      // フィードバック処理ロジック
      break;
    case 'ISSUE_CREATION':
      console.log('新しいイシュー作成:', data.issue);
      // イシュー処理ロジック
      break;
    case 'ISSUE_STATUS_CHANGE':
      console.log(
        'イシューステータス変更:',
        data.issue,
        '以前のステータス:',
        data.previousStatus,
      );
      // ステータス変更処理ロジック
      break;
    case 'ISSUE_ADDITION':
      console.log('イシュー追加:', data.addedIssue);
      // イシュー追加処理ロジック
      break;
  }

  res.status(200).json({ success: true });
});

app.listen(3000, () => {
  console.log('ウェブフックリスナーサーバーがポート3000で実行中です。');
});
```

---

## セキュリティと再試行ポリシー

### セキュリティ考慮事項

- **トークン検証**: `x-webhook-token`ヘッダーを通じてリクエストを検証します
- **HTTPS使用**: 本番環境では必ずHTTPSを使用してください

### 再試行ポリシー

- **自動再試行**: ABC User Feedbackはウェブフック送信失敗時に最大3回まで自動再試行します
- **再試行間隔**: 各再試行は3秒後に実行されます

### エラー処理

- **4xxエラー**: クライアントエラーと見なされ、再試行しません
- **5xxエラー**: サーバーエラーと見なされ、再試行します
- **ネットワークエラー**: 接続失敗時に再試行します

---

## 活用事例

### 1. 自動翻訳

```javascript
// FEEDBACK_CREATIONイベントを受信して自動翻訳
if (event === 'FEEDBACK_CREATION') {
  const translatedMessage = await translateText(data.feedback.message);
  // 翻訳された内容をフィードバックに更新
  await updateFeedback(data.feedback.id, { translatedMessage });
}
```

### 2. 外部チケットシステム統合

```javascript
// ISSUE_CREATIONイベントを受信して外部システムにチケット作成
if (event === 'ISSUE_CREATION') {
  const ticketId = await createExternalTicket({
    title: data.issue.name,
    description: data.issue.description,
    priority: 'medium',
  });
  // 外部チケットIDをイシューに保存
  await updateIssue(data.issue.id, { externalIssueId: ticketId });
}
```

### 3. 通知システム統合

```javascript
// ISSUE_STATUS_CHANGEイベントを受信してチームに通知
if (event === 'ISSUE_STATUS_CHANGE') {
  await sendSlackNotification({
    channel: '#feedback-alerts',
    message: `イシュー"${data.issue.name}"のステータスが${data.previousStatus}から${data.issue.status}に変更されました。`,
  });
}
```

---

## 関連ドキュメント

- [ウェブフック管理](/ja/user-guide/settings/webhook-management) - UIでウェブフックを設定する方法
- [API統合](./02-api-integration.md) - ウェブフックと一緒に使用できるAPI活用
- [イシュー管理](/ja/user-guide/issue-management) - イシューステータス変更イベントの理解

