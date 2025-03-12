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

interface IProps {
  onClickDelete: () => Promise<void> | void;
  isOpen: boolean;
  close: () => void;
  description?: string;
}

const DeleteDialog: React.FC<IProps> = (props) => {
  const { onClickDelete, close, isOpen, description } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent radius="large">
        <DialogHeader>
          <DialogIcon name="RiErrorWarningFill" variant="error" />
          <DialogTitle>{t('v2.dialog.delete.title')}</DialogTitle>
          <DialogDescription>
            {description ?? t('v2.dialog.delete.description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>{t('button.cancel')}</DialogClose>
          <Button
            variant="destructive"
            size="small"
            onClick={async () => {
              setLoading(true);
              await onClickDelete();
              close();
              setLoading(false);
            }}
            loading={loading}
          >
            {t('v2.button.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
