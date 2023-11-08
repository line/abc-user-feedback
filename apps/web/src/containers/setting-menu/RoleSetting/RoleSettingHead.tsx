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
import React, { useCallback, useMemo, useState } from 'react';
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
import type { RoleType } from '@/types/role.type';

interface IProps {
  role: RoleType;
  roles: RoleType[];
  isEdit: boolean;
  projectId?: number;
  onChangeEditRole: (roleId?: number) => void;
  onChangeEditName: (name: string) => void;
  onSubmitEdit: () => void;
  onClickDelete: (roleId: number) => void;
  onClickUpdate: (role: RoleType) => void;
  viewOnly?: boolean;
}

const RoleSettingHead: React.FC<IProps> = ({
  role,
  roles,
  isEdit,
  projectId,
  onChangeEditRole,
  onChangeEditName,
  onSubmitEdit,
  onClickDelete,
  onClickUpdate,
  viewOnly,
}) => {
  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [updatePopupOpen, setUpdatePopupOpen] = useState(false);

  const hasUpdateRolePerm = useMemo(
    () => !projectId || perms.includes('project_role_update'),
    [perms, projectId],
  );

  const hasDeleteRolePerm = useMemo(
    () => !projectId || perms.includes('project_role_delete'),
    [perms, projectId],
  );

  if (viewOnly) return <p className="text-center">{role.name}</p>;

  return (
    <>
      <div className="flex items-center justify-center gap-1">
        <p className="text-center">{role.name}</p>
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
                    onChangeEditRole(role.id);
                    onChangeEditName(role.name);
                  }}
                >
                  <Icon name="EditFill" size={16} />
                  <span className="font-12-regular">
                    {t('main.setting.role-mgmt.edit-role')}
                  </span>
                </li>
                <li
                  className={[
                    'mb-1 flex items-center gap-2 rounded p-2',
                    !hasUpdateRolePerm
                      ? 'text-tertiary cursor-not-allowed'
                      : 'hover:bg-fill-tertiary cursor-pointer',
                  ].join(' ')}
                  onClick={() => {
                    if (!hasUpdateRolePerm) return;
                    setUpdatePopupOpen(true);
                  }}
                >
                  <Icon name="DriverRegisterFill" size={16} />
                  <span className="font-12-regular">Role 이름 수정</span>
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
                    setDeletePopupOpen(true);
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
      <DeleteRolePopup
        open={deletePopupOpen}
        onOpenChange={setDeletePopupOpen}
        onClickDelete={() => onClickDelete(role.id)}
      />
      <UpdateRoleNamePopup
        open={updatePopupOpen}
        onOpenChange={setUpdatePopupOpen}
        onClickUpdate={onClickUpdate}
        role={role}
        roles={roles}
      />
    </>
  );
};

interface IDeleteRolePopupProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClickDelete: () => void;
}

const DeleteRolePopup: React.FC<IDeleteRolePopupProps> = ({
  open,
  onOpenChange,
  onClickDelete,
}) => {
  const { t } = useTranslation();
  return (
    <Popover open={open} onOpenChange={onOpenChange} modal>
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
          onClick: () => {
            onClickDelete();
            onOpenChange(false);
          },
        }}
      />
    </Popover>
  );
};

interface IUpdateRoleNamePopupProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClickUpdate: (newRole: RoleType) => void;
  role: RoleType;
  roles: RoleType[];
}
const defaultInputError = { roleName: '' };

const UpdateRoleNamePopup: React.FC<IUpdateRoleNamePopupProps> = ({
  open,
  onOpenChange,
  role,
  roles,
  onClickUpdate,
}) => {
  const [currentRoleName, setCurrentRoleName] = useState(role.name);

  const [inputError, setInputError] = useState(defaultInputError);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetError = useCallback(() => {
    setInputError(defaultInputError);
    setIsSubmitted(false);
  }, [defaultInputError]);

  return (
    <Popover open={open} onOpenChange={onOpenChange} modal>
      <PopoverModalContent
        cancelText="취소"
        submitButton={{
          children: '확인',
          onClick: () => {
            if (currentRoleName.length === 0) {
              setInputError({ roleName: '최소 1자 이상 입력해야합니다.' });
              setIsSubmitted(true);
              return;
            }
            if (
              roles
                .filter((v) => v.id !== role.id)
                .find((v) => v.name === currentRoleName)
            ) {
              setInputError({ roleName: '이미 존재하는 이름입니다.' });
              setIsSubmitted(true);
              return;
            }
            onClickUpdate({ ...role, name: currentRoleName });
            onOpenChange(false);
          },
        }}
        title="Role 생성"
        description="신규 Role의 명칭을 입력해주세요."
        icon={{
          name: 'ShieldPrivacyFill',
          size: 56,
          className: 'text-blue-primary',
        }}
      >
        <Input
          label="Role Name"
          placeholder="입력"
          value={currentRoleName}
          onChange={(e) => {
            resetError();
            setCurrentRoleName(e.target.value);
          }}
          isSubmitted={isSubmitted}
          isValid={!inputError.roleName}
          hint={inputError.roleName}
          maxLength={20}
        />
      </PopoverModalContent>
    </Popover>
  );
};

export default RoleSettingHead;
