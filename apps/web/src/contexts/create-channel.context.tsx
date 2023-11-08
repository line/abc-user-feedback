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
import { useContext } from 'react';

import type { InputChannelInfoType } from '@/types/channel.type';
import type { InputFieldType } from '@/types/field.type';
import {
  CreateContext,
  CreateProvider,
} from './create-project-channel.context';

const DEFAULT_FIELDS: InputFieldType[] = [
  {
    format: 'number',
    type: 'DEFAULT',
    status: 'ACTIVE',
    name: 'ID',
    key: 'id',
    description: '',
  },
  {
    format: 'date',
    type: 'DEFAULT',
    status: 'ACTIVE',
    name: 'Created',
    key: 'createdAt',
    description: '',
  },
  {
    format: 'date',
    type: 'DEFAULT',
    status: 'ACTIVE',
    name: 'Updated',
    key: 'updatedAt',
    description: '',
  },
  {
    format: 'multiSelect',
    type: 'DEFAULT',
    status: 'ACTIVE',
    name: 'Issue',
    key: 'issues',
    description: '',
    options: [],
  },
];

export const CHANNEL_STEPPER_TEXT: Record<ChannelStepType, string> = {
  channelInfo: 'Channel 정보',
  fields: 'Field 관리',
  fieldPreview: 'Field 미리보기',
};

interface ChannelInputType {
  channelInfo: InputChannelInfoType;
  fields: InputFieldType[];
  fieldPreview: null;
}
const CHANNEL_DEFAULT_INPUT: ChannelInputType = {
  channelInfo: { name: '', description: '' },
  fields: DEFAULT_FIELDS,
  fieldPreview: null,
};

export const CHANNEL_STEPS = ['channelInfo', 'fields', 'fieldPreview'] as const;

export type ChannelStepsType = typeof CHANNEL_STEPS;
export type ChannelStepType = (typeof CHANNEL_STEPS)[number];

const CreateChannelContext = CreateContext<ChannelStepType, ChannelInputType>({
  currentStep: 'channelInfo',
  completeStepIndex: 0,
  currentStepIndex: 0,
  input: CHANNEL_DEFAULT_INPUT,
  onChangeInput: () => {},
  onPrev: () => {},
  onNext: () => {},
  gotoStep: () => {},
  clearLocalStorage: () => {},
});
export const CreateChannelProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <CreateChannelContext.Provider
      value={CreateProvider({
        type: 'channel',
        defaultInput: CHANNEL_DEFAULT_INPUT,
        steps: CHANNEL_STEPS,
      })}
    >
      {children}
    </CreateChannelContext.Provider>
  );
};
export const useCreateChannel = () => {
  return useContext(CreateChannelContext);
};
