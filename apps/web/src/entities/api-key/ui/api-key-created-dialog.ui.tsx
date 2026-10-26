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

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ufb/react';

import { CopyIconButton } from '@/shared';

interface Props {
  isOpen: boolean;
  close: () => void;
  value: string;
}

/** Shows a newly created API key. This is the only time the raw key is shown. */
const ApiKeyCreatedDialog: React.FC<Props> = ({ isOpen, close, value }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={close} modal>
      <DialogContent radius="large">
        <DialogHeader>
          <DialogTitle>{t('main.api-key.created-title')}</DialogTitle>
          <DialogDescription>
            {t('main.api-key.created-description')}
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="border-neutral-tertiary text-base-strong flex items-center justify-between rounded border px-3 py-2 font-mono">
            <span className="break-all">{value}</span>
            <CopyIconButton data={value} />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose>{t('v2.button.confirm')}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyCreatedDialog;
