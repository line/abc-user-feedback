---
sidebar_position: 1
title: "Project Overview"
description: "Introducing the project overview."
---

# Project Overview

## What is ABC User Feedback?

ABC User Feedback is a standalone web application designed to efficiently collect, classify, and manage Voice of Customer (VoC). This open-source solution focuses on systematically managing user feedback to derive insights needed for product and service improvements.

Currently, this application is being used in a service with 10 million Monthly Active Users (MAU), demonstrating proven stability for large-scale feedback processing.

## Core Value Proposition

ABC User Feedback provides the following core values:

1. **Centralized Feedback Management**: Manage user feedback collected from various channels in one place
2. **Structured Analysis**: Classify feedback and identify trends through the issue system
3. **Issue Tracking**: Convert problems found in feedback into issues and track them
4. **Data-Driven Decision Making**: Visualize feedback data and derive insights through dashboards

## Technology Stack

ABC User Feedback is built on modern web technologies:

- **Frontend**: [Next.js](https://nextjs.org/) - React-based frontend framework
- **Backend**: [NestJS](https://nestjs.com/) - Scalable backend framework based on TypeScript
- **Database**: [MySQL v8](https://www.mysql.com/) - Reliable relational database
- **Search Engine**: [OpenSearch v2.16](https://opensearch.org/) (Optional) - High-performance search functionality for large amounts of feedback data

## Architecture Overview

ABC User Feedback consists of the following main components:

1. **Web Admin Interface**: Next.js-based web application providing user interfaces for feedback management, issue tracking, dashboards, etc.
2. **API Server**: NestJS-based backend server handling data processing, business logic, authentication, etc.
3. **Database**: MySQL database storing feedback, issues, user information, etc.
4. **Search Engine**: OpenSearch (optional) providing high-performance search for large amounts of feedback data
5. **SMTP Server**: Component responsible for sending emails required for user authentication processes such as email verification during account creation and password reset

These components are containerized through Docker, making them easy to deploy and scale.

## Main Use Cases

ABC User Feedback is particularly useful in the following situations:

1. **Product Improvement Process**: Collect and analyze user feedback to set product improvement directions
2. **Customer Support**: Efficiently track and manage user inquiries and issues
3. **User Experience Optimization**: Improve UX/UI based on user opinions
4. **Quality Management**: Systematically manage bug reports and feature requests
5. **Data-Driven Decision Making**: Support strategic decision-making using user feedback statistics

## Differentiators

ABC User Feedback differentiates itself from other feedback management tools with the following features:

1. **Fully Open Source**: Unlike commercial solutions, it's completely free to use and customizable
2. **Enterprise-Grade Features**: Provides features needed for enterprise environments such as SSO authentication and RBAC
3. **Scalability**: Proven performance in large-scale user base (10 million MAU)
4. **Easy Integration**: Easy integration with existing systems through RESTful API and webhooks
5. **Containerization**: Easy deployment and scaling with Docker support

## Next Steps

To get started with ABC User Feedback, refer to the following documents:

- [Key Features](./02-key-features.md) - Detailed feature descriptions
- [Installation Guide](/en/developer-guide/installation/docker-hub-images) - Installation methods

---

This document provides a basic overview of ABC User Feedback. For more detailed information, refer to the documents in the relevant sections.

