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
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@ufb/react';

import { SelectInput } from '@/shared';

const EXPIRY_DAYS = [30, 90, 180, 365];
const NEVER = 'never';

interface Props {
  isOpen: boolean;
  close: () => void;
  onSubmit: (input: { expiresAt: string | null }) => Promise<void> | void;
}

const CreateApiKeyDialog: React.FC<Props> = ({ isOpen, close, onSubmit }) => {
  const { t } = useTranslation();
  const [expiry, setExpiry] = useState<string>(NEVER);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await onSubmit({
        expiresAt:
          expiry === NEVER ? null : (
            dayjs().add(Number(expiry), 'day').toISOString()
          ),
      });
      close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={close} modal>
      <DialogContent radius="large">
        <DialogTitle>
          {t('v2.button.name.create', { name: 'API Key' })}
        </DialogTitle>
        <DialogBody>
          <SelectInput
            label={t('main.api-key.expiry')}
            options={[
              { label: t('main.api-key.never'), value: NEVER },
              ...EXPIRY_DAYS.map((count) => ({
                label: t('main.api-key.days', { count }),
                value: String(count),
              })),
            ]}
            value={expiry}
            onChange={(value) => setExpiry(value ?? NEVER)}
          />
        </DialogBody>
        <DialogFooter>
          <DialogClose>{t('v2.button.cancel')}</DialogClose>
          <Button onClick={submit} loading={loading}>
            {t('v2.button.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateApiKeyDialog;
