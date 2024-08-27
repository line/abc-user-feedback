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

import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@ufb/react';

import { useOAIQuery } from '@/shared';

interface IProps {
  projectId: number;
}

const ProjectSelectBox: React.FC<IProps> = ({ projectId }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const { data } = useOAIQuery({ path: '/api/admin/projects' });

  const onChangeProject = async (projectId: string) => {
    if (projectId === '0') {
      await router.push('/main/project/create');
      return;
    }
    await router.push({
      pathname: `/main/project/[projectId]/settings`,
      query: { projectId },
    });
  };

  return (
    <Select
      value={String(projectId)}
      onValueChange={(value) => onChangeProject(value)}
    >
      <SelectTrigger className="min-w-60">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data?.items.map(({ id, name }) => (
            <SelectItem key={id} value={String(id)}>
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectItem
          value="0"
          icon="RiAddCircleFill"
          className="text-tint-blue p-2"
        >
          {t('v2.text.create-project')}
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ProjectSelectBox;
