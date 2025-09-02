---
sidebar_position: 3
title: 'Tutorial'
description: 'A description of the tutorial.'
---

# Tutorial

After installing ABC User Feedback, initial setup is required to use the system. This document guides you through the initial setup process from creating an administrator account to configuring basic components.

## 1. System Access

Once the installation is complete, access the ABC User Feedback web interface through your web browser:

```
http://localhost:3000
```

> **Note**: If you changed the default port or installed on a different host, use the appropriate URL.

## 2. Tenant Description and Administrator Account Creation

When you first access ABC User Feedback, a tenant creation and administrator account setup screen will be displayed. A tenant is the top-level unit within ABC User Feedback that represents an organization or company, containing all projects and users.

### Enter Tenant Name

![Create Tenant](/assets/initial-setup/create-tenant-1.png)

- Enter your organization/company name in the "Create Tenant" screen.
- This name will be used as an identifier for the company or organization that will manage ABC User Feedback.
- Click the "Next" button after entering the information.

### Enter Administrator Account Information

![Create Administrator Account](/assets/initial-setup/create-tenant-2.png)

- Email Address: Enter the email address to be used for the administrator account.
- Password: Set a secure password.
- Confirm Password: Re-enter the same password.
- Click the "Request Code" button to request a verification code.

### Email Verification

![Email Verification](/assets/initial-setup/email-verification.png)

- If an SMTP server is configured, an email containing a verification code will be sent to the entered email address.
- Check the verification code from the email and enter it in the verification code input field.
- Click the "Verify Code" button to validate the code.

### Complete Verification and Create Account

![Enter Verification Code](/assets/initial-setup/create-tenant-3.png)

- Once the verification code is confirmed, the password input field will be activated.
- Enter the password and password confirmation, then click the "Next" button.

### Complete Tenant Creation

![Tenant Creation Complete](/assets/initial-setup/create-tenant-4.png)

- When tenant creation is complete, a confirmation screen will be displayed.
- Verify the tenant name and administrator email address, then click the "Confirm" button.
- Once tenant creation is complete, you will be redirected to the login screen.

> **Note**: A tenant provides a completely isolated environment within ABC User Feedback. Each tenant has its own users, projects, and settings, and does not share data with other tenants.

## 3. Login

Once the administrator account is created, a login screen will be displayed. Log in with the account information you created.

![Login Screen](/assets/initial-setup/login.png)

## 4. Project Creation

After logging in, the first step is to create a project. In ABC User Feedback, a project is the basic unit for collecting and managing feedback. Project creation is a 3-step process.

### Getting Started

When you first log in, a welcome screen will be displayed. ABC User Feedback manages feedback in a Tenant > Project > Channel structure. Click the "Next" button to start creating a project.

![Welcome Screen](/assets/initial-setup/welcome-screen.png)

### Step 1: Enter Project Information

![Enter Project Information](/assets/initial-setup/create-project-1.png)

In the first step, enter the basic information for the project:

1. **Project Name**: Enter the name of the product or service for which you will collect feedback (required).
2. **Description**: Enter a brief description of the project (optional).
3. **Timezone**: Select the default timezone for the project. This timezone will be used for generating dashboard statistics and displaying dates/times (required).
4. After entering all information, click the "Next" button to proceed to the next step.

### Step 2: Member Management

![Member Management](/assets/initial-setup/create-project-2.png)

In the second step, manage the members who will participate in the project:

1. Initially, no members are registered.
2. Click the "Register Member" button to add a new member.
3. In the member registration popup, select an email and role:
   ![Register Member](/assets/initial-setup/register-member.png)
   - **Email**: Select from users registered in the system.
   - **Role**: Select the role to be granted to the member.
4. Click the "Save" button to add the member.
5. After adding all necessary members, click the "Next" button.

### Role Management (Optional)

By clicking the "Role Management" button in the project member management screen, you can navigate to the role management screen:

![Role Management](/assets/initial-setup/role-management.png)

Here, you can check the permissions of the default provided roles (Admin, Editor, Viewer) and create new roles as needed:

1. You can set permissions related to feedback, issues, projects, and members for each role.
2. Click the "Create Role" button to create a new role.
3. After completing the settings, return to the member management screen.

### Step 3: API Key Management

![API Key Management](/assets/initial-setup/create-project-3.png)

In the third step, generate and manage API keys:

1. API keys are used when collecting or managing feedback programmatically.
2. Click the "Create API Key" button to generate a new API key.
3. The generated API key will be displayed in the list:
   ![API Key Created](/assets/initial-setup/api-key-created.png)
