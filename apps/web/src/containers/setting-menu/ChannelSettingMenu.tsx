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
import { useTranslation } from 'next-i18next';

import { CreateChannelButton } from '../buttons';

import { SelectBox, SettingMenuTemplate } from '@/components';
import { SettingMenuItem } from '@/components/layouts/setting-menu';
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
  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const { data: channelData } = useChannels(projectId);

  useEffect(() => {
    if (!channelData || channelData.items.length === 0) return;
    setChannelId(channelData.items?.[0]?.id ?? 0);
  }, [channelData]);

  if (!channelId) {
    return (
      <SettingMenuTemplate title="Channel">
        <div className="flex flex-1 items-center justify-center">
          <CreateChannelButton projectId={projectId} type="blue" />
        </div>
      </SettingMenuTemplate>
    );
  }

  return (
    <SettingMenuTemplate title="Channel">
      <SelectBox
        options={channelData?.items ?? []}
        value={channelData?.items.find((v) => v.id === channelId) ?? null}
        onChange={(input) => (input && input.id ? setChannelId(input.id) : {})}
        getOptionValue={(option) => String(option.id)}
        getOptionLabel={(option) => option.name}
      />
      <hr className="border-fill-tertiary basis" />
      <ul className="flex-1">
        <SettingMenuItem
          iconName="InfoCircleFill"
          name={t('channel-setting-menu.channel-info')}
          onClick={onClickSettingMenu('CHANNEL_INFO')}
          active={settingMenu === 'CHANNEL_INFO'}
        />
        <SettingMenuItem
          iconName="DocumentTermsFill"
          name={t('channel-setting-menu.field-mgmt')}
          onClick={onClickSettingMenu('FIELD_MANAGEMENT')}
          active={settingMenu === 'FIELD_MANAGEMENT'}
          disabled={!perms.includes('channel_field_read')}
        />
        <SettingMenuItem
          iconName="MediaImageFill"
          name={t('channel-setting-menu.image-mgmt')}
          onClick={onClickSettingMenu('IMAGE_UPLOAD_SETTING')}
          active={settingMenu === 'IMAGE_UPLOAD_SETTING'}
          disabled={!perms.includes('channel_field_read')}
        />
        <SettingMenuItem
          iconName="TrashFill"
          name={t('channel-setting-menu.delete-channel')}
          onClick={onClickSettingMenu('DELETE_CHANNEL')}
          active={settingMenu === 'DELETE_CHANNEL'}
          disabled={!perms.includes('channel_delete')}
        />
      </ul>
      <CreateChannelButton
        projectId={projectId}
        type="primary"
        placement="top"
      />
    </SettingMenuTemplate>
  );
};

export default ChannelSettingMenu;
