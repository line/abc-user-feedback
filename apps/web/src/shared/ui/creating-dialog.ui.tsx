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

import { useTranslation } from 'next-i18next';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogTitle,
} from '@ufb/react';

interface Props {
  onRestart: () => void;
  onContinue: () => void;
  isOpen: boolean;
  close: () => void;
  type: 'Project' | 'Channel';
}

const CreatingDialog: React.FC<Props> = ({
  onRestart,
  onContinue,
  isOpen,
  close,
  type,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent radius="large">
        <DialogHeader>
          <DialogIcon name="RiInformation2Fill" variant="informative" />
          <DialogTitle>{t('dialog.continue.title')}</DialogTitle>
          <DialogDescription>
            {t('dialog.continue.description', { type })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onRestart}>
              {t('dialog.continue.button.restart')}
            </Button>
          </DialogClose>
          <Button variant="primary" onClick={onContinue}>
            {t('dialog.continue.button.continue')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatingDialog;
