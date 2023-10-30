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
import { useEffect, useMemo, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getIronSession } from 'iron-session';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Icon } from '@ufb/ui';

import { MainTemplate } from '@/components';
import { SettingMenuBox } from '@/components/layouts/setting-menu';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { ironOption } from '@/constants/iron-option';
import { Path } from '@/constants/path';
import {
  APIKeySetting,
  ChannelDeleteSetting,
  ChannelInfoSetting,
  ChannelSettingMenu,
  FieldSetting,
  MemberSetting,
  ProjectDeleteSetting,
  ProjectInfoSetting,
  ProjectSettingMenu,
  RoleSetting,
  SignUpSetting,
  TenantInfoSetting,
  TenantSettingMenu,
  TicketSetting,
  UserSetting,
} from '@/containers/setting-menu';
import { env } from '@/env.mjs';
import type { SettingMenuType } from '@/types/setting-menu.type';
import type { NextPageWithLayout } from '../../../_app';

interface IProps {
  projectId: number;
}

const SettingPage: NextPageWithLayout<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [showList, setShowList] = useState<number[]>([0, 1, 2]);
  const [channelId, setChannelId] = useState<number | null>(null);
  const settingMenu = useMemo(() => {
    if (router.query?.menu) return router.query.menu as SettingMenuType;
    else return null;
  }, [router.query]);

  console.log('settingMenu: ', settingMenu);

  const setSettingMenu = (input: SettingMenuType | null) =>
    router.push({
      pathname: Path.SETTINGS,
      query: { menu: input ?? undefined, projectId },
    });

  const onClickReset = () => {
    setShowList([0, 1, 2]);
    setSettingMenu(null);
  };
  useEffect(() => {
    switch (settingMenu) {
      case 'TENANT_INFO':
      case 'SIGNUP_SETTING':
      case 'USER_MANAGEMENT':
        setShowList([0, 3]);
        break;
      case 'PROJECT_INFO':
      case 'API_KEY_MANAGEMENT':
      case 'MEMBER_MANAGEMENT':
      case 'ROLE_MANAGEMENT':
      case 'TICKET_MANAGEMENT':
      case 'DELETE_PROJECT':
        setShowList([1, 3]);
        break;
      case 'CHANNEL_INFO':
      case 'FIELD_MANAGEMENT':
      case 'DELETE_CHANNEL':
        setShowList([2, 3]);
        break;
      default:
        setShowList([0, 1, 2]);
        break;
    }
  }, [router.query]);

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
              <TicketSetting projectId={projectId} />
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

SettingPage.getLayout = function getLayout(page) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getServerSideProps: GetServerSideProps<IProps> = async ({
  req,
  res,
  locale,
  query,
}) => {
  const session = await getIronSession(req, res, ironOption);

  const projectId = parseInt(query.projectId as string);
  try {
    const data = await (
      await fetch(`${env.API_BASE_URL}/api/projects/${projectId}`, {
        headers: { Authorization: 'Bearer ' + session.jwt?.accessToken },
      })
    ).json();
    if (data?.statusCode === 401) {
      return {
        redirect: {
          destination: `/main/${projectId}/not-permission`,
          permanent: true,
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        destination: `/main/${projectId}/not-permission`,
        permanent: true,
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
      projectId,
    },
  };
};

export default SettingPage;
