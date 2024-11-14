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
import type { z } from 'zod';

import { Button, toast } from '@ufb/react';
import { ErrorCode } from '@ufb/shared';

import { SettingTemplate, TextInput, useOAIMutation } from '@/shared';

import { changePasswordFormSchema } from './change-password-form.schema';

type FormType = z.infer<typeof changePasswordFormSchema>;

const DEFAULT_VALUES: FormType = {
  confirmNewPassword: '',
  newPassword: '',
  password: '',
};

interface IProps {}

const ChangePasswordForm: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, setError, formState, reset } =
    useForm<FormType>({
      resolver: zodResolver(changePasswordFormSchema),
      defaultValues: DEFAULT_VALUES,
    });

  const { mutate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/users/password/change',
    queryOptions: {
      onSuccess() {
        toast.success(t('toast.save'));
        reset();
      },
      onError(error) {
        if (error.code === ErrorCode.User.InvalidPassword) {
          setError('password', { message: 'Invalid Password' });
        }
        toast.error(error.message);
      },
    },
  });

  return (
    <SettingTemplate
      title={t('main.profile.change-password')}
      action={
        <Button
          form="reset_password"
          type="submit"
          disabled={!formState.isValid}
          loading={isPending}
        >
          {t('button.save')}
        </Button>
      }
    >
      <form
        id="reset_password"
        className="flex flex-col gap-6"
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        <TextInput
          type="password"
          label={t('input.label.password')}
          placeholder={t('input.placeholder.password')}
          error={formState.errors.password?.message}
          {...register('password')}
          required
        />
        <TextInput
          type="password"
          label={t('main.profile.label.new-password')}
          placeholder={t('main.profile.placeholder.new-password')}
          error={formState.errors.newPassword?.message}
          {...register('newPassword')}
          required
        />
        <TextInput
          type="password"
          label={t('main.profile.label.confirm-new-password')}
          placeholder={t('main.profile.placeholder.confirm-new-password')}
          error={formState.errors.confirmNewPassword?.message}
          {...register('confirmNewPassword')}
          required
        />
      </form>
    </SettingTemplate>
  );
};

export default ChangePasswordForm;
