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

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { useThrottle } from 'react-use';

import type { FormOverlayProps } from '@/shared';
import { AsyncSelectSearchInput, FormDialog, TextInput } from '@/shared';
import { SelectInput } from '@/shared/ui/inputs';
import type { ProjectInfo } from '@/entities/project';
import type { Role } from '@/entities/role';
import { useUserSearch } from '@/entities/user';

import { memberInfoFormSchema } from '../member.schema';
import type { MemberInfo, MemberInfoForm } from '../member.type';

interface Props extends FormOverlayProps<MemberInfo> {
  members: MemberInfo[];
  project: ProjectInfo;
  roles: Role[];
}
const LIMIT = 20;

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
    disabledDelete: deleteDisabled = false,
    disabledUpdate: updateDisabled = false,
  } = props;

  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const [inputValue, setInputValue] = useState('');
  const throttledInputValue = useThrottle(inputValue, 1000);

  const { data: userData, isLoading } = useUserSearch({
    limit: LIMIT * page,
    page: 0,
    queries: [
      { key: 'type', value: ['GENERAL'], condition: 'IS' },
      { key: 'email', value: throttledInputValue, condition: 'CONTAINS' },
    ],
  });

  const { setValue, handleSubmit, formState, register, getValues, watch } =
    useForm<MemberInfoForm>({
      defaultValues: data,
      resolver: zodResolver(memberInfoFormSchema),
    });
  const user = watch('user');

  return (
    <FormDialog
      title={
        data ?
          t('v2.text.name.detail', { name: 'Member' })
        : t('v2.text.name.register', { name: 'Member' })
      }
      close={close}
      isOpen={isOpen}
      deleteBtn={{ disabled: deleteDisabled, onClick: onClickDelete }}
      submitBtn={{ disabled: updateDisabled, form: 'memberForm' }}
      formState={formState}
    >
      <form
        id="memberForm"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((value) => {
          const { role, user, createdAt, id } = value;
          if (!user || !role) return;
          onSubmit({ role, user, createdAt, id });
        })}
      >
        {!data && <TextInput label="Project" value={project.name} disabled />}
        <AsyncSelectSearchInput
          label="Email"
          value={user ? { label: user.email, value: user.email } : null}
          onChange={(value) => {
            const user = userData?.items.find(
              (user) => user.email === value?.value,
            );
            setValue('user', user, { shouldDirty: true });
          }}
          options={
            userData?.items
              .filter((v) => !members.some((member) => member.user.id === v.id))
              .map((v) => ({ label: v.email, value: v.email })) ?? []
          }
          error={formState.errors.user?.message}
          required
          disabled={!!data}
          fetchNextPage={() => setPage((prev) => prev + 1)}
          hasNextPage={
            (userData?.meta.itemCount ?? 0) < (userData?.meta.totalItems ?? 0)
          }
          isFetchingNextPage={isLoading}
          inputValue={inputValue}
          setInputValue={(v) => {
            setInputValue(v);
            setPage(1);
          }}
        />
        {data && <TextInput label="Name" disabled {...register('user.name')} />}
        {data && (
          <TextInput
            label="Department"
            {...register('user.department')}
            disabled
          />
        )}
        <SelectInput
          label="Role"
          placeholder={t('v2.placeholder.select')}
          value={getValues('role.id')?.toString()}
          options={roles.map((v) => ({ label: v.name, value: `${v.id}` }))}
          onChange={(v) => {
            const role = roles.find((role) => String(role.id) === v);
            if (!role) return;
            setValue('role', role, { shouldDirty: true });
          }}
          error={formState.errors.role?.message}
          required
        />
      </form>
    </FormDialog>
  );
};

export default MemberFormDialog;
