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
import type { TableFilterField } from './table-filter-popover.type';

interface Props {
  filterField: TableFilterField;
}

const TableFilterPopoverSelectOperator = (props: Props) => {
  const { filterField } = props;
  const operatorOptions = {
    text: [{ value: 'contains', label: 'Contains' }],
    keyword: [{ value: 'is', label: 'Is' }],
    number: [{ value: 'is', label: 'Is' }],
    date: [{ value: 'is', label: 'Is' }],
    select: [{ value: 'is', label: 'Is' }],
    multiSelect: [{ value: 'is', label: 'Is' }],
  };

  return (
    <SelectInput
      value={operatorOptions[filterField.format][0]?.value}
      options={operatorOptions[filterField.format]}
    />
  );
};

export default TableFilterPopoverSelectOperator;
