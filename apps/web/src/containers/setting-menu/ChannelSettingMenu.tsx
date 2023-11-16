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
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { NoChannel, SelectBox, SettingMenuTemplate } from '@/components';
import { SettingMenuItem } from '@/components/layouts/setting-menu';
import { Path } from '@/constants/path';
import { useChannels, usePermissions } from '@/hooks';
import type { SettingMenuType } from '@/types/setting-menu.type';

interface IProps extends React.PropsWithChildren {
  projectId: number;
  onClickSettingMenu: (input: SettingMenuType) => () => void;
  settingMenu: SettingMenuType | null;
  setChannelId: (id: number) => void;
  channelId: number | null;
}

const ChannelSettingMenu: React.FC<IProps> = (props) => {
  const {
    projectId,
    onClickSettingMenu,
    settingMenu,
    channelId,
    setChannelId,
  } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const { data: channelData } = useChannels(projectId);

  useEffect(() => {
    if (!channelData || channelData.items.length === 0) return;
    setChannelId(channelData.items?.[0]?.id ?? 0);
  }, [channelData]);

  const gotoCreateChannel = () =>
    router.push({ pathname: Path.CREATE_CHANNEL, query: { projectId } });

  if (!channelId) {
    return (
      <SettingMenuTemplate title="Channel">
        <NoChannel projectId={projectId} />
      </SettingMenuTemplate>
    );
  }

  return (
    <SettingMenuTemplate title="Channel">
      <SelectBox
        options={channelData?.items ?? []}
        value={channelData?.items.find((v) => v.id === channelId) ?? null}
        onChange={(input) => (input && input.id ? setChannelId(input.id) : {})}
      />
      <hr className="border-fill-tertiary basis" />
      <ul className="flex-1">
        <SettingMenuItem
          iconName="InfoCircleFill"
          name={t('main.setting.subtitle.channel-info')}
          onClick={onClickSettingMenu('CHANNEL_INFO')}
          active={settingMenu === 'CHANNEL_INFO'}
          disabled={!perms.includes('channel_read')}
        />
        <SettingMenuItem
          iconName="DocumentTermsFill"
          name={t('main.setting.subtitle.field-mgmt')}
          onClick={onClickSettingMenu('FIELD_MANAGEMENT')}
          active={settingMenu === 'FIELD_MANAGEMENT'}
          disabled={!perms.includes('channel_field_read')}
        />
        <SettingMenuItem
          iconName="TrashFill"
          name={t('main.setting.subtitle.delete-channel')}
          onClick={onClickSettingMenu('DELETE_CHANNEL')}
          active={settingMenu === 'DELETE_CHANNEL'}
          disabled={!perms.includes('channel_delete')}
        />
      </ul>
      <button
        className="btn btn-primary"
        disabled={!perms.includes('channel_create')}
        onClick={gotoCreateChannel}
      >
        + {t('main.setting.button.create-channel')}
      </button>
    </SettingMenuTemplate>
  );
};

export default ChannelSettingMenu;
