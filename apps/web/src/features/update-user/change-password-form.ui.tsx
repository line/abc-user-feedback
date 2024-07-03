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

import { ErrorCode } from '@ufb/shared';
import { TextInput, toast } from '@ufb/ui';

import { useOAIMutation } from '@/shared';

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
      async onSuccess() {
        toast.positive({ title: t('toast.save') });
        reset();
      },
      onError(error) {
        if (error.code === ErrorCode.User.InvalidPassword) {
          setError('password', { message: 'Invalid Password' });
          toast.negative({
            title: 'Error',
            description: error.message as string,
          });
        } else {
          toast.negative({ title: 'Error', description: error.message });
        }
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-20-bold">{t('main.profile.change-password')}</h1>
        <button
          form="reset_password"
          className="btn btn-md btn-primary min-w-[120px]"
          disabled={!formState.isValid || isPending}
        >
          {t('button.save')}
        </button>
      </div>
      <hr />
      <form
        id="reset_password"
        className="flex flex-col gap-6"
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        <TextInput
          type="password"
          label={t('input.label.password')}
          placeholder={t('input.placeholder.password')}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          isValid={!formState.errors.password}
          hint={formState.errors.password?.message}
          {...register('password')}
          required
        />
        <TextInput
          type="password"
          label={t('main.profile.label.new-password')}
          placeholder={t('main.profile.placeholder.new-password')}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          isValid={!formState.errors.newPassword}
          hint={formState.errors.newPassword?.message}
          {...register('newPassword')}
          required
        />
        <TextInput
          type="password"
          label={t('main.profile.label.confirm-new-password')}
          placeholder={t('main.profile.placeholder.confirm-new-password')}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          isValid={!formState.errors.confirmNewPassword}
          hint={formState.errors.confirmNewPassword?.message}
          {...register('confirmNewPassword')}
          required
        />
      </form>
    </div>
  );
};

export default ChangePasswordForm;
