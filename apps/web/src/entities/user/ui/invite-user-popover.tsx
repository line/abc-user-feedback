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
import { z } from 'zod';

import type { FormOverlayProps } from '@/shared';
import { FormDialog, SelectBox, TextInput, useOAIQuery } from '@/shared';
import type { UserTypeEnum } from '@/entities/user';

interface IForm {
  email: string;
  type: UserTypeEnum;
  projectId?: number;
  roleId?: number;
}

const scheme: Zod.ZodType<IForm> = z.object({
  email: z.string().email(),
  type: z.union([z.literal('SUPER'), z.literal('GENERAL')]),
  projectId: z.number().optional(),
  roleId: z.number().optional(),
});

const defaultValues: IForm = {
  email: '',
  type: 'GENERAL',
};

interface IProps extends FormOverlayProps<IForm> {}

const InviteUserPopover: React.FC<IProps> = (props) => {
  const { close, isOpen, onSubmit } = props;
  const { t } = useTranslation();
  const { register, watch, setValue, handleSubmit, formState } = useForm<IForm>(
    { resolver: zodResolver(scheme), defaultValues },
  );
  const { projectId, type, roleId } = watch();

  const { data: projectData } = useOAIQuery({ path: '/api/admin/projects' });

  const { data: roleData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/roles',
    variables: { projectId: projectId ?? 0 },
    queryOptions: {
      enabled: !!projectId && type === 'GENERAL',
    },
  });

  return (
    <FormDialog
      isOpen={isOpen}
      close={close}
      title={t('main.setting.dialog.invite-user.title')}
      submitBtn={{
        form: 'inviteUser',
        disabled: formState.isSubmitting || !formState.isValid,
      }}
    >
      <form
        className="flex flex-col gap-5"
        id="inviteUser"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          type="email"
          label="Email"
          placeholder={t('input.placeholder.email')}
          error={formState.errors.email?.message}
          {...register('email')}
          required
        />
        <SelectBox
          label="Type"
          onChange={(v) =>
            v?.value && setValue('type', v.value as UserTypeEnum)
          }
          options={[
            { label: 'SUPER', value: 'SUPER' },
            { label: 'GENERAL', value: 'GENERAL' },
          ]}
          defaultValue={{ label: type, value: type }}
          required
        />
        {type === 'GENERAL' && (
          <>
            <SelectBox
              label="Project"
              options={projectData?.items ?? []}
              onChange={(v) => setValue('projectId', v?.id)}
              getOptionValue={(option) => String(option.id)}
              getOptionLabel={(option) => option.name}
              isClearable
            />
            {projectId && (
              <SelectBox
                label="Role"
                required
                options={roleData?.roles ?? []}
                onChange={(v) => setValue('roleId', v?.id)}
                value={
                  roleData?.roles.find((role) => role.id === roleId) ?? null
                }
                getOptionValue={(option) => String(option.id)}
                getOptionLabel={(option) => option.name}
              />
            )}
          </>
        )}
      </form>
    </FormDialog>
  );
};

export default InviteUserPopover;
