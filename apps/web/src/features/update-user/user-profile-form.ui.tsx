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
import { zodResolver } from '@hookform/resolvers/zod';
import { useOverlay } from '@toss/use-overlay';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';

import { Button, toast } from '@ufb/react';

import {
  DeleteDialog,
  SettingTemplate,
  TextInput,
  useOAIMutation,
  useOAIQuery,
} from '@/shared';
import { useUserStore } from '@/entities/user';

import { userProfileFormSchema } from './user-profile-form.schema';

type FormType = z.infer<typeof userProfileFormSchema>;

interface IProps {}

const UserProfileForm: React.FC<IProps> = () => {
  const { user, signOut } = useUserStore();

  const { t } = useTranslation();
  const overlay = useOverlay();

  const { register, handleSubmit, formState, reset } = useForm<FormType>({
    resolver: zodResolver(userProfileFormSchema),
  });
  const { data, refetch } = useOAIQuery({
    path: '/api/admin/users/{id}',
    variables: { id: user?.id ?? 0 },
  });

  const { mutate: updateProfile, isPending: isPendingUpdateProfile } =
    useOAIMutation({
      method: 'put',
      path: '/api/admin/users/{id}',
      pathParams: { id: data?.id ?? 0 },
      queryOptions: {
        async onSuccess() {
          await refetch();
          toast.success(t('toast.save'));
        },
        onError(error) {
          toast.error(error.message);
        },
      },
    });

  const { mutateAsync: deleteAccount } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/users/{id}',
    pathParams: { id: data?.id ?? 0 },
    queryOptions: {
      async onSuccess() {
        await signOut();
      },
    },
  });

  useEffect(() => {
    reset(data);
  }, [data]);

  const openDeleteAccountDialog = () => {
    if (!user) return;
    overlay.open(({ close, isOpen }) => (
      <DeleteDialog
        close={close}
        isOpen={isOpen}
        onClickDelete={() => deleteAccount(undefined)}
      />
    ));
  };

  return (
    <SettingTemplate
      title={t('tenant-setting-menu.tenant-info')}
      action={
        <>
          <Button
            variant="outline"
            iconL="RiDeleteBinFill"
            onClick={openDeleteAccountDialog}
          >
            {t('main.profile.button.delete-account')}
          </Button>
          <Button
            form="profileInfo"
            type="submit"
            disabled={!formState.isDirty}
            loading={isPendingUpdateProfile}
          >
            {t('button.save')}
          </Button>
        </>
      }
    >
      <form
        id="profileInfo"
        onSubmit={handleSubmit((data) => updateProfile(data))}
        className="flex flex-col gap-6"
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
          error={formState.errors.name?.message}
          {...register('name')}
        />
        <TextInput
          label="Department"
          placeholder={t('main.profile.placeholder.department')}
          error={formState.errors.department?.message}
          {...register('department')}
        />
      </form>
    </SettingTemplate>
  );
};

export default UserProfileForm;
