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

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { TextInput } from '@ufb/ui';

import { useCreateChannel } from '@/contexts/create-channel.context';
import client from '@/libs/client';
import type { InputProjectInfoType } from '@/types/project.type';
import CreateChannelInputTemplate from './CreateChannelInputTemplate';

const defaultInputError = { name: '', description: '' };

interface IProps {}

const InputChannelInfo: React.FC<IProps> = () => {
  const { input, onChangeInput } = useCreateChannel();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputError, setInputError] = useState<{
    name: string;
    description: string;
  }>(defaultInputError);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const projectId = useMemo(
    () => Number(router.query.projectId),
    [router.query.projectId],
  );

  const name = useMemo(() => input.channelInfo.name, [input.channelInfo.name]);

  const description = useMemo(
    () => input.channelInfo.description,
    [input.channelInfo.description],
  );

  const onChangeProjectInfo = useCallback(
    <T extends keyof InputProjectInfoType>(
      key: T,
      value: InputProjectInfoType[T],
    ) => {
      setIsSubmitted(false);
      onChangeInput('channelInfo', { name, description, [key]: value });
    },
    [input.channelInfo],
  );
  const resetError = useCallback(() => {
    setInputError(defaultInputError);
    setIsSubmitted(false);
  }, [defaultInputError]);
  const validate = async () => {
    setIsLoading(true);

    resetError();

    const { data: isDuplicated } = await client.get({
      path: '/api/projects/{projectId}/channels/name-check',
      pathParams: { projectId },
      query: { name },
    });
    setIsSubmitted(true);
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
    <CreateChannelInputTemplate
      validate={validate}
      disableNextBtn={name.length === 0 || isLoading}
    >
      <TextInput
        label="Channel Name"
        placeholder="채널 이름을 입력해주세요."
        value={name}
        onChange={(e) => onChangeProjectInfo('name', e.target.value)}
        required
        isSubmitted={isSubmitted}
        isValid={!inputError.name}
        hint={inputError.name}
        maxLength={20}
      />
      <TextInput
        label="Channel Description"
        placeholder="채널 설명을 입력해주세요."
        value={description}
        onChange={(e) => onChangeProjectInfo('description', e.target.value)}
        isSubmitted={isSubmitted}
        isValid={!inputError.description}
        hint={inputError.description}
        maxLength={50}
      />
    </CreateChannelInputTemplate>
  );
};

export default InputChannelInfo;
