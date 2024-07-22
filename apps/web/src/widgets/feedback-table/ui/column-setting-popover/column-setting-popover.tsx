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
import { useEffect, useMemo, useState } from 'react';
import type { Table, VisibilityState } from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';
import type { DroppableProps, OnDragEndResponder } from 'react-beautiful-dnd';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import {
  Icon,
  Popover,
  PopoverContent,
  PopoverHeading,
  PopoverTrigger,
} from '@ufb/ui';

import { reorder } from '@/shared';
import type { Field } from '@/entities/field';

import type { FeedbackColumnType } from '../../feedback-table-columns';
import DraggableColumnItem from './draggable-column-item';

interface IProps extends React.PropsWithChildren {
  fieldData: Field[];
  table: Table<FeedbackColumnType>;
}

const ColumnSettingPopover: React.FC<IProps> = ({ fieldData, table }) => {
  const columns = table.getAllColumns();

  const { columnOrder, columnVisibility } = table.getState();

  const { t } = useTranslation();

  const columnKeys = useMemo(
    () =>
      columnOrder.length === 0 ? columns.map((v) => v.id)
      : columnOrder.length === columns.length ? columnOrder
      : columnOrder.concat(
          columns.filter((v) => !columnOrder.includes(v.id)).map((v) => v.id),
        ),
    [columns, columnOrder],
  );

  const onClickReset = () => {
    table.resetColumnOrder();
    table.setColumnVisibility(
      fieldData.reduce(
        (acc, v) => ({ ...acc, [v.key]: v.status !== 'INACTIVE' }),
        {} as VisibilityState,
      ),
    );
  };

  const checkedNum = useMemo(() => {
    return columnKeys.reduce((acc, key) => {
      return (
        acc +
        (typeof columnVisibility[key] === 'undefined' ? 1
        : columnVisibility[key] ? 1
        : 0)
      );
    }, 0);
  }, [columnKeys, columnVisibility]);

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (destination.index === source.index) return;
    if (destination.index < 2) destination.index = 2;

    const newFields: string[] = reorder(
      columnKeys,
      source.index + 1,
      destination.index + 1,
    );

    table.setColumnOrder(newFields);
  };

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger className="btn btn-secondary btn-sm gap-2">
          <Icon name="ViewColumnsStroke" size={16} />
          {t('main.feedback.column-setting')}
        </PopoverTrigger>
        <PopoverContent disabledFloatingStyle className="mt-1.5">
          <PopoverHeading className="whitespace-nowrap">
            {t('main.feedback.column-setting')} {checkedNum}
            <span className="text-tertiary">/{columnKeys.length}</span>
          </PopoverHeading>
          <div className="m-5">
            <DragDropContext onDragEnd={onDragEnd}>
              <StrictModeDroppable droppableId="list">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-w-[200px] space-y-1"
                  >
                    {columnKeys
                      .filter((v) => v !== 'select')
                      .map((key, index) => (
                        <DraggableColumnItem
                          name={
                            fieldData.find((v) => v.key === key)?.name ?? ''
                          }
                          index={index}
                          key={key}
                          isChecked={
                            typeof columnVisibility[key] === 'undefined' ?
                              true
                            : !!columnVisibility[key]
                          }
                          onChange={(isChecked) =>
                            table.setColumnVisibility((prev) => ({
                              ...prev,
                              [key]: isChecked,
                            }))
                          }
                          isDisabled={key === 'id' || key === 'issues'}
                        />
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
            <div className="flex justify-end">
              <button
                className="btn btn-sm btn-secondary mt-2"
                onClick={onClickReset}
              >
                {t('button.reset')}
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) return null;

  return <Droppable {...props}>{children}</Droppable>;
};

export default ColumnSettingPopover;
