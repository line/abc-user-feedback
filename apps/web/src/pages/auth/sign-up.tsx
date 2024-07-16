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
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { DEFAULT_LOCALE, LogoWithTitle } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { SignUpWithEmailForm } from '@/features/auth/sign-up-with-email';
import { MainLayout } from '@/widgets';

const SignUpPage: NextPageWithLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <LogoWithTitle title={t('auth.sign-up.title')} />
      <SignUpWithEmailForm />
    </div>
  );
};

SignUpPage.getLayout = (page) => {
  return <MainLayout center>{page}</MainLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default SignUpPage;
