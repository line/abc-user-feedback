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

import { TextInput } from '@ufb/ui';

import { useCreateChannel } from '@/contexts/create-channel.context';
import type { InputProjectInfoType } from '@/types/project.type';
import CreateChannelInputTemplate from './CreateChannelInputTemplate';

interface IProps {}

const InputChannelInfo: React.FC<IProps> = () => {
  const { input, onChangeInput } = useCreateChannel();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(true);

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
  const validate = () => {
    setIsSubmitted(true);
    if (name.length < 2) {
      setIsValid(false);
      return false;
    }
    setIsValid(true);
    return true;
  };

  return (
    <CreateChannelInputTemplate
      validate={validate}
      disableNextBtn={name.length === 0}
    >
      <TextInput
        label="Channel Name"
        placeholder="채널 이름을 입력해주세요."
        value={name}
        onChange={(e) => onChangeProjectInfo('name', e.target.value)}
        required
        isSubmitted={isSubmitted}
        isValid={isValid}
        maxLength={20}
      />
      <TextInput
        label="Channel Description"
        placeholder="채널 설명을 입력해주세요."
        value={description}
        onChange={(e) => onChangeProjectInfo('description', e.target.value)}
        maxLength={50}
      />
    </CreateChannelInputTemplate>
  );
};

export default InputChannelInfo;
