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
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { parseAsInteger, useQueryState } from 'nuqs';

import { Icon } from '@ufb/ui';

import { DEFAULT_LOCALE, Path } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { ProjectGuard } from '@/entities/project';
import { MainLayout } from '@/widgets';
import type { SettingMenuType } from '@/widgets/setting-menu';
import {
  ApiKeySetting,
  AuthSetting,
  ChannelDeletionSetting,
  ChannelInfoSetting,
  ChannelSettingMenu,
  FieldSetting,
  ImageConfigSetting,
  IssueTrackerSetting,
  MemberSetting,
  ProjectDeletionSetting,
  ProjectInfoSetting,
  ProjectSettingMenu,
  RoleSetting,
  SettingMenuBox,
  TenantInfoSetting,
  TenantSettingMenu,
  UserManagementSetting,
  WebhookSetting,
} from '@/widgets/setting-menu';

interface IProps {
  projectId: number;
}

const SettingPage: NextPageWithLayout<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [channelId, setChannelId] = useQueryState('channelId', parseAsInteger);
  const settingMenu =
    router.query.menu ? (router.query.menu as SettingMenuType) : null;

  const setSettingMenu = (menu: SettingMenuType | null) =>
    router.push({ pathname: Path.SETTINGS, query: { ...router.query, menu } });

  const onClickReset = () => setSettingMenu(null);

  const showList = useMemo(() => {
    switch (settingMenu) {
      case 'TENANT_INFO':
      case 'SIGNUP_SETTING':
      case 'USER_MANAGEMENT':
        return [0, 3];
      case 'PROJECT_INFO':
      case 'API_KEY_MANAGEMENT':
      case 'MEMBER_MANAGEMENT':
      case 'ROLE_MANAGEMENT':
      case 'TICKET_MANAGEMENT':
      case 'WEBHOOK_MANAGEMENT':
      case 'DELETE_PROJECT':
        return [1, 3];
      case 'CHANNEL_INFO':
      case 'FIELD_MANAGEMENT':
      case 'IMAGE_UPLOAD_SETTING':
      case 'DELETE_CHANNEL':
        return [2, 3];
      default:
        return [0, 1, 2];
    }
  }, [settingMenu]);

  return (
    <>
      <h1 className="font-20-bold mb-6">{t('main.setting.title')}</h1>
      <div className="flex">
        <SettingMenuBox show={showList.includes(0)}>
          <TenantSettingMenu
            settingMenu={settingMenu}
            onClickSettingMenu={setSettingMenu}
          />
        </SettingMenuBox>
        <SettingMenuBox show={showList.includes(1)}>
          <ProjectSettingMenu
            settingMenu={settingMenu}
            onClickSettingMenu={setSettingMenu}
            projectId={projectId}
          />
        </SettingMenuBox>
        <SettingMenuBox show={showList.includes(2)}>
          <ChannelSettingMenu
            settingMenu={settingMenu}
            projectId={projectId}
            onClickSettingMenu={setSettingMenu}
            setChannelId={setChannelId}
            channelId={channelId}
          />
        </SettingMenuBox>
        {projectId && (
          <SettingMenuBox show={showList.includes(3)} last>
            <button
              className="icon-btn icon-btn-secondary icon-btn-xs icon-btn-rounded absolute left-[0.1rem] top-[40px] z-10 -translate-y-1/2 border shadow"
              onClick={onClickReset}
            >
              <Icon name="ArrowRight" />
            </button>
            {settingMenu === 'TENANT_INFO' && <TenantInfoSetting />}
            {settingMenu === 'SIGNUP_SETTING' && <AuthSetting />}
            {settingMenu === 'USER_MANAGEMENT' && <UserManagementSetting />}
            {settingMenu === 'PROJECT_INFO' && (
              <ProjectInfoSetting projectId={projectId} />
            )}
            {settingMenu === 'MEMBER_MANAGEMENT' && (
              <MemberSetting projectId={projectId} />
            )}
            {settingMenu === 'ROLE_MANAGEMENT' && (
              <RoleSetting projectId={projectId} />
            )}
            {settingMenu === 'API_KEY_MANAGEMENT' && (
              <ApiKeySetting projectId={projectId} />
            )}
            {settingMenu === 'TICKET_MANAGEMENT' && (
              <IssueTrackerSetting projectId={projectId} />
            )}
            {settingMenu === 'WEBHOOK_MANAGEMENT' && (
              <WebhookSetting projectId={projectId} />
            )}
            {settingMenu === 'DELETE_PROJECT' && (
              <ProjectDeletionSetting projectId={projectId} />
            )}
            {settingMenu === 'CHANNEL_INFO' && channelId && (
              <ChannelInfoSetting projectId={projectId} channelId={channelId} />
            )}
            {settingMenu === 'FIELD_MANAGEMENT' && channelId && (
              <FieldSetting projectId={projectId} channelId={channelId} />
            )}
            {settingMenu === 'IMAGE_UPLOAD_SETTING' && channelId && (
              <ImageConfigSetting projectId={projectId} channelId={channelId} />
            )}
            {settingMenu === 'DELETE_CHANNEL' && channelId && (
              <ChannelDeletionSetting
                projectId={projectId}
                channelId={channelId}
              />
            )}
          </SettingMenuBox>
        )}
      </div>
    </>
  );
};

SettingPage.getLayout = (page: React.ReactElement<IProps>) => {
  return (
    <MainLayout>
      <ProjectGuard projectId={page.props.projectId}>{page}</ProjectGuard>
    </MainLayout>
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
