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

import { Menu, MenuItem } from '@ufb/react';

import type { NextPageWithLayout } from '@/shared';
import { DEFAULT_LOCALE } from '@/shared';
import SideMenuLayout from '@/shared/ui/side-menu-layout.ui';
import { Layout } from '@/widgets/layout';
import { AuthSetting, TenantInfoSetting } from '@/widgets/setting-menu';

const TenantPage: NextPageWithLayout = () => {
  const [currentMenu, setCurrentMenu] = useState('tenant');
  return (
    <SideMenuLayout
      sideMenu={
        <Menu
          type="single"
          orientation="vertical"
          className="w-full p-0"
          value={currentMenu}
          onValueChange={(value) => setCurrentMenu(value)}
        >
          <MenuItem value="tenant" iconL="RiInformation2Line">
            Tenant 정보
          </MenuItem>
          <MenuItem value="login" iconL="RiUser2Line">
            Login 관리
          </MenuItem>
          <MenuItem value="user" iconL="RiShieldKeyholeLine">
            User 관리
          </MenuItem>
        </Menu>
      }
    >
      {currentMenu === 'tenant' && <TenantInfoSetting />}
      {currentMenu === 'login' && <AuthSetting />}
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
