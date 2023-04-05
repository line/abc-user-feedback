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
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInterval } from 'react-use';
import * as yup from 'yup';

import { CenterTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { PATH } from '@/constants/path';
import { useUser } from '@/hooks';
import client from '@/libs/client';
import { IFetchError } from '@/types/fetch-error.type';

import { NextPageWithLayout } from '../_app';

type EmailState = 'NOT_VERIFIED' | 'VERIFING' | 'VERIFIED';

interface IForm {
  email: string;
  password: string;
  confirmPassword: string;
  code?: string;
  emailState: EmailState;
}

const schema: yup.SchemaOf<IForm> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  code: yup.string().required(),
  emailState: yup.mixed<EmailState>().required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Not equals to password ')
    .required(),
});

const defaultValues: IForm = {
  email: '',
  emailState: 'NOT_VERIFIED',
  password: '',
  confirmPassword: '',
  code: undefined,
};

const SignUpPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast({ position: 'top-right', isClosable: true });

  const { signUp } = useUser();

  const { handleSubmit, register, formState, getValues, setValue, watch } =
    useForm({
      resolver: yupResolver(schema),
      defaultValues,
      mode: 'all',
    });

  const { isValid } = formState;

  const [expiredTime, setExpiredTime] = useState<string>();
  const [leftTime, setLeftTime] = useState('');

  const onSubmit = async (data: IForm) => {
    const { email, password } = data;
    try {
      await signUp({ email, password });
      router.push(PATH.AUTH.SIGN_IN);
      toast({ title: 'Successfully send email ', status: 'success' });
    } catch (error) {
      const { code, message } = error as IFetchError;
      toast({ title: message, description: code, status: 'error' });
    }
  };

  useInterval(
    () => {
      const seconds = dayjs(expiredTime).diff(dayjs(), 'seconds');
      if (seconds < 0) return;
      const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
      const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');

      setLeftTime(`${m}:${s}`);
    },
    watch('emailState') === 'VERIFING' ? 1000 : null,
  );

  const getVerificationCode = async () => {
    const email = getValues('email');

    if (!email) return;
    try {
      const { data } = await client.post({
        path: '/api/auth/email/code',
        body: { email: getValues('email') },
      });
      setValue('emailState', 'VERIFING');
      setExpiredTime(data?.expiredAt);
      toast({ title: 'please confirm email', status: 'success' });
    } catch (error) {
      const { code, message } = error as IFetchError;
      toast({ title: message, description: code, status: 'error' });
    }
  };

  const verifyCode = async () => {
    const code = getValues('code');

    if (!code) return;
    if (code.length !== 6) return;
    try {
      await client.post({
        path: '/api/auth/email/code/verify',
        body: { code, email: getValues('email') },
      });
      setValue('emailState', 'VERIFIED');
      toast({ title: 'successfully email verification', status: 'success' });
    } catch (error) {
      const { code, message } = error as IFetchError;
      toast({ title: message, description: code, status: 'error' });
    }
  };

  return (
    <Card sx={{ width: '100%', maxWidth: '400px' }}>
      <CardHeader>
        <Heading size="lg">{t('title.signUp')}</Heading>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody>
          <VStack gap={2} flexDirection="column">
            <FormControl
              variant="floating"
              isRequired
              isDisabled={watch('emailState') !== 'NOT_VERIFIED'}
            >
              <FormLabel>{t('input.placeholder.email')}</FormLabel>
              <InputGroup>
                <Input type="email" {...register('email')} />
                <InputRightElement w="15">
                  <Button
                    size="sm"
                    colorScheme="primary"
                    onClick={getVerificationCode}
                    disabled={watch('emailState') === 'VERIFIED'}
                  >
                    {t('button.requestAuth')}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {watch('emailState') !== 'NOT_VERIFIED' && (
              <FormControl
                variant="floating"
                isDisabled={watch('emailState') === 'VERIFIED'}
                isRequired
              >
                <FormLabel>{t('input.placeholder.code')}</FormLabel>
                <InputGroup>
                  <Input type="code" {...register('code')} />
                  <InputRightElement w="30">
                    {watch('emailState') === 'VERIFING' && (
                      <Text mr="2">{leftTime}</Text>
                    )}
                    <Button
                      disabled={
                        watch('emailState') === 'VERIFIED' ||
                        watch('code')?.length !== 6
                      }
                      onClick={verifyCode}
                      flexShrink={0}
                    >
                      {t('button.verifyAuth')}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            )}
            <FormControl isRequired>
              <FormLabel>{t('input.placeholder.password')}</FormLabel>
              <Input type="password" {...register('password')} />
            </FormControl>
            <FormControl
              isRequired
              isInvalid={!!formState.errors.confirmPassword}
            >
              <FormLabel>{t('input.placeholder.confirmPassword')}</FormLabel>
              <Input type="password" {...register('confirmPassword')} />
              {formState.errors.confirmPassword && (
                <FormHelperText color="red.500">
                  {formState.errors.confirmPassword.message}
                </FormHelperText>
              )}
            </FormControl>
          </VStack>
        </CardBody>
        <CardFooter>
          <HStack justifyContent="space-between" w="100%">
            <Button variant="link" onClick={router.back}>
              {t('button.back')}
            </Button>
            <Button type="submit" disabled={!isValid}>
              {t('button.signUp')}
            </Button>
          </HStack>
        </CardFooter>
      </form>
    </Card>
  );
};

SignUpPage.getLayout = function getLayout(page: ReactElement) {
  return <CenterTemplate>{page}</CenterTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default SignUpPage;
