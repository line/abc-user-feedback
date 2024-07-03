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

import { TextInput, toast } from '@ufb/ui';

import { useOAIMutation } from '@/shared';
import type { User } from '@/entities/user';

import { userProfileFormSchema } from './user-profile-form.schema';

type FormType = z.infer<typeof userProfileFormSchema>;

interface IProps {
  user: User;
}

const UserProfileForm: React.FC<IProps> = (props) => {
  const { user } = props;

  const { t } = useTranslation();

  const { register, handleSubmit, formState, reset, getValues } =
    useForm<FormType>({
      resolver: zodResolver(userProfileFormSchema),
      defaultValues: user,
    });

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/users/{id}',
    pathParams: { id: user.id },
    queryOptions: {
      async onSuccess() {
        toast.positive({ title: t('toast.save') });
        reset(getValues());
      },
      onError(error) {
        toast.negative({ title: 'Error', description: error.message });
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-20-bold">{t('main.profile.profile-info')}</h1>
        <button
          form="profileInfo"
          className="btn btn-md btn-primary min-w-[120px]"
          disabled={isPending || !formState.isDirty}
        >
          {t('button.save')}
        </button>
      </div>
      <hr />
      <form
        id="profileInfo"
        className="flex flex-col gap-6"
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        <TextInput label="Email" value={user?.email} disabled />
        <TextInput
          label={t('main.profile.label.user-type')}
          value={user?.type}
          disabled
        />
        <TextInput
          label="Name"
          placeholder={t('main.profile.placeholder.name')}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          isValid={!formState.errors.name}
          hint={formState.errors.name?.message}
          {...register('name')}
        />
        <TextInput
          label="Department"
          placeholder={t('main.profile.placeholder.department')}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          isValid={!formState.errors.department}
          hint={formState.errors.department?.message}
          {...register('department')}
        />
      </form>
    </div>
  );
};

export default UserProfileForm;
