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
import { useEffect, useMemo } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Icon } from '@ufb/ui';

import { DEFAULT_LOCALE, Path } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { MainLayout } from '@/widgets';

import { SettingMenuBox } from '@/components/layouts/setting-menu';
import {
  APIKeySetting,
  ChannelDeleteSetting,
  ChannelInfoSetting,
  ChannelSettingMenu,
  FieldSetting,
  ImageSetting,
  IssueTrackerSetting,
  MemberSetting,
  ProjectDeleteSetting,
  ProjectInfoSetting,
  ProjectSettingMenu,
  RoleSetting,
  SignUpSetting,
  TenantInfoSetting,
  TenantSettingMenu,
  UserSetting,
  WebhookSetting,
} from '@/containers/setting-menu';
import type { SettingMenuType } from '@/types/setting-menu.type';

interface IProps {
  projectId: number;
}

const SettingPage: NextPageWithLayout<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const channelId =
    router.query?.channelId ? (Number(router.query.channelId) as number) : null;

  const setChannelId = (channelId: number | null) =>
    router.push({
      pathname: Path.SETTINGS,
      query: { ...router.query, channelId },
    });

  const settingMenu =
    router.query?.menu ? (router.query.menu as SettingMenuType) : null;

  const setSettingMenu = (menu: SettingMenuType | null) =>
    router.push({
      pathname: Path.SETTINGS,
      query: { ...router.query, menu },
    });

  const onClickReset = () => {
    setSettingMenu(null);
  };
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

  useEffect(() => {}, [router.query]);

  const onClickTarget = (target: SettingMenuType | null) => () => {
    setSettingMenu(target);
  };

  return (
    <>
      <h1 className="font-20-bold mb-6">{t('main.setting.title')}</h1>
      <div className="flex">
        <SettingMenuBox show={showList.includes(0)}>
          <TenantSettingMenu
            settingMenu={settingMenu}
            onClickSettingMenu={onClickTarget}
          />
        </SettingMenuBox>
        <SettingMenuBox show={showList.includes(1)}>
          <ProjectSettingMenu
            settingMenu={settingMenu}
            onClickSettingMenu={onClickTarget}
            projectId={projectId}
          />
        </SettingMenuBox>
        <SettingMenuBox show={showList.includes(2)}>
          {projectId && (
            <ChannelSettingMenu
              settingMenu={settingMenu}
              projectId={projectId}
              onClickSettingMenu={onClickTarget}
              setChannelId={setChannelId}
              channelId={channelId}
            />
          )}
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
            {settingMenu === 'SIGNUP_SETTING' && <SignUpSetting />}
            {settingMenu === 'USER_MANAGEMENT' && <UserSetting />}
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
              <APIKeySetting projectId={projectId} />
            )}
            {settingMenu === 'TICKET_MANAGEMENT' && (
              <IssueTrackerSetting projectId={projectId} />
            )}
            {settingMenu === 'WEBHOOK_MANAGEMENT' && (
              <WebhookSetting projectId={projectId} />
            )}
            {settingMenu === 'DELETE_PROJECT' && (
              <ProjectDeleteSetting projectId={projectId} />
            )}
            {settingMenu === 'CHANNEL_INFO' && channelId && (
              <ChannelInfoSetting projectId={projectId} channelId={channelId} />
            )}
            {settingMenu === 'FIELD_MANAGEMENT' && channelId && (
              <FieldSetting projectId={projectId} channelId={channelId} />
            )}
            {settingMenu === 'IMAGE_UPLOAD_SETTING' && channelId && (
              <ImageSetting projectId={projectId} channelId={channelId} />
            )}
            {settingMenu === 'DELETE_CHANNEL' && channelId && (
              <ChannelDeleteSetting
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

SettingPage.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
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
