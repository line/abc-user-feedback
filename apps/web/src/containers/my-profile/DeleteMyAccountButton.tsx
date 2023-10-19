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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Popover, PopoverModalContent, PopoverTrigger, toast } from '@ufb/ui';

import { useOAIMutation, useUser } from '@/hooks';

interface IProps extends React.PropsWithChildren {}

const DeleteMyAccountButton: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { user, signOut } = useUser();

  const { mutate, isLoading } = useOAIMutation({
    method: 'delete',
    path: '/api/users/{id}',
    pathParams: { id: user?.id ?? -1 },
    queryOptions: {
      async onSuccess() {
        await signOut();
        setOpen(false);
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });
  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="btn btn-md btn-secondary text-red-primary min-w-[120px]"
        disabled={user?.signUpMethod === 'OAUTH'}
      >
        {t('main.profile.button.delete-account')}
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.profile.dialog.delete-account.title')}
        cancelText={t('button.cancel')}
        icon={{
          name: 'WarningTriangleFill',
          className: 'text-red-primary',
          size: 56,
        }}
        submitButton={{
          children: t('button.delete'),
          onClick: () => mutate(undefined),
          className: 'bg-red-primary',
          disabled: isLoading,
        }}
      >
        <h2 className="font-20-bold mb-3 text-center">
          {t('main.profile.dialog.delete-account.description1')}
        </h2>
        <p className="font-14-regular mb-10 text-center">
          {t('main.profile.dialog.delete-account.description2')}
        </p>
      </PopoverModalContent>
    </Popover>
  );
};

export default DeleteMyAccountButton;
