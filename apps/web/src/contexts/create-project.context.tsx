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
import { z } from 'zod';

import type { InputApiKeyType } from '@/types/api-key.type';
import type { InputIssueTrackerType } from '@/types/issue-tracker.type';
import type { InputMemberType } from '@/types/member.type';
import { PermissionList } from '@/types/permission.type';
import type { InputProjectInfoType } from '@/types/project.type';
import type { InputRoleType } from '@/types/role.type';
import {
  CreateContext,
  CreateProvider,
} from './create-project-channel.context';

const DEFAULT_ROLES: InputRoleType[] = [
  { id: 1, name: 'Admin', permissions: [...PermissionList] },
  {
    id: 2,
    name: 'Editor',
    permissions: [...PermissionList].filter(
      (v) =>
        !v.includes('role') &&
        (v.includes('read') ||
          v.includes('feedback') ||
          v.includes('issue') ||
          v.includes('member_create')),
    ),
  },
  {
    id: 3,
    name: 'Viewer',
    permissions: [...PermissionList].filter(
      (v) => v.includes('read') && !v.includes('download'),
    ),
  },
];

export const PROJECT_STEPPER_TEXT: Record<ProjectStepType, string> = {
  projectInfo: 'Project 설정',
  roles: 'Role 관리',
  members: 'Member 관리',
  apiKeys: 'Api Key 관리',
  issueTracker: 'Issue Tracker',
};

const PROJECT_DEFAULT_INPUT: ProjectInputType = {
  apiKeys: [],
  members: [],
  roles: DEFAULT_ROLES,
  issueTracker: { ticketDomain: '', ticketKey: '' },
  projectInfo: { description: '', name: '' },
};

interface ProjectInputType {
  projectInfo: InputProjectInfoType;
  roles: InputRoleType[];
  members: InputMemberType[];
  apiKeys: InputApiKeyType[];
  issueTracker: InputIssueTrackerType;
}

export const projectInputScheme: Zod.ZodType<ProjectInputType> = z.object({
  projectInfo: z.object({
    name: z.string().min(1).max(20),
    description: z.string().max(50),
  }),
  roles: z.array(
    z.object({
      id: z.number(),
      name: z.string().min(1).max(20),
      permissions: z.array(z.enum(PermissionList)),
    }),
  ),
  members: z.array(
    z.object({
      roleId: z.number(),
      user: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string().email(),
        department: z.string(),
      }),
    }),
  ),
  apiKeys: z.array(
    z.object({
      value: z.string().length(20),
    }),
  ),
  issueTracker: z.object({
    ticketDomain: z.string(),
    ticketKey: z.string(),
  }),
});

export const PROJECT_STEPS = [
  'projectInfo',
  'roles',
  'members',
  'apiKeys',
  'issueTracker',
] as const;

export type ProjectStepType = (typeof PROJECT_STEPS)[number];

const CreateProjectContext = CreateContext<ProjectStepType, ProjectInputType>({
  currentStep: 'projectInfo',
  completeStepIndex: 0,
  currentStepIndex: 0,
  input: PROJECT_DEFAULT_INPUT,
  onChangeInput: () => {},
  onPrev: () => {},
  onNext: () => {},
  gotoStep: () => {},
  clearLocalStorage: () => {},
});

export const CreateProjectProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <CreateProjectContext.Provider
      value={CreateProvider({
        type: 'project',
        defaultInput: PROJECT_DEFAULT_INPUT,
        steps: PROJECT_STEPS,
      })}
    >
      {children}
    </CreateProjectContext.Provider>
  );
};
export const useCreateProject = () => {
  return useContext(CreateProjectContext);
};
