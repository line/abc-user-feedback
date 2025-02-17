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

import { SelectInput } from '../inputs';
import type {
  TableFilter,
  TableFilterCondition,
  TableFilterField,
} from './table-filter-popover.type';

interface Props {
  field: TableFilterField;
  filter: TableFilter;
  onChange: (value: TableFilterCondition) => void;
}

const TableFilterPopoverSelectCondition = (props: Props) => {
  const { field, onChange, filter } = props;

  return (
    <SelectInput
      value={filter.condition}
      options={field.matchType.map((type) => ({
        label: type,
        value: type,
      }))}
      onChange={(value) => onChange(value as TableFilterCondition)}
    />
  );
};

export default TableFilterPopoverSelectCondition;
