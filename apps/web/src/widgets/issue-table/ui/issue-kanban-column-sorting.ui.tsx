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

import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

import {
  Button,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ufb/react';

import { SelectInput } from '@/shared';

interface Props {
  sort: { key: string; value: string };
  onSubmit: (input: { key: string; value: string }) => void;
}

const IssueKanbanColumnSorting = (props: Props) => {
  const { sort, onSubmit } = props;
  const [currentKey, setCurrentKey] = useState(sort.key);
  const [currentValue, setCurrentValue] = useState(sort.value);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCurrentKey(sort.key);
    setCurrentValue(sort.value);
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-8">
          <Icon
            name="RiArrowUpDownFill"
            size={16}
            className="text-neutral-inverse"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex min-w-[320px] flex-col gap-5 p-5">
        <p className="text-title-h5">Sort</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <SelectInput
              options={[
                { label: 'Created', value: 'createdAt' },
                { label: 'Updated', value: 'updatedAt' },
                { label: 'Feedbacks', value: 'feedbackCount' },
              ]}
              value={currentKey}
              onChange={(value) => value && setCurrentKey(value)}
            />
          </div>
          <div className="flex-1">
            <SelectInput
              options={[
                { label: 'Desc', value: 'DESC' },
                { label: 'Asc', value: 'ASC' },
              ]}
              value={currentValue}
              onChange={(value) => value && setCurrentValue(value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 [&>button]:min-w-20">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('v2.button.cancel')}
          </Button>
          <Button
            onClick={() => onSubmit({ key: currentKey, value: currentValue })}
          >
            {t('v2.button.confirm')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IssueKanbanColumnSorting;
