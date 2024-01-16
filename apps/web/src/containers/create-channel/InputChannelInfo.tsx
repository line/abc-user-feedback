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
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { Input } from '@ufb/ui';

import { useCreateChannel } from '@/contexts/create-channel.context';
import client from '@/libs/client';
import type { InputChannelInfoType } from '@/types/channel.type';
import CreateChannelInputTemplate from './CreateChannelInputTemplate';

const defaultInputError = {};

interface IProps {}

const InputChannelInfo: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { input, onChangeInput } = useCreateChannel();

  const router = useRouter();
  const projectId = useMemo(
    () => Number(router.query.projectId),
    [router.query.projectId],
  );

  const [inputError, setInputError] = useState<{
    name?: string;
    description?: string;
  }>(defaultInputError);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

  const name = useMemo(() => input.channelInfo.name, [input.channelInfo.name]);
  const description = useMemo(
    () => input.channelInfo.description,
    [input.channelInfo.description],
  );

  const resetError = useCallback(() => {
    setInputError(defaultInputError);
    setIsSubmitted(false);
    setIsLoading(false);
  }, [defaultInputError]);

  useEffect(() => {
    resetError();
  }, [input.channelInfo]);

  const onChangeProjectInfo = useCallback(
    <T extends keyof InputChannelInfoType>(
      key: T,
      value: InputChannelInfoType[T],
    ) => {
      onChangeInput('channelInfo', { name, description, [key]: value });
    },
    [input.channelInfo],
  );

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
      setInputError((prev) => ({ ...prev, name: t('hint.required') }));
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
      path: '/api/projects/{projectId}/channels/name-check',
      pathParams: { projectId },
      query: { name },
    });
    if (isDuplicated) {
      setInputError((prev) => ({
        ...prev,
        name: t('hint.name-already-exists', { name: 'Channel Name' }),
      }));
      setIsLoading(false);
      isValid = false;
    }
    return isValid;
  };

  return (
    <CreateChannelInputTemplate
      validate={validate}
      disableNextBtn={
        !!inputError.name || !!inputError.description || isLoading
      }
    >
      <Input
        label="Channel Name"
        placeholder={t('placeholder', { name: 'Channel Name' })}
        value={name}
        onChange={(e) => onChangeProjectInfo('name', e.target.value)}
        required
        isSubmitted={isSubmitted}
        isValid={!inputError.name}
        hint={inputError.name}
      />
      <Input
        label="Channel Description"
        placeholder={t('placeholder', { name: 'Channel Description' })}
        value={description}
        onChange={(e) => onChangeProjectInfo('description', e.target.value)}
        isSubmitted={isSubmitted}
        isValid={!inputError.description}
        hint={inputError.description}
      />
    </CreateChannelInputTemplate>
  );
};

export default InputChannelInfo;
