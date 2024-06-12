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
import { useState } from 'react';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

import { SectionTemplate, SubMenu } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { useUserState } from '@/entities/user';
import { DeleteAccountButton } from '@/features/delete-user';
import { ChangePasswordForm, UserProfileForm } from '@/features/update-user';
import { MainLayout } from '@/widgets';

import { DescriptionTooltip } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';

const MENU_ITEMS = [
  { key: 'profile-info', iconName: 'InfoCircleFill' },
  { key: 'change-password', iconName: 'LockFill' },
] as const;

const ProfilePage: NextPageWithLayout = () => {
  const { t } = useTranslation();

  const user = useUserState();

  const [tabKey, setTabKey] = useState<(typeof MENU_ITEMS)[number]['key']>(
    MENU_ITEMS[0].key,
  );

  return (
    <SectionTemplate
      className="flex h-full flex-col"
      title={
        <>
          {t('main.profile.title')}
          <DescriptionTooltip description="Profile Description" />
        </>
      }
    >
      <div className="flex flex-1 items-stretch gap-4">
        <div className="card w-[400px]">
          <SubMenu
            items={MENU_ITEMS.map(({ key, iconName }) => ({
              iconName,
              name: t(`main.profile.${key}`),
              active: tabKey === key,
              onClick: () => setTabKey(key),
              disabled:
                key === 'change-password' && user?.signUpMethod === 'OAUTH',
            }))}
          />
        </div>
        <div className="card flex-1">
          {tabKey === MENU_ITEMS[0].key && user && (
            <>
              <UserProfileForm user={user} />
              <div className="mt-6 flex justify-end">
                <DeleteAccountButton user={user} />
              </div>
            </>
          )}
          {tabKey === MENU_ITEMS[1].key && <ChangePasswordForm />}
        </div>
      </div>
    </SectionTemplate>
  );
};

ProfilePage.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};
export default ProfilePage;
