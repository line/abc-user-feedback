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

import type { ApiKey } from '@/entities/api-key';
import type { IssueTracker } from '@/entities/issue-tracker';
import type { MemberInfo } from '@/entities/member';
import { getDefaultTimezone } from '@/entities/project';
import type { ProjectInfo } from '@/entities/project';
import { PermissionList } from '@/entities/role';
import type { PermissionType, Role } from '@/entities/role';

import type { CreateProjectStepKey } from './create-project-type';
import {
  CREATE_PROJECT_MAIN_STEP_LIST,
  CREATE_PROJECT_STEP_MAP,
  FIRST_CREATE_PROJECT_STEP,
  LAST_CREATE_PROJECT_STEP,
} from './create-project-type';

const DEFAULT_ROLES: Role[] = [
  { id: 1, name: 'Admin', permissions: [...PermissionList] },
  {
    id: 2,
    name: 'Editor',
    permissions: PermissionList.filter(
      (v) =>
        v.includes('issue') || v.includes('feedback') || v.includes('read'),
    ),
  },
  {
    id: 3,
    name: 'Viewer',
    permissions: [],
  },
];

interface Input {
  projectInfo: ProjectInfo;
  roles: {
    id: number;
    name: string;
    permissions: PermissionType[];
  }[];
  members: MemberInfo[];
  issueTracker: IssueTracker;
  apiKeys: ApiKey[];
}

interface Step {
  key: CreateProjectStepKey;
  index: number;
}

interface State {
  editingStepIndex: number | null;
  currentStep: Step;
  input: Input;
}

interface Action {
  setEditingStepIndex: (index: number) => void;
  jumpStepByIndex: (index: number) => void;
  jumpStepByKey: (key: CreateProjectStepKey) => void;
  prevStep: () => void;
  nextStep: () => void;
  reset: () => void;
  onChangeInput: <T extends keyof Input>(key: T, value: Input[T]) => void;
}
export const CREATE_PROJECT_DEFAULT_INPUT: Input = {
  projectInfo: {
    name: '',
    description: '',
    timezone: getDefaultTimezone(),
  },
  roles: DEFAULT_ROLES,
  members: [],
  issueTracker: {
    ticketDomain: '',
    ticketKey: '',
  },
  apiKeys: [],
};

const DEFAULT_STATE: State = {
  editingStepIndex: null,
  currentStep: {
    index: 0,
    key: 'project-info',
  },
  input: CREATE_PROJECT_DEFAULT_INPUT,
};

export const useCreateProjectStore = create<State & Action>()(
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
            key: CREATE_PROJECT_MAIN_STEP_LIST[index] ?? 'project-info',
          },
        });
      },
      jumpStepByKey(key) {
        set({ currentStep: { index: CREATE_PROJECT_STEP_MAP[key], key } });
      },
      nextStep() {
        set(({ currentStep }) => ({
          currentStep: {
            index: Math.min(currentStep.index + 1, LAST_CREATE_PROJECT_STEP),
            key:
              CREATE_PROJECT_MAIN_STEP_LIST[currentStep.index + 1] ??
              'project-info',
          },
          editingStepIndex: Math.min(
            currentStep.index + 1,
            LAST_CREATE_PROJECT_STEP,
          ),
        }));
      },
      prevStep() {
        set(({ currentStep }) => ({
          currentStep: {
            index: Math.max(currentStep.index - 1, FIRST_CREATE_PROJECT_STEP),
            key:
              CREATE_PROJECT_MAIN_STEP_LIST[currentStep.index - 1] ??
              'project-info',
          },
        }));
      },
      reset() {
        set({ ...DEFAULT_STATE });
      },
    }),
    { name: 'create-project', version: 2, migrate: () => DEFAULT_STATE },
  ),
);
