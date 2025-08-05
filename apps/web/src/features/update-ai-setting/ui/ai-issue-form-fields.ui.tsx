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

import { FormField, InputField, Label, Switch } from '@ufb/react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  DescriptionTooltip,
  Slider,
} from '@/shared';
import {
  FormMultiSelect,
  FormSelect,
  FormTextarea,
} from '@/shared/ui/form-inputs';
import type { AIIssue } from '@/entities/ai';

import { DATA_REFERENCE_CONFIG, TEMPERATURE_CONFIG } from '../constants';

interface ChannelSelectProps {
  channels: { id: number; name: string }[] | undefined;
}

export const ChannelSelect: React.FC<ChannelSelectProps> = ({ channels }) => {
  const { setValue, control } = useFormContext<AIIssue>();

  return (
    <FormField
      control={control}
      name="channelId"
      render={({ field }) => (
        <FormSelect
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
            field.onChange(+value);
            setValue('targetFieldKeys', []);
          }}
          value={field.value ? String(field.value) : ''}
          required
        />
      )}
    />
  );
};

interface FieldSelectProps {
  fields: { name: string; key: string }[] | undefined;
}

export const FieldSelect: React.FC<FieldSelectProps> = ({ fields }) => {
  const { control } = useFormContext<AIIssue>();

  return (
    <FormField
      name="targetFieldKeys"
      control={control}
      render={({ field }) => (
        <FormMultiSelect
          options={
            fields
              ?.filter((v) => v.key !== 'issues')
              .map(({ name, key }) => ({ value: key, label: name })) ?? []
          }
          label="Target Field"
          placeholder="Select a field"
          {...field}
          required
        />
      )}
    />
  );
};

export const PromptField: React.FC = () => {
  const { control } = useFormContext<AIIssue>();
  const { t } = useTranslation();
  return (
    <FormField
      name="prompt"
      control={control}
      render={({ field }) => (
        <FormTextarea
          label="Prompt"
          {...field}
          placeholder={t('v2.placeholder.ai-field-reccommendation-prompt')}
        />
      )}
    />
  );
};

export const EnableTemplateCard: React.FC = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<AIIssue>();

  return (
    <Card size="sm">
      <CardHeader
        action={
          <FormField
            control={control}
            name="isEnabled"
            render={({ field }) => (
              <Switch
                defaultChecked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
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
  const { control } = useFormContext<AIIssue>();

  return (
    <FormField
      control={control}
      name="model"
      render={({ field }) => (
        <FormSelect
          options={
            models?.map(({ id }) => ({
              value: id,
              label: id,
            })) ?? []
          }
          label="Model"
          placeholder="Select a model"
          onChange={field.onChange}
          value={field.value}
        />
      )}
    />
  );
};

export const TemperatureSlider: React.FC = () => {
  const { setValue, watch } = useFormContext<AIIssue>();

  return (
    <InputField>
      <Label>Temperature</Label>
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
      <Label>
        Data Reference Amount
        <DescriptionTooltip
          description={t(
            'v2.description.ai-issue-recommendation-data-reference-amount',
          )}
        />
      </Label>
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
