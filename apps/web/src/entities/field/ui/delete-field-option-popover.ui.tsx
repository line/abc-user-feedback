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

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Popover, PopoverContent, PopoverTrigger, Tag } from '@ufb/react';

import type { FieldOptionInfo } from '../field.type';

interface IProps {
  removeOption: (index: number) => void;
  index: number;
  option: FieldOptionInfo;
}

const DeleteFieldOptionPopover: React.FC<IProps> = (props) => {
  const { index, option, removeOption } = props;

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
          <Tag
            variant="secondary"
            iconR="RiCloseLargeLine"
            onClickIconR={() =>
              option.id ? setTargetOptionIndex(index) : removeOption(index)
            }
          >
            {option.name}
          </Tag>
        </div>
      </PopoverTrigger>
      <PopoverContent className="z-100">
        <h1>{t('main.setting.dialog.delete-option.title')}</h1>
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

export default DeleteFieldOptionPopover;
