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
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import { BasicTable } from '@/shared';

import { getApiKeyColumns } from '../api-key-columns';
import type { ApiKey, ApiKeyUpdateType } from '../api-key.type';

interface IProps {
  isLoading?: boolean;
  apiKeys: ApiKey[];
  onClickDelete?: (id: number) => void;
  onClickUpdate?: (type: ApiKeyUpdateType, id: number) => void;
}

const ApiKeyTable: React.FC<IProps> = (props) => {
  const { isLoading, apiKeys, onClickDelete, onClickUpdate } = props;

  const { t } = useTranslation();

  const table = useReactTable({
    columns: getApiKeyColumns(onClickDelete, onClickUpdate),
    data: apiKeys,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });

  return (
    <BasicTable
      isLoading={isLoading}
      table={table}
      emptyComponent={
        <div className="my-32 flex flex-col items-center justify-center gap-3">
          <Icon
            name="WarningTriangleFill"
            className="text-quaternary"
            size={32}
          />
          <p className="text-secondary">{t('text.no-data')}</p>
        </div>
      }
    />
  );
};

export default ApiKeyTable;
