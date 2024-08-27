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
import type { User } from '@/entities/user';
import { useUserSearch } from '@/entities/user';

import type { Member } from '../member.type';

interface IProps {
  members: Member[];
  onCreate: (user: User, role: Role) => void;
  project: ProjectInfo;
  roles: Role[];
  isOpen: boolean;
  close: () => void;
}

const CreateMemberDialog: React.FC<IProps> = (props) => {
  const { members, onCreate, project, roles, close, isOpen } = props;

  const { t } = useTranslation();

  const { data: userData } = useUserSearch({
    limit: 1000,
    query: { type: 'GENERAL' },
  });

  const [user, setUser] = useState<User>();
  const [role, setRole] = useState<Role>();

  return (
    <Dialog onOpenChange={close} open={isOpen} modal>
      <DialogContent>
        <DialogTitle>
          {t('main.setting.dialog.register-member.title')}
        </DialogTitle>
        <div className="my-8 flex flex-col gap-5">
          <SelectInput
            label="Email"
            placeholder={t('v2.placeholder.select')}
            onChange={(v) => {
              const newUser = userData?.items.find(
                (user) => String(user.id) === v,
              );
              setUser(newUser);
            }}
            options={
              userData?.items
                .filter(
                  (v) => !members.find((member) => member.user.id === v.id),
                )
                .map((v) => ({ label: v.email, value: `${v.id}` })) ?? []
            }
            required
          />
          <TextInput label="Project" value={project.name} disabled />
          <SelectInput
            label="Role"
            placeholder={t('v2.placeholder.select')}
            options={roles.map((v) => ({ label: v.name, value: `${v.id}` }))}
            onChange={(v) => {
              const newRole = roles.find((role) => String(role.id) === v);
              setRole(newRole);
            }}
            required
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('v2.button.cancel')}</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={() => {
              if (!user || !role) return;
              onCreate(user, role);
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

export default CreateMemberDialog;
