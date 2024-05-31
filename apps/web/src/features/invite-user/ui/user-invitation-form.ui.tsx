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
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';

import { TextInput, toast } from '@ufb/ui';

import { userInvitationSchema } from '../user-invitation.schema';

import { Path } from '@/constants/path';
import { useOAIMutation } from '@/hooks';

type FormType = z.infer<typeof userInvitationSchema>;

interface IProps {
  code: string;
  email: string;
}

const UserInvitationForm: React.FC<IProps> = ({ code, email }) => {
  const { t } = useTranslation();

  const router = useRouter();

  const { handleSubmit, register, formState } = useForm<FormType>({
    resolver: zodResolver(userInvitationSchema),
    defaultValues: { code, email },
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/auth/signUp/invitation',
    queryOptions: {
      async onSuccess() {
        toast.positive({ title: 'Success' });
        router.push(Path.SIGN_IN);
      },
      onError(error) {
        toast.negative({ title: 'Error', description: error.message });
      },
    },
  });

  const onSubmit = async ({ password, code, email }: FormType) =>
    mutate({ code, email, password });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6 space-y-4">
        <TextInput
          label="Email"
          placeholder={t('input.placeholder.email')}
          type="email"
          value={email}
          disabled
        />
        <TextInput
          type="password"
          label={t('input.label.password')}
          placeholder={t('input.placeholder.password')}
          {...register('password')}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          isValid={!formState.errors.password}
          hint={formState.errors.password?.message}
          required
        />
        <TextInput
          type="password"
          label={t('input.label.confirm-password')}
          placeholder={t('input.placeholder.confirm-password')}
          {...register('confirmPassword')}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          isValid={!formState.errors.confirmPassword}
          hint={formState.errors.confirmPassword?.message}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!formState.isValid || isPending}
        >
          {t('button.setting')}
        </button>
      </div>
    </form>
  );
};

export default UserInvitationForm;
