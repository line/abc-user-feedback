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
import { useTranslation } from 'react-i18next';

import { CreateSectionTemplate } from '@/components/templates/CreateSectionTemplate';
import type { FieldType } from '@/types/field.type';
import PreviewTable from '../setting-menu/FieldSetting/PreviewTable';

interface IProps {
  fields: FieldType[];
}

const FieldPreviewSection: React.FC<IProps> = ({ fields }) => {
  const { t } = useTranslation();
  return (
    <CreateSectionTemplate
      title={'Field ' + t('main.setting.field-mgmt.preview')}
    >
      <PreviewTable fields={fields} />
    </CreateSectionTemplate>
  );
};

export default FieldPreviewSection;
