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

import { Trans } from 'next-i18next';

import type { CreateChannelStepKey } from './create-channel-type';
import InputChannelInfoStep from './ui/input-channel-info-step.ui';
import InputFieldPreviewStep from './ui/input-field-preview-step.ui';
import InputFieldStep from './ui/input-field-step.ui';

export const CREATE_CHANNEL_COMPONENTS: Record<
  CreateChannelStepKey,
  React.ReactNode
> = {
  'channel-info': <InputChannelInfoStep />,
  field: <InputFieldStep />,
  'field-preview': <InputFieldPreviewStep />,
};

export const CREATE_CHANNEL_STEPPER_TEXT: Record<
  CreateChannelStepKey,
  React.ReactNode
> = {
  'channel-info': <Trans i18nKey="channel-setting-menu.channel-info" />,
  field: <Trans i18nKey="channel-setting-menu.field-mgmt" />,
  'field-preview': <Trans i18nKey="main.setting.field-mgmt.preview" />,
};

export const CREATE_CHANNEL_HELP_TEXT: Record<
  CreateChannelStepKey,
  React.ReactNode
> = {
  'channel-info': <Trans i18nKey="help-card.channel-info" />,
  field: <Trans i18nKey="help-card.field" />,
  'field-preview': <Trans i18nKey="help-card.field-preview" />,
};
