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
import { useTranslation } from 'react-i18next';

import { OptionType } from '@/types/field.type';

interface IProps extends React.PropsWithChildren {
  options: OptionType[];
}

const OptionInfoPopover: React.FC<IProps> = ({ options }) => {
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger>
        <span className="text-blue-primary font-12-regular underline cursor-pointer">
          {t('main.setting.option-info')}
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeading>{t('main.setting.option-info')}</PopoverHeading>
        <div className="m-4 flex flex-wrap gap-2 min-w-[200px] max-w-[340px]">
          {options.map((v) => (
            <Badge key={v.key} type="secondary">
              {v.name}
            </Badge>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default OptionInfoPopover;
