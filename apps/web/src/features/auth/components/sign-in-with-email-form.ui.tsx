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

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { Button, toast } from '@ufb/react';

import type { IFetchError } from '@/shared';
import { TextInput } from '@/shared';

import { useAuth } from '../contexts';

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type FormType = z.infer<typeof FormSchema>;

const SignInWithEmailForm = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const { signInWithEmail } = useAuth();

  const { handleSubmit, register, formState, setError } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormType) => {
    try {
      setLoading(true);
      await signInWithEmail(data);
      toast.success(t('v2.toast.success'));
    } catch (error) {
      const { message } = error as IFetchError;
      setError('email', { message: 'invalid email' });
      setError('password', { message: 'invalid password' });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <TextInput
          label="Email"
          placeholder={t('v2.placeholder.text')}
          type="email"
          {...register('email')}
          error={formState.errors.email?.message}
        />
        <TextInput
          label="Password"
          placeholder={t('v2.placeholder.text')}
          type="password"
          {...register('password')}
          error={formState.errors.password?.message}
        />
      </div>
      <div className="flex flex-col gap-4">
        <Button
          size="medium"
          type="submit"
          loading={loading}
          disabled={!formState.isDirty}
        >
          {t('button.sign-in')}
        </Button>
        <div className="flex flex-col gap-3">
          <Link href="/auth/reset-password" className="text-center underline">
            {t('link.reset-password.title')}
          </Link>
          <Link href="/auth/sign-up" className="text-center underline">
            {t('button.sign-up')}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignInWithEmailForm;
