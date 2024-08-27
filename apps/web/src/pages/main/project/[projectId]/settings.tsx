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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { DEFAULT_LOCALE } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { ProjectGuard } from '@/entities/project';
import {
  ChannelInfoSetting,
  FieldSetting,
  ImageConfigSetting,
} from '@/widgets/channel-settings';
import { Layout } from '@/widgets/layout';
import {
  ApiKeySetting,
  IssueTrackerSetting,
  MemberSetting,
  ProjectInfoSetting,
  RoleSetting,
  WebhookSetting,
} from '@/widgets/project-settings';
import { SettingsMenu } from '@/widgets/settings-menu';
import type { SettingMenu, SubSettingMenu } from '@/widgets/settings-menu';

interface IProps {
  projectId: number;
}

const SettingPage: NextPageWithLayout<IProps> = ({ projectId }) => {
  const [currentMenu, setCurrentMenu] = useState<SettingMenu>('project');
  const [currentSubMenu, setCurrentSubMenu] = useState<SubSettingMenu>();

  const [currentChannelId, setCurrentChannelId] = useState<number>();

  return (
    <div className="flex h-full gap-8">
      <div className="w-[280px] flex-shrink-0 px-3 py-6">
        <SettingsMenu
          onChangeSettingMenuValue={(settingMenu, channelId) => {
            setCurrentMenu(settingMenu);
            setCurrentChannelId(channelId);
            setCurrentSubMenu(undefined);
          }}
          projectId={projectId}
          settingMenuValue={currentMenu}
          channelId={currentChannelId}
        />
      </div>
      <div className="border-neutral-tertiary h-[calc(100vh-200px)] w-full overflow-auto rounded border p-6">
        {currentMenu === 'project' && (
          <ProjectInfoSetting projectId={projectId} />
        )}
        {currentMenu === 'member' &&
          (currentSubMenu === 'role' ?
            <RoleSetting
              projectId={projectId}
              onClickClearMenu={() => setCurrentSubMenu(undefined)}
            />
          : <MemberSetting
              projectId={projectId}
              onClickChangeSubMenu={(menu) => setCurrentSubMenu(menu)}
            />)}
        {currentMenu === 'api-key' && <ApiKeySetting projectId={projectId} />}
        {currentMenu === 'issue-tracker' && (
          <IssueTrackerSetting projectId={projectId} />
        )}
        {currentMenu === 'webhook' && <WebhookSetting projectId={projectId} />}
        {currentChannelId && currentMenu === 'channel-info' && (
          <ChannelInfoSetting
            projectId={projectId}
            channelId={currentChannelId}
          />
        )}
        {currentChannelId && currentMenu === 'field-mgmt' && (
          <FieldSetting projectId={projectId} channelId={currentChannelId} />
        )}
        {currentChannelId && currentMenu === 'image-mgmt' && (
          <ImageConfigSetting
            projectId={projectId}
            channelId={currentChannelId}
          />
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
