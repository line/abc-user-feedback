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
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, Icon, toast } from '@ufb/react';

import {
  DeleteDialog,
  SettingTemplate,
  useOAIMutation,
  useOAIQuery,
  useWarnIfUnsavedChanges,
} from '@/shared';
import type { UserProfile } from '@/entities/user';
import { UserProfileForm, userProfileSchema } from '@/entities/user';
import { useAuth } from '@/features/auth';

const UserProfileSetting = () => {
  const { t } = useTranslation();
  const overlay = useOverlay();

  const { user, signOut } = useAuth();

  const methods = useForm<UserProfile>({
    resolver: zodResolver(userProfileSchema),
  });

  const { data, refetch } = useOAIQuery({
    path: '/api/admin/users/{id}',
    variables: { id: user?.id ?? 0 },
    queryOptions: { refetchOnWindowFocus: false },
  });

  const { mutate: updateProfile, isPending: isPendingUpdateProfile } =
    useOAIMutation({
      method: 'put',
      path: '/api/admin/users/{id}',
      pathParams: { id: data?.id ?? 0 },
      queryOptions: {
        async onSuccess() {
          await refetch();
          toast.success(t('v2.toast.success'));
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
        toast.success(t('v2.toast.success'));
      },
    },
  });

  useEffect(() => {
    methods.reset(data);
  }, [data]);

  useWarnIfUnsavedChanges(methods.formState.isDirty);

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
  const onSubmit = ({ department, name }: UserProfile) =>
    updateProfile({ department, name });

  return (
    <SettingTemplate
      title={t('main.profile.profile-info')}
      action={
        <>
          <Button
            variant="outline"
            className="!text-tint-red"
            onClick={openDeleteAccountDialog}
          >
            <Icon name="RiDeleteBinFill" />
            {t('main.profile.button.delete-account')}
          </Button>
          <Button
            form="profileInfo"
            type="submit"
            disabled={!methods.formState.isDirty}
            loading={isPendingUpdateProfile}
          >
            {t('button.save')}
          </Button>
        </>
      }
    >
      <FormProvider {...methods}>
        <form id="profileInfo" onSubmit={methods.handleSubmit(onSubmit)}>
          {user && <UserProfileForm user={user} />}
        </form>
      </FormProvider>
    </SettingTemplate>
  );
};

export default UserProfileSetting;
