---
sidebar_position: 1
title: 'Project Overview'
description: 'This is a description of the project overview.'
---

# Project Overview

## What is ABC User Feedback?

ABC User Feedback is a standalone web application designed to efficiently collect, categorize, and manage Voice of Customer (VoC) feedback. This open-source solution focuses on systematically managing user feedback to derive insights necessary for product and service improvements.

Currently, this application is being utilized by services with 10 million monthly active users (MAU), demonstrating proven stability for large-scale feedback processing.

## Core Value Proposition

ABC User Feedback provides the following core values:

1. **Centralized Feedback Management**: Manage user feedback collected from various channels in one place
2. **Structured Analysis**: Categorize feedback and identify trends through the issue system
3. **Issue Tracking**: Convert problems discovered in feedback into issues for tracking and management
4. **Data-Driven Decision Making**: Visualize feedback data through dashboards and derive insights

## Technology Stack

ABC User Feedback is built on modern web technologies:

- **Frontend**: [Next.js](https://nextjs.org/) - React-based frontend framework
- **Backend**: [NestJS](https://nestjs.com/) - TypeScript-based scalable backend framework
- **Database**: [MySQL v8](https://www.mysql.com/) - Reliable relational database
- **Search Engine**: [OpenSearch v2.16](https://opensearch.org/) (optional) - High-performance search functionality for large volumes of feedback data

## Architecture Overview

ABC User Feedback consists of the following major components:

1. **Web Admin Interface**: Next.js-based web application providing user interfaces for feedback management, issue tracking, dashboard, etc.
2. **API Server**: NestJS-based backend server responsible for data processing, business logic, authentication, etc.
3. **Database**: MySQL database storing feedback, issues, user information, etc.
4. **Search Engine**: OpenSearch (optional) providing high-performance search for large volumes of feedback data
5. **SMTP Server**: Component responsible for sending emails required for user authentication processes such as email verification during account creation and password reset

These components are containerized through Docker for easy deployment and scaling.

The diagram below shows the major components of ABC User Feedback and their relationships:

```
┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │
│  Web Interface  │◄────►│   API Server    │
│   (Next.js)     │      │    (NestJS)     │
│                 │      │                 │
└─────────────────┘      └────────┬────────┘
                                  │
                                  ▼
         ┌──────────────────────┬──────────────────────┐
         │                      │                      │
┌────────▼─────────┐  ┌─────────▼────────┐  ┌─────────▼────────┐
│                  │  │                  │  │                  │
│  MySQL Database  │  │ OpenSearch Engine │  │   SMTP Server    │
│                  │  │    (Optional)     │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

## Key Use Cases

ABC User Feedback is particularly useful in the following situations:

1. **Product Improvement Process**: Collect and analyze user feedback to set product improvement directions
2. **Customer Support**: Efficiently track and manage user inquiries and issues
3. **User Experience Optimization**: Improve UX/UI based on user opinions
4. **Quality Management**: Systematically manage bug reports and feature requests
5. **Data-Driven Decision Making**: Support strategic decision-making using user feedback statistics

## Differentiating Features

ABC User Feedback differentiates itself from other feedback management tools with the following characteristics:

1. **Fully Open Source**: Completely free to use and customizable, unlike commercial solutions
2. **Enterprise-Grade Features**: Provides features necessary for enterprise environments such as SSO authentication and RBAC
3. **Scalability**: Proven performance at large user bases (10 million MAU)
4. **Easy Integration**: Easy integration with existing systems through RESTful APIs and webhooks
5. **Containerization**: Simple deployment and scaling with Docker support

## Next Steps

To get started with ABC User Feedback, please refer to the following documents:

- [Key Features](./02-key-features.md) - Detailed feature descriptions
- [Installation Guide](../02-getting-started/02-installation/01-docker-hub-images.md) - Installation methods

---

This document provides a basic overview of ABC User Feedback. For more detailed information, please refer to the documents in the respective sections.
