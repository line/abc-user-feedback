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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  Icon,
  Input,
  Popover,
  PopoverContent,
  PopoverHeading,
  PopoverTrigger,
  toast,
} from '@ufb/ui';

import { SelectBox } from '@/components';
import type { UserTypeEnum } from '@/contexts/user.context';
import { useOAIMutation } from '@/hooks';
import type { UserDataType } from './UserSetting';

interface IProps {
  data: UserDataType;
  refetch: () => void;
}

interface IForm {
  type: UserTypeEnum;
  name: string;
  department: string | null;
}
const scheme: Zod.ZodType<IForm> = z.object({
  type: z.union([z.literal('SUPER'), z.literal('GENERAL')]),
  name: z.string(),
  department: z.string().nullable(),
});

const UserEditPopover: React.FC<IProps> = ({ data, refetch }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { register, setValue, watch, handleSubmit } = useForm<IForm>({
    resolver: zodResolver(scheme),
    defaultValues: {
      type: data.type,
      name: data.name ?? '',
      department: data.department ?? '',
    },
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/users/{id}',
    pathParams: { id: data.id },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.positive({ title: t('toast.save') });
        setOpen(false);
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const onSubmit = (input: IForm) => mutate(input);
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
            <Input label="Email" value={data.email} disabled />
            <div>
              <label className="input-label mb-2">Type</label>
              <SelectBox
                isClearable={false}
                isSearchable={false}
                isMulti={false}
                value={{ key: watch('type'), name: watch('type') }}
                onChange={(v) => (v && v.key ? setValue('type', v.key) : {})}
                options={[
                  { name: 'SUPER', key: 'SUPER' },
                  { name: 'GENERAL', key: 'GENERAL' },
                ]}
              />
            </div>
            <Input label="Name" {...register('name')} />
            <Input label="Department" {...register('department')} />
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

export default UserEditPopover;
