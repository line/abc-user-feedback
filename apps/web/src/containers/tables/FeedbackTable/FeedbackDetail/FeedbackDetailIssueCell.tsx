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
import { useEffect, useRef, useState } from 'react';

import { Badge, Icon, Popover, PopoverContent, PopoverTrigger } from '@ufb/ui';

import { getStatusColor } from '@/constants/issues';
import type { IssueType } from '@/types/issue.type';

interface IProps {
  issues: IssueType[];
}

const FeedbackDetailIssueCell: React.FC<IProps> = ({ issues }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOverflow, setOverflow] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;
    const newState = ref.current.clientWidth < ref.current.scrollWidth;
    if (newState === isOverflow) return;
    setOverflow(newState);
  }, [ref.current, issues]);

  return (
    <div className="relative flex w-[260px] gap-1 overflow-hidden" ref={ref}>
      {issues.map((v) => (
        <Badge key={v.id} color={getStatusColor(v.status)} type="secondary">
          {v.name}
        </Badge>
      ))}
      {isOverflow && (
        <div className="bg-primary absolute -top-1 right-0 pl-2">
          <Popover placement="bottom-end">
            <PopoverTrigger asChild>
              <button className="icon-btn icon-btn-tertiary icon-btn-sm">
                <Icon name="Dots" />
              </button>
            </PopoverTrigger>
            <PopoverContent isPortal>
              <div>
                <h3 className="font-12-bold px-3 py-2">전체</h3>
                <ul>
                  {issues.map((v) => (
                    <li key={v.id} className="px-3 py-2">
                      <Badge color={getStatusColor(v.status)} type="secondary">
                        {v.name}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default FeedbackDetailIssueCell;
