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
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { DEFAULT_LOCALE, LogoWithTitle } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { ResetPasswordWithEmailForm } from '@/features/auth/reset-password-with-email';
import { MainLayout } from '@/widgets';

interface IProps {
  code: string;
  email: string;
}
const ResetPasswordPage: NextPageWithLayout<IProps> = (props) => {
  const { code, email } = props;
  const { t } = useTranslation();

  return (
    <div className="relative">
      <LogoWithTitle title={t('link.reset-password.title')} />
      <ResetPasswordWithEmailForm code={code} email={email} />
    </div>
  );
};

ResetPasswordPage.getLayout = (page) => {
  return <MainLayout center>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps<IProps> = async ({
  locale,
  query,
}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
      code: (query.code ?? '') as string,
      email: (query.email ?? '') as string,
    },
  };
};

export default ResetPasswordPage;
