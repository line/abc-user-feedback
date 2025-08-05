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

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

import {
  Badge,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icon,
  TextInput,
  toast,
} from '@ufb/react';

import { client } from '@/shared';
import type { Category } from '@/entities/category';

interface Props {
  projectId: number;
  cateogry: Category;
}

const CategoryComboboxEditPopover = (props: Props) => {
  const { projectId, cateogry } = props;

  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const refetch = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['/api/admin/projects/{projectId}/categories/search'],
    });
    await queryClient.invalidateQueries({
      queryKey: ['/api/admin/projects/{projectId}/issues/search'],
    });
  };

  const [inputValue, setInputValue] = useState(cateogry.name);

  const { mutate: updateCategory } = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const { data } = await client.put({
        path: '/api/admin/projects/{projectId}/categories/{categoryId}',
        pathParams: { projectId, categoryId: cateogry.id },
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
  const { mutate: deleteCategory } = useMutation({
    mutationFn: async () => {
      const { data } = await client.delete({
        path: '/api/admin/projects/{projectId}/categories/{categoryId}',
        pathParams: { projectId, categoryId: cateogry.id },
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
    <Dropdown>
      <DropdownTrigger asChild>
        <Badge variant="subtle" onClick={(e) => e.stopPropagation()}>
          Edit
        </Badge>
      </DropdownTrigger>
      <DropdownContent onClick={(e) => e.stopPropagation()} side="right">
        <div className="border-b">
          <TextInput
            className="border-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
                const name = inputValue.trim();
                updateCategory({ name });
                setInputValue(name);
              }
            }}
          />
        </div>
        <DropdownItem
          className="gap-2"
          onSelect={() => deleteCategory(undefined)}
        >
          <Icon name="RiDeleteBin5Fill" size={16} />
          Delete Category
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
};

export default CategoryComboboxEditPopover;
