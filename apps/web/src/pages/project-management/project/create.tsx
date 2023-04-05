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
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { MainTemplate, OverlayLoading, TitleTemplate } from '@/components';
import { PATH } from '@/constants/path';
import { useToastDefaultOption } from '@/constants/toast-default-option';
import {
  IProjectForm,
  ProjectFormContainer,
  projectFormSchema,
} from '@/containers/forms';
import { useOAIMuataion } from '@/hooks';
import { NextPageWithLayout } from '@/pages/_app';

const defaultValues: IProjectForm = {
  name: '',
  description: '',
};

const CreatePage: NextPageWithLayout = () => {
  const { t } = useTranslation();

  const toast = useToast(useToastDefaultOption);
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: defaultValues,
  });

  const { mutate, status, data } = useOAIMuataion({
    method: 'post',
    path: '/api/projects',
  });

  useEffect(() => {
    if (status === 'success') {
      if (!data) return;
      toast({ title: 'Successfully create project', status: 'success' });
      router.replace({
        pathname: PATH.PROJECT_MANAGEMENT.PROJECT.DETAIL,
        query: { projectId: data.id },
      });
    }
  }, [status, data]);

  const onSubmit = async (data: IProjectForm) => mutate(data);

  return (
    <>
      <OverlayLoading isLoading={status === 'loading'} />
      <TitleTemplate title={t('title.createProject')} showBackBtn>
        <ProjectFormContainer methods={methods} onSubmit={onSubmit} />
      </TitleTemplate>
    </>
  );
};

CreatePage.getLayout = function getLayout(page: ReactElement) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en')),
    },
  };
};

export default CreatePage;
