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
import { ForgotPasswordForm } from '@/features/auth';
import { AnonymousLayout } from '@/widgets/anonymous-layout';

import serverSideTranslations from '@/server-side-translations';

const ResetPasswordPage: NextPageWithLayout = () => {
  const { t } = useTranslation();

  return (
    <AnonymousTemplate
      title={t('v2.auth.reset-password.title')}
      image="/assets/images/send-reset-password-email.svg"
    >
      <ForgotPasswordForm />
    </AnonymousTemplate>
  );
};

ResetPasswordPage.getLayout = (page) => {
  return <AnonymousLayout>{page}</AnonymousLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

export default ResetPasswordPage;
