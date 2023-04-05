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
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { CenterTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { PATH } from '@/constants/path';
import { useToastDefaultOption } from '@/constants/toast-default-option';
import { useOAIQuery, useUser } from '@/hooks';
import { IFetchError } from '@/types/fetch-error.type';

import { NextPageWithLayout } from '../_app';

interface IForm {
  email: string;
  password: string;
}

const schema: yup.SchemaOf<IForm> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});
const defaultValues: IForm = { email: '', password: '' };

const SignInPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { signIn } = useUser();

  const toast = useToast(useToastDefaultOption);

  const { handleSubmit, register } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { data } = useOAIQuery({ path: '/api/tenant' });

  const onSubmit = async (data: IForm) => {
    try {
      await signIn(data);
      toast({ title: 'Successfully sign in', status: 'success' });
      router.reload();
    } catch (error) {
      const { message } = error as IFetchError;
      toast({ title: message, status: 'error' });
    }
  };

  return (
    <Card sx={{ width: '100%', maxWidth: '400px' }}>
      <CardHeader>
        <Heading size="lg" textAlign="center">
          Sign In
        </Heading>
      </CardHeader>
      <CardBody>
        <Flex
          as="form"
          gap={6}
          flexDirection="column"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl variant="floating" isRequired>
            <FormLabel>{t('input.placeholder.email')}</FormLabel>
            <Input type="email" {...register('email')} />
          </FormControl>
          <FormControl variant="floating" isRequired>
            <FormLabel>{t('input.placeholder.password')}</FormLabel>
            <Input type="password" {...register('password')} />
          </FormControl>
          <Button type="submit">{t('button.signIn')}</Button>
        </Flex>
      </CardBody>
      <CardFooter>
        <ButtonGroup spacing="2">
          {!data?.isPrivate && (
            <Button
              size="sm"
              variant="link"
              onClick={() => router.push(PATH.AUTH.SIGN_UP)}
            >
              {t('button.signUp')}
            </Button>
          )}
          <Button
            size="sm"
            variant="link"
            onClick={() => router.push(PATH.AUTH.RESET_PASSWORD)}
          >
            {t('button.resetPassword')}
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

SignInPage.getLayout = function getLayout(page: ReactElement) {
  return <CenterTemplate>{page}</CenterTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default SignInPage;
