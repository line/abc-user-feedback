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

import { TextInput, toast } from '@ufb/ui';

import { useOAIMutation } from '@/hooks';

type IForm = {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
};
const schema: Zod.ZodType<IForm> = z
  .object({
    password: z.string(),
    newPassword: z.string(),
    confirmNewPassword: z.string(),
  })
  .refine(({ password, newPassword }) => password !== newPassword, {
    message: 'must not equal Password',
    path: ['newPassword'],
  })
  .refine(
    ({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword,
    {
      message: 'must equal New Password',
      path: ['confirmNewPassword'],
    },
  );

interface IProps extends React.PropsWithChildren {}

const ChangePasswordForm: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, setError, formState, reset } = useForm<IForm>(
    { resolver: zodResolver(schema) },
  );

  const { mutate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/users/password/change',
    queryOptions: {
      async onSuccess() {
        toast.positive({ title: t('toast.save') });
        reset({ confirmNewPassword: '', newPassword: '', password: '' });
      },
      onError(error) {
        if (typeof error.message === 'string') {
          if (error.code === 'InvalidPassword') {
            setError('password', { message: 'Invalid Password' });
          }
          toast.negative({ title: error.message as string });
        }
        if (Array.isArray(error.message)) {
          error.message.forEach((message) =>
            toast.negative({ title: message }),
          );
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
          disabled={isPending}
        >
          {t('button.save')}
        </button>
      </div>
      <hr />
      <form
        id="reset_password"
        className="flex flex-col gap-6"
        onSubmit={handleSubmit((data) => {
          mutate({ ...data });
        })}
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
