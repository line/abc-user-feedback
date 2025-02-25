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

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormOverlayProps } from '@/shared';
import { FormDialog, SelectSearchInput, TextInput } from '@/shared';
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

  const { data: userData } = useUserSearch({
    limit: 500,
    queries: [{ type: ['GENERAL'], condition: 'IS' }] as Record<
      string,
      unknown
    >[],
  });

  const { setValue, handleSubmit, formState, register, getValues, watch } =
    useForm<MemberInfoForm>({
      defaultValues: data,
      resolver: zodResolver(memberInfoFormSchema),
    });

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
          if (!user) return;
          onSubmit({ role, user, createdAt, id });
        })}
      >
        {!data && <TextInput label="Project" value={project.name} disabled />}
        <SelectSearchInput
          label="Email"
          value={watch('user')?.email}
          onChange={(value) => {
            const user = userData?.items.find((user) => user.email === value);
            setValue('user', user, { shouldDirty: true, shouldValidate: true });
          }}
          options={
            userData?.items
              .filter((v) => !members.some((member) => member.user.id === v.id))
              .map((v) => ({ label: v.email, value: v.email })) ?? []
          }
          error={formState.errors.user?.message}
          required
          disabled={!!data}
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
          value={(getValues('role.id') as number | undefined)?.toString()}
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
