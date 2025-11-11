---
sidebar_position: 3
title: "OAuth Integration"
description: "This guide explains how to integrate single sign-on (SSO) through Google OAuth and custom OAuth providers."
---

# OAuth Integration

By setting up OAuth 2.0-based single sign-on (SSO) in ABC User Feedback, users can log in with existing accounts (Google, Microsoft, GitHub, etc.) without creating separate accounts. This improves user convenience and is essential for implementing integrated authentication in enterprise environments.

---

## OAuth Integration Overview

OAuth methods supported by ABC User Feedback:

### 1. Google OAuth

- Provided by default without additional setup
- Easy login via Google account

### 2. Custom OAuth Provider

- In-house authentication systems
- Other OAuth 2.0/OpenID Connect compatible services

After setting up OAuth, it can be used alongside existing email login, and you can restrict to OAuth only according to organizational policy.

---

## Google OAuth Integration Settings

### Settings in Google Cloud Console

#### 1. Access Google Cloud Console

Access [Google Cloud Console](https://console.cloud.google.com) and create a project or select an existing project.

#### 2. Create OAuth 2.0 Client ID

1. Navigate to **APIs & Services > Credentials** menu
2. Select **+ Create Credentials > OAuth Client ID**
3. Select application type as **Web Application**

#### 3. Set Authorized Redirect URIs

Add the following URL to **Authorized Redirect URIs**:

```
https://your-domain.com/auth/oauth-callback
```

Examples:

- `https://feedback.company.com/auth/oauth-callback`
- `http://localhost:3000/auth/oauth-callback` (development environment)

#### 4. Check Client Information

After creation is complete, check and copy the following information:

- **Client ID**: `1234567890-abc123def456.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-abcdef123456`

### Google OAuth Settings in ABC User Feedback

To use Google OAuth, follow these steps to configure:

#### 1. Enable Google OAuth Settings

In **Settings > Login Management**:

1. Enable **OAuth2.0 Login** toggle
2. Select **Login Button Type** as "Google Login"
3. Enter information obtained from Google Cloud Console:
   - **Client ID**: Client ID created in Google Cloud Console
   - **Client Secret**: Client secret created in Google Cloud Console
   - **Authorization Code Request URL**: `https://accounts.google.com/o/oauth2/v2/auth`
   - **Scope**: `openid email profile`
   - **Access Token URL**: `https://oauth2.googleapis.com/token`
   - **User Profile Request URL**: `https://www.googleapis.com/oauth2/v2/userinfo`
   - **Email Key**: `email`

#### 2. Register Redirect URI

Add the following URL to **Authorized Redirect URIs** in Google Cloud Console:

```
https://your-domain.com/auth/oauth-callback
```

For development environment:

```
http://localhost:3000/auth/oauth-callback
```

---

## Custom OAuth Provider Integration

### In-House Authentication System Integration

ABC User Feedback can integrate with in-house authentication systems used in enterprise environments. Most in-house authentication systems support OAuth 2.0 or OpenID Connect standards, so integration is possible through standard OAuth flow.

#### Requirements for In-House Authentication System Settings

To integrate with an in-house authentication system, the following information is required:

1. **OAuth Client Registration**

   - Client ID
   - Client Secret
   - Redirect URI: `https://your-domain.com/auth/oauth-callback`

2. **OAuth Endpoint Information**

   - Authorization URL (authentication request URL)
   - Token URL (token exchange URL)
   - User Info URL (user information query URL)

3. **Permission Scope (Scope)**
   - User profile information access permissions
   - Email address access permissions

#### Common In-House Authentication System Examples

| Item                               | Description                               | In-House System Example                           |
| ---------------------------------- | ----------------------------------------- | ------------------------------------------------- |
| **Login Button Type**              | Login button type                         | `CUSTOM`                                          |
| **Login Button Name**              | Name displayed on login button             | `Sign in with Company Account`                    |
| **Client ID**                      | OAuth client ID                           | `company-auth-client-123`                         |
| **Client Secret**                  | Client secret                             | `company-secret-abc123`                           |
| **Authorization Code Request URL** | User authentication request URL            | `https://auth.company.com/oauth/authorize`        |
| **Scope**                          | Permission scope to request                | `openid email profile`                            |
| **Access Token URL**               | Token request URL                         | `https://auth.company.com/oauth/token`            |
| **User Profile Request URL**       | User information query API                 | `https://auth.company.com/api/user`               |
| **Email Key**                      | Email field name in user information JSON | `email` or `mail`                                 |

### Other OAuth 2.0/OpenID Connect Compatible Services

ABC User Feedback can integrate with all authentication services that comply with OAuth 2.0 or OpenID Connect standards.

#### Supported Service Types

- **OpenID Connect Providers**: Services supporting standard OpenID Connect protocol
- **OAuth 2.0 Providers**: Services supporting OAuth 2.0 Authorization Code flow
- **Custom Authentication Servers**: Self-built services providing standard OAuth endpoints

#### Integration Setup Method

Configure custom OAuth in **Settings > Login Management**:

1. **Log in with admin account** and navigate to **Settings > Login Management** menu
2. Enable **OAuth2.0 Login** toggle
3. Select **Login Button Type** as `CUSTOM`
4. Enter information received from authentication service provider:
   - **Login Button Name**: Text displayed on login button (e.g., "Sign in with Company Account")
   - **Client ID**: OAuth client identifier
   - **Client Secret**: Client authentication secret
   - **Authorization Code Request URL**: User authentication request URL
   - **Scope**: Permission scope to request (space-separated, e.g., "openid email profile")
   - **Access Token URL**: Access token request URL
   - **User Profile Request URL**: User profile information query URL
   - **Email Key**: Email field name in user information JSON (e.g., "email" or "mail")

---

## Related Documents

- [Login Management](/en/user-guide/settings/tenant-settings) - How to configure OAuth in UI

