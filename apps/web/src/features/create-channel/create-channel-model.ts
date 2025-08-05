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
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ChannelInfo } from '@/entities/channel';
import type { FieldInfo } from '@/entities/field';

import type { CreateChannelStepKey } from './create-channel-type';
import {
  CREATE_CHANNEL_MAIN_STEP_LIST,
  CREATE_CHANNEL_STEP_MAP,
  FIRST_CREATE_CHANNEL_STEP,
  LAST_CREATE_CHANNEL_STEP,
} from './create-channel-type';

const DEFAULT_FIELDS: FieldInfo[] = [
  {
    format: 'number',
    property: 'READ_ONLY',
    status: 'ACTIVE',
    name: 'ID',
    key: 'id',
    description: '',
    order: 0,
    aiFieldTargetKeys: null,
    aiFieldTemplateId: null,
    aiFieldAutoProcessing: null,
  },
  {
    format: 'date',
    property: 'READ_ONLY',
    status: 'ACTIVE',
    name: 'Created',
    key: 'createdAt',
    description: '',
    order: 1,
    aiFieldTargetKeys: null,
    aiFieldTemplateId: null,
    aiFieldAutoProcessing: null,
  },
  {
    format: 'date',
    property: 'READ_ONLY',
    status: 'ACTIVE',
    name: 'Updated',
    key: 'updatedAt',
    description: '',
    order: 2,
    aiFieldTargetKeys: null,
    aiFieldTemplateId: null,
    aiFieldAutoProcessing: null,
  },
  {
    format: 'multiSelect',
    property: 'EDITABLE',
    status: 'ACTIVE',
    name: 'Issue',
    key: 'issues',
    description: '',
    options: [],
    order: 3,
    aiFieldTargetKeys: null,
    aiFieldTemplateId: null,
    aiFieldAutoProcessing: null,
  },
];

interface Input {
  channelInfo: ChannelInfo;
  fields: FieldInfo[];
  fieldPreview: null;
}

interface Step {
  key: CreateChannelStepKey;
  index: number;
}

interface State {
  editingStepIndex: number | null;
  currentStep: Step;
  input: Input;
}

interface Action {
  jumpStepByIndex: (index: number) => void;
  jumpStepByKey: (key: CreateChannelStepKey) => void;
  prevStep: () => void;
  nextStep: () => void;
  reset: () => void;
  onChangeInput: <T extends keyof Input>(key: T, value: Input[T]) => void;
  setEditingStepIndex: (index: number) => void;
}
export const CREATE_CHANNEL_DEFAULT_INPUT: Input = {
  channelInfo: { name: '', description: '', feedbackSearchMaxDays: 365 },
  fields: DEFAULT_FIELDS,
  fieldPreview: null,
};

const DEFAULT_STATE: State = {
  editingStepIndex: null,
  currentStep: {
    key: 'channel-info',
    index: 0,
  },
  input: {
    channelInfo: { name: '', description: '', feedbackSearchMaxDays: 365 },
    fields: DEFAULT_FIELDS,
    fieldPreview: null,
  },
};

export const useCreateChannelStore = create<State & Action>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setEditingStepIndex(index) {
        set({ editingStepIndex: index });
      },
      onChangeInput: <T extends keyof Input>(key: T, value: Input[T]) => {
        set(({ input }) => ({ input: { ...input, [key]: value } }));
      },
      jumpStepByIndex(index) {
        set({
          currentStep: {
            index,
            key: CREATE_CHANNEL_MAIN_STEP_LIST[index] ?? 'channel-info',
          },
        });
      },
      jumpStepByKey(key) {
        set({ currentStep: { index: CREATE_CHANNEL_STEP_MAP[key], key } });
      },
      nextStep() {
        set(({ currentStep }) => ({
          currentStep: {
            index: Math.min(currentStep.index + 1, LAST_CREATE_CHANNEL_STEP),
            key:
              CREATE_CHANNEL_MAIN_STEP_LIST[currentStep.index + 1] ??
              'channel-info',
          },
          editingStepIndex: Math.min(
            currentStep.index + 1,
            LAST_CREATE_CHANNEL_STEP,
          ),
        }));
      },
      prevStep() {
        set(({ currentStep }) => ({
          currentStep: {
            index: Math.max(currentStep.index - 1, FIRST_CREATE_CHANNEL_STEP),
            key:
              CREATE_CHANNEL_MAIN_STEP_LIST[currentStep.index - 1] ??
              'channel-info',
          },
        }));
      },
      reset() {
        set({ ...DEFAULT_STATE });
      },
    }),
    {
      name: 'create-channel',
      version: 3,
      migrate: () => DEFAULT_STATE,
    },
  ),
);
