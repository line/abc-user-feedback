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
  isOpen: boolean;
  close: () => void;
  onSubmit: () => void;
}

const WarnIfUnsavedChangesDialog: React.FC<Props> = (props) => {
  const { close, isOpen, onSubmit } = props;
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent radius="large">
        <DialogHeader>
          <DialogIcon name="RiAlertFill" variant="warning" />
          <DialogTitle>
            {t('v2.dialog.warn-if-unsaved-changes.title')}
          </DialogTitle>
          <DialogDescription>
            {t('v2.dialog.warn-if-unsaved-changes.description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>{t('v2.button.cancel')}</DialogClose>
          <Button variant="primary" onClick={onSubmit}>
            {t('v2.button.out')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarnIfUnsavedChangesDialog;
