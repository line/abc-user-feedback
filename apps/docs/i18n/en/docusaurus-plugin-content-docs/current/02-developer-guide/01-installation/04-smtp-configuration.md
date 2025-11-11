---
id: smtp-configuration
title: SMTP Server Integration Guide
description: This guide explains how to integrate with external SMTP servers for sending authentication emails in production environments.
sidebar_position: 4
---

# SMTP Server Integration Guide

In production environments, instead of local test servers like `smtp4dev`,  
you need to connect to **external SMTP servers (Gmail, SendGrid, company SMTP, etc.)**  
to properly send authentication emails (registration, password reset, etc.).

This document explains environment variable configuration for SMTP server integration and major integration examples.

---

## 1. SMTP-Related Environment Variables

Set the following environment variables in the `api` service or `.env` file:

> **Note**: For SMTP servers that do not require authentication, `SMTP_USERNAME` and `SMTP_PASSWORD` can be omitted.

| Environment Variable                | Description                                            | Required |
| ---------------------------------- | ------------------------------------------------------ | -------- |
| `SMTP_HOST`                        | SMTP server address (e.g., smtp.gmail.com)             | Required |
| `SMTP_PORT`                        | Port number (usually 587, 465, etc.)                  | Required |
| `SMTP_SENDER`                      | Sender email address (e.g., `noreply@yourdomain.com`) | Required |
| `SMTP_USERNAME`                    | SMTP authentication username (account ID)             | Optional |
| `SMTP_PASSWORD`                    | SMTP authentication password or API key               | Optional |
| `SMTP_TLS`                         | Whether to use TLS (`true` or `false`)                | Optional |
| `SMTP_CIPHER_SPEC`                 | TLS encryption algorithm (default: `TLSv1.2`)         | Optional |
| `SMTP_OPPORTUNISTIC_TLS`           | Whether to use STARTTLS (`true` or `false`)           | Optional |

> **Important**: In actual code, `SMTP_USERNAME` and `SMTP_PASSWORD` are used, and `SMTP_TLS=true` is mainly used for port 465, while `false` is mainly used for port 587.

---

## 2. Docker Environment Example

```yaml
api:
  image: line/abc-user-feedback-api
  environment:
    - SMTP_HOST=smtp.gmail.com
    - SMTP_PORT=587
    - SMTP_USERNAME=your-email@gmail.com
    - SMTP_PASSWORD=your-email-app-password
    - SMTP_SENDER=noreply@yourdomain.com
    - SMTP_TLS=false
    - SMTP_OPPORTUNISTIC_TLS=true
```

Or you can manage it separately with a `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-email-app-password
SMTP_SENDER=noreply@yourdomain.com
SMTP_TLS=false
SMTP_OPPORTUNISTIC_TLS=true
```

---

## 3. SMTP Integration Examples

### ✅ Gmail SMTP Integration (for personal testing)

- `SMTP_HOST`: `smtp.gmail.com`
- `SMTP_PORT`: `587`
- `SMTP_USERNAME`: Gmail address (e.g., `abc@gmail.com`)
- `SMTP_PASSWORD`: **App password** (Allow less secure apps → not recommended)
- `SMTP_TLS`: `false`
- `SMTP_OPPORTUNISTIC_TLS`: `true`

> If **two-factor authentication** is enabled on your Gmail account, you must create an [app password](https://myaccount.google.com/apppasswords).

---

### ✅ SendGrid Integration (Recommended)

- `SMTP_HOST`: `smtp.sendgrid.net`
- `SMTP_PORT`: `587`
- `SMTP_USERNAME`: `apikey`
- `SMTP_PASSWORD`: Actual SendGrid API Key
- `SMTP_SENDER`: verified sender address
- `SMTP_TLS`: `false`
- `SMTP_OPPORTUNISTIC_TLS`: `true`

---

## 4. Testing Methods

### 4.1 Email Sending Test

1. **Email Verification Test**:

   - Create admin or user account
   - Verify email verification code is sent

2. **Password Reset Test**:

   - Request password reset
   - Verify email with reset link is received

3. **User Invitation Test**:
   - Admin invites new user
   - Verify invitation email is sent

### 4.2 Log Checking

If email sending fails, check detailed logs with the following command:

```bash
# Docker Compose environment
docker compose logs api

# Check logs for specific time period
docker compose logs --since=10m api

# Real-time log monitoring
docker compose logs -f api
```

If SMTP errors occur, detailed messages will be displayed in the logs.

---

## 5. Troubleshooting

| Problem Type                  | Cause or Solution                      |
| ----------------------------- | -------------------------------------- |
| Authentication Error (`535`) | Recheck `SMTP_USERNAME` / `SMTP_PASSWORD` |
| Connection Refused (`ECONNREFUSED`) | Firewall or incorrect port settings   |
| Email Not Arriving            | `SMTP_SENDER` is not verified          |
| TLS Error (`ETLS`)            | `SMTP_TLS` setting is incorrect        |
| STARTTLS Failure               | Check `SMTP_OPPORTUNISTIC_TLS` setting  |

---

## 6. Email Templates Related to SMTP

Currently, emails are sent in the following situations:

- **Email Verification**: Send verification code when admin/user registers
- **Password Reset**: Send link when password reset is requested
- **User Invitation**: Send invitation email when admin invites user

Email content is based on **Handlebars templates** and includes the following information:

- Sender: `"User feedback" <SMTP_SENDER>`
- Base URL: Uses `ADMIN_WEB_URL` environment variable value
- Template location: `src/configs/modules/mailer-config/templates/`

---

## Related Documents

- [Docker Hub Installation Guide](./docker-hub-images)
- [Environment Variable Settings](./configuration)
- [Getting Started Guide](/en/user-guide/getting-started)

