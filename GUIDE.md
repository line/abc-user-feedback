# ABC User Feedback Integration Guide

## Image Storage Integration

ABC User Feedback supports the integration of image storage solutions to handle images submitted as part of user feedback. We currently support AWS S3 and S3-compatible storage services.

### Uploading Images

There are two methods for uploading images associated with feedback:

1. **Multipart Upload API**: This method requires setting up the [image configuration](#S3-configuration). Once configured, you can use the multipart upload API to securely upload images directly to your storage service.

2. **Feedback Creation API with Image URLs**: Alternatively, users can submit feedback with image URLs. This method does not require the image configuration setup; however, the image URLs must come from the whitelisted domains.

**Note**: For detailed instructions on using these methods, please refer to the API documentation. You can see the documentation by accessing to `{API server host}/docs` or `{API server host}/docs/redoc`.

### S3 Configuration

To enable image uploads directly to the server, you must configure the image storage settings. The service uses the following configuration parameters and you can set them in the setting menu.

- `accessKeyId`: Your storage service access key ID.
- `secretAccessKey`: Your storage service secret access key.
- `endpoint`: The endpoint URL for the storage service.
- `region`: The region your storage service is located in.
- `bucket`: The name of the bucket where images will be stored.
- `enablePresignedUrlDownload`: Download security can be enhanced by using pre-signed URLs supported by AWS S3.

Depending on your use case and the desired level of access, you may need to adjust the permissions of your S3 bucket. If your application requires that the images be publicly accessible, configure your S3 bucket's policy to allow public reads.

### Domain Whitelist

Users can specify a whitelist of domains for image URLs. This ensures that only images from trusted sources are accepted and managed by User Feedback API server.

**Note**: The domain whitelist is enforced at the time of posting feedback with images. This means that validation against the whitelist occurs only during the submission of new feedback. Once an image URL has been uploaded to the database and accepted, it will be accessible through the web admin interface regardless of its current status on the whitelist. It is important to ensure that image URLs are from trusted sources before they are uploaded, as subsequent changes to the whitelist will not retroactively affect previously stored image URLs.

## Webhook Feature

### Introduction to Webhooks

Webhooks in ABC User Feedback provide a powerful way to integrate with external services. They allow you to receive real-time notifications when specific events occur within the application, such as new feedback submissions or issue updates.

Furthermore, you can combine webhooks with ABC User Feedback API to make more powerful features such as translation, sentiment analysis or whatever you want. Just make a webhook listener and build your own script and send the result to ABC User Feedback by API.

### Setting Up Webhooks

To set up webhooks in ABC User Feedback:

1. Navigate to the project settings where you want to enable webhooks.
2. Add a new webhook by providing the URL endpoint that ABC User Feedback will send the data to when events occur.
3. Turn on the events you wish to subscribe to.
4. Save the webhook configuration.

Ensure that the endpoint you provide is secure and can accept POST requests with a JSON payload.

### Event Types and Request Bodies

ABC User Feedback's webhook supports the following event types, each with its own specific payload structure:

#### FEEDBACK_CREATION

This event is triggered when a new piece of feedback is created.

**Payload Structure:**

```json
{
  "event": "FEEDBACK_CREATION",
  "data": {
    "feedback": {
      "id": 1,
      "createdAt": "2023-04-02T15:30:00Z",
      "updatedAt": "2023-04-02T15:30:00Z",
      "issues": [
        {
          "id": 1,
          "createdAt": "2023-04-02T15:30:00Z",
          "updatedAt": "2023-04-02T15:30:00Z",
          "name": "issue name",
          "description": "issue description",
          "status": "INIT",
          "externalIssueId": "123",
          "feedbackCount": 1
        }
      ]
    },
    "channel": {
      "id": 1,
      "name": "channel name"
    },
    "project": {
      "id": 1,
      "name": "project name"
    }
  }
}
```

#### ISSUE_ADDITION

This event is triggered when an issue is added to an existing piece of feedback.

**Payload Structure:**

```json
{
  "event": "ISSUE_ADDITION",
  "data": {
    "feedback": {
      "id": 1,
      "createdAt": "2023-04-02T15:30:00Z",
      "updatedAt": "2023-04-02T15:30:00Z",
      "issues": [
        {
          "id": 1,
          "createdAt": "2023-04-02T15:30:00Z",
          "updatedAt": "2023-04-02T15:30:00Z",
          "name": "issue name",
          "description": "issue description",
          "status": "INIT",
          "externalIssueId": "123",
          "feedbackCount": 1
        }
      ]
    },
    "channel": {
      "id": 1,
      "name": "channel name"
    },
    "project": {
      "id": 1,
      "name": "project name"
    },
    "addedIssue": {
      "id": 1,
      "createdAt": "2023-04-02T15:30:00Z",
      "updatedAt": "2023-04-02T15:30:00Z",
      "name": "issue name",
      "description": "issue description",
      "status": "INIT",
      "externalIssueId": "123",
      "feedbackCount": 1
    }
  }
}
```

#### ISSUE_CREATION

This event is triggered when a new issue is created within a project.

**Payload Structure:**

```json
{
  "event": "ISSUE_CREATION",
  "data": {
    "issue": {
      "id": 1,
      "createdAt": "2023-04-02T15:30:00Z",
      "updatedAt": "2023-04-02T15:30:00Z",
      "name": "issue name",
      "description": "issue description",
      "status": "INIT",
      "externalIssueId": "123",
      "feedbackCount": 1
    },
    "project": {
      "id": 1,
      "name": "project name"
    }
  }
}
```

#### ISSUE_STATUS_CHANGE

This event is triggered when the status of an issue is updated.

**Payload Structure:**

```json
{
  "event": "ISSUE_STATUS_CHANGE",
  "data": {
    "issue": {
      "id": 1,
      "createdAt": "2023-04-02T15:30:00Z",
      "updatedAt": "2023-04-02T15:30:00Z",
      "name": "issue name",
      "description": "issue description",
      "status": "ON_REVIEW",
      "externalIssueId": "123",
      "feedbackCount": 1
    },
    "project": {
      "id": 1,
      "name": "project name"
    },
    "previousStatus": "INIT"
  }
}
```

### Handling Webhooks

Upon receiving a webhook payload, your endpoint should:

Parse the JSON payload.
Take appropriate action based on the event type and data received.
