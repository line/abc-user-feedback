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

import type { AIIssue, AITemplate } from '@/entities/ai';

export const FORM_ID = 'ai-issue-form';

export const DEFAULT_FIELD_COLUMNS_KEYS = [
  'id',
  'createdAt',
  'updatedAt',
  'issues',
];

export const GEMINI_PROVIDER = 'GEMINI';
export const DEFAULT_MODEL_GEMINI = 'gemini-2.5-flash';
export const DEFAULT_MODEL_GPT = 'gpt-4o';

export const AI_ISSUE_DEFAULT_VALUES: Partial<AIIssue> = {
  temperature: 0.5,
  prompt: '',
  isEnabled: true,
  dataReferenceAmount: 3,
};

export const AI_TEMPLATE_DEFAULT_VALUES: Partial<AITemplate> = {
  temperature: 0.5,
  title: '',
  prompt: '',
};

export const TEMPERATURE_CONFIG = {
  min: 0,
  max: 1,
  step: 0.1,
  labels: { min: 'Precise', max: 'Creative' },
} as const;

export const DATA_REFERENCE_CONFIG = {
  min: 1,
  max: 5,
  step: 1,
  labels: { min: 'Low', max: 'High' },
} as const;

export const PROVIDER_MODEL_CONFIG = {
  GEMINI: {
    defaultModel: 'gemini-2.5-flash',
  },
  DEFAULT: {
    defaultModel: 'gpt-4o',
  },
} as const;
