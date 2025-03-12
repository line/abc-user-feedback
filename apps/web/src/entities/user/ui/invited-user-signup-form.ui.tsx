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
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { Button, toast } from '@ufb/react';

import { Path, TextInput, useOAIMutation } from '@/shared';

import { invitedUserSignupSchema } from '../user.schema';

type FormType = z.infer<typeof invitedUserSignupSchema>;

interface IProps {
  code: string;
  email: string;
}

const InvitedUserSignupForm: React.FC<IProps> = ({ code, email }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { handleSubmit, register, formState } = useForm<FormType>({
    resolver: zodResolver(invitedUserSignupSchema),
    defaultValues: { code, email },
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/auth/signUp/invitation',
    queryOptions: {
      async onSuccess() {
        toast.success('Success');
        await router.push(Path.SIGN_IN);
      },
    },
  });

  const onSubmit = ({ password, code, email }: FormType) =>
    mutate({ code, email, password });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-12 flex flex-col gap-4">
        <TextInput
          label="Email"
          placeholder={t('v2.placeholder.text')}
          type="email"
          value={email}
          disabled
        />
        <TextInput
          type="password"
          label="Password"
          placeholder={t('v2.placeholder.text')}
          {...register('password')}
          error={formState.errors.password?.message}
          required
        />
        <TextInput
          type="password"
          label="Confirm Password"
          placeholder={t('v2.placeholder.text')}
          {...register('confirmPassword')}
          error={formState.errors.confirmPassword?.message}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button type="submit" loading={isPending} disabled={!formState.isDirty}>
          {t('button.setting')}
        </Button>
      </div>
    </form>
  );
};

export default InvitedUserSignupForm;
