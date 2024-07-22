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

import { SelectBox, SubMenu, useOAIQuery, usePermissions } from '@/shared';
import { RouteCreateChannelButton } from '@/features/create-channel';

import type { SettingMenuType } from '../setting-menu.type';
import SettingMenuTemplate from './setting-menu-template';

interface IProps {
  projectId: number;
  onClickSettingMenu: (input: SettingMenuType) => void;
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

  const { data: channelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  useEffect(() => {
    if (!channelData || channelData.items.length === 0) return;
    setChannelId(channelData.items[0]?.id ?? 0);
  }, [channelData]);

  if (!channelId) {
    return (
      <SettingMenuTemplate title="Channel">
        <div className="flex flex-1 items-center justify-center">
          <RouteCreateChannelButton projectId={projectId} type="blue" />
        </div>
      </SettingMenuTemplate>
    );
  }

  return (
    <SettingMenuTemplate title="Channel">
      <SelectBox
        options={channelData?.items ?? []}
        value={channelData?.items.find((v) => v.id === channelId) ?? null}
        onChange={(input) => (input?.id ? setChannelId(input.id) : {})}
        getOptionValue={(option) => String(option.id)}
        getOptionLabel={(option) => option.name}
      />
      <hr className="border-fill-tertiary basis" />
      <SubMenu
        className="flex-1"
        items={[
          {
            iconName: 'InfoCircleFill',
            name: t('channel-setting-menu.channel-info'),
            active: settingMenu === 'CHANNEL_INFO',
            onClick: () => onClickSettingMenu('CHANNEL_INFO'),
          },
          {
            iconName: 'DocumentTermsFill',
            name: t('channel-setting-menu.field-mgmt'),
            active: settingMenu === 'FIELD_MANAGEMENT',
            onClick: () => onClickSettingMenu('FIELD_MANAGEMENT'),
            disabled: !perms.includes('channel_field_read'),
          },
          {
            iconName: 'MediaImageFill',
            name: t('channel-setting-menu.image-mgmt'),
            active: settingMenu === 'IMAGE_UPLOAD_SETTING',
            onClick: () => onClickSettingMenu('IMAGE_UPLOAD_SETTING'),
            disabled: !perms.includes('channel_image_read'),
          },
          {
            iconName: 'TrashFill',
            name: t('channel-setting-menu.delete-channel'),
            active: settingMenu === 'DELETE_CHANNEL',
            onClick: () => onClickSettingMenu('DELETE_CHANNEL'),
            disabled: !perms.includes('channel_delete'),
          },
        ]}
      />
      <RouteCreateChannelButton
        projectId={projectId}
        type="primary"
        placement="top"
      />
    </SettingMenuTemplate>
  );
};

export default ChannelSettingMenu;
