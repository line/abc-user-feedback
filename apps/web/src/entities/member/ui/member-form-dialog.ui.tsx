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

import { TextInput } from '@/shared';
import { SelectInput } from '@/shared/ui/inputs';
import type { ProjectInfo } from '@/entities/project';
import type { Role } from '@/entities/role';
import { useUserSearch } from '@/entities/user';

import type { Member, MemberInfo } from '../member.type';

interface IProps {
  project: ProjectInfo;

  onSubmit: (member: MemberInfo) => Promise<void>;

  member?: Member;
  onDelete?: (memberId: number) => Promise<void>;

  roles: Role[];
  isOpen: boolean;
  close: () => void;
}

const MemberFormDialog: React.FC<IProps> = (props) => {
  const { project, roles, close, isOpen, member, onDelete, onSubmit } = props;

  const { t } = useTranslation();

  const { data: userData } = useUserSearch({
    limit: 1000,
    query: { type: 'GENERAL' },
  });

  const [user, setUser] = useState<Member['user'] | undefined>(member?.user);
  const [role, setRole] = useState<Member['role'] | undefined>(member?.role);

  return (
    <Dialog onOpenChange={close} open={isOpen} modal>
      <DialogContent>
        <DialogTitle>
          {member ?
            t('v2.text.name.detail', { name: 'Member' })
          : t('v2.text.name.register', { name: 'Member' })}
        </DialogTitle>
        <div className="my-8 flex flex-col gap-5">
          <SelectInput
            label="Email"
            placeholder={t('v2.placeholder.select')}
            value={String(user?.id)}
            onChange={(v) => {
              const newUser = userData?.items.find(
                (user) => String(user.id) === v,
              );
              setUser(newUser);
            }}
            options={
              userData?.items.map((v) => ({
                label: v.email,
                value: `${v.id}`,
              })) ?? []
            }
            required
          />
          <TextInput label="Project" value={project.name} disabled />
          <SelectInput
            label="Role"
            placeholder={t('v2.placeholder.select')}
            value={String(role?.id)}
            options={roles.map((v) => ({ label: v.name, value: `${v.id}` }))}
            onChange={(v) => {
              const newRole = roles.find((role) => String(role.id) === v);
              setRole(newRole);
            }}
            required
          />
        </div>
        <DialogFooter>
          {member && onDelete && (
            <div className="flex-1">
              <Button
                variant="destructive"
                onClick={async () => {
                  await onDelete(member.id);
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
