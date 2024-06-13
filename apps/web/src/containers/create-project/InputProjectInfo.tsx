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
import { useTranslation } from 'react-i18next';

import { Input } from '@ufb/ui';

import CreateProjectInputTemplate from './CreateProjectInputTemplate';

import { TimezoneSelectBox } from '@/components';
import { useCreateProject } from '@/contexts/create-project.context';
import client from '@/libs/client';
import type { InputProjectInfoType } from '@/types/project.type';

const defaultInputError = {};

interface IProps {}
const InputProjectInfo: React.FC<IProps> = () => {
  const { t } = useTranslation();
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
  const timezone = useMemo(
    () => input.projectInfo.timezone,
    [input.projectInfo.timezone],
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
      onChangeInput('projectInfo', {
        name,
        description,
        timezone,
        [key]: value,
      });
    },
    [input?.projectInfo],
  );

  useEffect(() => {
    resetError();
  }, [input.projectInfo]);

  const validate = async () => {
    setIsSubmitted(true);
    let isValid = true;

    if (name.length > 20) {
      setInputError((prev) => ({
        ...prev,
        name: t('hint.max-length', { length: 20 }),
      }));
      isValid = false;
    } else if (name.length === 0) {
      setInputError((prev) => ({
        ...prev,
        name: t('hint.required'),
      }));
      isValid = false;
    }
    if (description.length > 50) {
      setInputError((prev) => ({
        ...prev,
        description: t('hint.max-length', { length: 50 }),
      }));
      isValid = false;
    }

    setIsLoading(true);

    const { data: isDuplicated } = await client.get({
      path: '/api/admin/projects/name-check',
      query: { name },
    });
    if (isDuplicated) {
      setInputError((prev) => ({
        ...prev,
        name: t('hint.name-already-exists', { name: 'Project Name' }),
      }));
      setIsLoading(false);
      isValid = false;
    }
    return isValid;
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
        placeholder={t('placeholder', { name: 'Project Name' })}
        value={name}
        onChange={(e) => onChangeProjectInfo('name', e.target.value)}
        required
        isSubmitted={isSubmitted}
        isValid={!inputError.name}
        hint={inputError.name}
      />
      <Input
        label="Project Description"
        placeholder={t('placeholder', { name: 'Project Description' })}
        value={description}
        onChange={(e) => onChangeProjectInfo('description', e.target.value)}
        isSubmitted={isSubmitted}
        isValid={!inputError.description}
        hint={inputError.description}
      />
      <TimezoneSelectBox
        value={timezone}
        onChange={(option) => onChangeProjectInfo('timezone', option)}
      />
    </CreateProjectInputTemplate>
  );
};

export default InputProjectInfo;
