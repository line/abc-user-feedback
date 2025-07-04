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
import React, { useEffect } from 'react';
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { FormProvider, useForm } from 'react-hook-form';

import {
  Accordion,
  Alert,
  AlertButton,
  AlertContent,
  AlertDescription,
  AlertTextContainer,
  AlertTitle,
} from '@ufb/react';

import {
  CreateSectionTemplate,
  CreationLayout,
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

import serverSideTranslations from '@/server-side-translations';

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
      leftBottom={
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
      <div className="border-neutral-tertiary flex h-[calc(100vh-96px)] w-full flex-col gap-4 overflow-auto rounded border p-6">
        <h3 className="text-title-h3">{t('v2.text.summary')}</h3>
        <Accordion
          type="multiple"
          defaultValue={[t('v2.project-setting-menu.project-info')]}
          className="overflow-auto"
        >
          <CreateSectionTemplate
            title={t('v2.project-setting-menu.project-info')}
            defaultOpen
          >
            <FormProvider {...projectInfoFormMethods}>
              <ProjectInfoForm type="update" readOnly />
            </FormProvider>
          </CreateSectionTemplate>
          <CreateSectionTemplate title={t('v2.project-setting-menu.role-mgmt')}>
            <RoleTable roles={roles?.roles ?? []} />
          </CreateSectionTemplate>
          <CreateSectionTemplate
            title={t('v2.project-setting-menu.member-mgmt')}
          >
            <MemberTable data={members?.items ?? []} />
          </CreateSectionTemplate>
          <CreateSectionTemplate
            title={t('v2.project-setting-menu.api-key-mgmt')}
          >
            <ApiKeyTable data={apiKeys?.items ?? []} />
          </CreateSectionTemplate>
        </Accordion>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Alert className="w-[calc(100vw-32px)] max-w-[700px] shadow-md">
            <AlertContent>
              <AlertTextContainer>
                <AlertTitle>
                  {t('main.create-project.complete-title')}
                </AlertTitle>
                <AlertDescription>
                  {t('main.create-project.alert-description')}
                </AlertDescription>
              </AlertTextContainer>
              <AlertButton
                variant="outline"
                onClick={() =>
                  router.push({
                    pathname: Path.DASHBOARD,
                    query: { projectId },
                  })
                }
                className="min-w-[120px]"
              >
                {t('button.next-time')}
              </AlertButton>
              <AlertButton
                onClick={async () => {
                  reset();
                  await router.push({
                    pathname: Path.CREATE_CHANNEL,
                    query: { projectId },
                  });
                }}
                variant="primary"
                className="min-w-[120px]"
              >
                {t('main.setting.button.create-channel')}
              </AlertButton>
            </AlertContent>
          </Alert>
        </div>
      </div>
    </CreationLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

export default CompleteProjectCreationPage;
