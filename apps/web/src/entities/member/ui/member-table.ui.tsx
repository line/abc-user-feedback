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

import type { EntityTable } from '@/shared';
import { BasicTable } from '@/shared';
import type { ProjectInfo } from '@/entities/project';
import type { Role } from '@/entities/role';
import { useUserSearch } from '@/entities/user';

import { getMemberColumns } from '../member-columns';
import type { Member } from '../member.type';

interface IProps extends EntityTable<Member> {}

const MemberTable: React.FC<IProps> = (props) => {
  const { isLoading, createButton, data, onClickRow } = props;

  const { t } = useTranslation();

  const { data: userData } = useUserSearch({
    limit: 1000,
    query: { type: 'GENERAL' },
  });

  const columns = useMemo(
    () => getMemberColumns(userData?.items ?? []),
    [userData],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (originalRow) => String(originalRow.id),
  });

  return (
    <BasicTable
      table={table}
      isLoading={isLoading}
      emptyCaption={t('v2.text.no-data.member')}
      createButton={createButton}
      className={data.length === 0 ? 'h-full' : ''}
      onClickRow={onClickRow}
    />
  );
};

export default MemberTable;
