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
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';

import { AnonymousTemplate } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { useTenantStore } from '@/entities/tenant';
import { SignInWithEmailForm, SignInWithOAuthButton } from '@/features/auth';
import { AnonymousLayout } from '@/widgets/anonymous-layout';

import serverSideTranslations from '@/server-side-translations';

const SignInPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const { tenant } = useTenantStore();

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
      {tenant?.useEmail && <SignInWithEmailForm />}
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
