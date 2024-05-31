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
import { useMemo } from 'react';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { LogoWithTitle } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { UserInvitationForm } from '@/features/invite-user/ui';
import { MainLayout } from '@/widgets';

import { DEFAULT_LOCALE } from '@/constants/i18n';

const UserInvitationPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const code = useMemo(
    () => (router.query?.code ?? '') as string,
    [router.query],
  );
  const email = useMemo(
    () => (router.query?.email ?? '') as string,
    [router.query],
  );

  return (
    <div className="relative">
      <LogoWithTitle title={t('link.user-invitation.title')} />
      <UserInvitationForm code={code} email={email} />
    </div>
  );
};

UserInvitationPage.getLayout = (page) => {
  return <MainLayout center> {page}</MainLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default UserInvitationPage;
