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
import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { MainTemplate, OverlayLoading, TitleTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { PATH } from '@/constants/path';
import { useToastDefaultOption } from '@/constants/toast-default-option';
import {
  IProjectForm,
  ProjectFormContainer,
  projectFormSchema,
} from '@/containers/forms';
import { useOAIMuataion, useOAIQuery } from '@/hooks';
import client from '@/libs/client';
import { NextPageWithLayout } from '@/pages/_app';
import { IFetchError } from '@/types/fetch-error.type';

interface IProps {
  projectId: string;
  description: string;
  name: string;
}

const defaultValues: IProjectForm = {
  name: '',
  description: '',
};
const ModifyPage: NextPageWithLayout<IProps> = ({ projectId }) => {
  const toast = useToast(useToastDefaultOption);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { data } = useOAIQuery({
    path: '/api/projects/{id}',
    variables: { id: projectId },
  });

  const methods = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  const { mutateAsync, status } = useOAIMuataion({
    method: 'put',
    path: '/api/projects/{id}',
    pathParams: { id: projectId },
  });

  useEffect(() => {
    if (!data) return;
    const { description, name } = data;
    methods.reset({
      name,
      description,
    });
  }, [data]);

  useEffect(() => {}, [status]);

  const onSubmit = async (data: IProjectForm) => {
    const { description, name } = data;
    try {
      setIsLoading(true);

      await mutateAsync({ name, description });
      toast({ title: 'Successfully modify project', status: 'success' });
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <OverlayLoading isLoading={isLoading} />
      <TitleTemplate title="프로젝트 수정" showBackBtn>
        <ProjectFormContainer methods={methods} onSubmit={onSubmit} isModify />
      </TitleTemplate>
    </>
  );
};

ModifyPage.getLayout = function getLayout(page: ReactElement) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getServerSideProps: GetServerSideProps<
  IProps,
  { projectId: string }
> = async ({ params, locale }) => {
  const response = await fetch(
    `${process.env.API_BASE_URL}/api/projects/${params?.projectId}`,
    { method: 'get' },
  );

  const data = await response.json();
  if (response.status !== 200) {
    return { notFound: true };
  }

  const { id, name, description } = data;

  return {
    props: {
      projectId: id,
      name,
      description,
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};
export default ModifyPage;
