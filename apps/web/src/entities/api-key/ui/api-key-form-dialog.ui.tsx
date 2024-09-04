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

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@ufb/react';

import type { FormOverlayProps } from '@/shared';
import { SelectInput, TextInput } from '@/shared';

import type { ApiKeyFormSchema } from '../api-key.type';

interface Props extends FormOverlayProps<ApiKeyFormSchema> {}

const ApiKeyFormDialog: React.FC<Props> = (props) => {
  const { data, close, isOpen, onSubmit, onClickDelete } = props;
  const { t } = useTranslation();
  const [status, setStatus] = useState<ApiKeyFormSchema['status']>(
    data?.status ?? 'active',
  );

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogTitle>
          {t('v2.text.name.detail', { name: 'API Key' })}
        </DialogTitle>
        <div className="my-8 flex flex-col gap-5">
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
        </div>
        <DialogFooter>
          {onClickDelete && (
            <div className="flex-1">
              <Button variant="destructive" onClick={onClickDelete}>
                {t('v2.button.delete')}
              </Button>
            </div>
          )}
          <DialogClose asChild>
            <Button variant="outline">{t('v2.button.cancel')}</Button>
          </DialogClose>
          <Button
            onClick={() => onSubmit({ value: data?.value ?? '', status })}
          >
            {t('v2.button.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyFormDialog;
