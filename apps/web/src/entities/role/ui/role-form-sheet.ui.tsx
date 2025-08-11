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
import { useEffect, useMemo } from 'react';
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
  ChannelPermissionText,
  FeedbackPermissionList,
  FeedbackPermissionText,
  IssuePermissionList,
  IssuePermissionText,
  PermissionList,
  ProjectApiKeyPermissionList,
  ProjectGenerativeAIPermissionList,
  ProjectInfoPermissionList,
  ProjectMemberPermissionList,
  ProjectPermissionText,
  ProjectRolePermissionList,
  ProjectTrackerPermissionList,
  ProjectWebhookPermissionList,
} from '../permission.type';
import { roleInfoSchema } from '../role.schema';
import type { RoleInfo } from '../role.type';

interface Props extends FormOverlayProps<RoleInfo> {
  rows: RoleInfo[];
}

const RoleFormSheet: React.FC<Props> = (props) => {
  const {
    close,
    isOpen,
    data,
    onSubmit: onSave,
    onClickDelete,
    rows,
    disabledDelete: deleteDisabled,
    disabledUpdate: updateDisabled,
  } = props;

  const overlay = useOverlay();

  const { t } = useTranslation();
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState,
    setError,
  } = useForm<RoleInfo>({
    resolver: zodResolver(roleInfoSchema),
    defaultValues: { name: '', permissions: [] },
  });

  const currentPerms = watch('permissions');

  const otherRoles = useMemo(
    () => rows.filter((v) => v.name !== data?.name),
    [data, rows],
  );

  useEffect(() => {
    reset(data);
  }, [data]);

  const checkPermission = (checked: boolean, targetPerm: PermissionType) => {
    const current = new Set(currentPerms);
    if (checked) current.add(targetPerm);
    else current.delete(targetPerm);

    if (
      checked &&
      (targetPerm.includes('create') ||
        targetPerm.includes('update') ||
        targetPerm.includes('delete'))
    ) {
      const permPrefix = targetPerm.split('_').slice(0, -1).join('_');

      const relatedPerms = PermissionList.filter((v) => {
        const vPrefix = v.split('_').slice(0, -1).join('_');
        return (
          vPrefix === permPrefix &&
          v.includes('read') &&
          !v.includes('download')
        );
      });
      relatedPerms.forEach((relatedPerm) => {
        current.add(relatedPerm);
      });
    }
    if (
      !checked &&
      targetPerm.includes('read') &&
      !targetPerm.includes('download')
    ) {
      const permprefix = targetPerm.split('_').slice(0, -1).join('_');

      const relatedPerms = PermissionList.filter((v) => {
        const vPrefix = v.split('_').slice(0, -1).join('_');

        return (
          vPrefix === permprefix &&
          (v.includes('create') || v.includes('update') || v.includes('delete'))
        );
      });

      relatedPerms.forEach((relatedPerm) => {
        current.delete(relatedPerm);
      });
    }
    setValue(
      'permissions',
      Array.from(current.values()).filter((v) => PermissionList.includes(v)),
      { shouldDirty: true },
    );
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

  const onSubmit = async (input: RoleInfo) => {
    const checkDuplicatedKey = otherRoles.find((v) => v.name === input.name);
    if (checkDuplicatedKey) {
      setError('name', { message: 'Name is duplicated' });
      return;
    }
    await onSave({ ...data, ...input });
    reset({ name: '', permissions: [] });
    close();
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
            className="flex flex-col gap-4"
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
                currentPermissions={currentPerms}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Issue"
                permmissionsText={IssuePermissionText}
                permissions={IssuePermissionList}
                currentPermissions={currentPerms}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Project Info"
                permmissionsText={ProjectPermissionText}
                permissions={ProjectInfoPermissionList}
                currentPermissions={currentPerms}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Member"
                permmissionsText={ProjectPermissionText}
                permissions={ProjectMemberPermissionList}
                currentPermissions={currentPerms}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Role"
                permmissionsText={ProjectPermissionText}
                permissions={ProjectRolePermissionList}
                currentPermissions={currentPerms}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Api Key"
                permmissionsText={ProjectPermissionText}
                permissions={ProjectApiKeyPermissionList}
                currentPermissions={currentPerms}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Issue Tracker"
                permmissionsText={ProjectPermissionText}
                permissions={ProjectTrackerPermissionList}
                currentPermissions={currentPerms}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Webhook"
                permmissionsText={ProjectPermissionText}
                permissions={ProjectWebhookPermissionList}
                currentPermissions={currentPerms}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Generative AI"
                permmissionsText={ProjectPermissionText}
                permissions={ProjectGenerativeAIPermissionList}
                currentPermissions={currentPerms}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Channel Info"
                permmissionsText={ChannelPermissionText}
                permissions={['channel_update', 'channel_delete']}
                currentPermissions={currentPerms}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Field"
                permmissionsText={ChannelPermissionText}
                permissions={ChannelFieldPermissionList}
                currentPermissions={currentPerms}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Image Setting"
                permmissionsText={ChannelPermissionText}
                permissions={ChannelImageSettingPermissionList}
                currentPermissions={currentPerms}
                onChckedChange={checkPermission}
              />
              <PermissionRows
                title="Create Channel"
                permmissionsText={ChannelPermissionText}
                permissions={['channel_create']}
                currentPermissions={currentPerms}
                onChckedChange={checkPermission}
              />
            </Accordion>
          </form>
        </SheetBody>
        <SheetFooter>
          {data && onClickDelete && (
            <div className="flex-1">
              <Button
                variant="destructive"
                onClick={openDeleteDialog}
                disabled={deleteDisabled}
              >
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
            disabled={!formState.isDirty || updateDisabled}
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
    <AccordionItem value={title} divider={false}>
      <AccordionTrigger className="h-9 py-0">{title}</AccordionTrigger>
      <AccordionContent className="py-0">
        <div className="flex flex-col">
          {permissions.map((perm) => (
            <Checkbox
              key={perm}
              className="h-9 w-full"
              checked={currentPermissions.includes(perm)}
              onCheckedChange={(checked) => onChckedChange(!!checked, perm)}
              size="small"
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
