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
import Link from 'next/link';
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

import { cn, useOAIQuery } from '@/shared';

import type { SettingMenu } from '../setting-menu.type';

interface Props {
  settingMenuValue: SettingMenu;
  channelId?: number | null;
  projectId: number;
}

const SettingsMenu: React.FC<Props> = (props) => {
  const { settingMenuValue, projectId, channelId } = props;

  const menuValue = useMemo(() => {
    if (channelId) return `${settingMenuValue}_${channelId}`;
    return settingMenuValue;
  }, [settingMenuValue, channelId]);

  const { t } = useTranslation();

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  return (
    <Menu
      type="single"
      orientation="vertical"
      className="w-full"
      value={menuValue}
    >
      <Link
        href={{
          pathname: '/main/project/[projectId]/settings',
          query: { projectId, menu: 'project' },
        }}
      >
        <MenuItem value="project" iconL="RiInformation2Line">
          {t('v2.project-setting-menu.project-info')}
        </MenuItem>
      </Link>
      <Link
        href={{
          pathname: '/main/project/[projectId]/settings',
          query: { projectId, menu: 'member' },
        }}
      >
        <MenuItem value="member" iconL="RiUser2Line">
          {t('v2.project-setting-menu.member-mgmt')}
        </MenuItem>
      </Link>
      <Link
        href={{
          pathname: '/main/project/[projectId]/settings',
          query: { projectId, menu: 'api-key' },
        }}
      >
        <MenuItem value="api-key" iconL="RiShieldKeyholeLine">
          {t('v2.project-setting-menu.api-key-mgmt')}
        </MenuItem>
      </Link>
      <Link
        href={{
          pathname: '/main/project/[projectId]/settings',
          query: { projectId, menu: 'issue-tracker' },
        }}
      >
        <MenuItem value="issue-tracker" iconL="RiSeoLine">
          {t('v2.project-setting-menu.issue-tracker-mgmt')}
        </MenuItem>
      </Link>
      <Link
        href={{
          pathname: '/main/project/[projectId]/settings',
          query: { projectId, menu: 'webhook' },
        }}
      >
        <MenuItem value="webhook" iconL="RiWebhookLine">
          {t('v2.project-setting-menu.webhook-integration')}
        </MenuItem>
      </Link>
      <Accordion type="single" iconAlign="left" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="p-2">Channel List</AccordionTrigger>
          <AccordionContent
            className={cn({ 'p-0': data?.meta.totalItems === 0 })}
          >
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
                  <MenuDropdownTrigger iconR="RiArrowRightSLine">
                    {name}
                  </MenuDropdownTrigger>
                  <MenuDropdownContent side="right" align="start">
                    <Link
                      href={{
                        pathname: '/main/project/[projectId]/settings',
                        query: {
                          projectId,
                          menu: 'channel-info',
                          channelId: id,
                        },
                      }}
                    >
                      <MenuDropdownItem
                        value={`channel-info_${id}`}
                        iconL="RiInformation2Line"
                      >
                        {t('v2.channel-setting-menu.channel-info')}
                      </MenuDropdownItem>
                    </Link>
                    <Link
                      href={{
                        pathname: '/main/project/[projectId]/settings',
                        query: {
                          projectId,
                          menu: 'field-mgmt',
                          channelId: id,
                        },
                      }}
                    >
                      <MenuDropdownItem
                        value={`field-mgmt_${id}`}
                        iconL="RiListCheck"
                      >
                        {t('v2.channel-setting-menu.field-mgmt')}
                      </MenuDropdownItem>
                    </Link>
                    <Link
                      href={{
                        pathname: '/main/project/[projectId]/settings',
                        query: {
                          projectId,
                          menu: 'image-mgmt',
                          channelId: id,
                        },
                      }}
                    >
                      <MenuDropdownItem
                        value={`image-mgmt_${id}`}
                        iconL="RiImageFill"
                      >
                        {t('v2.channel-setting-menu.image-mgmt')}
                      </MenuDropdownItem>
                    </Link>
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
