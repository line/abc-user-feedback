---
title: Tenant Settings
description: This guide explains how to manage tenant information, login methods, user management, and other organization-wide settings in ABC User Feedback.
sidebar_position: 1
---

# Tenant Settings

Tenant settings are the top-level management features of ABC User Feedback, covering important settings that affect the entire organization. This document explains how to manage tenant information, configure login methods, and manage all users.

> **Note**: These settings can only be accessed by users with **Super Admin permissions**.

---

## Tenant Settings

A tenant is the top-level unit of an organization, encompassing all projects and users.

### Access Method

1. Click the **Home** icon in the top right menu
2. Select **Tenant Information** from the left menu

### Editable Items

| Item            | Description                                  | Editable | Example                      |
| --------------- | -------------------------------------------- | -------- | ---------------------------- |
| **ID**          | Unique tenant identifier (system auto-generated) | ❌ No    | `1`                          |
| **Name**        | Tenant name (organization name, company name, etc.) | ✅ Yes   | `ABC Company`                |
| **Description** | Tenant description (optional)                | ✅ Yes   | `Customer feedback management system` |

### How to Edit Information

1. Modify the **Name** or **Description** field
2. Click the **Save** button at the top right
3. A success message is displayed when saved

> The tenant name may be displayed in the login UI.

---

## Login Settings

Configure the authentication method users will use when accessing the system.

### Access Method

1. Click the **Home** icon in the top right menu
2. Select **Login Management** from the left menu

### Supported Login Methods

#### 1. Email Login

The default email + password combination method.

**Features**:

- Enabled by default without additional setup
- User invitation → email verification → password setup sequence
- Password reset functionality provided

**Password Policy**:

- Minimum 8 characters
- Recommended to include letters, numbers, and special characters
- Consecutive characters prohibited (e.g., `aa`, `11`)

#### 2. Google Login

Social login method via Google OAuth 2.0.

**Setup Method**:

1. **Enable Google Login**: Toggle to ON
2. **Google Cloud Console setup is required**:

> **Note**: For detailed implementation of Google OAuth integration, refer to the [OAuth Integration Guide](/en/developer-guide/oauth-integration).

#### 3. Custom OAuth Login

Method using your own OAuth server or other OAuth providers.

**Setup Items**:

| Item              | Description                          | Example                                       |
| ----------------- | ------------------------------------ | --------------------------------------------- |
| **Provider Name** | Name displayed on login button       | `Sign in with Microsoft`                      |
| **Client ID**     | OAuth client ID                      | `abc123xyz`                                   |
| **Client Secret** | OAuth client secret                  | `supersecret`                                 |
| **Auth URL**      | Authentication request URL            | `https://auth.example.com/oauth2/auth`        |
| **Token URL**     | Token request URL                    | `https://auth.example.com/oauth2/token`       |
| **User Info URL** | User information request URL         | `https://auth.example.com/oauth2/userinfo`    |
| **Scope**         | Permission scope to request          | `openid email profile`                        |
| **Email Key**     | Email field name in user information | `email`                                       |

**Setup Sequence**:

1. Enter OAuth server information in each field
2. Click the **Save** button to save
3. A button with the configured Provider Name is displayed on the login screen

### Login Method Combinations

Multiple login methods can be enabled simultaneously:

- **Email only**: Only default login form displayed
- **Email + Google**: Login form + "Sign in with Google" button
- **Email + Custom**: Login form + custom OAuth button

### Testing Login Settings

After changing settings, be sure to test:

1. Access the login page in browser incognito mode
2. Verify that configured login methods are displayed correctly
3. Perform actual login tests with each method

---

## User Management

A feature to centrally manage all users across the tenant.

### Access Method

1. Click the **Home** icon in the top right menu
2. Select **User Management** from the left menu

### Viewing User List

#### Displayed Information

| Column     | Description                      | Display Example              |
| ---------- | -------------------------------- | ---------------------------- |
| Email      | Login account email              | `user@company.com`            |
| Name       | User name (from profile)        | `John Doe`                   |
| Department | Department                       | `Development Team`           |
| Type       | User type                        | `SUPER` / `GENERAL`          |
| Project    | List of accessible projects      | `Project A, Project B`       |
| Created    | Account creation date/time      | `2024-03-15 14:30`           |

#### User Type Description

| Type      | Description                                                     | Permission Scope       |
| --------- | --------------------------------------------------------------- | ---------------------- |
| `SUPER`   | Can access all projects and settings. Acts as full system administrator | Entire tenant         |
| `GENERAL` | Can only access specified projects                              | Specific projects only |

### User Search and Filtering

You can quickly find desired users when there are many users.

#### Filter Function

Click the **Filter** button at the top to set conditions.

**Filter Conditions**:

- **Email**: Search by email address
- **Name**: Search by user name
- **Department**: Search by department name

**Operator Options**:

- **CONTAINS**: When it contains
- **IS**: When it exactly matches

### Inviting Users

Invite new users to the system.

#### Invitation Method

1. Click the **Invite User** button at the top right
2. Enter invitation information

| Item        | Description                        | Options                     |
| ----------- | ---------------------------------- | --------------------------- |
| **Email**   | Email address of user to invite    | Required input              |
| **Type**    | User type                          | `GENERAL` / `SUPER`         |
| **Project** | Projects to allow access           | Select from project list    |
| **Role**    | Role in that project               | `Admin` / `Editor` / `Viewer` |

3. Click the **Invite** button to complete the invitation

#### Post-Invitation Process

1. An email is sent to the invited user
2. The user clicks the link in the email to proceed with registration
3. After registration is complete, they are automatically added to the specified project

### Editing User Information

You can modify information and permissions of existing users.

#### Editing Method

1. Click the user you want to edit in the user list
2. The **Edit User** popup opens

#### Editable Items

| Item      | Editable | Description                           |
| --------- | -------- | ------------------------------------- |
| **Email** | ❌ No    | Cannot be changed as account identifier |
| **Type**  | ✅ Yes   | Can change between `GENERAL` ↔ `SUPER` |

#### Save and Apply

1. Modify necessary information
2. Click the **Save** button
3. Changes are applied immediately and reflected from the user's next login

### Deleting Users

You can delete users who no longer use the system.

#### Deletion Method

1. Click the **Delete** button at the bottom of the user edit popup
2. Approve deletion in the confirmation dialog

#### Deletion Notes

- **Cannot be recovered**: Deleted user accounts cannot be restored
- **Immediate access removal**: All system access is blocked immediately upon deletion

---

## Related Documents

- [Project Management](../02-project-management.md) - Member and permission management per project
- [OAuth Integration Guide](../../02-developer-guide/03-oauth-integration.md) - Technical implementation of OAuth settings
- [API Integration](/en/developer-guide/api-integration) - User management via API

