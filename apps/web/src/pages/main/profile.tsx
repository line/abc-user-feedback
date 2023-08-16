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
import { Icon, IconNameType } from '@ufb/ui';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MainTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import ChangePasswordForm from '@/containers/my-profile/ChangePasswordForm';
import MyProfileForm from '@/containers/my-profile/MyProfileForm';
import { useUser } from '@/hooks';

import type { NextPageWithLayout } from '../_app';

const menuItems: {
  key: 'profile-info' | 'change-password';
  iconName: IconNameType;
}[] = [
  { key: 'profile-info', iconName: 'InfoCircleFill' },
  { key: 'change-password', iconName: 'LockFill' },
];

const ProfilePage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [tabIndex, setTabIndex] = useState(menuItems[0].key);

  return (
    <>
      <h1 className="font-24-bold mb-4">{t('main.profile.title')}</h1>
      <div className="flex gap-4 items-stretch h-[calc(100vh-144px)]">
        <div className="border border-fill-tertiary rounded w-[400px] p-6">
          <ul className="space-y-2">
            {menuItems.map(({ key, iconName }) => {
              const isDisabled =
                user?.signUpMethod === 'OAUTH' && key === 'change-password';
              return (
                <li
                  key={key}
                  onClick={() => !isDisabled && setTabIndex(key)}
                  className={[
                    'p-2 mx-1 rounded flex items-center gap-2',
                    tabIndex === key ? 'bg-fill-tertiary' : '',
                    isDisabled
                      ? 'text-tertiary cursor-not-allowed'
                      : 'hover:bg-fill-secondary cursor-pointer',
                  ].join(' ')}
                >
                  <Icon name={iconName} size={20} />
                  <span className="font-12-regular">
                    {t(`main.profile.${key}`)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border border-fill-tertiary rounded flex-1 p-6">
          {tabIndex === menuItems[0].key && <MyProfileForm />}
          {tabIndex === menuItems[1].key && <ChangePasswordForm />}
        </div>
      </div>
    </>
  );
};

ProfilePage.getLayout = function getLayout(page) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};
export default ProfilePage;
