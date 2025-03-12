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
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';

import type { IconNameType } from '@ufb/react';
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

import {
  cn,
  CreatingDialog,
  Path,
  useAllChannels,
  usePermissions,
} from '@/shared';
import { useCreateChannelStore } from '@/features/create-channel/create-channel-model';

import type { SettingMenu as SettingMenuList } from '../setting-menu.type';

interface Props {
  settingMenuValue: SettingMenuList;
  channelId?: number | null;
  projectId: number;
}

const SettingsMenuList: React.FC<Props> = (props) => {
  const { settingMenuValue, projectId, channelId } = props;

  const { t } = useTranslation();
  const { editingStepIndex, reset, jumpStepByIndex } = useCreateChannelStore();

  const router = useRouter();
  const overlay = useOverlay();
  const menuValue =
    channelId ? `${settingMenuValue}_${channelId}` : settingMenuValue;

  const { data } = useAllChannels(projectId);
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

  const openChannelInProgress = async () => {
    if (editingStepIndex !== null) {
      await new Promise<boolean>((resolve) =>
        overlay.open(({ close, isOpen }) => (
          <CreatingDialog
            isOpen={isOpen}
            close={close}
            type="Channel"
            onRestart={() => {
              reset();
              resolve(true);
            }}
            onContinue={() => {
              jumpStepByIndex(editingStepIndex);
              resolve(true);
            }}
          />
        )),
      );
    }
    await router.push({ pathname: Path.CREATE_CHANNEL, query: { projectId } });
  };

  const isCreatingChannel = editingStepIndex !== null;

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
        divider={false}
        defaultValue="channel-list"
      >
        <AccordionItem value="channel-list" className="bg-primary">
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
  icon: IconNameType;
  value: string;
  projectId: number;
}

const ProjectMenuItem = (props: ProjectMenuItemProps) => {
  const { disabled = false, label, icon, value, projectId } = props;
  return (
    <Link
      className={cn({ 'pointer-events-none': disabled })}
      href={{
        pathname: '/main/project/[projectId]/settings',
        query: { projectId, menu: value },
      }}
    >
      <MenuItem value={value} disabled={disabled}>
        <Icon name={icon} />
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
      <MenuDropdownItem value={`${value}_${channelId}`} disabled={disabled}>
        <Icon name={icon} />
        {label}
      </MenuDropdownItem>
    </Link>
  );
};

export default SettingsMenuList;
