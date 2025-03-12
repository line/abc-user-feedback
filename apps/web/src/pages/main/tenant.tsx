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
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { parseAsString, useQueryState } from 'nuqs';

import { Icon, Menu, MenuItem } from '@ufb/react';

import type { NextPageWithLayout } from '@/shared';
import { DEFAULT_LOCALE } from '@/shared';
import SideMenuLayout from '@/shared/ui/side-menu-layout.ui';
import { Layout } from '@/widgets/layout';
import {
  LoginSetting,
  TenantInfoSetting,
  UserManagementSetting,
} from '@/widgets/setting-menu';

const TenantPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentMenu] = useQueryState<string>(
    'menu',
    parseAsString.withDefault('tenant'),
  );

  return (
    <SideMenuLayout
      sideMenu={
        <Menu
          type="single"
          orientation="vertical"
          className="w-full p-0"
          value={currentMenu}
          onValueChange={(value) =>
            router.push({ pathname: router.pathname, query: { menu: value } })
          }
        >
          <MenuItem value="tenant">
            <Icon name="RiInformation2Line" />
            {t('tenant-setting-menu.tenant-info')}
          </MenuItem>
          <MenuItem value="login">
            <Icon name="RiUser2Line" />
            {t('tenant-setting-menu.sign-up-mgmt')}
          </MenuItem>
          <MenuItem value="user">
            <Icon name="RiShieldKeyholeLine" />
            {t('tenant-setting-menu.user-mgmt')}
          </MenuItem>
        </Menu>
      }
    >
      {currentMenu === 'tenant' && <TenantInfoSetting />}
      {currentMenu === 'login' && <LoginSetting />}
      {currentMenu === 'user' && <UserManagementSetting />}
    </SideMenuLayout>
  );
};

TenantPage.getLayout = (page) => {
  return <Layout title="Tenant">{page}</Layout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default TenantPage;
