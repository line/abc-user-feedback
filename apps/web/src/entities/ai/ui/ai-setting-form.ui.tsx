/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import {
  InputCaption,
  InputField,
  InputLabel,
  RadioCard,
  RadioCardGroup,
  Textarea,
} from '@ufb/react';

import { TextInput } from '@/shared';

import type { AI } from '../ai.type';

const AiSettingForm = () => {
  const { register, setValue, watch, formState } = useFormContext<AI>();
  const { t } = useTranslation();
  const [previousValues, setPreviousValues] = useState<
    Record<
      AI['provider'],
      {
        apiKey: string;
        endpointUrl: string;
      }
    >
  >({
    GEMINI: {
      apiKey: '',
      endpointUrl: '',
    },
    OPEN_AI: {
      apiKey: '',
      endpointUrl: '',
    },
  });
  return (
    <div className="flex flex-col gap-4">
      <RadioCardGroup
        value={watch('provider')}
        onValueChange={(currentProvider: 'OPEN_AI' | 'GEMINI') => {
          // Update previous values when provider changes

          const {
            apiKey: previousApiKey,
            provider: previousProvider,
            endpointUrl: previousEndpointUrl,
          } = watch();
          setPreviousValues((prev) => ({
            ...prev,
            [previousProvider]: {
              apiKey: previousApiKey,
              endpointUrl: previousEndpointUrl,
            },
          }));

          setValue('provider', currentProvider, { shouldDirty: true });
          setValue('apiKey', previousValues[currentProvider].apiKey);
          setValue('endpointUrl', previousValues[currentProvider].endpointUrl);

          // const currentProvider = watch('provider');
          // const currentValues = previousValues[watch('provider')];
          // if (currentProvider && currentValues) {
          //   setPreviousValues((prev) => ({
          //     ...prev,
          //     [currentProvider]: {
          //       apiKey: watch('apiKey') || '',
          //       endpointUrl: watch('endpointUrl') || '',
          //     },
          //   }));
          // }
          // setValue('provider', v);
          // if (previousValues[v]) {
          //   setValue('apiKey', previousValues[v].apiKey);
          //   setValue('endpointUrl', previousValues[v].endpointUrl);
          // } else {
          //   setValue('apiKey', '');
          //   setValue('endpointUrl', '');
          // }
        }}
      >
        <RadioCard value="OPEN_AI" icon="RiGoogleFill" title="Open AI" />
        <RadioCard value="GEMINI" icon="RiToolsFill" title="Gemini" />
      </RadioCardGroup>
      <TextInput
        label="API Key"
        placeholder={t('v2.placeholder.text')}
        {...register('apiKey')}
        error={formState.errors.apiKey?.message}
        required
      />
      <TextInput
        label="Endpoint URL"
        placeholder={t('v2.placeholder.text')}
        {...register('endpointUrl')}
        error={formState.errors.endpointUrl?.message}
      />
      <InputField>
        <InputLabel>System Prompt</InputLabel>
        <Textarea
          placeholder={t('v2.placeholder.text')}
          {...register('systemPrompt')}
        />
        <div className="flex items-center justify-between">
          {!!formState.errors.systemPrompt?.message && (
            <InputCaption variant="error">
              {formState.errors.systemPrompt.message}
            </InputCaption>
          )}
          <InputCaption>{watch('systemPrompt')?.length} / 1000</InputCaption>
        </div>
      </InputField>
    </div>
  );
};

export default AiSettingForm;
