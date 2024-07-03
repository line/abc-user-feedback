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
import { persist } from 'zustand/middleware';

import type { ApiKey } from '@/entities/api-key';
import type { IssueTracker } from '@/entities/issue-tracker/issue-tracker.type';
import type { Member } from '@/entities/member';
import { getDefaultTimezone } from '@/entities/project';
import type { ProjectInfo } from '@/entities/project';

import type { CreateProjectStepKey } from './create-project-type';
import {
  CREATE_PROJECT_STEP_KEY_LIST,
  FIRST_CREATE_PROJECT_STEP,
  LAST_CREATE_PROJECT_STEP,
} from './create-project-type';

import { create } from '@/libs/zustand';
import { PermissionList } from '@/types/permission.type';
import type { PermissionType } from '@/types/permission.type';
import type { InputRoleType } from '@/types/role.type';

const DEFAULT_ROLES: InputRoleType[] = [
  { id: 1, name: 'Admin', permissions: [...PermissionList] },
  {
    id: 2,
    name: 'Editor',
    permissions: PermissionList.filter(
      (v) => v !== 'project_delete' && v !== 'channel_delete',
    ),
  },
  {
    id: 3,
    name: 'Viewer',
    permissions: [...PermissionList]
      .filter((v) => v.includes('read') && !v.includes('download'))
      .filter((v) => v !== 'project_apikey_read' && v !== 'channel_image_read'),
  },
];

type Input = {
  projectInfo: ProjectInfo;
  roles: {
    id: number;
    name: string;
    permissions: PermissionType[];
  }[];
  members: Member[];
  issueTracker: IssueTracker;
  apiKeys: ApiKey[];
};

type State = {
  editingStep: number;
  currentStep: number;
  input: Input;
};

type Action = {
  jumpStepByKey: (key: CreateProjectStepKey) => void;
  jumpStep: (step: number) => void;
  prevStep: () => void;
  nextStep: () => void;
  reset: () => void;
  getCurrentStepKey: () => CreateProjectStepKey;
  onChangeInput: <T extends keyof Input>(key: T, value: Input[T]) => void;
};

const DEFAULT_STATE: State = {
  editingStep: 0,
  currentStep: 0,
  input: {
    projectInfo: {
      name: '',
      description: null,
      timezone: getDefaultTimezone(),
    },
    roles: DEFAULT_ROLES,
    members: [],
    issueTracker: {
      ticketDomain: '',
      ticketKey: '',
    },
    apiKeys: [],
  },
};

export const useCreateProjectStore = create<State, Action>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      onChangeInput: <T extends keyof Input>(key: T, value: Input[T]) => {
        set(({ input }) => ({ input: { ...input, [key]: value } }));
      },
      getCurrentStepKey() {
        const { currentStep } = get();
        return (
          CREATE_PROJECT_STEP_KEY_LIST[currentStep] ??
          CREATE_PROJECT_STEP_KEY_LIST[0]
        );
      },
      jumpStepByKey(key) {
        set({ currentStep: CREATE_PROJECT_STEP_KEY_LIST.indexOf(key) });
      },
      jumpStep(step: number) {
        set({ currentStep: step });
      },
      nextStep() {
        set(({ currentStep, editingStep }) => ({
          currentStep: Math.min(currentStep + 1, LAST_CREATE_PROJECT_STEP),
          editingStep: Math.max(editingStep, currentStep + 1),
        }));
      },
      prevStep() {
        set(({ currentStep }) => ({
          currentStep: Math.max(currentStep - 1, FIRST_CREATE_PROJECT_STEP),
        }));
      },
      reset() {
        set({ ...DEFAULT_STATE });
      },
    }),
    { name: 'create-project' },
  ),
);
