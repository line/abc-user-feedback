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
import { TextInput, toast } from '@ufb/ui';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import AuthTemplate from '@/components/templates/AuthTemplate';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { Path } from '@/constants/path';
import { useOAIQuery, useTenant, useUser } from '@/hooks';
import { NextPageWithLayout } from '@/pages/_app';
import { IFetchError } from '@/types/fetch-error.type';

interface IForm {
  email: string;
  password: string;
  remember: boolean;
}

const schema: Zod.ZodType<IForm> = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  remember: z.boolean(),
});
const defaultValues: IForm = { email: '', password: '', remember: true };

const SignInPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { signIn } = useUser();
  const { tenant } = useTenant();

  const { handleSubmit, register, formState, setError } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const { isSubmitted, errors, isSubmitting } = formState;

  const onSubmit = async (data: IForm) => {
    try {
      await signIn(data);
      toast.positive({ title: t('toast.sign-in') });
    } catch (error) {
      const { message } = error as IFetchError;
      setError('email', { message: 'invalid email' });
      setError('password', { message: 'invalid password' });
      toast.negative({ title: message, description: message });
    }
  };
  const { data } = useOAIQuery({
    path: '/api/auth/signIn/oauth/loginURL',
    queryOptions: { enabled: tenant?.useOAuth ?? false },
  });

  return (
    <form className="w-[360px] m-auto" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-1 mb-8">
        <Image
          src="/assets/images/logo-horizontal.svg"
          alt="logo"
          width={124.5}
          height={50}
        />
        <div className="font-14-regular w-full text-center">
          {tenant?.siteName}
        </div>
      </div>
      {tenant?.useEmail && (
        <>
          <div className="space-y-3 mb-6">
            <TextInput
              placeholder="ID"
              leftIconName="ProfileCircleFill"
              type="email"
              {...register('email')}
              isSubmitted={isSubmitted}
              isSubmitting={isSubmitting}
              isValid={!errors.email}
            />
            <TextInput
              placeholder="Password"
              leftIconName="LockFill"
              type="password"
              {...register('password')}
              isSubmitted={isSubmitted}
              isSubmitting={isSubmitting}
              isValid={!errors.password}
            />
          </div>
          <div className="flex justify-end mb-6">
            <Link
              href={Path.PASSWORD_RESET}
              className="text-blue-primary font-14-regular"
            >
              {t('auth.sign-in.reset-password')}
            </Link>
          </div>
        </>
      )}
      <div className="flex flex-col gap-1">
        {tenant?.useEmail && (
          <button type="submit" className="btn btn-primary">
            {t('button.sign-in')}
          </button>
        )}
        {tenant?.useEmail && !tenant?.isPrivate && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push(Path.SIGN_UP)}
          >
            {t('button.sign-up')}
          </button>
        )}
        {tenant?.useEmail && tenant?.useOAuth && (
          <div className="relative my-5">
            <span className="absolute absolute-center text-secondary bg-primary py-1 px-2">
              OR
            </span>
            <hr />
          </div>
        )}
        {tenant?.useOAuth && (
          <button
            type="button"
            className="btn btn-blue"
            onClick={() => (data ? router.push(data.url) : {})}
          >
            OAuth2.0 {t('button.sign-in')}
          </button>
        )}
      </div>
    </form>
  );
};

SignInPage.getLayout = function getLayout(page) {
  return <AuthTemplate>{page}</AuthTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default SignInPage;
