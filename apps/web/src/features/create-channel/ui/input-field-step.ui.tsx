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

import { FieldSettingPopover } from '@/entities/field';
import type { FieldInfo } from '@/entities/field';
import FieldTable from '@/entities/field/ui/field-table.ui';

import { useCreateChannelStore } from '../create-channel-model';
import CreateChannelInputTemplate from './create-channel-input-template.ui';

interface IProps {}

const InputFieldStep: React.FC<IProps> = () => {
  const { input, onChangeInput } = useCreateChannelStore();

  const createField = (field: FieldInfo) => {
    onChangeInput('fields', input.fields.concat(field));
  };

  const updateField = ({
    field,
    index,
  }: {
    index: number;
    field: FieldInfo;
  }) => {
    onChangeInput(
      'fields',
      input.fields.map((v, i) => (i === index ? field : v)),
    );
  };

  const deleteField = ({ index }: { index: number }) => {
    onChangeInput(
      'fields',
      input.fields.filter((_, i) => i !== index),
    );
  };

  return (
    <CreateChannelInputTemplate
      actionButton={
        <FieldSettingPopover onSave={createField} fieldRows={input.fields} />
      }
    >
      <FieldTable
        isInputStep
        fields={input.fields}
        onDeleteField={deleteField}
        onModifyField={updateField}
      />
    </CreateChannelInputTemplate>
  );
};

export default InputFieldStep;
