/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import { useTranslation } from 'next-i18next';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Icon,
  Menu,
  MenuDropdown,
  MenuDropdownContent,
  MenuDropdownItem,
  MenuDropdownTrigger,
  MenuItem,
} from '@ufb/react';

import { cn, Path, useAllChannels, usePermissions } from '@/shared';
import { useRoutingChannelCreation } from '@/entities/channel/lib';

import type { SettingMenu as SettingMenuList } from '../setting-menu.type';

interface Props {
  settingMenuValue: SettingMenuList;
  channelId?: number | null;
  projectId: number;
}

const SettingsMenuList: React.FC<Props> = (props) => {
  const { settingMenuValue, projectId, channelId } = props;

  const { t } = useTranslation();
  const { isCreatingChannel, openChannelInProgress } =
    useRoutingChannelCreation(projectId);

  const router = useRouter();
  const menuValue =
    channelId ? `${settingMenuValue}_${channelId}` : settingMenuValue;

  const { data } = useAllChannels(projectId);
  const perms = usePermissions(projectId);

  const projectMenuItems: Omit<ProjectMenuItemProps, 'projectId'>[] = [
    {
      label: t('v2.project-setting-menu.project-info'),
      value: 'project',
    },
    {
      label: t('v2.project-setting-menu.member-mgmt'),
      disabled: !perms.includes('project_member_read'),
      value: 'member',
    },
    {
      label: t('v2.project-setting-menu.api-key-mgmt'),
      disabled: !perms.includes('project_apikey_read'),
      value: 'api-key',
    },
    {
      label: t('v2.project-setting-menu.issue-tracker-mgmt'),
      disabled: !perms.includes('project_tracker_read'),
      value: 'issue-tracker',
    },
    {
      label: t('v2.project-setting-menu.webhook-integration'),
      disabled: !perms.includes('project_webhook_read'),
      value: 'webhook',
    },
    {
      label: t('v2.project-setting-menu.generative-ai-setting'),
      disabled: !perms.includes('project_webhook_read'),
      value: 'generative-ai',
    },
  ];

  const channelMenuItems: Omit<ProjectMenuItemProps, 'projectId'>[] = [
    {
      label: t('v2.channel-setting-menu.channel-info'),
      value: 'channel-info',
    },
    {
      label: t('v2.channel-setting-menu.field-mgmt'),
      value: 'field-mgmt',
      disabled: !perms.includes('channel_field_read'),
    },
    {
      label: t('v2.channel-setting-menu.image-mgmt'),
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
      <Accordion
        type="single"
        iconAlign="left"
        collapsible
        border={false}
        defaultValue="channel-list"
      >
        <AccordionItem
          value="channel-list"
          className="bg-primary"
          divider={false}
        >
          <AccordionTrigger className="p-2">Channel List</AccordionTrigger>
          <AccordionContent className="p-0">
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
                <Button
                  className="w-full"
                  disabled={!perms.includes('channel_create')}
                  onClick={() =>
                    router.push({
                      pathname: Path.CREATE_CHANNEL,
                      query: { projectId },
                    })
                  }
                >
                  {isCreatingChannel ?
                    t('v2.text.continue')
                  : t('v2.text.create-channel')}
                </Button>
              </div>
            : data?.items.map(({ name, id }) => (
                <MenuDropdown key={id}>
                  <MenuDropdownTrigger
                    className={cn('!pl-8', {
                      '!bg-neutral-tertiary': channelId === id,
                    })}
                  >
                    {name}
                  </MenuDropdownTrigger>
                  <MenuDropdownContent
                    side="right"
                    align="start"
                    className="overflow-auto"
                  >
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
          className="!text-tint-blue hover:!text-tint-blue"
          onClick={openChannelInProgress}
          disabled={!perms.includes('channel_create')}
        >
          <Icon name="RiAddCircleFill" />
          <div className="flex w-full">
            <span className="flex-1">{t('v2.text.create-channel')}</span>
            {isCreatingChannel && (
              <Badge color="red" variant="bold">
                {t('v2.text.in-progress')}
              </Badge>
            )}
          </div>
        </MenuItem>
      )}
    </Menu>
  );
};

interface ProjectMenuItemProps {
  disabled?: boolean;
  label: string;
  value: string;
  projectId: number;
}

const ProjectMenuItem = (props: ProjectMenuItemProps) => {
  const { disabled = false, label, value, projectId } = props;
  return (
    <Link
      className={cn({ 'pointer-events-none': disabled })}
      href={{
        pathname: '/main/project/[projectId]/settings',
        query: { projectId, menu: value },
      }}
    >
      <MenuItem value={value} disabled={disabled}>
        {label}
      </MenuItem>
    </Link>
  );
};
interface ChannelMenuItemProps {
  disabled?: boolean;
  label: string;
  value: string;
  projectId: number;
  channelId: number;
}

const ChannelMenuItem = (props: ChannelMenuItemProps) => {
  const { disabled = false, label, value, projectId, channelId } = props;
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
      <MenuDropdownItem value={`${value}_${channelId}`} disabled={disabled}>
        {label}
      </MenuDropdownItem>
    </Link>
  );
};

export default SettingsMenuList;
