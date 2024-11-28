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
import { Icon } from '@ufb/react';

import { FIELD_FORMAT_ICON_MAP } from '../field.constant';
import type { FieldFormat } from '../field.type';

interface Props {
  name: string;
  format: FieldFormat;
}

const FieldFormatLabel = ({ name, format }: Props) => {
  return (
    <div className="flex items-center gap-1">
      <Icon name={FIELD_FORMAT_ICON_MAP[format]} size={16} />
      {name}
    </div>
  );
};

export default FieldFormatLabel;
