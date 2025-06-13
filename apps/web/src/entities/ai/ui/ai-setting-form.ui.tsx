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
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import {
  InputField,
  InputLabel,
  RadioCard,
  RadioCardGroup,
  Textarea,
} from '@ufb/react';

import { TextInput } from '@/shared';

import type { AI } from '../ai.type';

const AiSettingForm = () => {
  const { register, setValue, watch } = useFormContext<AI>();
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <RadioCardGroup
        value={watch('provider')}
        onValueChange={(v: 'OPEN_AI' | 'GEMINI') => setValue('provider', v)}
      >
        <RadioCard value="OPEN_AI" icon="RiGoogleFill" title="Open AI" />
        <RadioCard value="GEMINI" icon="RiToolsFill" title="Gemini" />
      </RadioCardGroup>
      <TextInput
        label="API Key"
        placeholder={t('v2.placeholder.text')}
        {...register('apiKey')}
        required
      />
      <TextInput
        label="Endpoint URL"
        placeholder={t('v2.placeholder.text')}
        {...register('endpointUrl')}
      />
      <InputField>
        <InputLabel>System Prompt</InputLabel>
        <Textarea
          placeholder={t('v2.placeholder.text')}
          {...register('systemPrompt')}
        />
      </InputField>
    </div>
  );
};

export default AiSettingForm;
