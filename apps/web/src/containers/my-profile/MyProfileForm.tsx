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
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Input, toast } from '@ufb/ui';

import { useUserState } from '@/entities/user';

import DeleteMyAccountButton from './DeleteMyAccountButton';

import client from '@/libs/client';

type IForm = {
  name: string | null;
  department: string | null;
};

const schema: Zod.ZodType<IForm> = z.object({
  name: z.string().nullable(),
  department: z.string().nullable(),
});

const defaultValues: IForm = {
  name: null,
  department: null,
};

interface IProps extends React.PropsWithChildren {}

const MyProfileForm: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useUserState();

  const { register, handleSubmit, reset } = useForm<IForm>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (!user) return;
    reset(user);
  }, [user]);

  const { mutate } = useMutation({
    mutationKey: ['put', '/api/admin/users/{id}', user],
    mutationFn: async (input: IForm & { userId: number }) => {
      const { userId, ...body } = input;
      await client.put({
        path: '/api/admin/users/{id}',
        body,
        pathParams: { id: userId },
      });
    },
    async onSuccess() {
      router.reload();
      toast.positive({ title: t('toast.save') });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-20-bold">{t('main.profile.profile-info')}</h1>
        <button
          form="profileInfo"
          className="btn btn-md btn-primary min-w-[120px]"
        >
          {t('button.save')}
        </button>
      </div>
      <hr />
      <form
        id="profileInfo"
        className="flex flex-col gap-6"
        onSubmit={handleSubmit((data) => {
          if (!user?.id) return;
          mutate({ ...data, userId: user.id });
        })}
      >
        <Input label="Email" value={user?.email} disabled />
        <Input
          label={t('main.profile.label.user-type')}
          value={user?.type}
          disabled
        />
        <Input
          label="Name"
          placeholder={t('main.profile.placeholder.name')}
          {...register('name')}
        />
        <Input
          label="Department"
          placeholder={t('main.profile.placeholder.department')}
          {...register('department')}
        />
      </form>
      <div className="flex justify-end">
        <DeleteMyAccountButton />
      </div>
    </div>
  );
};

export default MyProfileForm;
