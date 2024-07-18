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
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ChannelImageConfig, ChannelInfo } from '@/entities/channel';
import type { FieldInfo } from '@/entities/field';

import type { CreateChannelStepKey } from './create-channel-type';
import {
  CREATE_CHANNEL_STEP_KEY_LIST,
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
  },
  {
    format: 'date',
    property: 'READ_ONLY',
    status: 'ACTIVE',
    name: 'Created',
    key: 'createdAt',
    description: '',
  },
  {
    format: 'date',
    property: 'READ_ONLY',
    status: 'ACTIVE',
    name: 'Updated',
    key: 'updatedAt',
    description: '',
  },
  {
    format: 'multiSelect',
    property: 'EDITABLE',
    status: 'ACTIVE',
    name: 'Issue',
    key: 'issues',
    description: '',
    options: [],
  },
];

interface Input {
  channelInfo: ChannelInfo;
  fields: FieldInfo[];
  fieldPreview: null;
  imageConfig: ChannelImageConfig;
}

interface State {
  editingStep: number;
  currentStep: number;
  input: Input;
}

interface Action {
  jumpStepByKey: (key: CreateChannelStepKey) => void;
  jumpStep: (step: number) => void;
  prevStep: () => void;
  nextStep: () => void;
  reset: () => void;
  getCurrentStepKey: () => CreateChannelStepKey;
  onChangeInput: <T extends keyof Input>(key: T, value: Input[T]) => void;
}

const DEFAULT_STATE: State = {
  editingStep: 0,
  currentStep: 0,
  input: {
    channelInfo: { name: '', description: '' },
    fields: DEFAULT_FIELDS,
    fieldPreview: null,
    imageConfig: {
      accessKeyId: '',
      bucket: '',
      endpoint: '',
      region: '',
      secretAccessKey: '',
      domainWhiteList: null,
    },
  },
};

export const useCreateChannelStore = create<State & Action>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      onChangeInput: <T extends keyof Input>(key: T, value: Input[T]) => {
        set(({ input }) => ({ input: { ...input, [key]: value } }));
      },
      getCurrentStepKey() {
        const { currentStep } = get();
        return (
          CREATE_CHANNEL_STEP_KEY_LIST[currentStep] ??
          CREATE_CHANNEL_STEP_KEY_LIST[0]
        );
      },
      jumpStepByKey(key) {
        set({ currentStep: CREATE_CHANNEL_STEP_KEY_LIST.indexOf(key) });
      },
      jumpStep(step: number) {
        set({ currentStep: step });
      },
      nextStep() {
        set(({ currentStep, editingStep }) => ({
          currentStep: Math.min(currentStep + 1, LAST_CREATE_CHANNEL_STEP),
          editingStep: Math.max(editingStep, currentStep + 1),
        }));
      },
      prevStep() {
        set(({ currentStep }) => ({
          currentStep: Math.max(currentStep - 1, FIRST_CREATE_CHANNEL_STEP),
        }));
      },
      reset() {
        set({ ...DEFAULT_STATE });
      },
    }),
    { name: 'create-channel' },
  ),
);
