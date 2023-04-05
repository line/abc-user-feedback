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
  Center,
  Flex,
  FormControl,
  FormHelperText,
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
import { ReactElement, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Card, CenterTemplate, Header } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { PATH } from '@/constants/path';
import { useToastDefaultOption } from '@/constants/toast-default-option';
import { useOAIMuataion } from '@/hooks';

import { NextPageWithLayout } from '../_app';

interface IForm {
  password: string;
  confirmPassword: string;
}

const schema: yup.SchemaOf<IForm> = yup.object().shape({
  password: yup.string().required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Not equals to password ')
    .required(),
});

const defaultValues: IForm = {
  password: '',
  confirmPassword: '',
};

interface IProps {}

const UserInvitationPage: NextPageWithLayout<IProps> = () => {
  const { t } = useTranslation();
  const toast = useToast(useToastDefaultOption);
  const router = useRouter();
  const code = useMemo(() => router.query?.code as string, [router.query]);
  const email = useMemo(() => router.query?.email as string, [router.query]);

  const { mutate, status } = useOAIMuataion({
    method: 'post',
    path: '/api/auth/signUp/invitation',
  });

  useEffect(() => {
    if (status === 'success') {
      toast({ title: 'Successfully sign up', status });
      router.push(PATH.AUTH.SIGN_IN);
    }
  }, [status]);

  const { handleSubmit, register, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = ({ password }: IForm) => mutate({ code, email, password });

  return (
    <Card sx={{ width: '100%', maxWidth: '400px', p: 2 }}>
      <Flex
        flexDirection="column"
        as="form"
        gap={4}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Heading size="lg">{t('title.userInvitation')}</Heading>
        <Input type="email" variant="flushed" value={email} disabled />
        <FormControl>
          <Input
            type="password"
            placeholder={t('input.placeholder.password')}
            variant="flushed"
            isRequired
            {...register('password')}
          />
        </FormControl>
        <FormControl>
          <Input
            placeholder={t('input.placeholder.confirmPassword')}
            variant="flushed"
            isRequired
            type="password"
            {...register('confirmPassword')}
            isInvalid={!!formState.errors.confirmPassword}
          />
          {formState.errors.confirmPassword && (
            <FormHelperText color="red.500">
              {formState.errors.confirmPassword.message}
            </FormHelperText>
          )}
        </FormControl>
        <HStack justifyContent="space-between">
          <Button variant="link" onClick={() => router.push(PATH.AUTH.SIGN_IN)}>
            {t('button.back')}
          </Button>
          <Button type="submit">{t('button.signUp')}</Button>
        </HStack>
      </Flex>
    </Card>
  );
};

UserInvitationPage.getLayout = function getLayout(page: ReactElement) {
  return <CenterTemplate>{page}</CenterTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default UserInvitationPage;
