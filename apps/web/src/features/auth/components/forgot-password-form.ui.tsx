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
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, toast } from '@ufb/react';

import { Path, TextInput, useOAIMutation } from '@/shared';

const schema = z.object({ email: z.email() });

type FormType = z.infer<typeof schema>;

const ForgotPasswordForm = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const { register, handleSubmit, formState } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/users/password/reset/code',
    queryOptions: {
      async onSuccess() {
        await router.push(Path.SIGN_IN);
        toast.success(t('v2.toast.success'));
      },
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutate(data))}>
      <div className="mb-12 flex flex-col gap-4">
        <TextInput
          type="email"
          label="Email"
          placeholder={t('v2.placeholder.text')}
          error={formState.errors.email?.message}
          {...register('email')}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          size="medium"
          type="submit"
          loading={isPending}
          disabled={!formState.isValid}
        >
          {t('v2.auth.reset-password.button.send-email')}
        </Button>
        <Button
          size="medium"
          variant="outline"
          type="button"
          onClick={router.back}
        >
          {t('button.back')}
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
