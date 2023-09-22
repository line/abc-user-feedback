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
import {
  Badge,
  Popover,
  PopoverContent,
  PopoverHeading,
  PopoverTrigger,
} from '@ufb/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '@/types/field.type';

interface IProps {
  removeOption: (index: number) => void;
  index: number;
  option: OptionType;
}

const OptionDeletePopover: React.FC<IProps> = ({
  removeOption,
  index,
  option,
}) => {
  const { t } = useTranslation();
  const [targetOptionIndex, setTargetOptionIndex] = useState<number>();
  const close = () => setTargetOptionIndex(undefined);
  return (
    <Popover
      open={targetOptionIndex === index}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <PopoverTrigger asChild>
        <div className="relative">
          <Badge
            color="black"
            type="secondary"
            right={{
              iconName: 'Close',
              onClick: () =>
                option.id ? setTargetOptionIndex(index) : removeOption(index),
            }}
          >
            {option.name}
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent className="z-100">
        <PopoverHeading>
          {t('main.setting.dialog.delete-option.title')}
        </PopoverHeading>
        <div className="m-5">
          <p className="font-14-regular mb-10 whitespace-pre-line">
            {t('main.setting.dialog.delete-option.description')}
          </p>
          <div className="flex justify-end gap-2">
            <button className="btn btn-secondary" onClick={close}>
              {t('button.cancel')}
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                if (typeof targetOptionIndex !== 'undefined') {
                  removeOption(targetOptionIndex);
                }
                close();
              }}
            >
              {t('button.delete')}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default OptionDeletePopover;
