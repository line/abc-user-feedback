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

import { useCallback, useMemo } from 'react';

import { Input } from '@ufb/ui';

import { useCreateProject } from '@/contexts/create-project.context';
import type { InputProjectType } from '@/types/project.type';
import CreateProjectInputTemplate from './CreateProjectInputTemplate';

interface IProps {}

const InputProjectInfo: React.FC<IProps> = () => {
  const { input, onChangeInput } = useCreateProject();

  const name = useMemo(() => input.projectInfo.name, [input.projectInfo.name]);
  const description = useMemo(
    () => input.projectInfo.description,
    [input.projectInfo.description],
  );

  const onChangeProjectInfo = useCallback(
    <T extends keyof InputProjectType>(key: T, value: InputProjectType[T]) => {
      onChangeInput('projectInfo', { name, description, [key]: value });
    },
    [input?.projectInfo],
  );

  return (
    <CreateProjectInputTemplate
      validate={() => {
        return name.length >= 4;
      }}
    >
      <Input
        label="Project Name"
        placeholder="프로젝트 이름을 입력해주세요."
        value={name}
        onChange={(e) => onChangeProjectInfo('name', e.target.value)}
        required
      />
      <Input
        label="Project Description"
        placeholder="프로젝트 설명을 입력해주세요."
        value={description}
        onChange={(e) => onChangeProjectInfo('description', e.target.value)}
      />
    </CreateProjectInputTemplate>
  );
};

export default InputProjectInfo;
