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

import React, { useMemo, useState } from 'react';
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

import {
  client,
  cn,
  commandFilter,
  InfiniteScrollArea,
  usePermissions,
} from '@/shared';
import type { Category } from '@/entities/category';

import { useCategorySearchInfinite } from '../lib';
import CategoryComboboxEditPopover from './category-combobox-edit-popover.ui';

interface Props extends React.PropsWithChildren {
  category?: Category | null;
  issueId: number;
}
const CategoryCombobox = (props: Props) => {
  const { category, issueId, children } = props;

  const perms = usePermissions();
  const router = useRouter();
  const projectId = Number(router.query.projectId);
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState('');
  const throttledvalue = useThrottle(inputValue, 500);

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCategorySearchInfinite(Number(projectId), {
      limit: 10,
      categoryName: throttledvalue,
      sort: { name: 'ASC' },
    });

  const allcategories = useMemo(() => {
    return data.pages
      .map((v) => v?.items)
      .filter((v) => !!v)
      .flat();
  }, [data]);

  const refetch = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['/api/admin/projects/{projectId}/categories/search'],
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
      setInputValue('');
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
      <ComboboxContent options={{ filter: commandFilter }}>
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
            {allcategories
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
          </ComboboxGroup>
          <ComboboxGroup
            heading={
              <span className="text-neutral-tertiary text-base-normal">
                Category List
              </span>
            }
          >
            {allcategories
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
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </ComboboxGroup>
          {!!inputValue &&
            perms.includes('issue_update') &&
            !allcategories.some((v) => v.name === inputValue) && (
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
