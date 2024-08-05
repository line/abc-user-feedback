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
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Menu, MenuItem } from '@ufb/react';

import { DEFAULT_LOCALE } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { ProjectGuard } from '@/entities/project';
import { Layout } from '@/widgets/layout';
import { ProjectInfoSetting } from '@/widgets/setting-menu';

type MenuType = 'project' | 'member' | 'api-key' | 'issue-tracker' | 'webhook';

interface IProps {
  projectId: number;
}

const SettingPage: NextPageWithLayout<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const [menuItemValue, setMenuItemValue] = useState<MenuType>('project');

  return (
    <div className="flex h-full gap-8">
      <div className="w-[280px] flex-shrink-0 px-3 py-6">
        <Menu
          type="single"
          align="vertical"
          className="w-full"
          value={menuItemValue}
          onValueChange={(value: MenuType) => setMenuItemValue(value)}
        >
          <MenuItem value="project" iconL="RiInformation2Fill">
            {t('project-setting-menu.project-info')}
          </MenuItem>
          <MenuItem value="member" iconL="RiUser2Fill">
            {t('project-setting-menu.member-mgmt')}
          </MenuItem>
          <MenuItem value="api-key" iconL="RiShieldKeyholeFill">
            {t('project-setting-menu.api-key-mgmt')}
          </MenuItem>
          <MenuItem value="issue-tracker" iconL="RiSeoFill">
            {t('project-setting-menu.issue-tracker-mgmt')}
          </MenuItem>
          <MenuItem value="webhook" iconL="RiWebhookFill">
            {t('project-setting-menu.webhook-integration')}
          </MenuItem>
        </Menu>
      </div>
      <div className="border-neutral-tertiary h-[calc(100vh-300px)] w-full rounded border p-6">
        {menuItemValue === 'project' && (
          <ProjectInfoSetting projectId={projectId} />
        )}
      </div>
    </div>
  );
};

SettingPage.getLayout = (page: React.ReactElement<IProps>) => {
  return (
    <Layout projectId={page.props.projectId} title="Settings">
      <ProjectGuard projectId={page.props.projectId}>{page}</ProjectGuard>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<IProps> = async ({
  locale,
  query,
}) => {
  const projectId = parseInt(query.projectId as string);

  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
      projectId,
    },
  };
};

export default SettingPage;
