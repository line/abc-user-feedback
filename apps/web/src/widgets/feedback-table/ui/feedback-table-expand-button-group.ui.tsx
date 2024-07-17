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

import { Icon } from '@ufb/ui';

import { cn } from '@/shared';

import type { FeedbackColumnType } from '../feedback-table-columns';

interface IProps {
  table: Table<FeedbackColumnType>;
}

const FeedbackTableExpandButtonGroup: React.FC<IProps> = ({ table }) => {
  const isAllExpanded = table.getIsAllRowsExpanded();

  return (
    <div
      className="bg-fill-quaternary relative z-0 flex rounded p-0.5"
      onClick={() => table.toggleAllRowsExpanded()}
    >
      <div
        className={cn([
          'bg-primary absolute h-[28px] w-[28px] rounded',
          !isAllExpanded ? 'left-0.5' : 'right-0.5',
        ])}
      />
      <button className="z-20 flex h-[28px] w-[28px] items-center justify-center">
        <Icon
          name="List"
          size={16}
          className={!isAllExpanded ? 'text-primary' : 'text-tertiary'}
        />
      </button>
      <button className="z-20 flex h-[28px] w-[28px] items-center justify-center">
        <Icon
          name="ViewRowsFill"
          size={16}
          className={isAllExpanded ? 'text-primary' : 'text-tertiary'}
        />
      </button>
    </div>
  );
};

export default FeedbackTableExpandButtonGroup;
