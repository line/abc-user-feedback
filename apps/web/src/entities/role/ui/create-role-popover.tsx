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
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@ufb/react';
import { Input, Popover, PopoverModalContent, PopoverTrigger } from '@ufb/ui';

import type { Role } from '../role.type';

interface IForm {
  roleName: string;
}

interface IProps {
  roles: Role[];
  disabled?: boolean;
  onCreate: (name: string) => Promise<void> | void;
}

const CreateRolePopover: React.FC<IProps> = ({ disabled, onCreate, roles }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { register, handleSubmit, formState, setError, reset } = useForm<IForm>(
    {
      resolver: zodResolver(
        z.object({ roleName: z.string().min(1, t('hint.required')).max(20) }),
      ),
    },
  );

  useEffect(() => {
    reset();
  }, [open]);

  const onSubmit = async (data: IForm) => {
    if (roles.some((v) => v.name === data.roleName)) {
      setError('roleName', { message: 'Role name already exists' });
      return;
    }
    await onCreate(data.roleName);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger onClick={() => setOpen(true)} disabled={disabled} asChild>
        <Button>{t('v2.button.name.create', { name: 'Role' })}</Button>
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.create-role.title')}
        cancelButton={{ children: t('button.cancel') }}
        icon={{
          name: 'ShieldPrivacyFill',
          className: 'text-blue-primary',
          size: 56,
        }}
        description={t('main.setting.dialog.create-role.description')}
        submitButton={{
          children: t('button.confirm'),
          form: 'form',
          type: 'submit',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} id="form">
          <Input
            label="Role Name"
            {...register('roleName')}
            isSubmitted={formState.isSubmitted}
            isSubmitting={formState.isSubmitting}
            isValid={formState.isValid}
            hint={formState.errors.roleName?.message}
          />
        </form>
      </PopoverModalContent>
    </Popover>
  );
};

export default CreateRolePopover;
