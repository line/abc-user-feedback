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
import { i18n } from 'next-i18next';

import type { CreateProjectStepKey } from './create-project-type';
import InputApiKeysStep from './ui/input-api-keys-step.ui';
import InputIssueTrackerStep from './ui/input-issue-tracker-step.ui';
import InputMembersStep from './ui/input-members-step.ui';
import InputProjectInfoStep from './ui/input-project-info-step.ui';
import InputRolesStep from './ui/input-roles-step.ui';

import { HelpCardDocs } from '@/components';

export const CREATE_PROJECT_COMPONENTS: Record<
  CreateProjectStepKey,
  React.ReactNode
> = {
  'project-info': <InputProjectInfoStep />,
  roles: <InputRolesStep />,
  'api-keys': <InputApiKeysStep />,
  'issue-tracker': <InputIssueTrackerStep />,
  members: <InputMembersStep />,
};

export const CREATE_PROJECT_STEPPER_TEXT: Record<
  CreateProjectStepKey,
  React.ReactNode
> = {
  'project-info': i18n?.t('project-setting-menu.project-info'),
  roles: i18n?.t('project-setting-menu.role-mgmt'),
  members: i18n?.t('project-setting-menu.member-mgmt'),
  'api-keys': i18n?.t('project-setting-menu.api-key-mgmt'),
  'issue-tracker': i18n?.t('project-setting-menu.issue-tracker-mgmt'),
};

export const CREATE_PROJECT_HELP_TEXT: Record<
  CreateProjectStepKey,
  React.ReactNode
> = {
  'project-info': i18n?.t('help-card.project-info'),
  roles: i18n?.t('help-card.role'),
  members: i18n?.t('help-card.member'),
  'api-keys': <HelpCardDocs i18nKey="help-card.api-key" />,
  'issue-tracker': i18n?.t('help-card.issue-tracker'),
};
