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

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  Icon,
  Popover,
  PopoverModalContent,
  PopoverTrigger,
  TextInput,
  toast,
} from '@ufb/ui';

import { SelectBox, useOAIMutation, useOAIQuery } from '@/shared';
import type { UserTypeEnum } from '@/entities/user';

interface IProps {}

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

const UserInvitationDialog: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { register, watch, setValue, reset, handleSubmit, formState } =
    useForm<IForm>({ resolver: zodResolver(scheme), defaultValues });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    reset(defaultValues);
  }, [open]);

  useEffect(() => {
    if (watch('type') !== 'SUPER') return;
    reset({ projectId: undefined, roleId: undefined }, { keepValues: true });
  }, [watch('type')]);

  useEffect(() => {
    reset({ roleId: undefined }, { keepValues: true });
  }, [watch('projectId')]);

  const { data: projectData } = useOAIQuery({ path: '/api/admin/projects' });

  const { data: roleData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/roles',
    variables: { projectId: watch('projectId')! },
    queryOptions: {
      enabled: !!watch('projectId') && watch('type') === 'GENERAL',
    },
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/users/invite',
    queryOptions: {
      async onSuccess() {
        toast.positive({ title: t('toast.invite'), iconName: 'MailFill' });
        setOpen(false);
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="btn btn-primary" onClick={() => setOpen(true)}>
        <Icon name="MailStroke" size={20} className="mr-2" />
        {t('main.setting.dialog.invite-user.title')}
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.invite-user.title')}
        cancelButton={{ children: t('button.cancel') }}
        submitButton={{
          children: t('button.confirm'),
          type: 'submit',
          form: 'inviteUser',
          disabled: isPending,
        }}
      >
        <form
          className="flex flex-col gap-5"
          id="inviteUser"
          onSubmit={handleSubmit(({ email, roleId, type }) => {
            if (type === 'SUPER') mutate({ email, userType: type });
            if (type === 'GENERAL') mutate({ email, roleId, userType: type });
          })}
        >
          <TextInput
            type="email"
            label="Email"
            placeholder={t('input.placeholder.email')}
            isSubmitted={formState.isSubmitted}
            isSubmitting={formState.isSubmitting}
            isValid={!formState.errors.email}
            hint={formState.errors.email?.message}
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
            defaultValue={
              watch('type') ?
                { label: watch('type'), value: watch('type') }
              : undefined
            }
            required
          />
          {watch('type') === 'GENERAL' && (
            <>
              <SelectBox
                label="Project"
                options={projectData?.items ?? []}
                onChange={(v) => setValue('projectId', v?.id)}
                getOptionValue={(option) => String(option.id)}
                getOptionLabel={(option) => option.name}
                isClearable
              />
              {watch('projectId') && (
                <SelectBox
                  label="Role"
                  required
                  options={roleData?.roles ?? []}
                  onChange={(v) => setValue('roleId', v?.id)}
                  value={
                    roleData?.roles.find(
                      (role) => role.id === watch('roleId'),
                    ) ?? null
                  }
                  getOptionValue={(option) => String(option.id)}
                  getOptionLabel={(option) => option.name}
                />
              )}
            </>
          )}
        </form>
      </PopoverModalContent>
    </Popover>
  );
};

export default UserInvitationDialog;
