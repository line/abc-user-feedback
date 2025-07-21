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

import React from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import {
  InputCaption,
  InputField,
  InputLabel,
  Switch,
  Textarea,
} from '@ufb/react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  DescriptionTooltip,
  MultiSelectInput,
  SelectInput,
  Slider,
} from '@/shared';
import type { AIIssue } from '@/entities/ai';

import {
  DATA_REFERENCE_CONFIG,
  DEFAULT_FIELD_COLUMNS_KEYS,
  TEMPERATURE_CONFIG,
} from '../constants';

interface ChannelSelectProps {
  channels: { id: number; name: string }[] | undefined;
}

export const ChannelSelect: React.FC<ChannelSelectProps> = ({ channels }) => {
  const { setValue, watch, formState } = useFormContext<AIIssue>();

  return (
    <SelectInput
      options={
        channels?.map(({ id, name }) => ({
          value: String(id),
          label: name,
        })) ?? []
      }
      label="Channel"
      placeholder="Select a channel"
      onChange={(value) => {
        if (!value) return;
        setValue('channelId', +value, { shouldDirty: true });
        setValue('targetFieldKeys', [], { shouldDirty: true });
      }}
      value={watch('channelId') ? String(watch('channelId')) : ''}
      error={formState.errors.channelId?.message}
      required
    />
  );
};

interface FieldSelectProps {
  fields: { name: string; key: string }[] | undefined;
}

export const FieldSelect: React.FC<FieldSelectProps> = ({ fields }) => {
  const { setValue, watch, formState } = useFormContext<AIIssue>();

  return (
    <MultiSelectInput
      options={
        fields
          ?.filter((v) => !DEFAULT_FIELD_COLUMNS_KEYS.includes(v.key))
          .map(({ name, key }) => ({ value: key, label: name })) ?? []
      }
      label="Field"
      placeholder="Select a field"
      onChange={(value) => {
        setValue('targetFieldKeys', value, { shouldDirty: true });
      }}
      value={watch('targetFieldKeys')}
      error={formState.errors.targetFieldKeys?.message}
      required
    />
  );
};

export const PromptField: React.FC = () => {
  const { register, formState } = useFormContext<AIIssue>();
  const { t } = useTranslation();
  return (
    <InputField>
      <InputLabel>Prompt</InputLabel>
      <Textarea
        {...register('prompt')}
        placeholder={t('v2.placeholder.ai-field-template-prompt')}
      />
      {formState.errors.prompt?.message && (
        <InputCaption variant="error">
          {formState.errors.prompt.message}
        </InputCaption>
      )}
    </InputField>
  );
};

export const EnableTemplateCard: React.FC = () => {
  const { t } = useTranslation();
  const { setValue, watch } = useFormContext<AIIssue>();

  return (
    <Card size="sm">
      <CardHeader
        action={
          <Switch
            checked={watch('isEnabled')}
            onCheckedChange={(checked) =>
              setValue('isEnabled', checked, { shouldDirty: true })
            }
          />
        }
      >
        <CardTitle>Enable/Disable</CardTitle>
        <CardDescription>
          {t('v2.description.ai-issue-recommendation-enable')}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

interface ModelSelectProps {
  models: { id: string }[] | undefined;
}

export const ModelSelect: React.FC<ModelSelectProps> = ({ models }) => {
  const { setValue, watch, formState } = useFormContext<AIIssue>();

  return (
    <SelectInput
      options={
        models?.map(({ id }) => ({
          value: id,
          label: id,
        })) ?? []
      }
      label="Model"
      placeholder="Select a model"
      onChange={(value) => {
        if (!value) return;
        setValue('model', value, { shouldDirty: true });
      }}
      value={watch('model')}
      error={formState.errors.model?.message}
    />
  );
};

export const TemperatureSlider: React.FC = () => {
  const { setValue, watch } = useFormContext<AIIssue>();

  return (
    <InputField>
      <InputLabel>Temperature</InputLabel>
      <div className="border-neutral-tertiary rounded-8 flex gap-4 border p-6">
        <div>{TEMPERATURE_CONFIG.labels.min}</div>
        <Slider
          min={TEMPERATURE_CONFIG.min}
          max={TEMPERATURE_CONFIG.max}
          step={TEMPERATURE_CONFIG.step}
          value={[watch('temperature')]}
          onValueChange={(value) => {
            setValue('temperature', value[0] ?? 0, {
              shouldDirty: true,
            });
          }}
        />
        <div>{TEMPERATURE_CONFIG.labels.max}</div>
      </div>
    </InputField>
  );
};

export const DataReferenceSlider: React.FC = () => {
  const { t } = useTranslation();
  const { setValue, watch } = useFormContext<AIIssue>();

  return (
    <InputField>
      <InputLabel>
        Data Reference Amount
        <DescriptionTooltip
          description={t(
            'v2.description.ai-issue-recommendation-data-reference-amount',
          )}
        />
      </InputLabel>
      <div className="border-neutral-tertiary rounded-8 flex gap-4 border p-6">
        <div>{DATA_REFERENCE_CONFIG.labels.min}</div>
        <Slider
          min={DATA_REFERENCE_CONFIG.min}
          max={DATA_REFERENCE_CONFIG.max}
          step={DATA_REFERENCE_CONFIG.step}
          value={[watch('dataReferenceAmount')]}
          onValueChange={(value) => {
            setValue('dataReferenceAmount', value[0] ?? 3, {
              shouldDirty: true,
            });
          }}
        />
        <div>{DATA_REFERENCE_CONFIG.labels.max}</div>
      </div>
    </InputField>
  );
};
