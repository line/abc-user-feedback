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
import { useMemo } from 'react';
import type { GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Icon, TextInput, toast } from '@ufb/ui';

import AuthTemplate from '@/components/templates/AuthTemplate';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { Path } from '@/constants/path';
import { useOAIMutation } from '@/hooks';
import type { NextPageWithLayout } from '../_app';

interface IForm {
  password: string;
  confirmPassword: string;
}

const schema: Zod.ZodType<IForm> = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: 'Password not matched',
    path: ['confirmPassword'],
  });

const defaultValues: IForm = {
  password: '',
  confirmPassword: '',
};

const UserInvitationPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const code = useMemo(() => router.query?.code as string, [router.query]);
  const email = useMemo(() => router.query?.email as string, [router.query]);

  const { handleSubmit, register, formState, setError } = useForm<IForm>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { mutate, isLoading } = useOAIMutation({
    method: 'post',
    path: '/api/auth/signUp/invitation',
    queryOptions: {
      async onSuccess() {
        toast.positive({ title: 'Success' });
        router.push(Path.SIGN_IN);
      },
      onError(error) {
        setError('password', { message: error.message });
        setError('confirmPassword', { message: error.message });
        toast.negative({ title: error.message });
      },
    },
  });

  const onSubmit = async ({ password }: IForm) =>
    mutate({ code, email, password });

  return (
    <AuthTemplate>
      <div className="mb-12">
        <div className="mb-2 flex gap-0.5">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={12}
            height={12}
          />
          <Icon name="Title" className="h-[12px] w-[62px]" />
        </div>
        <h1 className="font-24-bold">{t('link.user-invitation.title')}</h1>
      </div>
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
            label={t('input.label.password')}
            placeholder={t('input.placeholder.password')}
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
            disabled={isLoading}
          >
            {t('button.setting')}
          </button>
        </div>
      </form>
    </AuthTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default UserInvitationPage;
