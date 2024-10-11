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
import { useTranslation } from 'react-i18next';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@ufb/react';

import DeleteDialog from './delete-dialog.ui';

interface Props extends React.PropsWithChildren {
  isOpen: boolean;
  close: () => void;
  title: React.ReactNode;
  deleteBtn: {
    disabled: boolean;
    onClick?: () => Promise<unknown>;
  };
  submitBtn: {
    disabled: boolean;
    onClick: () => Promise<unknown>;
  };
}

const FormDialog: React.FC<Props> = (props) => {
  const { close, isOpen, title, children, deleteBtn, submitBtn } = props;
  const { t } = useTranslation();
  const overlay = useOverlay();

  const openDeleteDialog = () => {
    overlay.open(({ close: dialogClose, isOpen }) => (
      <DeleteDialog
        close={dialogClose}
        isOpen={isOpen}
        onClickDelete={async () => {
          await deleteBtn.onClick?.();
          dialogClose();
          close();
        }}
      />
    ));
  };

  return (
    <Dialog onOpenChange={close} open={isOpen} modal>
      <DialogContent radius="large">
        <DialogTitle>{title}</DialogTitle>
        <div className="flex flex-col gap-3">{children}</div>
        <DialogFooter>
          {deleteBtn.onClick && (
            <div className="flex-1">
              <Button
                variant="destructive"
                onClick={openDeleteDialog}
                disabled={deleteBtn.disabled}
              >
                {t('v2.button.delete')}
              </Button>
            </div>
          )}
          <DialogClose asChild>
            <Button variant="outline">{t('v2.button.cancel')}</Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={submitBtn.disabled}
            onClick={async () => {
              await submitBtn.onClick();
              close();
            }}
          >
            {t('v2.button.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
