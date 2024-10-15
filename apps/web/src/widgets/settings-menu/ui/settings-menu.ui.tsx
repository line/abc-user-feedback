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
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import type { IconNameType } from '@ufb/react';
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

import { cn, Path, useOAIQuery, usePermissions } from '@/shared';

import type { SettingMenu } from '../setting-menu.type';

interface Props {
  settingMenuValue: SettingMenu;
  channelId?: number | null;
  projectId: number;
}

const SettingsMenu: React.FC<Props> = (props) => {
  const { settingMenuValue, projectId, channelId } = props;
  const { t } = useTranslation();

  const router = useRouter();

  const menuValue =
    channelId ? `${settingMenuValue}_${channelId}` : settingMenuValue;

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });
  const perms = usePermissions(projectId);

  const projectMenuItems: Omit<ProjectMenuItemProps, 'projectId'>[] = [
    {
      label: t('v2.project-setting-menu.project-info'),
      icon: 'RiInformation2Line',
      value: 'project',
    },
    {
      label: t('v2.project-setting-menu.member-mgmt'),
      icon: 'RiUser2Line',
      disabled: !perms.includes('project_member_read'),
      value: 'member',
    },
    {
      label: t('v2.project-setting-menu.api-key-mgmt'),
      icon: 'RiShieldKeyholeLine',
      disabled: !perms.includes('project_apikey_read'),
      value: 'api-key',
    },
    {
      label: t('v2.project-setting-menu.issue-tracker-mgmt'),
      icon: 'RiSeoLine',
      disabled: !perms.includes('project_tracker_read'),
      value: 'issue-tracker',
    },
    {
      label: t('v2.project-setting-menu.webhook-integration'),
      icon: 'RiWebhookLine',
      disabled: !perms.includes('project_webhook_read'),
      value: 'webhook',
    },
  ];
  const channelMenuItems: Omit<ProjectMenuItemProps, 'projectId'>[] = [
    {
      label: t('v2.channel-setting-menu.channel-info'),
      icon: 'RiInformationLine',
      value: 'channel-info',
    },
    {
      label: t('v2.channel-setting-menu.field-mgmt'),
      icon: 'RiListCheck',
      value: 'field-mgmt',
      disabled: !perms.includes('channel_field_read'),
    },
    {
      label: t('v2.channel-setting-menu.image-mgmt'),
      icon: 'RiImageFill',
      value: 'image-mgmt',
      disabled: !perms.includes('channel_image_read'),
    },
  ];

  return (
    <Menu
      type="single"
      orientation="vertical"
      className="w-full p-0"
      value={menuValue}
    >
      {projectMenuItems.map((item) => (
        <ProjectMenuItem key={item.label} {...item} projectId={projectId} />
      ))}
      <Accordion type="single" iconAlign="left" collapsible divider={false}>
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
                    {channelMenuItems.map((item) => (
                      <ChannelMenuItem
                        key={item.label}
                        {...item}
                        projectId={projectId}
                        channelId={id}
                      />
                    ))}
                  </MenuDropdownContent>
                </MenuDropdown>
              ))
            }
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {data?.meta.totalItems !== 0 && (
        <MenuItem
          value=""
          iconL="RiAddCircleFill"
          className="text-tint-blue hover:text-tint-blue"
          onClick={() =>
            router.push({ pathname: Path.CREATE_CHANNEL, query: { projectId } })
          }
        >
          {t('v2.text.create-channel')}
        </MenuItem>
      )}
    </Menu>
  );
};

interface ProjectMenuItemProps {
  disabled?: boolean;
  label: string;
  icon: IconNameType;
  value: string;
  projectId: number;
}

const ProjectMenuItem = (props: ProjectMenuItemProps) => {
  const { disabled = false, label, icon, value, projectId } = props;
  return (
    <Link
      className={cn({
        'pointer-events-none': disabled,
      })}
      href={{
        pathname: '/main/project/[projectId]/settings',
        query: { projectId, menu: value },
      }}
    >
      <MenuItem value={value} iconL={icon} disabled={disabled}>
        {label}
      </MenuItem>
    </Link>
  );
};
interface ChannelMenuItemProps {
  disabled?: boolean;
  label: string;
  icon: IconNameType;
  value: string;
  projectId: number;
  channelId: number;
}

const ChannelMenuItem = (props: ChannelMenuItemProps) => {
  const { disabled = false, label, icon, value, projectId, channelId } = props;
  return (
    <Link
      className={cn({
        'pointer-events-none': disabled,
      })}
      href={{
        pathname: '/main/project/[projectId]/settings',
        query: { projectId, menu: value, channelId },
      }}
    >
      <MenuDropdownItem
        value={`${value}_${channelId}`}
        iconL={icon}
        disabled={disabled}
      >
        {label}
      </MenuDropdownItem>
    </Link>
  );
};

export default SettingsMenu;
