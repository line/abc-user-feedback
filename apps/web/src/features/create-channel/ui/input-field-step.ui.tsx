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

import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';

import { Icon, ToggleGroup, ToggleGroupItem } from '@ufb/react';

import { FieldSettingSheet } from '@/entities/field';
import type { FieldInfo } from '@/entities/field';
import FieldTable from '@/entities/field/ui/field-table.ui';

import { useCreateChannelStore } from '../create-channel-model';
import CreateChannelInputTemplate from './create-channel-input-template.ui';

interface IProps {}

const InputFieldStep: React.FC<IProps> = () => {
  const { input, onChangeInput, jumpStepByKey } = useCreateChannelStore();
  const fields = input.fields;

  const { t } = useTranslation();

  const overlay = useOverlay();

  const createField = (field: FieldInfo) => {
    onChangeInput(
      'fields',
      input.fields.concat({ ...field, order: fields.length }),
    );
  };

  const updateField = (input: { index: number; field: FieldInfo }) => {
    const { field, index } = input;
    onChangeInput(
      'fields',
      fields.map((v, i) => (i === index ? field : v)),
    );
  };

  const deleteField = ({ index }: { index: number }) => {
    onChangeInput(
      'fields',
      input.fields.filter((_, i) => i !== index),
    );
  };

  const openFieldFormSheet = (input?: { index: number; field: FieldInfo }) => {
    overlay.open(({ close, isOpen }) => (
      <FieldSettingSheet
        isOpen={isOpen}
        close={close}
        onSubmit={(newField) => {
          if (input) {
            updateField({ index: input.index, field: newField });
            return;
          }
          createField(newField);
        }}
        fieldRows={fields}
        data={input?.field}
        onClickDelete={
          input ?
            () => {
              deleteField({ index: input.index });
              close();
            }
          : undefined
        }
      />
    ));
  };

  return (
    <CreateChannelInputTemplate
      actionButton={
        <ToggleGroup type="single" value="">
          <ToggleGroupItem value="item-1" onClick={() => openFieldFormSheet()}>
            <Icon name="RiAddLine" />
            {t('v2.button.name.add', { name: 'Field' })}
          </ToggleGroupItem>
          <ToggleGroupItem
            value="item-2"
            onClick={() => jumpStepByKey('field-preview')}
          >
            <Icon name="RiEyeLine" />
            {t('v2.text.preview')}
          </ToggleGroupItem>
        </ToggleGroup>
      }
    >
      <FieldTable
        fields={input.fields}
        onClickRow={(index, field) => openFieldFormSheet({ index, field })}
        disableFilter
      />
    </CreateChannelInputTemplate>
  );
};

export default InputFieldStep;
