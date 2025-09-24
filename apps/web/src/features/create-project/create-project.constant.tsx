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

import { Trans } from 'next-i18next';

import { HelpCardDocs } from '@/shared';

import type { CreateProjectStepKey } from './create-project-type';
import InputApiKeyStep from './ui/input-api-key-step.ui';
import InputMembersStep from './ui/input-members-step.ui';
import InputProjectInfoStep from './ui/input-project-info-step.ui';
import InputRolesStep from './ui/input-roles-step.ui';

export const CREATE_PROJECT_COMPONENTS: Record<
  CreateProjectStepKey,
  React.ReactNode
> = {
  'project-info': <InputProjectInfoStep />,
  roles: <InputRolesStep />,
  'api-keys': <InputApiKeyStep />,
  members: <InputMembersStep />,
};

export const CREATE_PROJECT_STEPPER_TEXT: Record<
  CreateProjectStepKey,
  React.ReactNode
> = {
  'project-info': <Trans i18nKey="v2.project-setting-menu.project-info" />,
  roles: <Trans i18nKey="v2.project-setting-menu.role-mgmt" />,
  members: <Trans i18nKey="v2.project-setting-menu.member-mgmt" />,
  'api-keys': <Trans i18nKey="v2.project-setting-menu.api-key-mgmt" />,
};

export const CREATE_PROJECT_HELP_TEXT: Record<
  CreateProjectStepKey,
  React.ReactNode | undefined
> = {
  'project-info': <Trans i18nKey="help-card.project-info" />,
  roles: undefined,
  members: <Trans i18nKey="help-card.member" />,
  'api-keys': <HelpCardDocs i18nKey="help-card.api-key" />,
};

export const CREATE_PROJECT_REQUIRED_STEP: Record<
  CreateProjectStepKey,
  boolean
> = {
  'project-info': true,
  members: false,
  roles: false,
  'api-keys': false,
};
