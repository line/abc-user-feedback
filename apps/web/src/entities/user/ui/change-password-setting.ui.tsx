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
import { useTranslation } from 'next-i18next';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, toast } from '@ufb/react';
import { ErrorCode } from '@ufb/shared';

import {
  SettingTemplate,
  useOAIMutation,
  useWarnIfUnsavedChanges,
} from '@/shared';
import type { ChangePassword } from '@/entities/user';
import { ChangePasswordForm, changePasswordSchema } from '@/entities/user';

const ChangePasswordSetting = () => {
  const { t } = useTranslation();

  const methods = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
  });

  useWarnIfUnsavedChanges(methods.formState.isDirty);

  const { mutate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/users/password/change',
    queryOptions: {
      onSuccess() {
        toast.success(t('v2.toast.success'));
        methods.reset();
      },
      onError(error) {
        if (error.code === ErrorCode.User.InvalidPassword) {
          methods.setError('password', { message: 'Invalid Password' });
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
          loading={isPending}
          disabled={!methods.formState.isDirty}
        >
          {t('button.save')}
        </Button>
      }
    >
      <FormProvider {...methods}>
        <form
          id="reset_password"
          onSubmit={methods.handleSubmit((data) => mutate(data))}
        >
          <ChangePasswordForm />
        </form>
      </FormProvider>
    </SettingTemplate>
  );
};

export default ChangePasswordSetting;
