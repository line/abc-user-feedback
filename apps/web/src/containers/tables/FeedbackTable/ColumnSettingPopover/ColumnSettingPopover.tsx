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
import { ColumnDef, Updater, VisibilityState } from '@tanstack/react-table';
import {
  Icon,
  Popover,
  PopoverContent,
  PopoverHeading,
  PopoverTrigger,
} from '@ufb/ui';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  DroppableProps,
  OnDragEndResponder,
} from 'react-beautiful-dnd';

import { FieldType } from '@/types/field.type';

import DraggableColumnItem from './DraggableColumnItem';

const reorder = (list: string[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
interface IProps extends React.PropsWithChildren {
  columns: ColumnDef<any, any>[];
  fieldData: FieldType[];
  columnOrder: string[];
  onChangeColumnOrder: (columns: string[]) => void;
  columnVisibility: VisibilityState;
  onChangeColumnVisibility: (visibility: Updater<VisibilityState>) => void;
  onClickReset: () => void;
}

const ColumnSettingPopover: React.FC<IProps> = ({
  columnOrder,
  onChangeColumnOrder,
  columnVisibility,
  onChangeColumnVisibility,
  fieldData,
  columns,
  onClickReset,
}) => {
  const { t } = useTranslation();

  const columnKeys = useMemo(
    () => columns.map((v) => v.id) as string[],
    [columns],
  );

  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    if (result.destination.index < 2) result.destination.index = 2;

    const newFields: string[] = reorder(
      columnOrder.length === 0 ? columnKeys : columnOrder,
      result.source.index,
      result.destination.index,
    );
    onChangeColumnOrder(['select'].concat(newFields));
  };

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger className="btn btn-secondary btn-sm gap-2">
          <Icon name="ViewColumnsStroke" size={16} />
          {t('main.feedback.column-setting')}
        </PopoverTrigger>
        <PopoverContent disabledFloatingStyle className="mt-1.5">
          <PopoverHeading>{t('main.feedback.column-setting')}</PopoverHeading>
          <div className="m-5">
            <DragDropContext onDragEnd={onDragEnd}>
              <StrictModeDroppable droppableId="list">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-1 min-w-[200px]"
                  >
                    {(columnOrder.length === 0 ? columnKeys : columnOrder)?.map(
                      (key, index) => (
                        <DraggableColumnItem
                          name={
                            fieldData.find((v) => v.key === key)?.name ?? ''
                          }
                          index={index}
                          key={key}
                          isChecked={
                            typeof columnVisibility[key] === 'undefined'
                              ? true
                              : columnVisibility[key]
                          }
                          onChange={(isChecked) =>
                            onChangeColumnVisibility((prev) => ({
                              ...prev,
                              [key]: isChecked,
                            }))
                          }
                          isDisabled={key === 'id' || key === 'issues'}
                        />
                      ),
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
            <div className="flex justify-end">
              <button
                className="mt-2 btn btn-sm btn-secondary"
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
