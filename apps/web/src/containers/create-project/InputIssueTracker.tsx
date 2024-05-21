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
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { ZodError } from 'zod';

import { ErrorCode } from '@ufb/shared';
import { Popover, PopoverModalContent, TextInput, toast } from '@ufb/ui';

import CreateProjectInputTemplate from './CreateProjectInputTemplate';

import { SelectBox } from '@/components';
import { Path } from '@/constants/path';
import {
  projectInputScheme,
  useCreateProject,
} from '@/contexts/create-project.context';
import { useOAIMutation } from '@/hooks';
import type { IssueTrackerType } from '@/types/issue-tracker.type';

interface IProps {}

const InputIssueTracker: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { input, onChangeInput, clearLocalStorage, gotoStep } =
    useCreateProject();
  const [openRoleError, setOpenRoleError] = useState(false);
  const [openMemberError, setOpenMemberError] = useState(false);
  const [openProjectError, setOpenProjectError] = useState(false);

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

  const { mutate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects',
    queryOptions: {
      onError(error) {
        if (error.code === ErrorCode.Member.MemberInvalidUser)
          setOpenMemberError(true);
        else if (error.code === ErrorCode.Project.ProjectAlreadyExists)
          setOpenProjectError(true);
        else toast.negative({ title: error?.message ?? 'Error' });
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
    try {
      projectInputScheme.parse(input);
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0] === 'members') setOpenMemberError(true);
          else if (err.path[0] === 'projectInfo') setOpenProjectError(true);
          else if (err.path[0] === 'roles') setOpenRoleError(true);
        });
      }
      return;
    }

    const { apiKeys, issueTracker, members, projectInfo, roles } = input;

    mutate({
      name: projectInfo.name,
      description: projectInfo.description,
      timezone: projectInfo.timezone,
      members: members.map((member) => ({
        roleName: roles.find((role) => role.id === member.roleId)?.name ?? '',
        userId: member.user.id,
      })),
      issueTracker: { data: issueTracker as any },
      apiKeys,
      roles,
    });
  };

  return (
    <CreateProjectInputTemplate onComplete={onComplete} isLoading={isPending}>
      <SelectBox
        options={[{ value: 'jira', label: 'JIRA' }]}
        value={{ value: 'jira', label: 'JIRA' }}
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
        placeholder="PROJECT"
        value={ticketKey}
        onChange={(e) => onChangeIssueTracker('ticketKey', e.target.value)}
      />
      <TextInput
        label="Ticket URL"
        value={`${input.issueTracker.ticketDomain}/browse/${input.issueTracker.ticketKey}-{Number}`}
        disabled
      />
      {openMemberError && (
        <Popover modal open={openMemberError} onOpenChange={setOpenMemberError}>
          <PopoverModalContent
            title={t('text.guide')}
            description={t('main.create-project.guide.invalid-member')}
            submitButton={{
              children: t('button.confirm'),
              onClick: () => {
                setOpenMemberError(false);
                gotoStep('members');
              },
            }}
          />
        </Popover>
      )}
      {openProjectError && (
        <Popover
          modal
          open={openProjectError}
          onOpenChange={setOpenProjectError}
        >
          <PopoverModalContent
            title={t('text.guide')}
            description={t('main.create-project.guide.invalid-project')}
            submitButton={{
              children: t('button.confirm'),
              onClick: () => {
                setOpenProjectError(false);
                gotoStep('projectInfo');
              },
            }}
          />
        </Popover>
      )}
      {openRoleError && (
        <Popover modal open={openRoleError} onOpenChange={setOpenRoleError}>
          <PopoverModalContent
            title={t('text.guide')}
            description={t('main.create-project.guide.invalid-role')}
            submitButton={{
              children: t('button.confirm'),
              onClick: () => {
                setOpenRoleError(false);
                gotoStep('roles');
              },
            }}
          />
        </Popover>
      )}
    </CreateProjectInputTemplate>
  );
};

export default InputIssueTracker;
