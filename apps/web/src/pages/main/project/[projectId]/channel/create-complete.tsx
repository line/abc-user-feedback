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
import type { GetServerSideProps, NextPage } from 'next';
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
import { ChannelInfoForm, ImageConfigForm } from '@/entities/channel';
import type { ChannelImageConfig, ChannelInfo } from '@/entities/channel';
import { FieldTable, PreviewFieldTable } from '@/entities/field';

const CompleteChannelCreationPage: NextPage = () => {
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
  const imageConfigFormMethods = useForm<ChannelImageConfig>();

  useEffect(() => {
    if (!data) return;
    channelInfoFormMethods.reset(data);
    imageConfigFormMethods.reset(data.imageConfig);
  }, [data]);

  const gotoFeedback = () => {
    router.push({ pathname: Path.FEEDBACK, query: { channelId, projectId } });
  };

  return (
    <div className="m-auto flex min-h-screen w-[1040px] flex-col gap-4 pb-6">
      <Header goOut={gotoFeedback} />
      <div className="flex flex-col items-center gap-3 py-6">
        <Icon
          name="Check"
          size={48}
          className="bg-blue-primary text-above-primary rounded-full"
        />
        <p className="font-20-bold">
          {t('main.create-channel.complete-title')}
        </p>
      </div>
      <CreateSectionTemplate
        title={t('channel-setting-menu.channel-info')}
        defaultOpen
      >
        <FormProvider {...channelInfoFormMethods}>
          <ChannelInfoForm readOnly />
        </FormProvider>
      </CreateSectionTemplate>
      <CreateSectionTemplate title={t('channel-setting-menu.field-mgmt')}>
        <FieldTable fields={data?.fields ?? []} />
      </CreateSectionTemplate>
      <CreateSectionTemplate title={t('channel-setting-menu.image-mgmt')}>
        <FormProvider {...imageConfigFormMethods}>
          <ImageConfigForm readOnly />
        </FormProvider>
      </CreateSectionTemplate>
      <CreateSectionTemplate title={t('main.setting.field-mgmt.preview')}>
        <PreviewFieldTable fields={data?.fields ?? []} />
      </CreateSectionTemplate>

      <div className="border-fill-tertiary flex rounded border p-6">
        <div className="flex flex-1 items-center gap-2.5">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={24}
            height={24}
          />
          <p className="font-12-regular whitespace-pre-line">
            {t('main.create-channel.finish-channel-creation')}
          </p>
        </div>
        <button
          className="btn btn-lg btn-blue w-[160px]"
          onClick={gotoFeedback}
        >
          {t('button.start')}
        </button>
      </div>
    </div>
  );
};

const Header: React.FC<{ goOut: () => void }> = ({ goOut }) => {
  const { t } = useTranslation();
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
        onClick={goOut}
      >
        <Icon name="Out" size={16} />
        <span className="font-12-bold uppercase">{t('button.get-out')}</span>
      </button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default CompleteChannelCreationPage;
