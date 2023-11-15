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

import { Input } from '@ufb/ui';

import { CreateSectionTemplate } from '@/components/templates';

interface IProps {
  name: string;
  description: string;
}

const ProjectInfoSection: React.FC<IProps> = ({ description, name }) => {
  const { t } = useTranslation();
  return (
    <CreateSectionTemplate
      title={t('main.setting.subtitle.project-info')}
      defaultOpen
    >
      <Input label="Project Name" value={name} required disabled />
      <Input label="Project Description" value={description} disabled />
    </CreateSectionTemplate>
  );
};

export default ProjectInfoSection;
