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
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Icon,
  Popover,
  PopoverContent,
  PopoverHeading,
  PopoverTrigger,
  TextInput,
  toast,
} from '@ufb/ui';

import { SelectBox, useOAIMutation } from '@/shared';

import { updateUserSchema } from '../user.schema';
import type { UpdateUser, UserMember, UserTypeEnum } from '../user.type';

interface IProps {
  user: UserMember;
}

const UpdateUserPopover: React.FC<IProps> = (props) => {
  const { user } = props;
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { register, setValue, watch, handleSubmit, formState } =
    useForm<UpdateUser>({
      resolver: zodResolver(updateUserSchema),
      defaultValues: {
        email: user.email,
        type: user.type,
        name: user.name,
        department: user.department,
      },
    });

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/users/{id}',
    pathParams: { id: user.id },
    queryOptions: {
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: ['/api/admin/users/search'],
        });
        toast.positive({ title: t('toast.save') });
        setOpen(false);
      },
      onError(error) {
        toast.negative({ title: error.message });
      },
    },
  });

  const onSubmit = (input: UpdateUser) => {
    mutate(input);
  };
  return (
    <Popover placement="left-start" open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="icon-btn icon-btn-sm icon-btn-tertiary"
          onClick={() => setOpen(true)}
          disabled={isPending}
        >
          <Icon name="EditFill" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeading>
          {t('main.setting.dialog.edit-user.title')}
        </PopoverHeading>
        <form className="m-5 w-[400px]" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <TextInput label="Email" value={user.email} disabled />
            <div>
              <label className="input-label mb-2">Type</label>
              <SelectBox
                value={{ label: watch('type'), value: watch('type') }}
                onChange={(v) =>
                  v?.value && setValue('type', v.value as UserTypeEnum)
                }
                options={[
                  { label: 'SUPER', value: 'SUPER' },
                  { label: 'GENERAL', value: 'GENERAL' },
                ]}
              />
            </div>
            <TextInput
              label="Name"
              {...register('name')}
              isSubmitting={formState.isSubmitting}
              isSubmitted={formState.isSubmitted}
              hint={formState.errors.name?.message}
              isValid={!formState.errors.name}
            />
            <TextInput
              label="Department"
              {...register('department')}
              isSubmitting={formState.isSubmitting}
              isSubmitted={formState.isSubmitted}
              hint={formState.errors.department?.message}
              isValid={!formState.errors.department}
            />
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setOpen(false)}
            >
              {t('button.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('button.save')}
            </button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default UpdateUserPopover;
