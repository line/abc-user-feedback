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

import {
  Input,
  Popover,
  PopoverModalContent,
  PopoverTrigger,
  toast,
} from '@ufb/ui';

import { useOAIMutation, usePermissions } from '@/hooks';

interface IProps {
  projectId: number;
  refetch: () => void;
}

const AddRoleDialog: React.FC<IProps> = ({ projectId, refetch }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const perms = usePermissions(projectId);
  const [isValid, setIsValid] = useState<boolean>();
  const [newRoleName, setNewRoleName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: createRole, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/projects/{projectId}/roles',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        setNewRoleName('');
        setOpen(false);
        refetch();
        setIsValid(undefined);
        setIsSubmitted(false);
        toast.positive({ title: t('toast.add') });
      },
      onError(error) {
        if (!error) return;
        setIsValid(false);
        toast.negative({ title: error.message });
      },
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger
        onClick={() => setOpen(true)}
        disabled={!perms.includes('project_role_create') || isPending}
        className="btn-primary btn min-w-[120px]"
      >
        {t('main.setting.dialog.create-role.title')}
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.create-role.title')}
        cancelText={t('button.cancel')}
        icon={{
          name: 'ShieldPrivacyFill',
          className: 'text-blue-primary',
          size: 56,
        }}
        description={t('main.setting.dialog.create-role.description')}
        submitButton={{
          onClick: () => {
            createRole({ name: newRoleName, permissions: [] });
            setIsSubmitted(true);
          },
          children: t('button.confirm'),
        }}
      >
        <Input
          label="Role Name"
          onChange={(e) => setNewRoleName(e.target.value)}
          isValid={isValid}
          isSubmitted={isSubmitted}
        />
      </PopoverModalContent>
    </Popover>
  );
};

export default AddRoleDialog;
