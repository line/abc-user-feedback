/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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

export enum PermissionEnum {
  feedback_download_read = 'feedback_download_read',
  feedback_update = 'feedback_update',
  feedback_delete = 'feedback_delete',
  feedback_issue_update = 'feedback_issue_update',

  issue_create = 'issue_create',
  issue_update = 'issue_update',
  issue_delete = 'issue_delete',

  project_update = 'project_update',
  project_delete = 'project_delete',

  project_member_read = 'project_member_read',
  project_member_create = 'project_member_create',
  project_member_update = 'project_member_update',
  project_member_delete = 'project_member_delete',

  project_role_read = 'project_role_read',
  project_role_create = 'project_role_create',
  project_role_update = 'project_role_update',
  project_role_delete = 'project_role_delete',

  project_apikey_read = 'project_apikey_read',
  project_apikey_create = 'project_apikey_create',
  project_apikey_update = 'project_apikey_update',
  project_apikey_delete = 'project_apikey_delete',

  project_tracker_read = 'project_tracker_read',
  project_tracker_update = 'project_tracker_update',

  project_webhook_read = 'project_webhook_read',
  project_webhook_create = 'project_webhook_create',
  project_webhook_update = 'project_webhook_update',
  project_webhook_delete = 'project_webhook_delete',

  project_genai_read = 'project_genai_read',
  project_genai_update = 'project_genai_update',

  channel_create = 'channel_create',
  channel_update = 'channel_update',
  channel_delete = 'channel_delete',
  channel_field_read = 'channel_field_read',
  channel_field_update = 'channel_field_update',
  channel_image_read = 'channel_image_read',
  channel_image_update = 'channel_image_update',
}

export const AllPermissions = Object.values(PermissionEnum);
