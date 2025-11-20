---
sidebar_position: 4
title: 'Webhook Integration'
description: 'This guide explains how to integrate with external systems in real-time using webhooks and provides implementation examples.'
---

# Webhook Integration

With webhooks, you can deliver major events occurring in ABC User Feedback to external systems in real-time. You can integrate with Slack notifications, automation workflows, custom analysis systems, etc.

---

## Supported Event Types

Events supported by ABC User Feedback are as follows:

### 1. FEEDBACK_CREATION

Occurs when new feedback is created.

**Request Headers:**

```
Content-Type: application/json
x-webhook-token: your-secret-token
```

**Payload Example:**

```json
{
  "event": "FEEDBACK_CREATION",
  "data": {
    "feedback": {
      "id": 123,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "message": "User feedback content",
      "userEmail": "user@example.com",
      "issues": [
        {
          "id": 456,
          "createdAt": "2024-01-15T10:30:00.000Z",
          "updatedAt": "2024-01-15T10:30:00.000Z",
          "name": "Bug Report",
          "description": "Issue description",
          "status": "OPEN",
          "externalIssueId": "EXT-123",
          "feedbackCount": 5
        }
      ]
    },
    "channel": {
      "id": 1,
      "name": "Website Feedback"
    },
    "project": {
      "id": 1,
      "name": "My Project"
    }
  }
}
```

### 2. ISSUE_CREATION

Occurs when a new issue is created.

**Payload Example:**

```json
{
  "event": "ISSUE_CREATION",
  "data": {
    "issue": {
      "id": 789,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z",
      "name": "New Issue",
      "description": "Issue description",
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

Occurs when issue status is changed.

**Payload Example:**

```json
{
  "event": "ISSUE_STATUS_CHANGE",
  "data": {
    "issue": {
      "id": 789,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z",
      "name": "Issue Name",
      "description": "Issue description",
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

Occurs when an issue is added to feedback.

**Payload Example:**

```json
{
  "event": "ISSUE_ADDITION",
  "data": {
    "feedback": {
      "id": 123,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "message": "User feedback content",
      "issues": [
        {
          "id": 456,
          "name": "Existing Issue",
          "status": "OPEN"
        },
        {
          "id": 789,
          "name": "Newly Added Issue",
          "status": "OPEN"
        }
      ]
    },
    "channel": {
      "id": 1,
      "name": "Website Feedback"
    },
    "project": {
      "id": 1,
      "name": "My Project"
    },
    "addedIssue": {
      "id": 789,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z",
      "name": "Newly Added Issue",
      "description": "Issue description",
      "status": "OPEN",
      "externalIssueId": "EXT-456",
      "feedbackCount": 1
    }
  }
}
```

---

## Webhook Receiving Server Implementation

You need to implement an HTTP server to receive webhooks. The server must meet the following requirements:

### Basic Requirements

1. **HTTP POST Request Handling**: Webhooks are sent via HTTP POST
2. **JSON Payload Parsing**: Request body is in JSON format
3. **Return 200 Response Code**: Must respond with 200 status code on successful processing

### Implementation Example (Node.js/Express)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  const token = req.headers['x-webhook-token'];

  // Token verification
  if (token !== 'your-secret-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Event processing
  switch (event) {
    case 'FEEDBACK_CREATION':
      console.log('New feedback created:', data.feedback);
      // Feedback processing logic
      break;
    case 'ISSUE_CREATION':
      console.log('New issue created:', data.issue);
      // Issue processing logic
      break;
    case 'ISSUE_STATUS_CHANGE':
      console.log(
        'Issue status changed:',
        data.issue,
        'Previous status:',
        data.previousStatus,
      );
      // Status change processing logic
      break;
    case 'ISSUE_ADDITION':
      console.log('Issue added:', data.addedIssue);
      // Issue addition processing logic
      break;
  }

  res.status(200).json({ success: true });
});

app.listen(3000, () => {
  console.log('Webhook listener server running on port 3000.');
});
```

---

## Security and Retry Policy

### Security Considerations

- **Token Verification**: Verify requests through `x-webhook-token` header
- **HTTPS Usage**: Always use HTTPS in production environments

### Retry Policy

- **Automatic Retry**: ABC User Feedback automatically retries up to 3 times on webhook transmission failure
- **Retry Interval**: Each retry is executed after 3 seconds

### Error Handling

- **4xx Errors**: Considered client errors, not retried
- **5xx Errors**: Considered server errors, retried
- **Network Errors**: Retried on connection failure

---

## Usage Examples

### 1. Automatic Translation

```javascript
// Receive FEEDBACK_CREATION event and automatically translate
if (event === 'FEEDBACK_CREATION') {
  const translatedMessage = await translateText(data.feedback.message);
  // Update feedback with translated content
  await updateFeedback(data.feedback.id, { translatedMessage });
}
```

### 2. External Ticket System Integration

```javascript
// Receive ISSUE_CREATION event and create ticket in external system
if (event === 'ISSUE_CREATION') {
  const ticketId = await createExternalTicket({
    title: data.issue.name,
    description: data.issue.description,
    priority: 'medium',
  });
  // Store external ticket ID in issue
  await updateIssue(data.issue.id, { externalIssueId: ticketId });
}
```

### 3. Notification System Integration

```javascript
// Receive ISSUE_STATUS_CHANGE event and notify team
if (event === 'ISSUE_STATUS_CHANGE') {
  await sendSlackNotification({
    channel: '#feedback-alerts',
    message: `Issue "${data.issue.name}" status changed from ${data.previousStatus} to ${data.issue.status}.`,
  });
}
```

---

## Related Documents

- [Webhook Management](/en/user-guide/settings/webhook-management) - How to configure webhooks in UI
- [API Integration](./02-api-integration.md) - API usage that can be used with webhooks
- [Issue Management](/en/user-guide/issue-management) - Understanding issue status change events

