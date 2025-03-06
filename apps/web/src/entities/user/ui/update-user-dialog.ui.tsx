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
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import type { FormOverlayProps } from '@/shared';
import { FormDialog, SelectInput, TextInput } from '@/shared';

import { updateUserSchema } from '../user.schema';
import type { UpdateUser, UserMember, UserTypeEnum } from '../user.type';

interface IProps extends FormOverlayProps<UpdateUser> {
  data: UserMember;
}

const UpdateUserDialog: React.FC<IProps> = (props) => {
  const {
    close,
    isOpen,
    data,
    onSubmit,
    onClickDelete,
    disabledDelete: deleteDisabled = false,
    disabledUpdate: updateDisabled = false,
  } = props;
  const { t } = useTranslation();

  const { setValue, watch, handleSubmit, formState } = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: data,
  });

  return (
    <FormDialog
      title={t('v2.text.name.detail', { name: 'User' })}
      close={close}
      isOpen={isOpen}
      submitBtn={{ disabled: updateDisabled, form: 'update-user' }}
      deleteBtn={{ disabled: deleteDisabled, onClick: onClickDelete }}
      formState={formState}
    >
      <form
        id="update-user"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput label="Email" value={data.email} disabled />
        <SelectInput
          label="Type"
          value={watch('type')}
          onChange={(v) =>
            setValue('type', v as UserTypeEnum, { shouldDirty: true })
          }
          options={[
            { label: 'SUPER', value: 'SUPER' },
            { label: 'GENERAL', value: 'GENERAL' },
          ]}
        />
      </form>
    </FormDialog>
  );
};

export default UpdateUserDialog;
