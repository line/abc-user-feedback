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

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Input } from '@ufb/ui';

import { useCreateProject } from '@/contexts/create-project.context';
import client from '@/libs/client';
import type { InputProjectInfoType } from '@/types/project.type';
import CreateProjectInputTemplate from './CreateProjectInputTemplate';

const defaultInputError = {};

interface IProps {}
const InputProjectInfo: React.FC<IProps> = () => {
  const { input, onChangeInput } = useCreateProject();

  const [inputError, setInputError] = useState<{
    name?: string;
    description?: string;
  }>(defaultInputError);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

  const name = useMemo(() => input.projectInfo.name, [input.projectInfo.name]);
  const description = useMemo(
    () => input.projectInfo.description,
    [input.projectInfo.description],
  );

  const resetError = useCallback(() => {
    setInputError(defaultInputError);
    setIsSubmitted(false);
    setIsLoading(false);
  }, [defaultInputError]);

  const onChangeProjectInfo = useCallback(
    <T extends keyof InputProjectInfoType>(
      key: T,
      value: InputProjectInfoType[T],
    ) => {
      onChangeInput('projectInfo', { name, description, [key]: value });
    },
    [input?.projectInfo],
  );

  useEffect(() => {
    resetError();
  }, [input.projectInfo]);

  const validate = async () => {
    setIsSubmitted(true);
    if (name.length > 20) {
      setInputError((prev) => ({
        ...prev,
        name: '프로젝트 이름은 20자 이하로 입력해주세요.',
      }));
      return false;
    } else if (name.length === 0) {
      setInputError((prev) => ({
        ...prev,
        name: '필수 입력 대상입니다.',
      }));
      return false;
    }
    if (description.length > 50) {
      setInputError((prev) => ({
        ...prev,
        description: '프로젝트 설명은 50자 이하로 입력해주세요.',
      }));
      return false;
    }

    setIsLoading(true);
    const { data: isDuplicated } = await client.get({
      path: '/api/projects/name-check',
      query: { name },
    });
    if (isDuplicated) {
      setInputError((prev) => ({
        ...prev,
        name: '이미 존재하는 프로젝트 이름입니다.',
      }));
      setIsLoading(false);
      return false;
    }
    return true;
  };

  return (
    <CreateProjectInputTemplate
      validate={validate}
      disableNextBtn={
        !!inputError.name || !!inputError.description || isLoading
      }
    >
      <Input
        label="Project Name"
        placeholder="프로젝트 이름을 입력해주세요."
        value={name}
        onChange={(e) => onChangeProjectInfo('name', e.target.value)}
        required
        isSubmitted={isSubmitted}
        isValid={!inputError.name}
        hint={inputError.name}
      />
      <Input
        label="Project Description"
        placeholder="프로젝트 설명을 입력해주세요."
        value={description}
        onChange={(e) => onChangeProjectInfo('description', e.target.value)}
        isSubmitted={isSubmitted}
        isValid={!inputError.description}
        hint={inputError.description}
      />
    </CreateProjectInputTemplate>
  );
};

export default InputProjectInfo;
