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
import { useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FormProvider, useForm } from 'react-hook-form';

import { Accordion, Button, Icon } from '@ufb/react';

import type { NextPageWithLayout } from '@/shared';
import {
  CreateSectionTemplate,
  CreationLayout,
  DEFAULT_LOCALE,
  Path,
  useOAIQuery,
} from '@/shared';
import { ChannelInfoForm } from '@/entities/channel';
import type { ChannelInfo } from '@/entities/channel';
import { FieldTable } from '@/entities/field';
import { ProjectGuard } from '@/entities/project';

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
      <div className="border-neutral-tertiary flex h-[calc(100vh-100px)] w-full flex-col gap-4 overflow-auto rounded border p-6">
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
        <div className="create-template-footer flex justify-end gap-2">
          <Button onClick={gotoFeedback}>
            <Icon name="RiSparklingFill" />
            {t('button.start')}
          </Button>
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
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
      projectId,
    },
  };
};

export default CompleteChannelCreationPage;
