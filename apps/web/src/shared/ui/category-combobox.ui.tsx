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

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { useThrottle } from 'react-use';

import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  toast,
} from '@ufb/react';

import type { Category } from '@/entities/category';

import { client, useOAIQuery, usePermissions } from '../lib';
import { cn } from '../utils';
import CategoryComboboxEditPopover from './category-combobox-edit-popover.ui';
import InfiniteScrollArea from './infinite-scroll-area.ui';

interface Props extends React.PropsWithChildren {
  category?: Category | null;
  issueId: number;
}
const LIMIT = 20;
const CategoryCombobox = (props: Props) => {
  const { category, issueId, children } = props;

  const perms = usePermissions();
  const router = useRouter();
  const projectId = Number(router.query.projectId);
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState('');
  const throttledvalue = useThrottle(inputValue, 500);
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();

  const { data, isLoading } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/categories',
    variables: { projectId, categoryName: throttledvalue, limit: page * LIMIT },
  });

  const refetch = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['/api/admin/projects/{projectId}/categories'],
    });
    await queryClient.invalidateQueries({
      queryKey: ['/api/admin/projects/{projectId}/issues/search'],
    });
  };

  const { mutate: attachCategory } = useMutation({
    mutationFn: async ({ categoryId }: { categoryId: number }) => {
      const { data } = await client.put({
        path: '/api/admin/projects/{projectId}/issues/{issueId}/category/{categoryId}',
        pathParams: { projectId, issueId, categoryId },
      });
      return data;
    },
    async onSuccess() {
      await refetch();
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const { mutate: detachCategory } = useMutation({
    mutationFn: async ({ categoryId }: { categoryId: number }) => {
      const { data } = await client.delete({
        path: '/api/admin/projects/{projectId}/issues/{issueId}/category/{categoryId}',
        pathParams: { projectId, issueId, categoryId },
      });
      return data;
    },
    async onSuccess() {
      await refetch();
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const { mutateAsync: createCategory } = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const { data } = await client.post({
        path: '/api/admin/projects/{projectId}/categories',
        pathParams: { projectId },
        body: { name },
      });
      return data;
    },
    async onSuccess() {
      await refetch();
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <Combobox>
      <ComboboxTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          disabled={!perms.includes('issue_update')}
          className={cn(
            { 'opacity-50': !perms.includes('issue_update') },
            'w-fit',
          )}
        >
          {children}
        </button>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput
          onClick={(e) => e.stopPropagation()}
          onValueChange={(value) => setInputValue(value)}
          value={inputValue}
        />
        <ComboboxList onClick={(e) => e.stopPropagation()} maxHeight="200px">
          <ComboboxGroup
            heading={
              <span className="text-neutral-tertiary text-base-normal">
                Selected Category
              </span>
            }
          >
            {data?.items
              .filter((v) => category?.id === v.id)
              .map(({ id, name }) => (
                <ComboboxItem
                  key={id}
                  value={name}
                  onSelect={() => {
                    if (category?.id === id) detachCategory({ categoryId: id });
                    if (category?.id !== id) attachCategory({ categoryId: id });
                  }}
                >
                  <span className="flex-1">{name}</span>
                  <span className="text-neutral-tertiary text-small-normal">
                    Remove
                  </span>
                </ComboboxItem>
              ))}
            <InfiniteScrollArea
              fetchNextPage={() => setPage(page + 1)}
              hasNextPage={
                (data?.meta.itemCount ?? 0) < (data?.meta.totalItems ?? 0)
              }
            />
          </ComboboxGroup>
          <ComboboxGroup
            heading={
              <span className="text-neutral-tertiary text-base-normal">
                Category List
              </span>
            }
          >
            {data?.items
              .filter((v) => category?.id !== v.id)
              .map(({ id, name }) => (
                <ComboboxItem
                  key={id}
                  value={name}
                  onSelect={() => {
                    if (category?.id === id) detachCategory({ categoryId: id });
                    if (category?.id !== id) attachCategory({ categoryId: id });
                  }}
                >
                  <span className="flex-1">{name}</span>
                  <CategoryComboboxEditPopover
                    projectId={projectId}
                    cateogry={{ id, name }}
                  />
                </ComboboxItem>
              ))}
            <InfiniteScrollArea
              fetchNextPage={() => setPage(page + 1)}
              hasNextPage={
                (data?.meta.itemCount ?? 0) < (data?.meta.totalItems ?? 0)
              }
            />
          </ComboboxGroup>
          {isLoading && <div className="combobox-item">Loading...</div>}
          {!!inputValue &&
            !data?.items.some((v) => v.name === inputValue) &&
            !isLoading && (
              <div
                className="combobox-item"
                onClick={async () => {
                  const name = inputValue.trim();
                  const data = await createCategory({ name });
                  if (!data) return;
                  setInputValue(name);
                  attachCategory({ categoryId: data.id });
                }}
              >
                <span className="flex-1">{inputValue}</span>
                <span className="text-neutral-tertiary text-small-normal">
                  Create
                </span>
              </div>
            )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default CategoryCombobox;
