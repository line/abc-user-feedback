---
sidebar_position: 3
title: "Key Features"
description: "Introducing key features."
---

# Key Features

ABC User Feedback provides various features to effectively collect, manage, and analyze user feedback. This document describes the core features in detail.

## Feedback Tagging System

![Feedback Tag](/assets/01-feedback-tag.png)

The feedback tagging system is a core feature for systematically classifying and managing large amounts of user feedback.

### Key Features

- **Multiple Issue Assignment**: Assign multiple issues to each feedback for multidimensional classification
- **Custom Issue Creation**: Create and manage customized issues tailored to project characteristics
- **Issue-Based Filtering**: Filter feedback by issue to focus on specific topics
- **Issue Statistics**: Derive insights through analysis of issue usage frequency and trends
- **Issue Color Coding**: Assign colors to issues for visual distinction

### How to Use

1. Create issue categories and issues in the admin panel
2. Assign relevant issues to received feedback
3. Filter and analyze feedback by issue
4. Identify key issues and trends through issue usage patterns

## Kanban Mode

![Issue Kanban](/assets/02-Issue-Kanban.png)

Kanban mode is a feature for visually managing issue groups and optimizing workflows.

### Key Features

- **Intuitive Drag and Drop**: Simple interface for changing issue status
- **Status-Based Column Configuration**: Column separation based on issue progress status (e.g., To Do, In Progress, Done)
- **Workflow Visualization**: Understand team work processes and progress at a glance
- **Workload Management**: Monitor workload through the number of issues in each status
- **Filter and Sort**: Filter and sort issues in the kanban board by various criteria

### How to Use

1. Select kanban mode view
2. Check and manage issues by status
3. Change issue status with drag and drop
4. Optimize team workflows and identify bottlenecks

## Issue Tracker Integration

![Issue Tracker](/assets/03-issue-tracker.png)

Issue tracker integration is a feature for systematically managing problems or improvements found in feedback.

### Key Features

- **Status Indicators**: Visually display the current status of issues (New, In Progress, Resolved, etc.)
- **Priority Setting**: Set priorities based on issue importance
- **External System Integration**: Connect with existing issue tracker systems (JIRA, GitHub Issues, etc.)
- **Assignee Assignment**: Assign responsible parties for issue resolution
- **Timeline Tracking**: Manage issue status changes and comment history

### How to Use

1. Create issues from feedback or register issues directly
2. Set issue details, priority, and assignees
3. Connect with external issue trackers (optional)
4. Monitor and update issue progress
5. Close issues after resolution and notify feedback providers (optional)

## Single Sign-On (SSO)

![Single Sign-on](/assets/04-single-signon.png)

Single Sign-On simplifies authentication processes in enterprise environments and enhances security.

### Key Features

- **OAuth Support**: Authentication support through various OAuth providers
- **Enterprise ID Integration**: Seamless integration with existing enterprise ID systems
- **Centralized User Management**: Manage user access through a single authentication system
- **Enhanced Security**: Apply multi-factor authentication and enterprise security policies
- **Simplified Login Experience**: No need for users to create additional accounts

### Supported SSO Providers

- Google
- Custom (Standard OAuth 2.0 and OpenID Connect providers)

### How to Use

1. Configure SSO provider in admin settings
2. Set authentication parameters and redirect URLs
3. Configure user attribute mapping
4. Enable and test SSO login

## Role-Based Access Control (RBAC)

![Role Management](/assets/05-role-management.png)

Role-Based Access Control is a feature for effectively managing user permissions and maintaining system security.

### Key Features

- **Predefined Roles**: Provides basic roles such as Administrator, Analyst, Viewer
- **Custom Role Creation**: Create customized roles and permissions tailored to organizational structure
- **Granular Permission Control**: Set access permissions by function and data
- **Role Assignment Management**: Assign and change roles per user
- **Permission Inheritance**: Support hierarchical permission structures

### Default Roles

1. **System Administrator**: Full access to all features and settings
2. **Project Manager**: Management permissions for all features within a specific project
3. **Analyst**: Permissions to view, analyze, and assign issues to feedback
4. **Issue Manager**: Permissions to create, modify, and change status of issues
5. **Viewer**: Limited permissions to only view feedback and dashboards

### How to Use

1. Access role management menu in admin panel
2. Create new roles or modify existing roles as needed
3. Assign appropriate roles to users
4. Regularly review permissions and access scope by role

## Dashboard

![Dashboard](/assets/06-dashboard.png)

The dashboard is a feature that visualizes feedback data to understand important insights at a glance.

### Key Features

- **Real-Time Statistics**: Display key metrics in real-time such as feedback count, issue status, resolution rate
- **Trend Analysis**: Graphs showing feedback and issue trends over time
- **Issue Distribution**: Visualize feedback distribution by issue
- **Sentiment Analysis**: Analyze positive/negative/neutral sentiment of feedback (optional feature)
- **Custom Dashboard**: Configure personalized dashboards per user

### Charts and Widgets Provided

1. **Feedback Summary Card**: Key metrics such as total feedback count, new feedback, processed feedback
2. **Time Series Graph**: Daily/weekly/monthly feedback trends
3. **Issue Cloud**: Visualization of frequently used issues
4. **Issue Status Donut Chart**: Distribution by issue status
5. **Recent Feedback List**: Quick view of latest feedback
6. **Performance Metrics**: Performance measurement indicators such as response time and resolution time

### How to Use

1. Access dashboard page
2. Adjust data range through period and filter settings
3. Analyze key metrics and trends
4. Make data-driven decisions and derive action items
5. Export detailed reports when needed

## Additional Features

In addition to the key features described above, ABC User Feedback provides the following additional features:

### API Integration

- Integration with external systems through RESTful API
- Programmatic feedback collection and management

### Webhooks

- Notify external systems when major events occur
- Support building automated workflows

### Image Storage Integration

- Manage user-submitted images through S3-compatible storage
- Attach screenshots and images to feedback

### Data Export

- Export feedback data in CSV, Excel formats
- Generate customized reports

### Multi-Language Support

- Provide interfaces in various languages
- Multi-language feedback management for international teams

---

This document provides an overview of ABC User Feedback's key features. For more detailed usage of each feature, refer to the [User Guide](/en/user-guide/getting-started) section.

