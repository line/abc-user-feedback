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
export const CREATE_CHANNEL_STEP_KEY_LIST = [
  'channel-info',
  'field',
  'field-preview',
] as const;

export const CREATE_CHANNEL_MAIN_STEP_LIST: CreateChannelStepKey[] = [
  'channel-info',
  'field',
];
export const CREATE_CHANNEL_STEP_MAP: Record<CreateChannelStepKey, number> = {
  'channel-info': 0,
  field: 1,
  'field-preview': 1,
};

export const LAST_CREATE_CHANNEL_STEP = CREATE_CHANNEL_STEP_KEY_LIST.length;
export const FIRST_CREATE_CHANNEL_STEP = 0;

export type CreateChannelStepKey =
  (typeof CREATE_CHANNEL_STEP_KEY_LIST)[number];
