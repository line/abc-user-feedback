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
import { useMemo } from 'react';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import { BasicTable } from '@/shared';

import { getApiKeyColumns } from '../api-key-columns';
import type { ApiKey, ApiKeyUpdateType } from '../api-key.type';
import ApiKeyFormDialog from './api-key-form-dialog.ui';

interface IProps {
  isLoading?: boolean;
  apiKeys: ApiKey[];
  onClickDelete?: (id: number) => Promise<void> | void;
  onClickUpdate: (type: ApiKeyUpdateType, id: number) => Promise<void> | void;
  createButton: React.ReactNode;
}

const ApiKeyTable: React.FC<IProps> = (props) => {
  const { isLoading, apiKeys, onClickDelete, onClickUpdate, createButton } =
    props;

  const { t } = useTranslation();
  const overlay = useOverlay();
  const columns = useMemo(() => getApiKeyColumns(), []);

  const table = useReactTable({
    columns,
    data: apiKeys,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const openApiKeyDialog = (apiKey: ApiKey) => {
    overlay.open(({ close, isOpen }) => (
      <ApiKeyFormDialog
        close={close}
        isOpen={isOpen}
        data={{
          status: apiKey.deletedAt === null ? 'active' : 'inactive',
          value: apiKey.value,
        }}
        onSubmit={async (input) => {
          await onClickUpdate(
            input.status === 'active' ? 'recover' : 'softDelete',
            apiKey.id,
          );
          close();
        }}
        onClickDelete={async () => {
          await onClickDelete?.(apiKey.id);
          close();
        }}
      />
    ));
  };

  return (
    <BasicTable
      isLoading={isLoading}
      table={table}
      emptyCaption={t('v2.text.no-data.api-key')}
      createButton={createButton}
      classname={apiKeys.length === 0 ? 'h-full' : ''}
      onClickRow={(_, row) => openApiKeyDialog(row)}
    />
  );
};

export default ApiKeyTable;
