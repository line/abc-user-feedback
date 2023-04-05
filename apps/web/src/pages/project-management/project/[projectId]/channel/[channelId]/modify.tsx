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
import { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { MainTemplate, OverlayLoading, TitleTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { useToastDefaultOption } from '@/constants/toast-default-option';
import { ChannelForm, ChannelFormContainer } from '@/containers/forms';
import { useOAIMuataion, useOAIQuery } from '@/hooks';
import { NextPageWithLayout } from '@/pages/_app';

interface IProps {
  channelId: string;
  projectId: string;
}

const defaultValues = {
  name: '',
  description: '',
  fields: [],
} as ChannelForm.FormType;

const ModifyPage: NextPageWithLayout<IProps> = (props) => {
  const { channelId, projectId } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const toast = useToast(useToastDefaultOption);

  const [isLoading, setIsLoading] = useState(false);

  const { data } = useOAIQuery({
    path: '/api/channels/{id}',
    variables: { id: channelId },
  });
  const { data: fieldData } = useOAIQuery({
    path: '/api/channels/{channelId}/fields',
    variables: { channelId },
  });

  const { mutateAsync } = useOAIMuataion({
    method: 'put',
    path: '/api/channels/{id}',
    pathParams: { id: channelId },
  });

  const methods = useForm({
    resolver: zodResolver(ChannelForm.schema),
    defaultValues,
  });

  useEffect(() => {
    if (!data) return;
    const { description, name } = data;
    methods.reset({
      description,
      fields: fieldData,
      name,
    });
  }, [data]);

  const confirmRemovedField = (formData: ChannelForm.FormType) => {
    const removedFields = fieldData?.filter(
      (field) => !formData.fields.find((v) => v.id === field.id),
    );
    if (removedFields && removedFields.length > 0) {
      return confirm(
        '삭제된 필드는 되돌릴 수 없고 데이터가 모두 삭제됩니다. 수정하시겠습니까?\n' +
          removedFields.map((v) => v.name).join('\n'),
      );
    }
    return true;
  };

  const onSubmit = async (formData: ChannelForm.FormType) => {
    if (!confirmRemovedField(formData)) return;
    try {
      setIsLoading(true);
      await mutateAsync(formData);
      toast({ title: 'Successfully modify feedback', status: 'success' });
      router.back();
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
          isModify
        />
      </TitleTemplate>
    </>
  );
};

ModifyPage.getLayout = function getLayout(page: ReactElement) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getServerSideProps: GetServerSideProps<IProps> = async ({
  locale,
  params,
}) => {
  const channelId = (params?.channelId ?? '') as string;
  const projectId = (params?.projectId ?? '') as string;
  return {
    props: {
      channelId,
      projectId,
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default ModifyPage;
