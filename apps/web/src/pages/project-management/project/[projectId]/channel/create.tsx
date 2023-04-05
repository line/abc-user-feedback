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
import { useToast } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';

import { MainTemplate, OverlayLoading, TitleTemplate } from '@/components';
import { PATH } from '@/constants/path';
import { useToastDefaultOption } from '@/constants/toast-default-option';
import { ChannelForm, ChannelFormContainer } from '@/containers/forms';
import client from '@/libs/client';
import { NextPageWithLayout } from '@/pages/_app';

interface IProps {
  projectId: string;
}

const defaultValues: ChannelForm.FormType = {
  name: '',
  description: '',
  fields: [],
};

const ChannelCreatePage: NextPageWithLayout<IProps> = ({ projectId }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast(useToastDefaultOption);

  const methods = useForm({
    resolver: zodResolver(ChannelForm.schema),
    defaultValues,
  });

  const onSubmit = async (inputData: ChannelForm.FormType) => {
    try {
      setIsLoading(true);

      const { data } = await client.post({
        path: '/api/projects/{projectId}/channels',
        pathParams: { projectId },
        body: inputData,
      });

      toast({ title: 'Successfully create channel', status: 'success' });
      router.replace({
        pathname: PATH.PROJECT_MANAGEMENT.CHANNEL.DETAIL,
        query: { channelId: data?.id, projectId },
      });
    } catch (error: any) {
      toast({ title: error.message, description: error.code, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <OverlayLoading isLoading={isLoading} />
      <TitleTemplate title={t('title.createChannel')} showBackBtn>
        <ChannelFormContainer
          methods={methods}
          onSubmit={onSubmit}
          projectId={projectId}
        />
      </TitleTemplate>
    </>
  );
};

ChannelCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const projectId = (params?.projectId ?? '') as string;

  return {
    props: {
      projectId,
      ...(await serverSideTranslations(locale ?? 'en')),
    },
  };
};

export default ChannelCreatePage;
