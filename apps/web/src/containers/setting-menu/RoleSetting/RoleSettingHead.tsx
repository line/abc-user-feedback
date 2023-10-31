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
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Icon,
  Input,
  Popover,
  PopoverContent,
  PopoverModalContent,
  PopoverTrigger,
} from '@ufb/ui';

import { usePermissions } from '@/hooks';

interface IProps {
  name: string;
  roleId: number;
  isEdit: boolean;
  projectId?: number;
  onChangeEditRole: (roleId?: number) => void;
  onChangeEditName: (name: string) => void;
  onSubmitEdit: () => void;
  onClickDelete: (roleId: number) => void;
}

const RoleSettingHead: React.FC<IProps> = ({
  name,
  roleId,
  isEdit,
  projectId,
  onChangeEditRole,
  onChangeEditName,
  onSubmitEdit,
  onClickDelete,
}) => {
  const { t } = useTranslation();
  const perms = usePermissions(projectId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasUpdateRolePerm = useMemo(
    () => !projectId || perms.includes('project_role_update'),
    [perms, projectId],
  );
  const hasDeleteRolePerm = useMemo(
    () => !projectId || perms.includes('project_role_delete'),
    [perms, projectId],
  );

  return (
    <>
      <div className="flex items-center justify-center gap-1">
        {isEdit ? (
          <Input
            size="sm"
            defaultValue={name}
            className="w-[100px]"
            onChange={(e) => onChangeEditName(e.target.value)}
          />
        ) : (
          <p className="text-center">{name}</p>
        )}
        {isEdit ? (
          <div className="flex gap-1">
            <button
              className="icon-btn icon-btn-xs icon-btn-tertiary"
              onClick={() => onChangeEditRole(undefined)}
            >
              <Icon name="Close" className="text-red-primary" />
            </button>
            <button
              className="icon-btn icon-btn-xs icon-btn-tertiary"
              onClick={onSubmitEdit}
            >
              <Icon name="Check" className="text-blue-primary" />
            </button>
          </div>
        ) : (
          <Popover placement="bottom-start">
            <PopoverTrigger className="icon-btn icon-btn-xs icon-btn-tertiary">
              <Icon name="Dots" className="rotate-90" />
            </PopoverTrigger>
            <PopoverContent>
              <ul className="w-[160px] p-1">
                <li
                  className={[
                    'mb-1 flex items-center gap-2 rounded p-2',
                    !hasUpdateRolePerm
                      ? 'text-tertiary cursor-not-allowed'
                      : 'hover:bg-fill-tertiary cursor-pointer',
                  ].join(' ')}
                  onClick={() => {
                    if (!hasUpdateRolePerm) return;
                    onChangeEditRole(roleId);
                    onChangeEditName(name);
                  }}
                >
                  <Icon name="EditFill" size={16} />
                  <span className="font-12-regular">
                    {t('main.setting.role-mgmt.edit-role')}
                  </span>
                </li>
                <li
                  className={[
                    'flex items-center gap-2 rounded p-2',
                    !hasDeleteRolePerm
                      ? 'text-tertiary cursor-not-allowed'
                      : 'hover:bg-fill-tertiary cursor-pointer',
                  ].join(' ')}
                  onClick={() => {
                    if (!hasDeleteRolePerm) return;
                    setDialogOpen(true);
                  }}
                >
                  <Icon name="TrashFill" size={16} />
                  <span className="font-12-regular">
                    {t('main.setting.role-mgmt.delete-role')}
                  </span>
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <Popover open={dialogOpen} onOpenChange={setDialogOpen} modal>
        <PopoverModalContent
          title={t('main.setting.dialog.delete-role.title')}
          description={t('main.setting.dialog.delete-role.description')}
          cancelText={t('button.cancel')}
          icon={{
            name: 'WarningCircleFill',
            className: 'text-red-primary',
            size: 56,
          }}
          submitButton={{
            children: t('button.delete'),
            className: 'bg-red-primary',
            onClick: () => onClickDelete(roleId),
          }}
        />
      </Popover>
    </>
  );
};

export default RoleSettingHead;
