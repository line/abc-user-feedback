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
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';

import type { EntityTable } from '@/shared';
import { BasicTable } from '@/shared';

import { memberColumns } from '../member-columns';
import type { MemberInfo } from '../member.type';

interface IProps extends EntityTable<MemberInfo> {}

const MemberTable: React.FC<IProps> = (props) => {
  const { isLoading, createButton, data, onClickRow } = props;

  const { t } = useTranslation();

  const table = useReactTable({
    columns: memberColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <BasicTable
      table={table}
      isLoading={isLoading}
      emptyCaption={t('v2.text.no-data.member')}
      createButton={createButton}
      onClickRow={onClickRow}
    />
  );
};

export default MemberTable;
