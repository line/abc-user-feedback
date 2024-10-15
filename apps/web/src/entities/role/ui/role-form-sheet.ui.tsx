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
import { zodResolver } from '@hookform/resolvers/zod';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@ufb/react';

import type { FormOverlayProps } from '@/shared';
import { DeleteDialog, TextInput } from '@/shared';

import type { PermissionType } from '../permission.type';
import {
  ChannelFieldPermissionList,
  ChannelImageSettingPermissionList,
  ChannelInfoPermissionList,
  ChannelPermissionText,
  FeedbackPermissionList,
  FeedbackPermissionText,
  IssuePermissionList,
  IssuePermissionText,
  PermissionList,
  ProjectApiKeyPermissionList,
  ProjectInfoPermissionList,
  ProjectMemberPermissionList,
  ProjectPermissionText,
  ProjectRolePermissionList,
  ProjectTrackerPermissionList,
  ProjectWebhookPermissionList,
} from '../permission.type';
import { roleInfoSchema } from '../role.schema';
import type { RoleInfo } from '../role.type';

interface Props extends FormOverlayProps<RoleInfo> {}

const RoleFormSheet: React.FC<Props> = (props) => {
  const { close, isOpen, data, onSubmit, onClickDelete } = props;

  const overlay = useOverlay();

  const { t } = useTranslation();
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState,
  } = useForm<RoleInfo>({
    resolver: zodResolver(roleInfoSchema),
    defaultValues: { name: '', permissions: [] },
  });
  console.log('formState: ', formState.errors);
  const permissions = watch('permissions');

  useEffect(() => {
    reset(data);
  }, [data]);

  const checkPermission = (checked: boolean, perm: PermissionType) => {
    const permssions = getValues('permissions');
    setValue(
      'permissions',
      checked ? [...permssions, perm] : permssions.filter((v) => v !== perm),
    );
    if (
      checked &&
      (perm.includes('create') ||
        perm.includes('update') ||
        perm.includes('delete'))
    ) {
      const permPrefix = perm.split('_').slice(0, -1).join('_');

      const relatedPerms = PermissionList.filter((v) => {
        const vPrefix = v.split('_').slice(0, -1).join('_');
        return (
          vPrefix === permPrefix &&
          v.includes('read') &&
          !v.includes('download')
        );
      });
      relatedPerms.forEach((perm) => {
        setValue(
          'permissions',
          permssions.includes(perm) ? permssions : [...permssions, perm],
        );
      });
    }
    if (!checked && perm.includes('read') && !perm.includes('download')) {
      const permprefix = perm.split('_').slice(0, -1).join('_');

      const relatedPerms = PermissionList.filter((v) => {
        const vPrefix = v.split('_').slice(0, -1).join('_');

        return (
          vPrefix === permprefix &&
          (v.includes('create') || v.includes('update') || v.includes('delete'))
        );
      });

      relatedPerms.forEach((perm) => {
        setValue(
          'permissions',
          permssions.includes(perm) ?
            permssions.filter((v) => v !== perm)
          : permssions,
        );
      });
    }
  };
  const openDeleteDialog = () => {
    overlay.open(({ close: dialogClose, isOpen }) => (
      <DeleteDialog
        close={dialogClose}
        isOpen={isOpen}
        onClickDelete={async () => {
          await onClickDelete?.();
          dialogClose();
          close();
        }}
      />
    ));
  };

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {data ?
              t('v2.text.name.detail', { name: 'Role' })
            : t('v2.text.name.add', { name: 'Role' })}
          </SheetTitle>
        </SheetHeader>
        <SheetBody>
          <form
            className="flex flex-col"
            onSubmit={handleSubmit((role) => onSubmit(role))}
            id="role"
          >
            <TextInput
              label="Name"
              required
              {...register('name')}
              error={formState.errors.name?.message}
            />
            <Accordion type="multiple" iconAlign="left">
              <PermissionRows
                title="Feedback"
                permmissionsText={FeedbackPermissionText}
                permissions={FeedbackPermissionList}
                currentPermissions={permissions}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Issue"
                permmissionsText={IssuePermissionText}
                permissions={IssuePermissionList}
                currentPermissions={permissions}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Project Info"
                permmissionsText={ProjectPermissionText}
                permissions={ProjectInfoPermissionList}
                currentPermissions={permissions}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Member"
                permmissionsText={ProjectPermissionText}
                permissions={ProjectMemberPermissionList}
                currentPermissions={permissions}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Role"
                permmissionsText={ProjectPermissionText}
                permissions={ProjectRolePermissionList}
                currentPermissions={permissions}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Api Key"
                permmissionsText={ProjectPermissionText}
                permissions={ProjectApiKeyPermissionList}
                currentPermissions={permissions}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Issue Tracker"
                permmissionsText={ProjectPermissionText}
                permissions={ProjectTrackerPermissionList}
                currentPermissions={permissions}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Webhook"
                permmissionsText={ProjectPermissionText}
                permissions={ProjectWebhookPermissionList}
                currentPermissions={permissions}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Channel Info"
                permmissionsText={ChannelPermissionText}
                permissions={ChannelInfoPermissionList}
                currentPermissions={permissions}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Channel Field"
                permmissionsText={ChannelPermissionText}
                permissions={ChannelFieldPermissionList}
                currentPermissions={permissions}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Channel Image Setting"
                permmissionsText={ChannelPermissionText}
                permissions={ChannelImageSettingPermissionList}
                currentPermissions={permissions}
                onChckedChange={checkPermission}
              />
            </Accordion>
          </form>
        </SheetBody>
        <SheetFooter>
          {data && onClickDelete && (
            <div className="flex-1">
              <Button variant="destructive" onClick={openDeleteDialog}>
                {t('v2.button.delete')}
              </Button>
            </div>
          )}
          <SheetClose asChild>
            <Button variant="outline">{t('v2.button.cancel')}</Button>
          </SheetClose>
          <Button
            type="submit"
            className="min-w-[84px]"
            form="role"
            disabled={!formState.isValid}
          >
            {t('v2.button.save')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

interface IPermissionRowsProps<T extends PermissionType> {
  title: string;
  currentPermissions: PermissionType[];
  onChckedChange: (checked: boolean, permission: T) => void;
  permissions: readonly T[];
  permmissionsText: Record<T, string>;
}

const PermissionRows = <T extends PermissionType>(
  props: IPermissionRowsProps<T>,
) => {
  const {
    permmissionsText,
    permissions,
    title,
    currentPermissions,
    onChckedChange,
  } = props;

  return (
    <AccordionItem value={title}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent className="py-0">
        <div className="flex flex-col">
          {permissions.map((perm) => (
            <Checkbox
              key={perm}
              className="h-9 w-full text-base"
              checked={currentPermissions.includes(perm)}
              onCheckedChange={(checked) => onChckedChange(!!checked, perm)}
            >
              {permmissionsText[perm]}
            </Checkbox>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default RoleFormSheet;
