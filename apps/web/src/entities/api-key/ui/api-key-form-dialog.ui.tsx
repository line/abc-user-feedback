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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { FormOverlayProps } from '@/shared';
import { FormDialog, SelectInput, TextInput } from '@/shared';

import type { ApiKeyFormSchema } from '../api-key.type';

interface Props extends FormOverlayProps<ApiKeyFormSchema> {}

const ApiKeyFormDialog: React.FC<Props> = (props) => {
  const { data, close, isOpen, onSubmit, onClickDelete } = props;
  const { t } = useTranslation();
  const [status, setStatus] = useState<ApiKeyFormSchema['status']>(
    data?.status ?? 'active',
  );

  return (
    <FormDialog
      isOpen={isOpen}
      close={close}
      title={t('v2.text.name.detail', { name: 'API Key' })}
      submitBtn={{
        disabled: status === data?.status,
        onClick: () => onSubmit({ value: data?.value ?? '', status }),
      }}
      deleteBtn={{
        disabled: false,
        onClick: onClickDelete,
      }}
    >
      <TextInput label="API Key" value={data?.value} disabled />
      <SelectInput
        label="Status"
        options={[
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ]}
        value={status}
        onChange={(value) => setStatus(value as 'active' | 'inactive')}
      />
    </FormDialog>
  );
};

export default ApiKeyFormDialog;
