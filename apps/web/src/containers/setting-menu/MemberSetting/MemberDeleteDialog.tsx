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

import { useOAIMutation } from '@/hooks';

interface IProps {
  memberId: number;
  projectId: number;
  refetch: () => void;
  disabled: boolean;
}

const MemberDeleteDialog: React.FC<IProps> = ({
  memberId,
  projectId,
  refetch,
  disabled,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useOAIMutation({
    method: 'delete',
    path: '/api/projects/{projectId}/members/{memberId}',
    pathParams: { memberId, projectId },
    queryOptions: {
      async onSuccess() {
        toast.negative({ title: t('toast.delete') });
        refetch();
        setOpen(false);
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger
        onClick={() => setOpen((prev) => !prev)}
        className="icon-btn icon-btn-sm icon-btn-tertiary"
        disabled={disabled || isPending}
      >
        <Icon name="TrashFill" />
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.delete-member.title')}
        description={t('main.setting.dialog.delete-member.description')}
        cancelButton={{ children: t('button.cancel') }}
        icon={{
          name: 'WarningTriangleFill',
          className: 'text-red-primary',
          size: 56,
        }}
        submitButton={{
          className: 'bg-red-primary',
          children: t('button.delete'),
          onClick: () => mutate(undefined),
        }}
      />
    </Popover>
  );
};

export default MemberDeleteDialog;
