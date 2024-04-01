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
import { useCallback, useEffect, useState } from 'react';
import type { Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { Icon, toast } from '@ufb/ui';

import { TableCheckbox } from '@/components';
import { DATE_FORMAT } from '@/constants/dayjs-format';
import { ShareButton } from '@/containers/buttons';
import { useOAIMutation, usePermissions } from '@/hooks';
import useTableStore from '@/zustand/table.store';
import { TableRow } from '../../IssueTable/TableRow';
import FeedbackDetail from '../FeedbackDetail';

interface IProps {
  row: Row<any>;
  channelId: number;
  refetch: () => Promise<any>;
  projectId: number;
}

const FeedbackTableRow: React.FC<IProps> = ({
  projectId,
  row,
  channelId,
  refetch,
}) => {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<number>();

  const { disableEditState, enableEditState, editableState, editInput } =
    useTableStore();

  const perms = usePermissions();
  useEffect(() => {
    disableEditState();
  }, [channelId]);

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}',
    pathParams: { projectId, channelId, feedbackId: row.original.id },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const toggleRow = useCallback(
    (isExpand?: boolean) => {
      row.toggleExpanded(isExpand ? isExpand : !row.getIsExpanded());
    },
    [row],
  );

  const editRow = useCallback(() => {
    toggleRow(true);
    enableEditState(row.original.id);
  }, [row, toggleRow]);

  const onSubmit = () => {
    mutate(editInput as any);
    disableEditState();
  };
  const onOpenChange = (open: boolean) =>
    setOpenId(open ? row.original.id : undefined);

  const open = openId === row.original.id;

  return (
    <>
      <TableRow
        isSelected={row.getIsExpanded() || open}
        onClick={!editableState ? () => onOpenChange(true) : undefined}
        hoverElement={
          <>
            <TableCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
            {editableState !== row.original.id ?
              <>
                <button
                  className="icon-btn icon-btn-sm icon-btn-tertiary"
                  onClick={editRow}
                  disabled={!perms.includes('feedback_update')}
                >
                  <Icon name="EditStroke" size={16} />
                </button>
                <ShareButton
                  pathname={`/main/project/${projectId}/feedback?ids=${
                    row.original.id
                  }&channelId=${channelId}&createdAt=${dayjs(
                    row.original.createdAt,
                  ).format(DATE_FORMAT)}~${dayjs(row.original.createdAt).format(
                    DATE_FORMAT,
                  )}`}
                />
              </>
            : <>
                <button
                  className="icon-btn icon-btn-sm icon-btn-tertiary"
                  onClick={() => {
                    toggleRow(false);
                    disableEditState();
                  }}
                >
                  <Icon name="Close" size={16} className="text-red-primary" />
                </button>
                <button
                  className="icon-btn icon-btn-sm icon-btn-tertiary"
                  onClick={() => {
                    onSubmit();
                    toggleRow(false);
                  }}
                  disabled={isPending}
                >
                  <Icon name="Check" size={16} className="text-blue-primary" />
                </button>
              </>
            }
          </>
        }
      >
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} style={{ width: cell.column.getSize() }}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </TableRow>
      {open && (
        <FeedbackDetail
          id={row.original.id}
          key={row.original.id}
          channelId={channelId}
          projectId={projectId}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  );
};

export default FeedbackTableRow;
