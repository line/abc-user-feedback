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
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import { TextInput, toast } from '@ufb/ui';

import { SelectBox } from '@/components';
import { Path } from '@/constants/path';
import { useCreateProject } from '@/contexts/create-project.context';
import { useOAIMutation } from '@/hooks';
import type { IssueTrackerType } from '@/types/issue-tracker.type';
import CreateProjectInputTemplate from './CreateProjectInputTemplate';

interface IProps {}

const InputIssueTracker: React.FC<IProps> = () => {
  const router = useRouter();

  const { input, onChangeInput, clearLocalStorage } = useCreateProject();

  const ticketDomain = useMemo(
    () => input.issueTracker.ticketDomain,
    [input.issueTracker.ticketDomain],
  );
  const ticketKey = useMemo(
    () => input.issueTracker.ticketKey,
    [input.issueTracker.ticketKey],
  );
  const onChangeIssueTracker = useCallback(
    <T extends keyof IssueTrackerType>(key: T, value: IssueTrackerType[T]) => {
      onChangeInput('issueTracker', { ticketDomain, ticketKey, [key]: value });
    },
    [input?.issueTracker],
  );
  const { mutate } = useOAIMutation({
    method: 'post',
    path: '/api/projects',
    queryOptions: {
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
      onSuccess(data) {
        clearLocalStorage();
        router.replace({
          pathname: Path.CREATE_PROJECT_COMPLETE,
          query: { projectId: data?.id },
        });
      },
    },
  });
  const onComplete = () => {
    mutate({
      name: input.projectInfo.name,
      description: input.projectInfo.description,
      apiKeys: input.apiKeys,
      issueTracker: { data: input.issueTracker as any },
      members: input.members.map((v) => ({
        roleName: v.role.name,
        userId: v.user.id,
      })),
      roles: input.roles,
    });
  };

  return (
    <CreateProjectInputTemplate onComplete={onComplete}>
      <SelectBox
        options={[{ key: 'jira', name: 'JIRA' }]}
        value={{ key: 'jira', name: 'JIRA' }}
        label="Issue Tracking System"
      />
      <TextInput
        label="Base URL"
        placeholder="example.com"
        value={ticketDomain}
        onChange={(e) => onChangeIssueTracker('ticketDomain', e.target.value)}
      />
      <TextInput
        label="Project Key"
        placeholder="Delivery"
        value={ticketKey}
        onChange={(e) => onChangeIssueTracker('ticketKey', e.target.value)}
      />
      <TextInput
        label="Ticket URL"
        value={`${input.issueTracker.ticketDomain}/browse/${input.issueTracker.ticketKey}-{Number}`}
        disabled
      />
    </CreateProjectInputTemplate>
  );
};

export default InputIssueTracker;
