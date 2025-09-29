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

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { FormOverlayProps } from '@/shared';
import {
  FormDialog,
  SelectInput,
  TextInput,
  useAllProjects,
  useOAIQuery,
} from '@/shared';
import type { UserTypeEnum } from '@/entities/user';

const scheme = z
  .object({
    email: z.email(),
    type: z.literal('SUPER').or(z.literal('GENERAL')),
    projectId: z.number(),
    roleId: z.number(),
  })
  .or(
    z.object({
      email: z.email(),
      type: z.literal('GENERAL'),
      projectId: z.number(),
      roleId: z.number(),
    }),
  );

type InvitationForm = z.infer<typeof scheme>;

const defaultValues: InvitationForm = {
  email: '',
  type: 'GENERAL',
  projectId: 0,
  roleId: 0,
};

interface IProps extends FormOverlayProps<InvitationForm> {}

const InviteUserDialog: React.FC<IProps> = (props) => {
  const { close, isOpen, onSubmit, disabledUpdate: updateDisabled } = props;
  const { t } = useTranslation();
  const { register, watch, setValue, handleSubmit, formState } =
    useForm<InvitationForm>({ resolver: zodResolver(scheme), defaultValues });

  const { type, projectId, roleId } = watch();

  const { data: projectData } = useAllProjects();

  const { data: roleData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/roles',
    variables: { projectId },
    queryOptions: { enabled: !!projectId && type === 'GENERAL' },
  });

  return (
    <FormDialog
      isOpen={isOpen}
      close={close}
      title={t('main.setting.dialog.invite-user.title')}
      submitBtn={{
        form: 'inviteUser',
        disabled: updateDisabled,
        text: t('v2.button.confirm'),
      }}
      formState={formState}
    >
      <form
        id="inviteUser"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          type="email"
          label="Email"
          placeholder={t('v2.placeholder.text')}
          error={formState.errors.email?.message}
          {...register('email')}
          required
        />
        <SelectInput
          label="Type"
          value={type}
          options={[
            { label: 'SUPER', value: 'SUPER' },
            { label: 'GENERAL', value: 'GENERAL' },
          ]}
          onChange={(v) => {
            setValue('type', v as UserTypeEnum, { shouldDirty: true });
            if (type === 'SUPER') {
              setValue('projectId', 0);
              setValue('roleId', 0);
            }
          }}
          required
        />
        {type === 'GENERAL' && (
          <>
            <SelectInput
              label="Project"
              placeholder={t('v2.placeholder.select')}
              options={(projectData?.items ?? []).map(({ id, name }) => ({
                label: name,
                value: id.toString(),
              }))}
              onChange={(v) => {
                setValue('projectId', Number(v), { shouldDirty: true });
                setValue('roleId', 0, { shouldDirty: true });
              }}
              value={projectId === 0 ? '' : projectId.toString()}
              error={formState.errors.projectId?.message}
              required
            />
            {projectId > 0 && (
              <SelectInput
                label="Role"
                placeholder={t('v2.placeholder.select')}
                options={(roleData?.roles ?? []).map(({ id, name }) => ({
                  label: name,
                  value: id.toString(),
                }))}
                onChange={(v) =>
                  setValue('roleId', Number(v), { shouldDirty: true })
                }
                value={roleId === 0 ? '' : roleId.toString()}
                error={formState.errors.roleId?.message}
                required
              />
            )}
          </>
        )}
      </form>
    </FormDialog>
  );
};

export default InviteUserDialog;
