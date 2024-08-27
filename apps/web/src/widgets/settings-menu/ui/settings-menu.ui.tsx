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
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Menu,
  MenuDropdown,
  MenuDropdownContent,
  MenuDropdownItem,
  MenuDropdownTrigger,
  MenuItem,
} from '@ufb/react';

import { useOAIQuery } from '@/shared';

import type { SettingMenu } from '../setting-menu.type';

interface Props {
  settingMenuValue: SettingMenu;
  channelId?: number;
  onChangeSettingMenuValue: (value: SettingMenu, channelId?: number) => void;
  projectId: number;
}

const SettingsMenu: React.FC<Props> = (props) => {
  const { settingMenuValue, onChangeSettingMenuValue, projectId, channelId } =
    props;

  const menuValue = useMemo(() => {
    if (channelId) return `${settingMenuValue}_${channelId}`;
    return settingMenuValue;
  }, [settingMenuValue, channelId]);

  const { t } = useTranslation();

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  const onMenuValueChange = (value: string) => {
    if (!value) return;
    const [menuValue, channelId] = value.split('_');

    if (!channelId) {
      onChangeSettingMenuValue(menuValue as SettingMenu, undefined);
    } else {
      onChangeSettingMenuValue(menuValue as SettingMenu, parseInt(channelId));
    }
  };

  return (
    <Menu
      type="single"
      align="vertical"
      className="w-full"
      value={menuValue}
      onValueChange={onMenuValueChange}
    >
      <MenuItem value="project" iconL="RiInformation2Line">
        {t('v2.project-setting-menu.project-info')}
      </MenuItem>
      <MenuItem value="member" iconL="RiUser2Line">
        {t('v2.project-setting-menu.member-mgmt')}
      </MenuItem>
      <MenuItem value="api-key" iconL="RiShieldKeyholeLine">
        {t('v2.project-setting-menu.api-key-mgmt')}
      </MenuItem>
      <MenuItem value="issue-tracker" iconL="RiSeoLine">
        {t('v2.project-setting-menu.issue-tracker-mgmt')}
      </MenuItem>
      <MenuItem value="webhook" iconL="RiWebhookLine">
        {t('v2.project-setting-menu.webhook-integration')}
      </MenuItem>
      <Accordion type="single" iconAlign="left" collapsible useDivider={false}>
        <AccordionItem value="item-1">
          <AccordionTrigger className="p-2">Channel List</AccordionTrigger>
          <AccordionContent className="!p-0">
            {data?.meta.totalItems === 0 ?
              <div className="border-neutral-tertiary flex w-full flex-col items-center justify-center gap-4 rounded border p-4">
                <Image
                  width={96}
                  height={96}
                  src="/assets/images/empty-image.png"
                  alt="empty image"
                />
                <p className="text-small text-neutral-tertiary">
                  {t('v2.text.no-data.channel')}
                </p>
                <Button className="w-full">
                  {t('v2.text.create-channel')}
                </Button>
              </div>
            : data?.items.map(({ name, id }) => (
                <MenuDropdown key={id}>
                  <MenuDropdownTrigger value="" iconR="RiArrowRightSLine">
                    {name}
                  </MenuDropdownTrigger>
                  <MenuDropdownContent side="right" align="start">
                    <MenuDropdownItem
                      value={`channel-info_${id}`}
                      iconL="RiInformation2Line"
                    >
                      {t('v2.channel-setting-menu.channel-info')}
                    </MenuDropdownItem>
                    <MenuDropdownItem
                      value={`field-mgmt_${id}`}
                      iconL="RiListCheck"
                    >
                      {t('v2.channel-setting-menu.field-mgmt')}
                    </MenuDropdownItem>
                    <MenuDropdownItem
                      value={`image-mgmt_${id}`}
                      iconL="RiImageFill"
                    >
                      {t('v2.channel-setting-menu.image-mgmt')}
                    </MenuDropdownItem>
                  </MenuDropdownContent>
                </MenuDropdown>
              ))
            }
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Menu>
  );
};

export default SettingsMenu;
