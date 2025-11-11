---
sidebar_position: 2
title: "API統合"
description: "ABC User Feedback APIを活用した外部システム統合方法と実際の実装例を案内します。"
---

# API統合

ABC User Feedbackは**RESTful API**を通じて外部システムと統合できます。プログラムでフィードバックを収集し、イシューを管理し、データを照会できるため、既存のサービスやワークフローに簡単に統合できます。

---

## API基本情報

### 公式APIドキュメント

ABC User Feedbackの**完全なAPIドキュメント**は次のリンクで確認できます：

🔗 **[公式APIドキュメント（Redocly）](https://line.github.io/abc-user-feedback/)**

このドキュメントでは、すべてのエンドポイントの詳細な仕様、リクエスト/レスポンス例、実際にテスト可能なインターフェースを提供します。

### Base URL

```
https://your-domain.com/api
```

### 認証方式

すべてのAPIリクエストは**APIキーベースの認証**を使用します。

```http
X-API-KEY: your-api-key-here
Content-Type: application/json
```

:::warning セキュリティ注意事項
APIキーはサーバーサイドでのみ使用し、クライアント（ブラウザ、モバイルアプリ）に公開しないでください。
:::

### APIキー発行方法

1. **管理者ページアクセス**: ABC User Feedback管理者ページにログイン
2. **プロジェクト設定**: 該当プロジェクトの設定ページに移動
3. **APIキー管理**: 「APIキー管理」メニューから新しいAPIキーを生成
4. **キーコピー**: 生成されたAPIキーを安全な場所に保存

:::info APIキー権限
APIキーはプロジェクトごとに発行され、該当プロジェクトのデータにのみアクセスできます。
:::

---

## 主要APIエンドポイント例

### 1. フィードバック作成

#### 基本フィードバック作成

```javascript
const createFeedback = async (
  projectId,
  channelId,
  message,
  issueNames = []
) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "your-api-key-here",
      },
      body: JSON.stringify({
        message: message,
        issueNames: issueNames,
      }),
    }
  );

  return await response.json();
};

// 使用例
const feedback = await createFeedback(1, 1, "決済エラーが発生しました", [
  "決済",
  "エラー",
]);
```

### 2. フィードバック照会

#### チャネル別フィードバック検索

```javascript
const searchFeedbacks = async (
  projectId,
  channelId,
  searchText,
  limit = 10,
  page = 1
) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "your-api-key-here",
      },
      body: JSON.stringify({
        limit: limit,
        page: page,
        query: {
          searchText: searchText,
          createdAt: {
            gte: "2024-01-01",
            lt: "2024-12-31",
          },
        },
        sort: {
          createdAt: "DESC",
        },
      }),
    }
  );

  return await response.json();
};

// 使用例
const feedbacks = await searchFeedbacks(1, 1, "決済", 20, 1);
console.log(
  `合計${feedbacks.meta.totalItems}件のフィードバック中${feedbacks.items.length}件を照会`
);
```

#### 単一フィードバック照会

```javascript
const getFeedbackById = async (projectId, channelId, feedbackId) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks/${feedbackId}`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": "your-api-key-here",
      },
    }
  );

  return await response.json();
};

// 使用例
const feedback = await getFeedbackById(1, 1, 123);
console.log("フィードバック詳細:", feedback);
```

#### フィードバック更新

```javascript
const updateFeedback = async (projectId, channelId, feedbackId, updateData) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks/${feedbackId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "your-api-key-here",
      },
      body: JSON.stringify(updateData),
    }
  );

  return await response.json();
};

// 使用例
const updatedFeedback = await updateFeedback(1, 1, 123, {
  message: "更新されたフィードバック内容",
  issueNames: ["更新されたイシュー"],
});
```

#### フィードバック削除

```javascript
const deleteFeedbacks = async (projectId, channelId, feedbackIds) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "your-api-key-here",
      },
      body: JSON.stringify({
        feedbackIds: feedbackIds,
      }),
    }
  );

  return await response.json();
};

// 使用例
const result = await deleteFeedbacks(1, 1, [123, 124, 125]);
console.log("削除完了:", result);
```

### 3. イシュー管理

#### イシュー作成

```javascript
const createIssue = async (projectId, name, description) => {
  const response = await fetch(`/api/projects/${projectId}/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "your-api-key-here",
    },
    body: JSON.stringify({
      name: name,
      description: description,
    }),
  });

  return await response.json();
};

// 使用例
const issue = await createIssue(
  1,
  "決済エラー",
  "ユーザーが決済過程でエラーを経験"
);
```

#### イシュー検索

```javascript
const searchIssues = async (projectId, query = {}) => {
  const response = await fetch(`/api/projects/${projectId}/issues/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "your-api-key-here",
    },
    body: JSON.stringify({
      limit: 10,
      page: 1,
      query: query,
      sort: {
        createdAt: "DESC",
      },
    }),
  });

  return await response.json();
};

// 使用例
const issues = await searchIssues(1, { name: "決済" });
```

#### イシュー照会

```javascript
const getIssueById = async (projectId, issueId) => {
  const response = await fetch(`/api/projects/${projectId}/issues/${issueId}`, {
    method: "GET",
    headers: {
      "X-API-KEY": "your-api-key-here",
    },
  });

  return await response.json();
};

