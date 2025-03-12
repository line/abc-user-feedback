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
import type { Table } from '@tanstack/react-table';

import {
  Badge,
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxSelectItem,
  ComboboxTrigger,
  Icon,
} from '@ufb/react';

import type { FieldInfo } from '@/entities/field';
import { FieldFormatLabel } from '@/entities/field';

import type { Feedback } from '../feedback.type';

interface Props {
  table: Table<Feedback>;
  fields: FieldInfo[];
}

const FeedbackTableViewOptions = ({ table, fields }: Props) => {
  return (
    <Combobox>
      <ComboboxTrigger trigger="click">
        <Icon name="RiEyeLine" />
        View
        <Badge variant="subtle">{table.getVisibleFlatColumns().length}</Badge>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxList maxHeight="400px">
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide(),
            )
            .map((column) => {
              const field = fields.find((f) => f.key === column.id);
              if (!field) return null;
              return (
                <ComboboxSelectItem
                  key={column.id}
                  onSelect={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                  checked={column.getIsVisible()}
                >
                  <FieldFormatLabel format={field.format} name={field.name} />
                </ComboboxSelectItem>
              );
            })}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default FeedbackTableViewOptions;
