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
import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

import type { NextPageWithLayout } from '@/shared/types';
import { useTenantState } from '@/entities/tenant';
import { SignInWithEmailForm } from '@/features/auth/sign-in-with-email';
import { SignInWithOAuthButton } from '@/features/auth/sign-in-with-oauth';
import { MainLayout } from '@/widgets';

import { DEFAULT_LOCALE } from '@/constants/i18n';
import { Path } from '@/constants/path';

const SignInPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const tenant = useTenantState();

  return (
    <div className="relative">
      <div className="mb-8 flex flex-col items-center gap-1">
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
      {tenant?.useEmail && <SignInWithEmailForm />}
      <div className="my-1 flex flex-col gap-1">
        {tenant?.useEmail && tenant?.useOAuth && (
          <div className="relative my-5">
            <span className="absolute-center text-secondary bg-primary absolute px-2 py-1">
              OR
            </span>
            <hr />
          </div>
        )}
        {tenant?.useOAuth && <SignInWithOAuthButton />}
      </div>
      {tenant?.useEmail && !tenant.isPrivate && (
        <div className="absolute -bottom-28 left-1/2 -translate-x-1/2">
          <Link
            href={Path.PASSWORD_RESET}
            className="text-blue-primary font-14-regular"
          >
            {t('auth.sign-in.reset-password')}
          </Link>
        </div>
      )}
    </div>
  );
};

SignInPage.getLayout = (page) => {
  return <MainLayout center>{page}</MainLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default SignInPage;
