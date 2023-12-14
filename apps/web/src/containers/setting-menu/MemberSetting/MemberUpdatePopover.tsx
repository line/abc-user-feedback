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
  Icon,
  Popover,
  PopoverModalContent,
  PopoverTrigger,
  toast,
} from '@ufb/ui';

import { SelectBox } from '@/components';
import { useOAIMutation, useOAIQuery } from '@/hooks';
import type { RoleType } from '@/types/role.type';

interface IProps {
  projectId: number;
  memberId: number;
  currentRole: RoleType;
  refetch: () => void;
  disabled: boolean;
}

const MemberUpdatePopover: React.FC<IProps> = ({
  memberId,
  projectId,
  currentRole,
  refetch,
  disabled,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [inputRoleId, setInputRoleId] = useState<number>(currentRole.id);

  const { data } = useOAIQuery({
    path: '/api/projects/{projectId}/roles',
    variables: { projectId },
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/projects/{projectId}/members/{memberId}',
    pathParams: { memberId, projectId },
    queryOptions: {
      async onSuccess() {
        toast.positive({ title: t('toast.save') });
        refetch();
        setOpen(false);
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  return (
    <Popover onOpenChange={setOpen} open={open} modal>
      <PopoverTrigger
        className="icon-btn icon-btn-sm icon-btn-tertiary"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled || isPending}
      >
        <Icon name="EditFill" />
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.edit-member.title')}
        cancelButton={{ children: t('button.cancel') }}
        icon={{
          name: 'ProfileSettingFill',
          className: 'text-orange-primary',
          size: 56,
        }}
        description={t('main.setting.dialog.edit-member.description')}
        submitButton={{
          onClick: () => mutate({ roleId: inputRoleId }),
          disabled: inputRoleId === currentRole.id,
          children: t('button.save'),
        }}
      >
        <SelectBox
          label="Role"
          options={data?.roles ?? []}
          onChange={(v) => (v && v.id ? setInputRoleId(v.id) : {})}
          defaultValue={currentRole}
          isSearchable={false}
        />
      </PopoverModalContent>
    </Popover>
  );
};

export default MemberUpdatePopover;
