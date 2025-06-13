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
import { useRouter } from 'next/router';

import type { NextPageWithLayout } from '@/shared/types';
import SideMenuLayout from '@/shared/ui/side-menu-layout.ui';
import { ProjectGuard } from '@/entities/project';
import {
  ChannelInfoSetting,
  FieldSetting,
  ImageConfigSetting,
} from '@/widgets/channel-settings';
import { Layout } from '@/widgets/layout';
import {
  ApiKeySetting,
  GenerativeAiSetting,
  IssueTrackerSetting,
  MemberSetting,
  ProjectInfoSetting,
  RoleSetting,
  WebhookSetting,
} from '@/widgets/project-settings';
import { SettingsMenuList } from '@/widgets/setting-menu';
import type { SettingMenu, SubSettingMenu } from '@/widgets/setting-menu';

import serverSideTranslations from '@/server-side-translations';

interface IProps {
  projectId: number;
}

const SettingsPage: NextPageWithLayout<IProps> = ({ projectId }) => {
  const router = useRouter();

  const currentMenu = (router.query.menu ?? 'project') as SettingMenu;
  const currentSubMenu = router.query.submenu as SubSettingMenu | undefined;
  const currentChannelId =
    router.query.channelId ? Number(router.query.channelId) : null;

  return (
    <SideMenuLayout
      sideMenu={
        <SettingsMenuList
          projectId={projectId}
          settingMenuValue={currentMenu}
          channelId={currentChannelId}
        />
      }
    >
      {currentMenu === 'project' && (
        <ProjectInfoSetting projectId={projectId} />
      )}
      {currentMenu === 'member' && (
        <>
          {currentSubMenu !== 'role' && <MemberSetting projectId={projectId} />}
          {currentSubMenu === 'role' && <RoleSetting projectId={projectId} />}
        </>
      )}
      {currentMenu === 'api-key' && <ApiKeySetting projectId={projectId} />}
      {currentMenu === 'issue-tracker' && (
        <IssueTrackerSetting projectId={projectId} />
      )}
      {currentMenu === 'webhook' && <WebhookSetting projectId={projectId} />}
      {currentMenu === 'generative-ai' && (
        <GenerativeAiSetting projectId={projectId} />
      )}
      {currentChannelId && (
        <>
          {currentMenu === 'channel-info' && (
            <ChannelInfoSetting
              projectId={projectId}
              channelId={currentChannelId}
            />
          )}
          {currentMenu === 'field-mgmt' && !currentSubMenu && (
            <FieldSetting projectId={projectId} channelId={currentChannelId} />
          )}
          {currentMenu === 'image-mgmt' && (
            <ImageConfigSetting
              projectId={projectId}
              channelId={currentChannelId}
            />
          )}
        </>
      )}
    </SideMenuLayout>
  );
};

SettingsPage.getLayout = (page: React.ReactElement<IProps>) => {
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
      ...(await serverSideTranslations(locale)),
      projectId,
    },
  };
};

export default SettingsPage;
