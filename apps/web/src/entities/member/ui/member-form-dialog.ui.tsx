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

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@ufb/react';

import type { FormOverlayProps } from '@/shared';
import { SelectSearchInput, TextInput } from '@/shared';
import { SelectInput } from '@/shared/ui/inputs';
import type { ProjectInfo } from '@/entities/project';
import type { Role } from '@/entities/role';
import { useUserSearch } from '@/entities/user';

import type { Member, MemberInfo } from '../member.type';

interface Props extends FormOverlayProps<MemberInfo> {
  members: Member[];
  project: ProjectInfo;
  roles: Role[];
}

const MemberFormDialog: React.FC<Props> = (props) => {
  const {
    project,
    roles,
    close,
    isOpen,
    data,
    onSubmit,
    onClickDelete,
    members,
  } = props;

  const { t } = useTranslation();

  const { data: userData } = useUserSearch({
    limit: 1000,
    query: { type: 'GENERAL' },
  });

  const [user, setUser] = useState<Member['user'] | undefined>(data?.user);
  const [role, setRole] = useState<Member['role'] | undefined>(data?.role);

  return (
    <Dialog onOpenChange={close} open={isOpen} modal>
      <DialogContent>
        <DialogTitle>
          {data ?
            t('v2.text.name.detail', { name: 'Member' })
          : t('v2.text.name.register', { name: 'Member' })}
        </DialogTitle>
        <div className="flex flex-col gap-3">
          <TextInput label="Project" value={project.name} disabled />
          <SelectSearchInput
            label="Email"
            value={user?.email}
            onChange={(v) => {
              setUser(userData?.items.find((user) => user.email === v));
            }}
            options={
              userData?.items
                .filter(
                  (v) => !members.some((member) => member.user.id === v.id),
                )
                .map((v) => ({ label: v.email, value: v.email })) ?? []
            }
            required
          />
          <SelectInput
            label="Role"
            placeholder={t('v2.placeholder.select')}
            value={role ? String(role.id) : undefined}
            options={roles.map((v) => ({ label: v.name, value: `${v.id}` }))}
            onChange={(v) => {
              setRole(roles.find((role) => String(role.id) === v));
            }}
            required
          />
        </div>
        <DialogFooter>
          {data?.id && onClickDelete && (
            <div className="flex-1">
              <Button
                variant="destructive"
                onClick={async () => {
                  await onClickDelete();
                  close();
                }}
              >
                {t('v2.button.delete')}
              </Button>
            </div>
          )}
          <DialogClose asChild>
            <Button variant="outline">{t('v2.button.cancel')}</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={async () => {
              if (!user || !role) return;
              await onSubmit({ user, role });
              close();
            }}
          >
            {t('v2.button.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemberFormDialog;
