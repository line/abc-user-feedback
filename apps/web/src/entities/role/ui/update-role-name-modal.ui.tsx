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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';

import { Input, Popover, PopoverModalContent } from '@ufb/ui';

import type { Role } from '../role.type';
import { updateRoleNameSchema } from '../role.type';

type FormType = z.infer<typeof updateRoleNameSchema>;

interface IProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClickUpdate: (newRole: Role) => void;
  role: Role;
  roles: Role[];
}

const UpdateRoleNameModal: React.FC<IProps> = (props) => {
  const { open, onOpenChange, role, roles, onClickUpdate } = props;

  const { t } = useTranslation();

  const { register, handleSubmit, formState, setError, reset } =
    useForm<FormType>({
      resolver: zodResolver(updateRoleNameSchema),
      defaultValues: { name: role.name },
    });

  useEffect(() => {
    reset({ name: role.name });
  }, [open]);

  const onSubmit = (data: FormType) => {
    if (roles.some((v) => v.id !== role.id && v.name === data.name)) {
      setError('name', {
        message: t('hint.name-already-exists', { name: 'Role Name' }),
      });
      return;
    }
    onClickUpdate({ ...role, name: data.name });
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange} modal>
      <PopoverModalContent
        cancelButton={{ children: t('button.cancel') }}
        submitButton={{
          children: t('button.confirm'),
          form: 'form',
          type: 'submit',
        }}
        title={t('main.setting.dialog.update-role-name.title')}
        description={t('main.setting.dialog.update-role-name.description')}
        icon={{
          name: 'ShieldPrivacyFill',
          size: 56,
          className: 'text-blue-primary',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} id="form">
          <Input
            label="Role Name"
            placeholder={t('placeholder', { name: 'Role Name' })}
            {...register('name')}
            isSubmitted={formState.isSubmitted}
            isSubmitting={formState.isSubmitting}
            isValid={formState.isValid}
            hint={formState.errors.name?.message}
          />
        </form>
      </PopoverModalContent>
    </Popover>
  );
};
export default UpdateRoleNameModal;
