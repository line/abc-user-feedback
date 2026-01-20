---
title: Issue Tracker Settings
description: This guide explains how to integrate ABC User Feedback issues with external issue trackers (Jira, etc.) to track and link issues.
sidebar_position: 3
---

# Issue Tracker Settings

With issue tracker settings, you can integrate ABC User Feedback issues with external issue management systems (Jira, etc.). You can link external ticket links to internal issues to naturally integrate with development workflows.

---

## Issue Tracker Overview

### Purpose of Integration

Issue tracker integration is used for the following purposes:

- **Workflow integration**: Connect customer feedback with development work
- **Issue tracking**: One-to-one mapping between internal issues and external tickets
- **Progress sharing**: Synchronize information between development and customer support teams
- **Efficiency improvement**: Prevent duplicate work and maintain context

### Integration Method

- **Manual link connection**: Manually enter external ticket numbers in ABC issues
- **Automatic URL generation**: Automatically generate links with configured Base URL and Project Key
- **Click navigation**: Click generated links to immediately navigate to external systems

> **Note**: Real-time bidirectional synchronization is not supported. If synchronization such as status changes is needed, use [Webhook](./04-webhook-management.md).

---

## Accessing Settings Screen

### Access Method

1. Click **Settings** in the top menu
2. Select **Issue Tracker Management** from the left menu

### Settings Screen Structure

The issue tracker management screen is structured as follows:

- **Issue Tracking System**: Dropdown to select system to integrate
- **Connection Settings**: Area to enter connection information
- **Link Preview**: Preview of links to be generated
- **Test Connection**: Connection test button

---

## Jira Integration Settings

### System Selection

#### 1. Issue Tracking System Setting

Select **Jira** from the dropdown.

### Entering Connection Information

#### 2. Base URL Setting

Enter the base address of the Jira system.

| Input Example                           | Description                    |
| --------------------------------------- | ------------------------------ |
| `https://yourcompany.atlassian.net`     | Jira Cloud instance            |
| `https://jira.company.com`              | Self-hosted Jira Server        |
| `https://jira.internal:8080`             | Internal network Jira          |

**Notes**:

- Must include `https://` or `http://` protocol
- Remove trailing slash (`/`)
- Include port number if present

#### 3. Project Key Setting

Enter the unique key of the Jira project.

| Input Example | Description                 |
| ------------- | --------------------------- |
| `PROJ`        | Common project key          |
| `DEV`         | Development team project   |
| `CS`          | Customer support team project |
| `BUG`         | Bug management dedicated    |

**How to Check Project Key**:

1. Access the project in Jira
2. The part before `-` in the issue number is the Project Key
3. Example: In `PROJ-123`, `PROJ` is the Project Key

### Link Preview

You can preview the links that will be generated based on the configured information.

#### Preview Structure

```
Base URL + /browse/ + Project Key + - + Issue Number
```

**Example**:

- Base URL: `https://yourcompany.atlassian.net`
- Project Key: `PROJ`
- Issue Number: `123` (entered by user)
- **Generated Link**: `https://yourcompany.atlassian.net/browse/PROJ-123`

#### Link Format Validation

Use the preview to check the following:

- Whether the URL format is correct
- Whether actual Jira issues are accessible
- Whether team members have access permissions

---

## Linking Tickets to Issues

### Entering Ticket Number

After issue tracker settings are complete, you can link external tickets to individual issues.

#### Linking Method

1. Click the desired issue in the **Issue** tab
2. The **Issue Details** panel opens on the right
3. Enter the external ticket number in the **Ticket** field

#### Input Format

| Input Method | Description | Generated Link                              |
| ----------- | ----------- | -------------------------------------------- |
| `123`       | Enter only number | `https://jira.company.com/browse/PROJ-123` |

The system automatically adds the Project Key, so you only need to enter the number.

### Automatic Link Generation

After entering the ticket number, click the **Save** button to automatically generate the link.

#### Link Features

- **Click navigation**: Clicking the link opens the external Jira issue in a new tab
- **External link display**: External link icon displayed next to the link
- **Editable**: Can change ticket number in Edit mode

### Unlinking

To remove external ticket connection:

1. Click the **Edit** button in the issue detail panel
2. Delete the content in the **Ticket** field
3. Save changes with the **Save** button

---

## Related Documents

- [Issue Management](/en/user-guide/issue-management) - How to create issues and link tickets
- [Webhook Management](/en/user-guide/settings/webhook-management) - External system notifications when issue status changes
- [API Integration Guide](/en/developer-guide/api-integration) - Issue management via API