// 使用例
const issue = await getIssueById(1, 123);
console.log("イシュー詳細:", issue);
```

#### イシュー更新

```javascript
const updateIssue = async (projectId, issueId, updateData) => {
  const response = await fetch(`/api/projects/${projectId}/issues/${issueId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "your-api-key-here",
    },
    body: JSON.stringify(updateData),
  });

  return await response.json();
};

// 使用例
const updatedIssue = await updateIssue(1, 123, {
  name: "更新されたイシュー名",
  description: "更新されたイシュー説明",
});
```

#### イシュー削除

```javascript
const deleteIssues = async (projectId, issueIds) => {
  const response = await fetch(`/api/projects/${projectId}/issues`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "your-api-key-here",
    },
    body: JSON.stringify({
      issueIds: issueIds,
    }),
  });

  return await response.json();
};

// 使用例
const result = await deleteIssues(1, [123, 124, 125]);
console.log("イシュー削除完了:", result);
```

#### フィードバックにイシュー追加

```javascript
const addIssueToFeedback = async (
  projectId,
  channelId,
  feedbackId,
  issueId
) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks/${feedbackId}/issues/${issueId}`,
    {
      method: "POST",
      headers: {
        "X-API-KEY": "your-api-key-here",
      },
    }
  );

  return await response.json();
};

// 使用例
const result = await addIssueToFeedback(1, 1, 123, 456);
console.log("イシュー追加完了:", result);
```

#### フィードバックからイシュー削除

```javascript
const removeIssueFromFeedback = async (
  projectId,
  channelId,
  feedbackId,
  issueId
) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/feedbacks/${feedbackId}/issues/${issueId}`,
    {
      method: "DELETE",
      headers: {
        "X-API-KEY": "your-api-key-here",
      },
    }
  );

  return await response.json();
};

// 使用例
const result = await removeIssueFromFeedback(1, 1, 123, 456);
console.log("イシュー削除完了:", result);
```

### 4. プロジェクトとチャネル情報

#### プロジェクト情報照会

```javascript
const getProjectInfo = async (projectId) => {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "GET",
    headers: {
      "X-API-KEY": "your-api-key-here",
    },
  });

  return await response.json();
};

// 使用例
const project = await getProjectInfo(1);
console.log("プロジェクト情報:", project);
```

#### チャネルフィールド照会

```javascript
const getChannelFields = async (projectId, channelId) => {
  const response = await fetch(
    `/api/projects/${projectId}/channels/${channelId}/fields`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": "your-api-key-here",
      },
    }
  );

  return await response.json();
};

// 使用例
const fields = await getChannelFields(1, 1);
console.log("チャネルフィールド:", fields);
```

---

## SwaggerによるAPIテスト

ABC User Feedbackは**Swagger UI**を提供して、APIを簡単にテストし理解できます。

### Swaggerアクセス方法

**APIサーバーアドレス + `/docs`**でアクセスします：

```
https://your-domain.com/api/docs
```

または**ReDoc形式**で：

```
https://your-domain.com/api/docs/redoc
```

### SwaggerでのAPIキー設定

1. Swagger UI上部の**"Authorize"**ボタンをクリック
2. **X-API-KEY**フィールドに発行されたAPIキーを入力
3. **"Authorize"**をクリックして認証完了

これ以降、すべてのAPIリクエストで自動的にAPIキーが含まれ、テストできます。

### Swagger活用のヒント

- **"Try it out"**ボタンで実際のAPI呼び出しテスト
- **Response body**セクションで実際のレスポンスデータ構造を確認
- **Schema**タブでリクエスト/レスポンスデータ形式の詳細を確認
- **cURL**コマンドを自動生成してCLIテスト可能

---

## エラー処理と再試行ロジック

### HTTPステータスコード

| ステータスコード | 意味           | 処理方法               |
| --------- | -------------- | ----------------------- |
| **200**   | 成功           | 正常処理               |
| **400**   | 不正なリクエスト | リクエストデータ検証        |
| **401**   | 認証失敗      | APIキー確認             |
| **403**   | 権限なし      | プロジェクトアクセス権限確認 |
| **404**   | リソースなし    | ID値確認              |
| **429**   | リクエスト制限超過 | しばらくしてから再試行          |
| **500**   | サーバーエラー      | 再試行またはサポートチームに問い合わせ |

## レスポンスデータ解析方法

### ページネーションレスポンス構造

```json
{
  "meta": {
    "itemCount": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "totalPages": 10,
    "currentPage": 1
  },
  "items": [
    {
      "id": 1,
      "message": "フィードバック内容",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "issues": [
        {
          "id": 1,
          "name": "イシュー名"
        }
      ]
    }
  ]
}
```

## セキュリティとパフォーマンス最適化

### APIキーセキュリティ

- **環境変数使用**: APIキーを環境変数で管理
- **サーバーサイドのみ**: クライアントにAPIキーを公開しない
- **キーローテーション**: 定期的なAPIキー交換
- **IPホワイトリスト**: 可能な場合は特定IPからのみアクセス許可

### パフォーマンス最適化

- **ページネーション活用**: 大量データ照会時に適切なlimit設定
- **必要なフィールドのみリクエスト**: クエリ最適化でレスポンス速度改善
- **キャッシング戦略**: 頻繁に照会するデータはクライアントサイドキャッシング
- **バッチ処理**: 複数のリクエストをまとめて処理

## 関連ドキュメント

- [APIキー管理](/ja/user-guide/settings/api-key-management) - UIからAPIキーを発行する方法
- [画像設定](/ja/user-guide/settings/image-setting) - 画像アップロードAPI使用のための設定
- [Webhook統合](/ja/user-guide/settings/webhook-management) - APIと一緒に活用できるリアルタイム通知設定

