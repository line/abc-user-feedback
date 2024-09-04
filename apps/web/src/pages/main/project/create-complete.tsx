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
import React, { useEffect } from 'react';
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import {
  CreateSectionTemplate,
  DEFAULT_LOCALE,
  Path,
  useOAIQuery,
} from '@/shared';
import { ApiKeyTable } from '@/entities/api-key';
import type { IssueTracker } from '@/entities/issue-tracker';
import { IssueTrackerForm } from '@/entities/issue-tracker';
import { MemberTable } from '@/entities/member';
import type { ProjectInfo } from '@/entities/project';
import { ProjectInfoForm } from '@/entities/project';
import { RoleTable } from '@/entities/role';

const CompleteProjectCreationPage: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const projectId = Number(router.query.projectId);

  const { data: project } = useOAIQuery({
    path: '/api/admin/projects/{projectId}',
    variables: { projectId },
  });

  const { data: apiKeys } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/api-keys',
    variables: { projectId },
  });
  const { data: roles } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/roles',
    variables: { projectId },
  });
  const { data: issueTracker } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/issue-tracker',
    variables: { projectId },
  });
  const { data: members } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/members',
    variables: { projectId, createdAt: 'ASC' },
  });

  const projectInfoFormMethods = useForm<ProjectInfo>();
  const issueTrackerFormMethods = useForm<IssueTracker>();

  useEffect(() => {
    if (!project || !issueTracker) return;
    projectInfoFormMethods.reset(project);
    issueTrackerFormMethods.reset(issueTracker.data);
  }, [project, issueTracker]);

  return (
    <div className="m-auto flex min-h-screen w-[1040px] flex-col gap-4 pb-6">
      <Header />
      <div className="flex flex-col items-center gap-3 py-6">
        <Icon
          name="Check"
          size={48}
          className="bg-blue-primary text-above-primary rounded-full"
        />
        <p className="font-20-bold">
          {t('main.create-project.complete-title')}
        </p>
      </div>
      <CreateSectionTemplate
        title={t('project-setting-menu.project-info')}
        defaultOpen
      >
        <FormProvider {...projectInfoFormMethods}>
          <ProjectInfoForm type="update" readOnly />
        </FormProvider>
      </CreateSectionTemplate>
      <CreateSectionTemplate title={t('project-setting-menu.role-mgmt')}>
        <RoleTable roles={roles?.roles ?? []} />
      </CreateSectionTemplate>
      <CreateSectionTemplate title={t('project-setting-menu.member-mgmt')}>
        <MemberTable
          members={members?.members ?? []}
          roles={roles?.roles ?? []}
          createButton={<></>}
          onUpdateMember={() => {}}
        />
      </CreateSectionTemplate>
      <CreateSectionTemplate title={t('project-setting-menu.api-key-mgmt')}>
        <ApiKeyTable
          apiKeys={apiKeys?.items ?? []}
          createButton
          onClickUpdate={() => {}}
        />
      </CreateSectionTemplate>
      <CreateSectionTemplate
        title={t('project-setting-menu.issue-tracker-mgmt')}
      >
        <FormProvider {...issueTrackerFormMethods}>
          <IssueTrackerForm readOnly />
        </FormProvider>
      </CreateSectionTemplate>
      <div className="border-fill-tertiary flex rounded border p-6">
        <div className="flex flex-1 items-center gap-2.5">
          <Icon
            name="InfoCircleFill"
            size={24}
            className="text-green-primary"
          />
          <p className="font-12-regular whitespace-pre-line">
            {t('main.create-project.continue-channel-creation')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-lg btn-secondary w-[160px]"
            onClick={() => router.push({ pathname: Path.MAIN })}
          >
            {t('button.next-time')}
          </button>
          <button
            className="btn btn-lg btn-blue w-[160px]"
            onClick={() =>
              router.push({
                pathname: Path.CREATE_CHANNEL,
                query: { projectId },
              })
            }
          >
            {t('main.setting.button.create-channel')}
          </button>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <div className="flex h-12 items-center justify-between">
      <div className="flex items-center gap-1">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={24}
          height={24}
        />
        <Icon name="Title" className="h-[24px] w-[123px]" />
      </div>
      <button
        className="btn btn-sm btn-secondary min-w-0 gap-1 px-2"
        onClick={() => router.push(Path.MAIN)}
      >
        <Icon name="Out" size={16} />
        <span className="font-12-bold uppercase">{t('button.get-out')}</span>
      </button>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default CompleteProjectCreationPage;
