/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

export const FeedbackPermissionList = [
  'feedback_read',
  'feedback_download_read',
  'feedback_update',
  'feedback_delete',
  'feedback_issue_update',
  'issue_create',
  'issue_delete',
] as const;

export const FeedbackPermissionText: Record<FeedbackPermissionType, string> = {
  feedback_read: 'Read Feedback',
  feedback_download_read: 'Download Feedback',
  feedback_update: 'Edit Feedback',
  feedback_delete: 'Delete Feedback',
  feedback_issue_update: 'Attach/Dettach Issue in Feedback',
  issue_create: 'Create Issue',
  issue_delete: 'Delete Issue',
};

export const IssuePermissionList = ['issue_read', 'issue_update'] as const;

export const IssuePermissionText: Record<IssuePermissionType, string> = {
  issue_read: 'Read Issue',
  issue_update: 'Edit Issue',
};

export const ProjectPermissionList = [
  'project_read',
  'project_update',
  'project_delete',
  'project_member_read',
  'project_member_create',
  'project_member_update',
  'project_member_delete',
  'project_role_read',
  'project_role_create',
  'project_role_update',
  'project_role_delete',
  'project_apikey_read',
  'project_apikey_create',
  'project_apikey_update',
  'project_apikey_delete',
  'project_tracker_read',
  'project_tracker_update',
] as const;

export const ProjectInfoPermissionList = [
  'project_read',
  'project_update',
  'project_delete',
] as const;

export const ProjectMemberPermissionList = [
  'project_member_read',
  'project_member_create',
  'project_member_update',
  'project_member_delete',
] as const;

export const ProjectRolePermissionList = [
  'project_role_read',
  'project_role_create',
  'project_role_update',
  'project_role_delete',
] as const;

export const ProjectApiKeyPermissionList = [
  'project_apikey_read',
  'project_apikey_create',
  'project_apikey_update',
  'project_apikey_delete',
] as const;

export const ProjectTrackerPermissionList = [
  'project_tracker_read',
  'project_tracker_update',
] as const;

export const ProjectPermissionText: Record<ProjectPermissionType, string> = {
  project_read: 'Read Project Information',
  project_update: 'Edit Project Information',
  project_delete: 'Delete Project',
  project_member_read: 'Read Project Member',
  project_member_create: 'Create Project Member',
  project_member_update: 'Edit Project Member',
  project_member_delete: 'Delete Project Member',
  project_role_read: 'Read Project Role',
  project_role_create: 'Create Project Role',
  project_role_update: 'Edit Project Role',
  project_role_delete: 'Delete Project Role ',
  project_apikey_read: 'Read API Key',
  project_apikey_create: 'Create API Key',
  project_apikey_update: 'Edit API Key',
  project_apikey_delete: 'Delete API Key',
  project_tracker_read: 'Read Issue Tracker',
  project_tracker_update: 'Edit Issue Tracker',
};

export const ChannelInfoPermissionList = [
  'channel_read',
  'channel_update',
  'channel_create',
  'channel_delete',
] as const;

export const ChannelFieldPermissionList = [
  'channel_field_read',
  'channel_field_update',
] as const;

export const ChannelImageSettingPermissionList = [
  'channel_image_read',
  'channel_image_update',
] as const;

export const ChannelPermissionList = [
  'channel_read',
  'channel_create',
  'channel_update',
  'channel_delete',
  'channel_field_read',
  'channel_field_update',
  'channel_image_read',
  'channel_image_update',
] as const;

export const ChannelPermissionText: Record<ChannelPermissionType, string> = {
  channel_read: 'Read Channel Info',
  channel_update: 'Edit Channel Info',
  channel_field_read: 'Read Channel Field',
  channel_field_update: 'Edit Channel Field',
  channel_image_read: 'Read Image Setting',
  channel_image_update: 'Edit Image Setting',
  channel_create: 'Create Channel',
  channel_delete: 'Delete Channel',
};

export const PermissionList = [
  ...FeedbackPermissionList,
  ...IssuePermissionList,
  ...ProjectPermissionList,
  ...ChannelPermissionList,
] as const;

export type PermissionType = (typeof PermissionList)[number];

export type FeedbackPermissionType = (typeof FeedbackPermissionList)[number];
export type IssuePermissionType = (typeof IssuePermissionList)[number];
export type ProjectPermissionType = (typeof ProjectPermissionList)[number];
export type ChannelPermissionType = (typeof ChannelPermissionList)[number];
