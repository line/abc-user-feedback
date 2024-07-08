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
import { useRouter } from 'next/router';
import { Listbox } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Icon, Input, toast } from '@ufb/ui';

import { ISSUES, Popper, useOAIMutation } from '@/shared';
import type { Issue, IssueStatus } from '@/entities/issue';
import type { IssueTracker } from '@/entities/issue-tracker';

type UpdateIssueType = {
  name: string;
  description: string | null;
  status: IssueStatus;
  color: string;
  externalIssueId: string;
};

const schema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  status: z.string(),
  externalIssueId: z.string().nullable(),
});

interface IProps {
  issue: Issue;
  refetch: () => Promise<any>;
  issueTracker?: IssueTracker;
  disabled: boolean;
}

const IssueSettingPopover: React.FC<IProps> = ({
  issue,
  refetch,
  issueTracker,
  disabled,
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const projectId = Number(router.query.projectId);

  const { register, handleSubmit, formState, reset, control } =
    useForm<UpdateIssueType>({
      resolver: zodResolver(schema),
      defaultValues: issue,
    });

  const { errors } = formState;

  useEffect(() => {
    reset(issue);
  }, [issue]);

  useEffect(() => {
    if (!errors) return;
    Object.entries(errors).forEach(([key, value]) => {
      toast.negative({ title: key, description: value.message });
    });
  }, [errors]);

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/issues/{issueId}',
    pathParams: { projectId, issueId: issue.id },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.positive({ title: t('toast.save') });
        close();
      },
      async onError({ message }) {
        toast.negative({ title: message });
      },
    },
  });

  const close = () => setOpen(false);
  const onSubmit = async (data: UpdateIssueType) => mutate(data);

  return (
    <Popper
      open={open}
      setOpen={setOpen}
      placement="right-start"
      buttonChildren={
        <button
          className="icon-btn icon-btn-sm icon-btn-tertiary"
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          <Icon name="DocumentStroke" />
        </button>
      }
    >
      <div className="m-5 flex w-[392px] justify-between">
        <h1 className="font-16-bold">{t('main.issue.setting')}</h1>
        <button
          className="icon-btn icon-btn-tertiary icon-btn-xs"
          onClick={close}
        >
          <Icon name="Close" />
        </button>
      </div>
      <form
        className="m-5"
        onSubmit={handleSubmit(onSubmit)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 space-y-[10px]">
          <Input
            label="Issue Id"
            placeholder="Issue Id"
            value={issue.id}
            disabled
          />
          <Input
            label="Issue"
            placeholder="Issue Name"
            {...register('name')}
            required
          />
          <Input
            label="Description"
            placeholder="Issue Description"
            {...register('description')}
            required={false}
          />
          <div className="relative">
            <span className="font-12-regular mb-[6px] block">Status</span>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Listbox value={field.value} onChange={field.onChange}>
                  <Listbox.Button className="input relative text-left">
                    <span className="block truncate">
                      {ISSUES(t).find((v) => v.key === field.value)?.name}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <Icon
                        className="h-5 w-5 text-gray-400"
                        name="TriangleDown"
                      />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="bg-primary absolute z-10 mt-1 w-full border shadow">
                    {ISSUES(t).map(({ key, name }) => (
                      <Listbox.Option
                        key={key}
                        value={key}
                        className={({ selected }) =>
                          'hover:bg-secondary cursor-pointer select-none p-3 ' +
                          (selected ? 'bg-secondary' : 'bg-primary')
                        }
                      >
                        {name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              )}
            />
          </div>
          <label className="block">
            <span className="font-12-regular mb-[6px] block">Ticket</span>
            <div className="flex items-center gap-2">
              <input
                className="input w-[120px]"
                value={issueTracker?.ticketKey}
                disabled
              />
              -
              <input
                className="input"
                placeholder="Ticket ID"
                {...register('externalIssueId')}
              />
            </div>
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setOpen(false)}
          >
            {t('button.cancel')}
          </button>
          <button
            className="btn btn-primary"
            disabled={!formState.isDirty || isPending}
          >
            {t('button.save')}
          </button>
        </div>
      </form>
    </Popper>
  );
};

export default IssueSettingPopover;
