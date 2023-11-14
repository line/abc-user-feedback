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
import { z } from 'zod';

import { Input, Popover, PopoverModalContent } from '@ufb/ui';

import type { RoleType } from '@/types/role.type';

interface IForm {
  roleName: string;
}

const scheme: Zod.ZodType<IForm> = z.object({
  roleName: z.string().min(1, '필수 입력대상 입니다.').max(20),
});

interface IProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClickUpdate: (newRole: RoleType) => void;
  role: RoleType;
  roles: RoleType[];
}

const UpdateRolePopover: React.FC<IProps> = ({
  open,
  onOpenChange,
  role,
  roles,
  onClickUpdate,
}) => {
  const { t } = useTranslation();

  const { register, handleSubmit, formState, setError, reset } = useForm<IForm>(
    { resolver: zodResolver(scheme), defaultValues: { roleName: role.name } },
  );

  useEffect(() => {
    reset({ roleName: role.name });
  }, [open]);

  const onSubmit = (data: IForm) => {
    if (roles.some((v) => v.id !== role.id && v.name === data.roleName)) {
      setError('roleName', { message: 'Role name already exists' });
      return;
    }
    onClickUpdate({ ...role, name: data.roleName });
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
        title="Role 이름 수정"
        description="Role의 명칭을 수정해주세요."
        icon={{
          name: 'ShieldPrivacyFill',
          size: 56,
          className: 'text-blue-primary',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} id="form">
          <Input
            label="Role Name"
            placeholder="입력"
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
export default UpdateRolePopover;
