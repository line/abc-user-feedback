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
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';

import { AnonymousTemplate } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { ResetPasswordForm } from '@/features/auth';
import { AnonymousLayout } from '@/widgets/anonymous-layout';

import serverSideTranslations from '@/server-side-translations';

interface IProps {
  code: string;
  email: string;
}

const ResetPasswordPage: NextPageWithLayout<IProps> = (props) => {
  const { code, email } = props;
  const { t } = useTranslation();

  return (
    <AnonymousTemplate
      title={t('v2.link.reset-password.title')}
      image="/assets/images/reset-password.svg"
    >
      <ResetPasswordForm code={code} email={email} />
    </AnonymousTemplate>
  );
};

ResetPasswordPage.getLayout = (page) => {
  return <AnonymousLayout>{page}</AnonymousLayout>;
};

export const getServerSideProps: GetServerSideProps<IProps> = async ({
  locale,
  query,
}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      code: (query.code ?? '') as string,
      email: (query.email ?? '') as string,
    },
  };
};

export default ResetPasswordPage;
