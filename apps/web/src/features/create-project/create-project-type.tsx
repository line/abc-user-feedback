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
type CreateProject = {};

export const CREATE_PROJEC_STEP_KEY_LIST = [
  'project-info',
  'role',
  'member',
  'issue-tracker',
  'api-key',
] as const;

export const LAST_CREATE_PROJECT_STEP = CREATE_PROJEC_STEP_KEY_LIST.length;
export const FIRST_CREATE_PROJECT_STEP = 0;

export type CreateProjectStepKey = (typeof CREATE_PROJEC_STEP_KEY_LIST)[number];
