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
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon, TextInput, toast } from '@ufb/ui';
import dayjs from 'dayjs';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInterval } from 'react-use';
import { z } from 'zod';

import AuthTemplate from '@/components/templates/AuthTemplate';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { Path } from '@/constants/path';
import { useUser } from '@/hooks';
import client from '@/libs/client';
import { IFetchError } from '@/types/fetch-error.type';

import { NextPageWithLayout } from '../_app';

type EmailState = 'NOT_VERIFIED' | 'VERIFING' | 'EXPIRED' | 'VERIFIED';

interface IForm {
  email: string;
  password: string;
  confirmPassword: string;
  code?: string;
  emailState: EmailState;
}

const schema = z
  .object({
    email: z.string().email(),
    emailState: z.enum(['NOT_VERIFIED', 'VERIFING', 'EXPIRED', 'VERIFIED']),
    code: z.string().length(6),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine(
    (schema) => schema.password === schema.confirmPassword,
    'Password not matched',
  );

const defaultValues: IForm = {
  email: '',
  emailState: 'NOT_VERIFIED',
  password: '',
  confirmPassword: '',
  code: '',
};

const SignUpPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { signUp } = useUser();

  const {
    handleSubmit,
    register,
    formState,
    getValues,
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onSubmit',
  });

  const { isValid } = formState;

  const [expiredTime, setExpiredTime] = useState<string>();
  const [leftTime, setLeftTime] = useState('');
  const [codeStatus, setCodeStatus] = useState<
    'isSubmitting' | 'isSubmitted'
  >();
  const [emailInputStatus, setEmailInputStatus] = useState<
    'isSubmitting' | 'isSubmitted'
  >();

  const onSubmit = async (data: IForm) => {
    const { email, password } = data;
    try {
      await signUp({ email, password });
      router.push(Path.SIGN_IN);
      toast.positive({ title: 'Success' });
    } catch (error) {
      const { code, message } = error as IFetchError;
      toast.negative({ title: message, description: code });
    }
  };

  useInterval(
    () => {
      const seconds = dayjs(expiredTime).diff(dayjs(), 'seconds');

      if (seconds < 0) {
        setLeftTime(`00:00`);
        setValue('emailState', 'EXPIRED');
      } else {
        const m = Math.floor(seconds / 60)
          .toString()
          .padStart(2, '0');
        const s = Math.floor(seconds % 60)
          .toString()
          .padStart(2, '0');

        setLeftTime(`${m}:${s}`);
      }
    },
    watch('emailState') === 'VERIFING' ? 1000 : null,
  );

  const getVerificationCode = async () => {
    setEmailInputStatus('isSubmitting');

    try {
      const { data } = await client.post({
        path: '/api/auth/email/code',
        body: { email: getValues('email') },
      });
      setValue('emailState', 'VERIFING');
      setExpiredTime(data?.expiredAt);
      clearErrors('email');
      toast.positive({ title: 'Success' });
    } catch (error) {
      const { message } = error as IFetchError;
      setError('email', { message });
      toast.negative({ title: message });
    } finally {
      setEmailInputStatus('isSubmitted');
    }
  };

  const verifyCode = async () => {
    const code = getValues('code');
    setCodeStatus('isSubmitting');
    if (!code) return;
    if (code.length !== 6) return;
    try {
      await client.post({
        path: '/api/auth/email/code/verify',
        body: { code, email: getValues('email') },
      });
      setValue('emailState', 'VERIFIED');
      clearErrors('code');
      toast.positive({ title: 'Success' });
    } catch (error) {
      const { message } = error as IFetchError;
      setError('code', { message });
      toast.negative({ title: message });
    } finally {
      setCodeStatus('isSubmitted');
    }
  };

  return (
    <div className="w-[360px] m-auto">
      <div className="mb-12">
        <div className="flex gap-0.5 mb-2">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={12}
            height={12}
          />
          <Icon name="Title" className="w-[62px] h-[12px]" />
        </div>
        <p className="font-24-bold">{t('auth.sign-up.title')}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 mb-12">
          <TextInput
            size="lg"
            type="email"
            {...register('email')}
            label="Email"
            placeholder={t('input.placeholder.email')}
            disabled={watch('emailState') === 'VERIFIED'}
            isValid={!formState.errors.email}
            isSubmitted={emailInputStatus === 'isSubmitted'}
            isSubmitting={emailInputStatus === 'isSubmitting'}
            hint={formState.errors.email?.message}
            rightChildren={
              <button
                type="button"
                className="btn btn-secondary btn-xs btn-rounded"
                onClick={getVerificationCode}
                disabled={watch('emailState') === 'VERIFIED'}
              >
                {t('auth.sign-up.button.request-auth-code')}
              </button>
            }
            required
          />
          {watch('emailState') !== 'NOT_VERIFIED' && (
            <TextInput
              size="lg"
              type="code"
              label={t('auth.sign-up.label.auth-code')}
              {...register('code')}
              disabled={watch('emailState') === 'VERIFIED'}
              placeholder={t('auth.sign-up.placeholder.auth-code')}
              isValid={!formState.errors.code}
              isSubmitted={codeStatus === 'isSubmitted'}
              isSubmitting={codeStatus === 'isSubmitting'}
              hint={formState.errors.code?.message}
              rightChildren={
                <div className="flex gap-2 items-center">
                  {(watch('emailState') === 'VERIFING' ||
                    watch('emailState') === 'EXPIRED') && (
                    <p className="font-16-regular">{leftTime}</p>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs btn-rounded"
                    disabled={
                      watch('emailState') === 'VERIFIED' ||
                      watch('code')?.length !== 6
                    }
                    onClick={verifyCode}
                  >
                    {t('auth.sign-up.button.verify-auth-code')}
                  </button>
                </div>
              }
              required
            />
          )}
          <TextInput
            size="lg"
            type="password"
            label={t('input.label.password')}
            placeholder={t('input.placeholder.password')}
            isSubmitted={formState.isSubmitted}
            isSubmitting={formState.isSubmitting}
            isValid={!formState.errors.password}
            hint={formState.errors.password?.message}
            {...register('password')}
            required
          />
          <TextInput
            size="lg"
            type="password"
            label={t('input.label.confirm-password')}
            placeholder={t('input.placeholder.confirm-password')}
            isSubmitted={formState.isSubmitted}
            isSubmitting={formState.isSubmitting}
            isValid={!formState.errors.confirmPassword}
            hint={formState.errors.confirmPassword?.message}
            {...register('confirmPassword')}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="btn btn-lg btn-primary"
            disabled={!isValid}
          >
            {t('button.sign-up')}
          </button>
          <button
            type="button"
            className="btn btn-lg btn-secondary"
            onClick={router.back}
          >
            {t('button.back')}
          </button>
        </div>
      </form>
    </div>
  );
};

SignUpPage.getLayout = function getLayout(page) {
  return <AuthTemplate>{page}</AuthTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default SignUpPage;
