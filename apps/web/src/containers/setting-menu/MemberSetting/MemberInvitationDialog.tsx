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
import type { Dispatch, SetStateAction } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Input, Popover, PopoverModalContent, toast } from '@ufb/ui';

import { SelectBox, useOAIMutation, useOAIQuery } from '@/shared';
import { useUserSearch } from '@/entities/user';

interface IForm {
  roleId: number;
  userId: number;
}
const scheme: Zod.ZodType<IForm> = z.object({
  roleId: z.number(),
  userId: z.number(),
});
interface IProps {
  projectId: number;
  refetch: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const MemberInvitationDialog: React.FC<IProps> = (props) => {
  const { projectId, refetch, open, setOpen } = props;
  const { t } = useTranslation();

  const { setValue, handleSubmit } = useForm<IForm>({
    resolver: zodResolver(scheme),
  });

  const { data: projectData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}',
    variables: { projectId },
  });

  const { data: roleData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/roles',
    variables: { projectId },
  });

  const { data: userData } = useUserSearch({
    limit: 1000,
    query: { type: 'GENERAL' },
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/members',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        toast.positive({ title: t('toast.save'), iconName: 'MailFill' });
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
      <PopoverModalContent
        title={t('main.setting.dialog.register-member.title')}
        cancelButton={{ children: t('button.cancel') }}
        submitButton={{
          type: 'submit',
          form: 'inviteMember',
          children: t('button.confirm'),
          disabled: isPending,
        }}
      >
        <form
          id="inviteMember"
          className="my-8 flex flex-col gap-5"
          onSubmit={handleSubmit((data) => mutate(data))}
        >
          <Input label="Project" value={projectData?.name} disabled />
          <SelectBox
            label="User"
            required
            isSearchable
            options={
              userData?.items
                .filter(
                  (v) =>
                    !v.members.find(
                      (member) => member.role.project.id === projectId,
                    ),
                )
                .map((v) => ({
                  id: v.id,
                  name: v.name ? `${v.email} (${v.name})` : v.email,
                })) ?? []
            }
            onChange={(v) => v?.id && setValue('userId', v?.id)}
            getOptionValue={(option) => String(option.id)}
            getOptionLabel={(option) => option.name}
          />
          <SelectBox
            label="Role"
            required
            options={roleData?.roles ?? []}
            onChange={(v) => v?.id && setValue('roleId', v.id)}
            getOptionValue={(option) => String(option.id)}
            getOptionLabel={(option) => option.name}
          />
        </form>
      </PopoverModalContent>
    </Popover>
  );
};

export default MemberInvitationDialog;
