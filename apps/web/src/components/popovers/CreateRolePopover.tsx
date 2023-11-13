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
import { useTranslation } from 'react-i18next';

import { Input, Popover, PopoverModalContent, PopoverTrigger } from '@ufb/ui';

import type { RoleType } from '@/types/role.type';

interface IProps {
  roles: RoleType[];
  disabled?: boolean;
  onSubmit: (name: string) => Promise<void> | void;
}

const CreateRolePopover: React.FC<IProps> = ({ disabled, onSubmit, roles }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [roleName, setRoleName] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("Role name can't be empty");

  useEffect(() => {
    setIsSubmitted(true);
    if (roleName.length === 0) {
      setIsValid(false);
      setError("Role name can't be empty");
    } else if (roleName.length > 20) {
      setIsValid(false);
      setError("Role name can't be longer than 20 characters");
    } else if (roles.some((v) => v.name === roleName)) {
      setIsValid(false);
      setError('Role name already exists');
    } else {
      setIsValid(true);
      setError('');
    }
  }, [roleName]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="btn-primary btn min-w-[120px]"
      >
        {t('main.setting.dialog.create-role.title')}
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
          onClick: async () => {
            await onSubmit(roleName);
            setOpen(false);
          },
          children: t('button.confirm'),
          disabled: !isValid,
        }}
      >
        <Input
          label="Role Name"
          onChange={(e) => setRoleName(e.target.value)}
          isSubmitted={isSubmitted}
          isValid={isValid}
          hint={error}
        />
      </PopoverModalContent>
    </Popover>
  );
};

export default CreateRolePopover;
