/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import { useState } from 'react';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, toast } from '@ufb/react';

import { AnonymousTemplate, TextInput } from '@/shared';
import type { IFetchError, NextPageWithLayout } from '@/shared/types';
import { useTenantStore } from '@/entities/tenant';
import { useUserStore } from '@/entities/user';
import { SignInWithOAuthButton } from '@/features/auth/sign-in-with-oauth';
import { AnonymousLayout } from '@/widgets/anonymous-layout';

import serverSideTranslations from '@/server-side-translations';

const signInWithEmailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormType = z.infer<typeof signInWithEmailSchema>;

const SignInPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const { tenant } = useTenantStore();
  const { signInWithEmail } = useUserStore();
  const [loginLoading, setLoginLoading] = useState(false);

  const { handleSubmit, register, formState, setError } = useForm<FormType>({
    resolver: zodResolver(signInWithEmailSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormType) => {
    try {
      setLoginLoading(true);
      await signInWithEmail(data);
      toast.success(t('v2.toast.success'));
    } catch (error) {
      const { message } = error as IFetchError;
      setError('email', { message: 'invalid email' });
      setError('password', { message: 'invalid password' });
      toast.error(message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <AnonymousTemplate
      title={t('button.sign-in')}
      image="/assets/images/sign-in.svg"
      imageSub={
        <p className="text-title-h3 text-center">
          Listen to <br />
          users' voice & improve.
        </p>
      }
    >
      {tenant?.useOAuth && <SignInWithOAuthButton />}
      {tenant?.useOAuth && tenant.useEmail && (
        <div className="flex items-center gap-2">
          <div className="border-neutral-tertiary flex-1 border-b-[1px]" />
          <span className="text-neutral-tertiary">or With Email</span>
          <div className="border-neutral-tertiary flex-1 border-b-[1px]" />
        </div>
      )}
      {tenant?.useEmail && (
        <form id="sign-in" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Email"
            placeholder={t('v2.placeholder.text')}
            type="email"
            {...register('email')}
            error={formState.errors.email?.message}
          />
          <TextInput
            label="Password"
            placeholder={t('v2.placeholder.text')}
            type="password"
            {...register('password')}
            error={formState.errors.password?.message}
          />
        </form>
      )}
      {tenant?.useEmail && (
        <div className="flex flex-col gap-4">
          <Button
            size="medium"
            type="submit"
            loading={loginLoading}
            form="sign-in"
            disabled={!formState.isDirty}
          >
            {t('button.sign-in')}
          </Button>
          <div className="flex flex-col gap-3">
            <Link href="/auth/reset-password" className="text-center underline">
              {t('link.reset-password.title')}
            </Link>
            <Link href="/auth/sign-up" className="text-center underline">
              {t('button.sign-up')}
            </Link>
          </div>
        </div>
      )}
    </AnonymousTemplate>
  );
};

SignInPage.getLayout = (page) => {
  return <AnonymousLayout>{page}</AnonymousLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

export default SignInPage;
