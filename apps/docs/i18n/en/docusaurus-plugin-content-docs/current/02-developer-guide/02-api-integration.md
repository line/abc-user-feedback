---
sidebar_position: 2
title: "API Integration"
description: "This guide explains how to integrate external systems using ABC User Feedback API and provides actual implementation examples."
---

# API Integration

ABC User Feedback can integrate with external systems through **RESTful API**. You can programmatically collect feedback, manage issues, and query data, making it easy to integrate with existing services or workflows.

---

## API Basic Information

### Official API Documentation

The **complete API documentation** for ABC User Feedback can be found at the following link:

🔗 **[Official API Documentation (Redocly)](https://line.github.io/abc-user-feedback/)**

This documentation provides detailed specs for all endpoints, request/response examples, and an interface for actual testing.

### Base URL

```
https://your-domain.com/api
```

### Authentication Method

All API requests use **API key-based authentication**.

```http
X-API-KEY: your-api-key-here
Content-Type: application/json
```

:::warning Security Notice
Use API keys only on the server side, and do not expose them to clients (browsers, mobile apps).
:::

### API Key Issuance Method

1. **Access Admin Page**: Log in to ABC User Feedback admin page
2. **Project Settings**: Navigate to the settings page for the project
3. **API Key Management**: Create a new API key from the "API Key Management" menu
4. **Copy Key**: Save the generated API key in a safe place

:::info API Key Permissions
API keys are issued per project and can only access data for that project.
:::

---

## Main API Endpoint Examples

### 1. Creating Feedback

#### Basic Feedback Creation

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

// Usage example
const feedback = await createFeedback(1, 1, "Payment error occurred", [
  "Payment",
  "Error",
]);
```

### 2. Querying Feedback

#### Channel-Based Feedback Search

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

// Usage example
const feedbacks = await searchFeedbacks(1, 1, "Payment", 20, 1);
console.log(
  `Retrieved ${feedbacks.items.length} out of ${feedbacks.meta.totalItems} feedback`
);
```

#### Single Feedback Query

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

// Usage example
const feedback = await getFeedbackById(1, 1, 123);
console.log("Feedback details:", feedback);
```

#### Feedback Update

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

// Usage example
const updatedFeedback = await updateFeedback(1, 1, 123, {
  message: "Updated feedback content",
  issueNames: ["Updated issue"],
});
```

#### Feedback Deletion

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

// Usage example
const result = await deleteFeedbacks(1, 1, [123, 124, 125]);
console.log("Deletion complete:", result);
```

### 3. Issue Management

#### Issue Creation

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

// Usage example
const issue = await createIssue(
  1,
  "Payment Error",
  "User experienced error during payment process"
);
```

#### Issue Search

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

// Usage example
const issues = await searchIssues(1, { name: "Payment" });
```

#### Issue Query

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

// Usage example
const issue = await getIssueById(1, 123);
console.log("Issue details:", issue);
```

#### Issue Update

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

// Usage example
const updatedIssue = await updateIssue(1, 123, {
  name: "Updated issue name",
  description: "Updated issue description",
});
```

#### Issue Deletion

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

// Usage example
const result = await deleteIssues(1, [123, 124, 125]);
console.log("Issue deletion complete:", result);
```

#### Adding Issue to Feedback

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

// Usage example
const result = await addIssueToFeedback(1, 1, 123, 456);
console.log("Issue added:", result);
```

#### Removing Issue from Feedback

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

// Usage example
const result = await removeIssueFromFeedback(1, 1, 123, 456);
console.log("Issue removed:", result);
```

### 4. Project and Channel Information

#### Project Information Query

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

// Usage example
const project = await getProjectInfo(1);
console.log("Project information:", project);
```

#### Channel Field Query

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

// Usage example
const fields = await getChannelFields(1, 1);
console.log("Channel fields:", fields);
```

---

## API Testing via Swagger

ABC User Feedback provides **Swagger UI** to easily test and understand the API.

### Swagger Access Method

Access via **API server address + `/docs`**:

```
https://your-domain.com/api/docs
```

Or in **ReDoc format**:

```
https://your-domain.com/api/docs/redoc
```

### Setting API Key in Swagger

1. Click the **"Authorize"** button at the top of Swagger UI
2. Enter the issued API key in the **X-API-KEY** field
3. Click **"Authorize"** to complete authentication

After this, all API requests will automatically include the API key for testing.

### Swagger Usage Tips

- Use **"Try it out"** button to test actual API calls
- Check actual response data structure in **Response body** section
- View detailed request/response data format in **Schema** tab
- Generate **cURL** commands automatically for CLI testing

---

## Error Handling and Retry Logic

### HTTP Status Codes

| Status Code | Meaning          | Handling Method               |
| ----------- | ---------------- | ----------------------------- |
| **200**    | Success         | Normal processing             |
| **400**    | Bad Request     | Validate request data         |
| **401**    | Authentication Failed | Check API key             |
| **403**    | Forbidden       | Check project access permissions |
| **404**    | Not Found       | Check ID value                |
| **429**    | Rate Limit Exceeded | Retry after a moment      |
| **500**    | Server Error    | Retry or contact support team |

## Response Data Parsing Method

### Pagination Response Structure

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
      "message": "Feedback content",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "issues": [
        {
          "id": 1,
          "name": "Issue name"
        }
      ]
    }
  ]
}
```

## Security and Performance Optimization

### API Key Security

- **Use environment variables**: Manage API keys as environment variables
- **Server side only**: Do not expose API keys to clients
- **Key rotation**: Regularly replace API keys
- **IP whitelist**: Allow access only from specific IPs when possible

### Performance Optimization

- **Use pagination**: Set appropriate limit when querying large amounts of data
- **Request only needed fields**: Improve response speed through query optimization
- **Caching strategy**: Cache frequently queried data on client side
- **Batch processing**: Process multiple requests together

## Related Documents

- [API Key Management](/en/user-guide/settings/api-key-management) - How to issue API keys from UI
- [Image Settings](/en/user-guide/settings/image-setting) - Settings for using image upload API
- [Webhook Integration](/en/user-guide/settings/webhook-management) - Real-time notification settings that can be used with API

