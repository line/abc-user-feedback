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
import {
  Button,
  Flex,
  HStack,
  Heading,
  Input,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Card, CenterTemplate, Header } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { PATH } from '@/constants/path';
import { useToastDefaultOption } from '@/constants/toast-default-option';
import { useOAIMuataion } from '@/hooks';

import { NextPageWithLayout } from '../_app';

interface IForm {
  email: string;
}
const defaultValues: IForm = {
  email: '',
};
const schema: yup.SchemaOf<IForm> = yup.object().shape({
  email: yup.string().email().required(),
});

const ResetPasswordPage: NextPageWithLayout = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const toast = useToast(useToastDefaultOption);

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { mutate, status } = useOAIMuataion({
    method: 'post',
    path: '/api/users/password/reset/code',
  });

  useEffect(() => {
    if (status === 'success') {
      toast({ title: '이메일을 확인해주세요', status });
      router.push(PATH.AUTH.SIGN_IN);
    }
  }, [status]);

  return (
    <Card sx={{ width: '100%', maxWidth: '400px', p: 2 }}>
      <Flex
        flexDirection="column"
        as="form"
        gap={6}
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        <Heading size="lg">{t('title.resetPassword')}</Heading>
        <Input
          type="email"
          placeholder={t('input.placeholder.email')}
          {...register('email')}
        />
        <HStack justifyContent="space-between">
          <Button variant="link" onClick={() => router.push(PATH.AUTH.SIGN_IN)}>
            {t('button.back')}
          </Button>
          <Button type="submit">{t('button.sendEmail')}</Button>
        </HStack>
      </Flex>
    </Card>
  );
};

ResetPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return <CenterTemplate>{page}</CenterTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default ResetPasswordPage;
