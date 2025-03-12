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
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FormProvider, useForm } from 'react-hook-form';

import { Accordion, Button } from '@ufb/react';

import {
  CreateSectionTemplate,
  CreationLayout,
  DEFAULT_LOCALE,
  Path,
  useOAIQuery,
} from '@/shared';
import { ApiKeyTable } from '@/entities/api-key';
import { MemberTable } from '@/entities/member';
import { useMembmerSearch } from '@/entities/member/lib';
import type { ProjectInfo } from '@/entities/project';
import { ProjectInfoForm } from '@/entities/project';
import { RoleTable } from '@/entities/role';
import { useCreateChannelStore } from '@/features/create-channel';

const CompleteProjectCreationPage: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { reset } = useCreateChannelStore();
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
  const { data: members } = useMembmerSearch(projectId, {});

  const projectInfoFormMethods = useForm<ProjectInfo>();

  useEffect(() => {
    if (!project) return;
    projectInfoFormMethods.reset(project);
  }, [project]);

  return (
    <CreationLayout
      title={t('main.create-project.complete-title')}
      leftPanel={
        <p className="text-neutral-secondary text-large-normal whitespace-pre-line">
          {t('v2.description.create-project')}
        </p>
      }
      leftBottm={
        <div className="flex justify-end">
          <Image
            src={`/assets/images/create-complete.svg`}
            alt="Create Project"
            className="align"
            width={320}
            height={320}
          />
        </div>
      }
    >
      <div className="border-neutral-tertiary flex h-[calc(100vh-100px)] w-full flex-col gap-4 overflow-auto rounded border p-6">
        <h3 className="text-title-h3">{t('v2.text.summary')}</h3>
        <Accordion
          type="multiple"
          defaultValue={[t('project-setting-menu.project-info')]}
          className="overflow-auto"
        >
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
            <MemberTable data={members?.items ?? []} />
          </CreateSectionTemplate>
          <CreateSectionTemplate title={t('project-setting-menu.api-key-mgmt')}>
            <ApiKeyTable data={apiKeys?.items ?? []} />
          </CreateSectionTemplate>
        </Accordion>
        <div className="create-template-footer flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push({ pathname: Path.DASHBOARD, query: { projectId } })
            }
          >
            {t('button.next-time')}
          </Button>
          <Button
            onClick={async () => {
              reset();
              await router.push({
                pathname: Path.CREATE_CHANNEL,
                query: { projectId },
              });
            }}
          >
            {t('main.setting.button.create-channel')}
          </Button>
        </div>
      </div>
    </CreationLayout>
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
