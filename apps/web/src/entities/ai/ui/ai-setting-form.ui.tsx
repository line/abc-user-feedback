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

import { FormField, RadioCard, RadioCardGroup } from '@ufb/react';

import { FormInput, FormTextarea } from '@/shared/ui/form-inputs';

import { GeminiIcon, OpenAIIcon } from '@/assets';
import type { AI } from '../ai.type';

const AiSettingForm = () => {
  const { setValue, watch, control } = useFormContext<AI>();
  const { t } = useTranslation();
  const [previousValues, setPreviousValues] = useState<
    Record<AI['provider'], { apiKey: string; endpointUrl: string }>
  >({
    GEMINI: { apiKey: '', endpointUrl: '' },
    OPEN_AI: { apiKey: '', endpointUrl: '' },
  });

  return (
    <div className="flex flex-col gap-4">
      <RadioCardGroup
        value={watch('provider')}
        onValueChange={(currentProvider: 'OPEN_AI' | 'GEMINI') => {
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
        }}
      >
        <RadioCard value="OPEN_AI" icon={<OpenAIIcon />} title="Open AI" />
        <RadioCard value="GEMINI" icon={<GeminiIcon />} title="Gemini" />
      </RadioCardGroup>
      <FormField
        control={control}
        name="apiKey"
        render={({ field }) => (
          <FormInput
            label="API Key"
            placeholder={t('v2.placeholder.text')}
            {...field}
            required
          />
        )}
      />
      <FormField
        control={control}
        name="endpointUrl"
        render={({ field }) => (
          <FormInput
            label="Endpoint URL"
            placeholder={t('v2.placeholder.ai-endpoint-url')}
            {...field}
          />
        )}
      />
      <FormField
        control={control}
        name="systemPrompt"
        render={({ field }) => (
          <FormTextarea
            label="System Prompt"
            placeholder={t('v2.placeholder.system-prompt')}
            {...field}
          />
        )}
      />
    </div>
  );
};

export default AiSettingForm;
