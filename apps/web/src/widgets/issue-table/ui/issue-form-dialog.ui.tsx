/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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

import { InputField, Label, Textarea } from '@ufb/react';

import { FormDialog, ISSUES, SelectInput, TextInput } from '@/shared';
import type { FormOverlayProps } from '@/shared';
import type { IssueFormSchema } from '@/entities/issue';
import type { IssueTracker } from '@/entities/issue-tracker';
import { issueFormSchema } from '@/entities/issue/issue.schema';

interface Props extends FormOverlayProps<IssueFormSchema> {
  issueTracker?: IssueTracker;
}

const IssueFormDialog = (props: Props) => {
  const {
    data,
    close,
    isOpen,
    onSubmit,
    issueTracker,
    disabledUpdate: updateDisabled,
  } = props;
  const { t } = useTranslation();

  const { register, watch, setValue, handleSubmit, formState } =
    useForm<IssueFormSchema>({
      resolver: zodResolver(issueFormSchema),
      defaultValues: data ?? { status: 'INIT' },
    });

  const { status } = watch();

  return (
    <FormDialog
      isOpen={isOpen}
      close={close}
      title={t('v2.text.name.create', { name: 'Issue' })}
      submitBtn={{ form: 'issueForm', disabled: updateDisabled }}
      formState={formState}
    >
      <form
        id="issueForm"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          {...register('name')}
          label="Title"
          required
          placeholder={t('v2.placeholder.text')}
          error={formState.errors.name?.message}
        />
        <SelectInput
          label="Status"
          options={ISSUES(t).map((issue) => ({
            value: issue.key,
            label: issue.name,
          }))}
          value={status}
          onChange={(value) =>
            setValue('status', value as IssueFormSchema['status'], {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          required
          placeholder={t('v2.placeholder.select')}
          error={formState.errors.status?.message}
        />
        <InputField>
          <Label>Description</Label>
          <Textarea
            {...register('description')}
            placeholder={t('v2.placeholder.text')}
          />
        </InputField>
        <InputField>
          <Label>Ticket</Label>
          <div className="flex items-center gap-2">
            <div className="w-28">
              <TextInput disabled value={issueTracker?.ticketKey ?? ''} />
            </div>
            <span>-</span>
            <InputField className="w-full">
              <TextInput
                {...register('externalIssueId')}
                placeholder={t('v2.placeholder.text')}
              />
            </InputField>
          </div>
        </InputField>
      </form>
    </FormDialog>
  );
};

export default IssueFormDialog;
