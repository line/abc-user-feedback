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
import { useEffect } from 'react';
import type { GetServerSideProps } from 'next';
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
  Icon,
} from '@ufb/react';

import type { NextPageWithLayout } from '@/shared';
import {
  CreateSectionTemplate,
  CreationLayout,
  Path,
  useOAIQuery,
} from '@/shared';
import { ChannelInfoForm } from '@/entities/channel';
import type { ChannelInfo } from '@/entities/channel';
import { FieldTable } from '@/entities/field';
import { ProjectGuard } from '@/entities/project';

import serverSideTranslations from '@/server-side-translations';

interface IProps {
  projectId: number;
}

const CompleteChannelCreationPage: NextPageWithLayout<IProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { channelId, projectId } = {
    channelId: Number(router.query.channelId),
    projectId: Number(router.query.projectId),
  };

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });

  const channelInfoFormMethods = useForm<ChannelInfo>();

  useEffect(() => {
    if (!data) return;
    channelInfoFormMethods.reset(data);
  }, [data]);

  const gotoFeedback = () =>
    router.push({ pathname: Path.FEEDBACK, query: { channelId, projectId } });

  return (
    <CreationLayout
      title={t('main.create-channel.complete-title')}
      leftPanel={
        <p className="text-neutral-secondary text-large-normal whitespace-pre-line">
          {t('v2.description.create-channel')}
        </p>
      }
    >
      <div className="border-neutral-tertiary flex h-[calc(100vh-96px)] w-full flex-col gap-4 overflow-auto rounded border p-6">
        <h3 className="text-title-h3">{t('v2.text.summary')}</h3>
        <Accordion
          type="multiple"
          defaultValue={[t('channel-setting-menu.channel-info')]}
          className="overflow-auto"
        >
          <CreateSectionTemplate
            title={t('channel-setting-menu.channel-info')}
            defaultOpen
          >
            <FormProvider {...channelInfoFormMethods}>
              <ChannelInfoForm readOnly />
            </FormProvider>
          </CreateSectionTemplate>
          <CreateSectionTemplate title={t('channel-setting-menu.field-mgmt')}>
            <FieldTable fields={data?.fields ?? []} disableFilter />
          </CreateSectionTemplate>
        </Accordion>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Alert className="w-[calc(100vw-32px)] max-w-[700px] shadow-md">
            <AlertContent>
              <AlertTextContainer>
                <AlertTitle>
                  {t('main.create-channel.complete-title')}
                </AlertTitle>
                <AlertDescription>
                  {t('main.create-channel.alert-description')}
                </AlertDescription>
              </AlertTextContainer>
              <AlertButton
                onClick={gotoFeedback}
                variant="primary"
                className="min-w-[120px]"
              >
                <Icon name="RiSparklingFill" />
                {t('button.start')}
              </AlertButton>
            </AlertContent>
          </Alert>
        </div>
      </div>
    </CreationLayout>
  );
};

CompleteChannelCreationPage.getLayout = (page: React.ReactElement<IProps>) => {
  return <ProjectGuard projectId={page.props.projectId}>{page}</ProjectGuard>;
};

export const getServerSideProps: GetServerSideProps<IProps> = async ({
  locale,
  query,
}) => {
  const projectId = parseInt(query.projectId as string);

  return {
    props: {
      ...(await serverSideTranslations(locale)),
      projectId,
    },
  };
};

export default CompleteChannelCreationPage;