4. Store the API key in a safe place. This key will not be displayed again.
5. Click the "Complete" button to complete project creation.

### Project Creation Complete

![Project Creation Complete](/assets/initial-setup/project-creation-complete.png)

When project creation is complete, a summary screen will be displayed:

1. You can expand the Project Information, Role Management, Member Management, and API Key Management sections to review the configuration.
2. Click the "Create Channel" button to proceed to creating a channel for collecting feedback.
3. Alternatively, click the "Later" button to create a channel later.

> **Note**: In ABC User Feedback, at least one channel is required to collect feedback. It is recommended to create a channel immediately after creating a project.

## 4. Channel Setup

After creating a project, you need to set up channels for collecting feedback. A channel represents the source from which feedback comes. Channel creation is a 2-step process.

### Step 1: Enter Channel Information

![Enter Channel Information](/assets/initial-setup/create-channel-1.png)

In the first step, enter the basic information for the channel:

- **Channel Name**: Enter an identifying name for the channel (e.g., "In-app Feedback", "Email Inquiry", "Customer Support") (required)
- **Description**: Enter a brief description of the channel (optional)
- A channel is a unit that distinguishes feedback collection paths or collection methods. Consider the characteristics of the channel when entering information.
- After entering the information, click the "Next" button to proceed to the next step.

### Step 2: Field Management

![Field Management](/assets/initial-setup/create-channel-2.png)

In the second step, define the fields for feedback data to be collected in the channel:

1. By default, system fields such as id, createdAt, updatedAt, and issues are provided.
2. Click the "Add Field" button to add new fields:
   ![Add Field](/assets/initial-setup/add-field.png)
   - **Key**: Unique identifier for the field
   - **Display Name**: Name to be displayed in the user interface
   - **Format**: Data format of the field such as text, number, date, etc.
   - **Property**: Whether it's read-only or editable
   - **Status**: Activation status of the field
   - **Description**: Description of the field (optional)
3. Click the "Preview" button to view a preview of feedback data composed of the configured fields:
   ![Field Preview](/assets/initial-setup/field-preview.png)
4. After adding all necessary fields, click the "Complete" button to complete channel creation.

### Channel Creation Complete

![Channel Creation Complete](/assets/initial-setup/channel-creation-complete.png)

When channel creation is complete, a summary screen will be displayed:

1. You can expand the Channel Information and Field Management sections to review the configuration.
2. Click the "Start" button to begin collecting feedback.

> **Note**: Once channel setup is complete, you can collect feedback through the API.

## 5. Collecting Your First Feedback

### Collecting Feedback via API

Let's collect your first feedback through the API. Run the following command in your terminal:

```bash
curl -X POST http://localhost:4000/api/v1/projects/1/channels/1/feedbacks \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: YOUR_API_KEY" \
  -d '{
    "content": "I really like this product! But the loading speed is a bit slow.",
    "userEmail": "user@example.com"
  }'
```

Replace `YOUR_API_KEY` with the API key you created earlier.

### Viewing Feedback in the Web Interface

1. Click the "Feedback" tab in the top menu of the web interface.
2. The feedback you just added will appear in the list.
3. Click on the feedback to view detailed information.

<!-- ![Feedback List](/assets/quick-start/feedback-list.png) -->

## 6. Adding Issues

1. In the feedback detail screen, click the "+" button in the issue column.
2. A dropdown will open where you can enter the name of the issue.
3. Click on that issue to create it and add the issue to the corresponding feedback.

<!-- ![Add Issue](/assets/quick-start/add-tag.png) -->

## 7. Viewing Issues

1. Click the "Issue" tab in the top menu of the web interface.
2. Issues will be displayed by status.
3. Click the List button to view issues in list format.

<!-- ![Create Issue](/assets/quick-start/create-issue.png) -->

## Next Steps

After completing the initial setup, you can proceed to the following steps:

- [Feedback Management](../03-user-guide/02-feedback-management/01-viewing-filtering.md): Learn how to view, filter, and tag feedback
- [Using Issue Tracker](../03-user-guide/03-issue-management/01-issue-tracker.md): Learn how to manage and track issues
- [API Overview](../04-integration-guide/01-api-overview.md): Learn how to integrate programmatically through the API
- [Setting Up and Using Webhooks](../04-integration-guide/03-webhooks.md): Learn how to integrate with external systems through webhooks
