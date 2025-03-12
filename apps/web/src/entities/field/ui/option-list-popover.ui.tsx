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

import { useTranslation } from 'next-i18next';

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icon,
  Tag,
} from '@ufb/react';

import type { FieldOptionInfo } from '../field.type';

interface IProps {
  options: FieldOptionInfo[];
}

const OptionListPopover: React.FC<IProps> = ({ options }) => {
  const { t } = useTranslation();

  return (
    <Dropdown>
      <DropdownTrigger asChild data-state="close">
        <Tag onClick={(e) => e.stopPropagation()}>
          {t('main.setting.option-info')}
          <Icon name="RiInformation2Line" />
        </Tag>
      </DropdownTrigger>
      <DropdownContent>
        {options.map((v) => (
          <DropdownItem key={v.key}>{v.name}</DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
};

export default OptionListPopover;
